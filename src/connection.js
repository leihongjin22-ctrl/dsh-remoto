'use strict';

// WebSocket connection for protocol 0.5.4. Owns the control-plane handshake,
// heartbeat/reconnect, the pairing handshake and the sealed command channel.
//
// Transport-independent: a socket factory can be injected, so the whole class is
// exercised by node tests without opening a real network connection.

const codec = require('./codec.js');
const frames = require('./frames.js');
const pairingFlow = require('./pairing-flow.js');
const { createTransport } = require('./transport.js');

const DEFAULT_CONFIG = {
  heartbeatMs: 30000,
  pongTimeoutMs: 12000,
  handshakeTimeoutMs: 15000,
  backoffMinMs: 1000,
  backoffMaxMs: 30000,
  autoReconnect: true
};

function createConnection(options) {
  const opts = options || {};
  const config = { ...DEFAULT_CONFIG, ...(opts.config || {}) };
  const now = opts.now || (() => Date.now());
  const timers = {
    setTimeout: opts.setTimeout || ((fn, ms) => setTimeout(fn, ms)),
    clearTimeout: opts.clearTimeout || ((id) => clearTimeout(id)),
    setInterval: opts.setInterval || ((fn, ms) => setInterval(fn, ms)),
    clearInterval: opts.clearInterval || ((id) => clearInterval(id))
  };
  const factory =
    opts.factory ||
    ((url) => {
      const Socket = typeof WebSocket !== 'undefined' ? WebSocket : null;
      if (!Socket) throw new Error('WebSocket unavailable');
      return new Socket(url);
    });

  const listeners = Object.create(null);
  const state = {
    phase: 'idle',
    detail: '',
    hostOnline: false,
    attempt: 0,
    clientId: opts.clientId || '',
    url: opts.url || '',
    channelId: '',
    hostId: '',
    psk: '',
    keys: null,
    sendSeq: 0,
    undecryptable: 0,
    manualClose: false
  };
  const flow = pairingFlow.createPairingFlow({ now });
  let transport = null;
  let reconnectTimer = null;
  let heartbeatTimer = null;
  let handshakeTimer = null;
  let pongDeadline = 0;

  function on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return () => {
      const list = listeners[event];
      const index = list.indexOf(fn);
      if (index !== -1) list.splice(index, 1);
    };
  }

  function emit(event, data) {
    const list = listeners[event];
    if (!list) return;
    for (const fn of list.slice()) {
      try {
        fn(data);
      } catch {}
    }
  }

  function setPhase(phase, detail) {
    state.phase = phase;
    state.detail = detail || '';
    emit('state', {
      state: phase,
      detail: state.detail,
      hostOnline: state.hostOnline,
      channelId: state.channelId,
      url: state.url
    });
  }

  function isOpen() {
    return !!(transport && transport.current() && transport.current().readyState === 1);
  }

  function sendFrame(frame) {
    if (!isOpen()) return false;
    try {
      return transport.send(JSON.stringify(frame));
    } catch {
      return false;
    }
  }

  function stopTimers() {
    if (heartbeatTimer) timers.clearInterval(heartbeatTimer);
    if (handshakeTimer) timers.clearTimeout(handshakeTimer);
    heartbeatTimer = null;
    handshakeTimer = null;
    pongDeadline = 0;
  }

  function clearReconnect() {
    if (reconnectTimer) timers.clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  function scheduleReconnect() {
    if (state.manualClose || !config.autoReconnect || reconnectTimer) return;
    const base = Math.min(config.backoffMaxMs, config.backoffMinMs * Math.pow(2, state.attempt));
    const delay = base + Math.floor(Math.random() * 500);
    state.attempt += 1;
    reconnectTimer = timers.setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, delay);
  }

  function closeSocket() {
    if (transport) {
      try {
        transport.close();
      } catch {}
    }
    transport = null;
  }

  function handleStateLoss(detail) {
    stopTimers();
    closeSocket();
    if (state.manualClose) {
      setPhase('closed', detail);
      return;
    }
    setPhase('offline', detail);
    scheduleReconnect();
  }

  function startHandshake() {
    setPhase('handshaking');
    sendFrame(
      frames.helloClient({
        clientId: state.clientId,
        label: opts.label,
        platform: opts.platform,
        softwareVersion: opts.softwareVersion
      })
    );
    handshakeTimer = timers.setTimeout(() => {
      if (state.phase === 'handshaking') handleStateLoss('handshake timeout');
    }, config.handshakeTimeoutMs);
  }

  function onOpen() {
    state.attempt = 0;
    startHandshake();
  }

  function onMessage(text) {
    const frame = frames.parseFrame(String(text));
    if (!frame) {
      emit('protocol-error', { reason: 'bad_json' });
      return;
    }
    emit('frame', { t: frame.t });
    const verdict = frames.classifyRelayFrame(frame);
    if (!verdict.ok) {
      if (verdict.reason !== 'unknown_frame') emit('protocol-error', verdict);
      return;
    }
    switch (frame.t) {
      case 'hello-ok':
        onHelloOk(frame);
        break;
      case 'ping':
        sendFrame(frames.pong(frame.ts));
        break;
      case 'pong':
        pongDeadline = 0;
        break;
      case 'pair-ready':
        pairingFlow.onPairReady(flow, frame);
        emit('pair', { stage: 'ready', ttlMs: flow.ttlMs, token: flow.token });
        break;
      case 'pair-grant':
        onPairGrant(frame);
        break;
      case 'paired':
        onPaired(frame);
        break;
      case 'pair-fail':
        onPairFail(frame);
        break;
      case 'enc':
        onEncrypted(frame);
        break;
      case 'enc-batch':
        onEncryptedBatch(frame);
        break;
      case 'error':
        onRelayError(frame);
        break;
      case 'peer-left':
        state.hostOnline = false;
        emit('peer-left', frame);
        emit('host', { online: false });
        break;
      case 'peer-joined':
        state.hostOnline = true;
        emit('peer-joined', frame);
        emit('host', { online: true });
        break;
      case 'resume-gap':
        emit('resume-gap', frame);
        break;
      default:
        break;
    }
  }

  function onError(event) {
    const detail = (event && (event.message || event.error)) || 'socket error';
    handleStateLoss(String(detail).slice(0, 120));
  }

  function connect() {
    if (state.phase === 'connecting' || state.phase === 'handshaking' || state.phase === 'ready') return;
    if (!state.url) {
      setPhase('idle', 'no url');
      return;
    }
    clearReconnect();
    state.manualClose = false;
    setPhase('connecting');
    try {
      transport = createTransport(state.url, factory, {
        onOpen,
        onMessage,
        onClose: () => {
          if (!state.manualClose) handleStateLoss('closed');
        },
        onError
      });
      transport.connect();
    } catch (error) {
      setPhase('offline', String((error && error.message) || error).slice(0, 120));
      scheduleReconnect();
    }
  }

  function onHelloOk(frame) {
    if (handshakeTimer) timers.clearTimeout(handshakeTimer);
    handshakeTimer = null;
    const previousClientId = state.clientId;
    if (frame.clientId) state.clientId = String(frame.clientId);
    if (frame.hostId) state.hostId = String(frame.hostId);
    state.hostOnline = true;
    setPhase('online');
    emit('hello-ok', {
      clientId: state.clientId,
      hostId: state.hostId,
      capabilities: Array.isArray(frame.capabilities) ? frame.capabilities : [],
      summary: frame.summary || null,
      notify: frame.notify || null
    });
    if (state.keys && previousClientId !== state.clientId) {
      // The relay re-issued the authoritative client id: the nonce prefix and
      // its persisted counter must follow, or counters restart under a new prefix.
      deriveKeys();
    }
    if (flow.state === 'claiming') {
      sendPairClaim();
      return;
    }
    setPhase('ready');
    startHeartbeat();
    emit('ready', { paired: !!state.keys, channelId: state.channelId, hostId: state.hostId });
  }

  function startHeartbeat() {
    stopHeartbeat();
    heartbeatTimer = timers.setInterval(() => {
      if (state.phase !== 'ready') return;
      if (pongDeadline && now() > pongDeadline) {
        handleStateLoss('pong timeout');
        return;
      }
      pongDeadline = now() + config.pongTimeoutMs;
      sendFrame(frames.ping(now()));
    }, config.heartbeatMs);
  }

  function stopHeartbeat() {
    if (heartbeatTimer) timers.clearInterval(heartbeatTimer);
    heartbeatTimer = null;
    pongDeadline = 0;
  }

  function sendPairClaim() {
    const started = pairingFlow.start(flow, flow.token, now());
    if (!started.ok) {
      emit('pair', { stage: 'fail', reason: started.reason });
      return;
    }
    setPhase('pairing');
    emit('pair', { stage: 'claiming', token: flow.token });
    const sent = sendFrame(started.frame);
    if (!sent) emit('pair', { stage: 'sending-failed' });
  }

  function beginPair(token) {
    if (!/^\d{6}$/.test(String(token || ''))) {
      emit('pair', { stage: 'fail', reason: 'bad_token' });
      return false;
    }
    flow.token = String(token);
    flow.state = 'claiming';
    flow.reason = '';
    flow.expiresAt = now() + flow.ttlMs;
    flow.keyPair = null;
    flow.channel = null;
    flow.grant = null;
    flow.sas = '';
    if (state.phase === 'ready' || state.phase === 'online') {
      sendPairClaim();
    } else {
      if (state.phase === 'offline' || state.phase === 'closed' || state.phase === 'idle') connect();
      emit('pair', { stage: 'waiting-connection', token: flow.token });
    }
    return true;
  }

  function cancelPair() {
    pairingFlow.reset(flow);
    if (state.phase === 'pairing') {
      setPhase(state.keys ? 'ready' : 'online');
    }
    emit('pair', { stage: 'cancelled' });
  }

  function onPairGrant(frame) {
    pairingFlow.onGrant(flow, frame);
    if (flow.state === 'failed') {
      emit('pair', { stage: 'fail', reason: flow.reason || 'invalid_or_expired' });
      return;
    }
    if (flow.sas) emit('pair', { stage: 'verify', sas: flow.sas, ttlMs: flow.ttlMs });
    finishPairIfReady();
  }

  function onPaired(frame) {
    if (!flow.token && !state.channelId) return;
    if (flow.state === 'idle') {
      // Reconnect to a channel we already know: nothing to do.
      return;
    }
    pairingFlow.onPaired(flow, frame);
    if (flow.state === 'failed') {
      emit('pair', { stage: 'fail', reason: flow.reason || 'invalid_or_expired' });
      return;
    }
    finishPairIfReady();
  }

  function finishPairIfReady() {
    const result = pairingFlow.result(flow);
    if (!result) return;
    const clientId = state.clientId;
    pairingFlow.reset(flow);
    state.hostOnline = true;
    emit('pair', {
      stage: 'paired',
      channelId: result.channelId,
      hostId: result.hostId,
      psk: result.psk,
      sas: result.sas,
      clientId
    });
  }

  function onPairFail(frame) {
    const reason = frame.reason || 'invalid_or_expired';
    pairingFlow.fail(flow, reason);
    emit('pair', { stage: 'fail', reason });
    setPhase(state.keys ? 'ready' : 'online');
  }

  function onRelayError(frame) {
    if (frame.code === 'unknown_session') {
      clearSession();
      setPhase('online', 'unknown_session');
      emit('lost', { reason: 'unknown_session', message: frame.message || '' });
      return;
    }
    emit('error', {
      code: frame.code || 'internal',
      message: frame.message || '',
      retryAfterMs: frame.retryAfterMs || 0
    });
  }

  function onEncrypted(frame) {
    // Between the host's `pair-grant` and the user's SAS confirmation the client
    // intentionally has no keys for the new channel. Frames pushed in that window
    // are expected; do not count them as decrypt failures.
    if (!state.keys || state.phase === 'pairing') return;
    const payload = codec.open(state.keys.recvKey, frame);
    if (!payload) {
      state.undecryptable += 1;
      emit('codec-error', { count: state.undecryptable });
      if (state.undecryptable >= 2) {
        clearSession();
        setPhase('online', 'keys lost');
        emit('lost', { reason: 'undecryptable' });
      }
      return;
    }
    state.undecryptable = 0;
    if (payload && typeof payload.t === 'string') emit('payload', payload);
  }

  function onEncryptedBatch(frame) {
    if (!state.keys || state.phase === 'pairing' || !Array.isArray(frame.items)) return;
    for (const item of frame.items) {
      const payload = codec.open(state.keys.recvKey, item);
      if (!payload) {
        state.undecryptable += 1;
        continue;
      }
      state.undecryptable = 0;
      if (payload && typeof payload.t === 'string') emit('payload', payload);
    }
  }

  function configureSession(session) {
    if (!session || !session.channelId || !session.psk) throw new Error('bad session');
    state.channelId = String(session.channelId);
    state.hostId = String(session.hostId || '');
    state.psk = String(session.psk);
    deriveKeys();
    if (state.phase === 'ready' || state.phase === 'online' || state.phase === 'pairing') {
      setPhase('ready');
      startHeartbeat();
      emit('ready', { paired: true, channelId: state.channelId, hostId: state.hostId });
    }
    return state.keys;
  }

  function deriveKeys() {
    if (!state.psk || !state.channelId) {
      state.keys = null;
      return;
    }
    const clientId = state.clientId;
    state.keys = {
      sendKey: codec.deriveKey(state.psk, 'c2h', state.channelId),
      recvKey: codec.deriveKey(state.psk, 'h2c', state.channelId),
      sendPrefix: codec.noncePrefix(state.psk, state.channelId, clientId)
    };
    state.sendSeq = opts.loadCounter
      ? Number(opts.loadCounter(state.channelId, clientId)) || 0
      : 0;
    state.undecryptable = 0;
  }

  function clearSession() {
    state.keys = null;
    state.channelId = '';
    state.psk = '';
    state.hostId = '';
    state.sendSeq = 0;
  }

  function setUrl(url) {
    if (!/^wss?:\/\//.test(String(url || ''))) throw new Error('bad url');
    state.url = String(url);
    return state.url;
  }

  function sendCommand(payload) {
    if (!state.keys || !state.channelId || !isOpen()) return false;
    const nonce = codec.counterNonce(state.keys.sendPrefix, state.sendSeq);
    state.sendSeq += 1;
    if (opts.saveCounter) opts.saveCounter(state.channelId, state.clientId, state.sendSeq);
    let record;
    try {
      record = codec.seal(state.keys.sendKey, payload, nonce);
    } catch {
      return false;
    }
    return sendFrame(frames.encFrame(state.channelId, record.ciphertext));
  }

  function sendLeave() {
    if (!state.channelId) return false;
    return sendFrame(frames.sessionLeave(state.channelId));
  }

  function reconnectNow() {
    stopTimers();
    closeSocket();
    reconnectTimer = null;
    state.attempt = 0;
    connect();
  }

  function stop() {
    state.manualClose = true;
    stopTimers();
    clearReconnect();
    closeSocket();
    setPhase('closed', 'manual');
  }

  function destroy() {
    stop();
    for (const key of Object.keys(listeners)) listeners[key] = [];
  }

  return {
    on,
    connect,
    stop,
    destroy,
    reconnectNow,
    setUrl,
    beginPair,
    cancelPair,
    configureSession,
    clearSession,
    sendCommand,
    sendLeave,
    getState: () => state.phase,
    isReady: () => state.phase === 'ready' && !!state.keys,
    getClientId: () => state.clientId,
    getChannelId: () => state.channelId,
    getUrl: () => state.url,
    getPairingState: () => ({ state: flow.state, sas: flow.sas, ttlMs: flow.ttlMs, expiresAt: flow.expiresAt })
  };
}

module.exports = { DEFAULT_CONFIG, createConnection };

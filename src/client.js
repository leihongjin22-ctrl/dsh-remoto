'use strict';

// Application controller: owns the connection, the host model, the per-session
// chat models, approvals/questions and the command/ack bookkeeping. It has no DOM
// dependency, so the whole client except rendering can be tested in Node.

const codec = require('./codec.js');
const hostsModel = require('./hosts.js');
const payloads = require('./payloads.js');
const chatModel = require('./chat-model.js');
const sessionList = require('./session-list.js');
const messageState = require('./message-state.js');
const { createConnection } = require('./connection.js');
const { createStore } = require('./store.js');

const SEND_TIMEOUT_MS = payloads.COMMAND_TIMEOUT_MS;
const HISTORY_PAGE_LIMIT = 40;
const HISTORY_TIMEOUT_MS = 15000;
const IMAGE_RETRY_DELAY_MS = 12000;
const IMAGE_RETRY_LIMIT = 6;
const DEFAULT_RELAY_URL = '';

const PAIR_FAIL_TEXT = {
  invalid_or_expired: '配对码无效或已过期，请在电脑上点「刷新」重新生成',
  already_used: '配对码已经被使用，请在电脑上重新生成',
  host_offline: '主机不在线，请确认电脑上的 DSH 已启动',
  bad_token: '配对码必须是 6 位数字',
  timeout: '配对超时，请重新输入电脑上的 6 位码'
};

const ERROR_TEXT = {
  bad_token: '主机令牌无效',
  unknown_session: '配对已失效，请重新配对',
  not_member: '当前配对不属于这个会话',
  host_unavailable: '主机暂时不在线，请稍后重试',
  rate_limited: '操作太频繁，请稍后重试',
  unsupported_protocol: '协议版本不一致，请更新客户端',
  bad_frame: '主机不接受这条请求',
  history_window_exceeded: '历史窗口已过期，正在重新加载',
  internal: '主机内部错误'
};

function createClient(options) {
  const opts = options || {};
  const backend = opts.backend || null;
  const store = opts.store || createStore(backend);
  const now = opts.now || (() => Date.now());
  const setTimeoutFn = opts.setTimeout || ((fn, ms) => setTimeout(fn, ms));
  const clearTimeoutFn = opts.clearTimeout || ((id) => clearTimeout(id));
  const defaults = opts.defaults || {};
  const makeSocket = opts.factory;

  const state = {
    hosts: [],
    activeHostId: '',
    mode: 'relay',
    status: { phase: 'idle', detail: '', hostOnline: false, paired: false },
    sessions: [],
    sessionsUpdatedAt: 0,
    reconcileRunState: false,
    currentSessionId: '',
    hostInfo: null,
    limits: null,
    keepAwake: { enabled: false, active: false, backend: '', platform: '' },
    pairing: { state: 'idle', sas: '', error: '', token: '' }
  };

  const models = new Map();
  const historyReq = new Map();
  const historyBuffers = new Map();
  const historyStatus = new Map();
  const pendingPermissions = new Map();
  const pendingQuestions = new Map();
  const pendingSends = new Map();
  const sendByCmd = new Map();
  const pendingCommands = new Map();
  const permissionRequests = new Map();
  let connection = null;
  let connectionUrl = '';
  let pendingPairData = null;
  let lastRefreshAt = 0;
  let seq = 0;
  let installId = '';
  const listeners = Object.create(null);

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
    for (const fn of (listeners[event] || []).slice()) {
      try {
        fn(data);
      } catch {}
    }
  }

  function toast(message, tone) {
    emit('toast', { message, tone: tone || 'info' });
  }

  function makeId(prefix) {
    seq += 1;
    return `${prefix}_${now().toString(36)}_${seq.toString(36)}`;
  }

  // ---------------------------------------------------------------- host model

  function normalizeHost(raw) {
    const host = hostsModel.createHost(raw && raw.id, raw && raw.label);
    host.createdAt = (raw && raw.createdAt) || 0;
    for (const mode of hostsModel.MODES) {
      const endpoint = raw && raw.endpoints ? raw.endpoints[mode] : null;
      if (endpoint && endpoint.url) {
        host.endpoints[mode] = {
          url: endpoint.url,
          pskKey: `psk:${mode}`,
          pairing: endpoint.pairing || null
        };
      }
    }
    host.activeMode = raw && raw.activeMode === 'lan' ? 'lan' : raw && raw.activeMode === 'relay' ? 'relay' : '';
    return host;
  }

  function loadHosts() {
    const saved = store.loadHosts();
    state.hosts = Array.isArray(saved) ? saved.map(normalizeHost) : [];
    const active = store.loadActive();
    if (active && state.hosts.some((host) => host.id === active.hostId)) {
      state.activeHostId = active.hostId;
      state.mode = active.mode;
    } else if (state.hosts.length) {
      state.activeHostId = state.hosts[0].id;
      state.mode = state.hosts[0].activeMode || 'relay';
    }
    const host = activeHost();
    if (host && !host.activeMode) host.activeMode = state.mode;
    emit('hosts', getHostsSnapshot());
  }

  function saveHosts() {
    store.saveHosts(state.hosts);
    store.saveActive({ hostId: state.activeHostId, mode: state.mode });
  }

  function activeHost() {
    return state.hosts.find((host) => host.id === state.activeHostId) || null;
  }

  function activeEndpoint() {
    const host = activeHost();
    if (!host) return null;
    return host.endpoints[state.mode] || null;
  }

  function getHostsSnapshot() {
    return {
      hosts: state.hosts.map((host) => ({
        id: host.id,
        label: host.label,
        active: host.id === state.activeHostId,
        activeMode: host.activeMode,
        endpoints: {
          relay: host.endpoints.relay
            ? { url: host.endpoints.relay.url, paired: hostsModel.hasPairing(host, 'relay') }
            : null,
          lan: host.endpoints.lan
            ? { url: host.endpoints.lan.url, paired: hostsModel.hasPairing(host, 'lan') }
            : null
        }
      })),
      activeHostId: state.activeHostId,
      mode: state.mode
    };
  }

  function addHost(input) {
    const fields = input || {};
    const id = `h_${codec.randomBytes(6).reduce((text, byte) => text + byte.toString(16).padStart(2, '0'), '')}`;
    const host = hostsModel.createHost(id, fields.label || '我的电脑');
    host.createdAt = now();
    if (fields.relayUrl) hostsModel.setEndpoint(host, 'relay', fields.relayUrl);
    if (fields.lanAddress) hostsModel.setEndpoint(host, 'lan', fields.lanAddress);
    let mode = fields.mode === 'lan' || fields.mode === 'relay' ? fields.mode : '';
    if (!mode) mode = host.endpoints.lan ? 'lan' : 'relay';
    if (mode === 'lan' && !host.endpoints.lan && host.endpoints.relay) mode = 'relay';
    if (mode === 'relay' && !host.endpoints.relay && host.endpoints.lan) mode = 'lan';
    host.activeMode = mode;
    state.hosts.push(host);
    state.activeHostId = host.id;
    state.mode = host.activeMode;
    saveHosts();
    emit('hosts', getHostsSnapshot());
    return host;
  }

  function updateHost(id, patch) {
    const host = state.hosts.find((item) => item.id === id);
    if (!host) throw new Error('host not found');
    if (patch && patch.label) host.label = String(patch.label);
    if (patch && patch.relayUrl !== undefined) {
      if (patch.relayUrl) hostsModel.setEndpoint(host, 'relay', patch.relayUrl);
      else {
        host.endpoints.relay = null;
        if (state.activeHostId === host.id && state.mode === 'relay') disconnect();
      }
    }
    if (patch && patch.lanAddress !== undefined) {
      if (patch.lanAddress) hostsModel.setEndpoint(host, 'lan', patch.lanAddress);
      else {
        host.endpoints.lan = null;
        if (state.activeHostId === host.id && state.mode === 'lan') disconnect();
      }
    }
    saveHosts();
    emit('hosts', getHostsSnapshot());
    return host;
  }

  function removeHost(id) {
    const index = state.hosts.findIndex((host) => host.id === id);
    if (index === -1) return;
    if (state.activeHostId === id) {
      disconnect();
      models.clear();
      historyReq.clear();
      historyBuffers.clear();
      historyStatus.clear();
      pendingPermissions.clear();
      pendingQuestions.clear();
    }
    state.hosts.splice(index, 1);
    if (state.activeHostId === id) {
      state.activeHostId = state.hosts.length ? state.hosts[0].id : '';
      const host = activeHost();
      state.mode = host ? host.activeMode || 'relay' : 'relay';
      state.currentSessionId = '';
      state.sessions = host ? sessionList.normalizeSessions(store.loadSessions(sessionCacheKey())) : [];
    }
    saveHosts();
    emit('hosts', getHostsSnapshot());
    emit('sessions', state.sessions);
    emit('pending', getPendingSnapshot());
  }

  function selectHost(id) {
    const host = state.hosts.find((item) => item.id === id);
    if (!host) return false;
    if (id === state.activeHostId) return true;
    disconnect();
    for (const pending of historyReq.values()) {
      if (pending.timer) clearTimeoutFn(pending.timer);
    }
    historyReq.clear();
    historyBuffers.clear();
    historyStatus.clear();
    models.clear();
    pendingPermissions.clear();
    pendingQuestions.clear();
    state.activeHostId = id;
    state.mode = host.activeMode || (host.endpoints.relay ? 'relay' : 'lan');
    host.activeMode = state.mode;
    state.currentSessionId = '';
    state.sessions = sessionList.normalizeSessions(store.loadSessions(sessionCacheKey()));
    persist();
    emit('hosts', getHostsSnapshot());
    emit('sessions', state.sessions);
    emit('pending', getPendingSnapshot());
    emit('session', { sessionId: '' });
    return true;
  }

  function persist() {
    saveHosts();
  }

  function setMode(mode) {
    if (mode !== 'relay' && mode !== 'lan') throw new Error('bad mode');
    const host = activeHost();
    if (!host) throw new Error('no host');
    if (!host.endpoints[mode]) throw new Error('endpoint not configured');
    const wasActive = !!connection && state.status.phase !== 'closed' && state.status.phase !== 'idle';
    disconnect();
    state.mode = mode;
    host.activeMode = mode;
    persist();
    emit('hosts', getHostsSnapshot());
    if (wasActive) connect();
  }

  function clearHistoryCaches() {
    const host = activeHost();
    if (!host) return;
    models.clear();
    historyReq.clear();
    historyBuffers.clear();
    historyStatus.clear();
    try { store.clearHistory(host.id); } catch {}
    state.sessions = [];
    emit('sessions', state.sessions);
    emit('chat', { sessionId: state.currentSessionId });
  }

  // ---------------------------------------------------------------- connection

  function connectionConfig() {
    const host = activeHost();
    const endpoint = host ? host.endpoints[state.mode] : null;
    return { host, endpoint };
  }

  function destroyConnection() {
    if (connection) {
      try {
        connection.destroy();
      } catch {}
    }
    connection = null;
    connectionUrl = '';
  }

  function ensureConnection() {
    const { host, endpoint } = connectionConfig();
    if (!host) throw new Error('请先添加主机');
    if (!endpoint) throw new Error(`还没有配置${hostsModel.describeMode(state.mode)}地址`);
    if (connection && connectionUrl === endpoint.url) return connection;
    destroyConnection();
    connectionUrl = endpoint.url;
    connection = createConnection({
      url: endpoint.url,
      clientId: installId,
      label: 'DSH Remoto',
      platform: 'android',
      softwareVersion: opts.softwareVersion || '0.3.0',
      factory: makeSocket,
      loadCounter: (channelId, clientId) => store.loadCounter(channelId, clientId),
      saveCounter: (channelId, clientId, value) => store.saveCounter(channelId, clientId, value),
      config: opts.config
    });
    wireConnection(connection);
    if (endpoint.pairing) {
      try {
        connection.configureSession({
          channelId: endpoint.pairing.channelId,
          hostId: endpoint.pairing.hostId,
          psk: endpoint.pairing.psk,
          clientId: endpoint.pairing.clientId
        });
      } catch {}
    }
    return connection;
  }

  function wireConnection(conn) {
    conn.on('state', (data) => {
      state.status.phase = data.state;
      state.status.detail = data.detail || '';
      if (data.hostOnline !== undefined) state.status.hostOnline = !!data.hostOnline;
      if (data.state === 'offline' || data.state === 'closed') state.status.paired = false;
      emit('state', getStateSnapshot());
    });
    conn.on('ready', (data) => {
      const { endpoint } = connectionConfig();
      state.status.paired = !!(endpoint && endpoint.pairing);
      emit('state', getStateSnapshot());
      if (data && data.paired) {
        const stamp = now();
        if (stamp - lastRefreshAt > 1200) {
          lastRefreshAt = stamp;
          refreshSessions();
          getPending();
        }
      }
    });
    conn.on('pair', (data) => {
      if (data.stage === 'claiming' || data.stage === 'waiting-connection') {
        state.pairing = { state: 'claiming', sas: '', error: '', token: data.token || state.pairing.token };
      } else if (data.stage === 'verify') {
        state.pairing = { ...state.pairing, state: 'verify', sas: data.sas || '' };
      } else if (data.stage === 'paired') {
        // Security gate: never install the PSK before the phone owner has compared
        // the 6 digits with the desktop screen. This is the only place a MITM that
        // swapped the relay's public keys can be caught.
        pendingPairData = data;
        state.pairing = { ...state.pairing, state: 'verify', sas: data.sas || state.pairing.sas };
        emit('pair', getPairingSnapshot());
        return;
      } else if (data.stage === 'fail') {
        state.pairing = { state: 'failed', sas: '', error: PAIR_FAIL_TEXT[data.reason] || PAIR_FAIL_TEXT.invalid_or_expired, token: '' };
        emit('pair', getPairingSnapshot());
        toast(state.pairing.error, 'error');
        return;
      } else if (data.stage === 'cancelled') {
        state.pairing = { state: 'idle', sas: '', error: '', token: '' };
      }
      emit('pair', getPairingSnapshot());
    });
    conn.on('payload', handlePayload);
    conn.on('lost', (data) => {
      const { host, endpoint } = connectionConfig();
      if (host && endpoint && endpoint.pairing) {
        hostsModel.clearPairing(host, state.mode);
        persist();
        emit('hosts', getHostsSnapshot());
      }
      state.status.paired = false;
      const text =
        data.reason === 'unknown_session'
          ? '配对已失效，请重新输入电脑上的 6 位码'
          : '无法解密主机消息，请重新配对';
      toast(text, 'error');
      emit('state', getStateSnapshot());
      emit('hosts', getHostsSnapshot());
    });
    conn.on('error', (data) => {
      const text = ERROR_TEXT[data.code] || data.message || data.code;
      toast(text, 'error');
      if (data.code === 'history_window_exceeded') {
        const pending = Array.from(historyReq.values()).find((item) => item.since);
        if (pending) requestHistory(pending.sessionId, { older: false, force: true });
      }
    });
    conn.on('protocol-error', (data) => {
      if (data.reason !== 'unknown_frame') toast(`协议帧异常：${data.reason}`, 'error');
    });
    conn.on('resume-gap', () => {
      if (state.currentSessionId) requestHistory(state.currentSessionId, { older: false, force: true });
    });
  }

  function acceptPairing(data) {
    const { host, endpoint } = connectionConfig();
    if (!host || !endpoint) return;
    const pairing = {
      channelId: data.channelId,
      hostId: data.hostId || '',
      psk: data.psk,
      clientId: data.clientId || installId,
      pairedAt: now(),
      sendSeq: 0
    };
    hostsModel.setPairing(host, state.mode, pairing);
    host.endpoints[state.mode].url = endpoint.url;
    persist();
    state.status.paired = true;
    state.pairing = { state: 'paired', sas: data.sas || state.pairing.sas, error: '', token: '' };
    emit('pair', getPairingSnapshot());
    try {
      connection.configureSession({
        channelId: pairing.channelId,
        hostId: pairing.hostId,
        psk: pairing.psk,
        clientId: pairing.clientId
      });
    } catch {}
    emit('hosts', getHostsSnapshot());
    emit('state', getStateSnapshot());
    toast('配对成功', 'ok');
    refreshSessions();
    getPending();
  }

  function connect() {
    try {
      const conn = ensureConnection();
      conn.connect();
    } catch (error) {
      toast(String(error.message || error), 'error');
      throw error;
    }
  }

  function disconnect() {
    if (connection) connection.stop();
    state.status.phase = 'closed';
    state.status.paired = false;
    emit('state', getStateSnapshot());
  }

  function resume(hiddenForMs) {
    if (!connection) return;
    if (hiddenForMs > 5000 || state.status.phase !== 'ready') connection.reconnectNow();
    else refreshSessions();
  }

  function pair(code) {
    const token = String(code || '').trim();
    if (!/^\d{6}$/.test(token)) throw new Error('配对码必须是 6 位数字');
    const { endpoint } = connectionConfig();
    if (!endpoint) throw new Error('请先填写中继地址或局域网地址');
    pendingPairData = null;
    state.pairing = { state: 'claiming', sas: '', error: '', token };
    const conn = ensureConnection();
    conn.beginPair(token);
    if (state.status.phase !== 'handshaking' && state.status.phase !== 'ready' && state.status.phase !== 'online') {
      conn.connect();
    }
    emit('pair', getPairingSnapshot());
  }

  function confirmPairing() {
    if (!pendingPairData) return false;
    const data = pendingPairData;
    pendingPairData = null;
    acceptPairing(data);
    return true;
  }

  function cancelPair() {
    pendingPairData = null;
    if (connection) connection.cancelPair();
    state.pairing = { state: 'idle', sas: '', error: '', token: '' };
    emit('pair', getPairingSnapshot());
  }

  function forgetPairing() {
    const host = activeHost();
    if (!host) return;
    hostsModel.clearPairing(host, state.mode);
    persist();
    if (connection) connection.clearSession();
    state.status.paired = false;
    state.sessions = [];
    models.clear();
    emit('hosts', getHostsSnapshot());
    emit('state', getStateSnapshot());
    emit('sessions', state.sessions);
  }

  function getStateSnapshot() {
    return {
      phase: state.status.phase,
      detail: state.status.detail,
      hostOnline: state.status.hostOnline,
      paired: state.status.paired,
      mode: state.mode,
      hostId: state.activeHostId,
      url: activeEndpoint() ? activeEndpoint().url : ''
    };
  }

  function getPairingSnapshot() {
    return {
      ...state.pairing,
      mode: state.mode,
      url: activeEndpoint() ? activeEndpoint().url : ''
    };
  }

  // ----------------------------------------------------------------- commands

  function sendCommand(payload, meta) {
    if (!connection || !connection.isReady()) return false;
    const sent = connection.sendCommand(payload);
    if (sent) {
      const entry = { ...payload, at: now(), ...meta };
      pendingCommands.set(payload.cmdId, entry);
      const timer = setTimeoutFn(() => {
        if (pendingCommands.has(payload.cmdId)) {
          pendingCommands.delete(payload.cmdId);
          if (meta && meta.onTimeout) meta.onTimeout();
        }
      }, SEND_TIMEOUT_MS);
      entry.timer = timer;
    }
    return sent;
  }

  function settleCommand(cmdId) {
    const entry = pendingCommands.get(cmdId);
    if (!entry) return null;
    pendingCommands.delete(cmdId);
    if (entry.timer) clearTimeoutFn(entry.timer);
    return entry;
  }

  function refreshSessions() {
    if (!connection || !connection.isReady()) return false;
    state.reconcileRunState = true;
    return sendCommand(payloads.listSessions(makeId('cmd')));
  }

  function getPending(sessionId) {
    if (!connection || !connection.isReady()) return false;
    return sendCommand(payloads.getPending(makeId('cmd'), { sessionId }));
  }

  // ------------------------------------------------------------------- session

  function sessionCacheKey() {
    return state.activeHostId || 'nohost';
  }

  function ensureModel(sessionId) {
    if (models.has(sessionId)) return models.get(sessionId);
    const model = chatModel.createChatModel();
    const cached = store.loadHistory(sessionCacheKey(), sessionId);
    if (cached.items.length) chatModel.applyHistoryPage(model, cached.items, { older: false });
    model.nextBeforeSeq = cached.nextBeforeSeq || 0;
    model.historyLoaded = cached.items.length > 0;
    models.set(sessionId, model);
    return model;
  }

  function openSession(sessionId) {
    if (!sessionId) return;
    state.currentSessionId = sessionId;
    const model = ensureModel(sessionId);
    const summary = sessionList.findSession(state.sessions, sessionId);
    if (summary && (summary.running || summary.state === 'running') && model.runState !== 'running') {
      // Seed the thinking timer from the session list when the live run_state
      // frame has not arrived yet.
      model.runState = 'running';
      model.runStartedAt = Date.now();
    } else if (summary && !summary.running && summary.state !== 'running' && model.runState === 'running') {
      // The session list says this turn is over; clear a stale live indicator.
      model.runState = 'idle';
      model.runStartedAt = 0;
    }
    emit('session', { sessionId, session: summary });
    emit('chat', { sessionId });
    if (connection && connection.isReady()) {
      requestHistory(sessionId, { older: false });
      getPending(sessionId);
    } else {
      historyStatus.set(sessionId, { loading: false, error: '离线，显示本地缓存' });
      emit('history', { sessionId, ...historyStatus.get(sessionId) });
    }
  }

  function requestHistory(sessionId, options) {
    const opts = options || {};
    const model = ensureModel(sessionId);
    const status = historyStatus.get(sessionId) || { loading: false, error: '' };
    if (status.loading && !opts.force) return false;
    if (!connection || !connection.isReady()) {
      historyStatus.set(sessionId, { loading: false, error: '离线，显示本地缓存' });
      emit('history', { sessionId, ...historyStatus.get(sessionId) });
      return false;
    }
    if (opts.older && !model.nextBeforeSeq) return false;
    for (const [id, pending] of Array.from(historyReq.entries())) {
      if (pending.sessionId !== sessionId) continue;
      clearTimeoutFn(pending.timer);
      historyReq.delete(id);
    }
    const cmdId = makeId(opts.older ? 'old' : 'hist');
    const fields = { sessionId, limit: HISTORY_PAGE_LIMIT };
    if (opts.older) fields.beforeSeq = model.nextBeforeSeq;
    const timer = setTimeoutFn(() => {
      const pending = historyReq.get(cmdId);
      if (!pending) return;
      historyReq.delete(cmdId);
      historyStatus.set(sessionId, { loading: false, error: '读取超时，显示本地缓存' });
      emit('history', { sessionId, ...historyStatus.get(sessionId) });
    }, HISTORY_TIMEOUT_MS);
    historyReq.set(cmdId, { sessionId, older: !!opts.older, timer });
    historyStatus.set(sessionId, { loading: true, error: '' });
    emit('history', { sessionId, loading: true, error: '' });
    const sent = sendCommand(payloads.sessionHistory(cmdId, fields));
    if (!sent) {
      clearTimeoutFn(timer);
      historyReq.delete(cmdId);
      historyStatus.set(sessionId, { loading: false, error: '未连接，显示本地缓存' });
      emit('history', { sessionId, ...historyStatus.get(sessionId) });
      return false;
    }
    return true;
  }

  function loadEarlier() {
    if (!state.currentSessionId) return false;
    return requestHistory(state.currentSessionId, { older: true });
  }

  function handleHistory(payload) {
    const pending = historyReq.get(payload.cmdId);
    if (!pending) return;
    if (pending.sessionId !== payload.sessionId) return;
    clearTimeoutFn(pending.timer);
    historyReq.delete(payload.cmdId);
    const model = ensureModel(payload.sessionId);
    const items = Array.isArray(payload.items) ? payload.items : [];
    chatModel.applyHistoryPage(model, items, {
      older: pending.older,
      nextBeforeSeq: payload.nextBeforeSeq || 0,
      historyEmpty: items.length === 0
    });
    if (typeof payload.latestSeq === 'number') model.latestSeq = payload.latestSeq;
    for (const item of items) {
      if (item && item.t === 'ev.message_delta' && item.role === 'user' && item.done) {
        confirmEcho({ sessionId: payload.sessionId, messageId: item.messageId });
      }
    }
    const cached = store.loadHistory(sessionCacheKey(), payload.sessionId);
    let cachedItems;
    if (pending.older) {
      cachedItems = items.concat(cached.items);
    } else {
      cachedItems = items;
    }
    store.saveHistory(sessionCacheKey(), payload.sessionId, {
      items: cachedItems,
      nextBeforeSeq: payload.nextBeforeSeq || 0,
      latestSeq: payload.latestSeq || cached.latestSeq || 0
    });
    historyStatus.set(payload.sessionId, { loading: false, error: '' });
    flushHistoryBuffer(payload.sessionId);
    emit('history', { sessionId: payload.sessionId, loading: false, error: '' });
    emit('chat', { sessionId: payload.sessionId });
  }

  function bufferDuringHistory(sessionId, payload) {
    if (!sessionId || sessionId !== state.currentSessionId) return false;
    const hasRequest = Array.from(historyReq.values()).some(
      (item) => item.sessionId === sessionId && !item.older
    );
    if (!hasRequest) return false;
    if (!historyBuffers.has(sessionId)) historyBuffers.set(sessionId, []);
    historyBuffers.get(sessionId).push(payload);
    return true;
  }

  function flushHistoryBuffer(sessionId) {
    const list = historyBuffers.get(sessionId);
    if (!list || !list.length) return;
    historyBuffers.delete(sessionId);
    const model = ensureModel(sessionId);
    for (const payload of list) applyChatPayload(model, payload, { fromBuffer: true, history: true });
  }

  function applyChatPayload(model, payload, options) {
    const opts = options || {};
    const result = chatModel.applyEvent(model, payload, { history: !!opts.history });
    if (result.changed) {
      if (!opts.fromBuffer) appendLiveCache(payload);
    }
    return result;
  }

  function appendLiveCache(payload) {
    if (!payload.sessionId) return;
    // Large base64 artifacts must not be written to localStorage: one 400KB file
    // can exceed the WebView quota and abort the whole payload dispatch.
    if (payload.t === 'ev.artifact' && payload.data) return;
    try {
      const hostKey = sessionCacheKey();
      const cached = store.loadHistory(hostKey, payload.sessionId);
      cached.items.push(payload);
      store.saveHistory(hostKey, payload.sessionId, {
        items: cached.items.slice(-120),
        nextBeforeSeq: cached.nextBeforeSeq,
        latestSeq: cached.latestSeq
      });
    } catch {
      // Cache is best-effort; a quota error must never hide a live message.
    }
  }

  function chatPayloadTouches(payload, sessionId) {
    if (!payload.sessionId) return false;
    return payload.sessionId === sessionId;
  }

  // -------------------------------------------------------------------- payload

  function handlePayload(payload) {
    if (!payload || typeof payload.t !== 'string') return;
    switch (payload.t) {
      case 'ev.session_changed':
        onSessions(payload);
        return;
      case 'ev.session_history':
        handleHistory(payload);
        return;
      case 'ev.result':
        onResult(payload);
        return;
      case 'ev.host_info':
        state.hostInfo = payload;
        state.limits = payload.limits || null;
        emit('host', payload);
        return;
      case 'ev.keep_awake_state':
        state.keepAwake = {
          enabled: !!payload.enabled,
          active: !!payload.active,
          backend: payload.backend || '',
          platform: payload.platform || ''
        };
        emit('keepAwake', state.keepAwake);
        return;
      case 'ev.permission_request':
        onPermissionRequest(payload);
        return;
      case 'ev.permission_resolved':
        onPermissionResolved(payload);
        return;
      case 'ev.question_request':
        onQuestionRequest(payload);
        return;
      case 'ev.question_resolved':
        onQuestionResolved(payload);
        return;
      default:
        break;
    }
    if (!payload.sessionId) return;
    if (payload.sessionId !== state.currentSessionId) return;
    if (bufferDuringHistory(payload.sessionId, payload)) return;
    const model = ensureModel(payload.sessionId);
    const result = applyChatPayload(model, payload);
    if (!result.changed) return;
    if (payload.t === 'ev.message_delta' && payload.role === 'user' && payload.done) {
      confirmEcho(payload);
    }
    if (payload.t === 'ev.run_state') {
      const session = state.sessions.find((item) => item.id === payload.sessionId);
      if (session) {
        session.state = payload.state === 'running' ? 'running' : session.state === 'archived' ? 'archived' : 'idle';
        session.running = payload.state === 'running';
        emit('sessions', state.sessions);
      }
    }
    emit('chat', { sessionId: payload.sessionId });
  }

  function confirmEcho(payload) {
    const model = models.get(payload.sessionId);
    if (!model) return;
    const block = model.byId.get(payload.messageId);
    if (!block || !block.clientMsgId) return;
    const entry = pendingSends.get(block.clientMsgId);
    if (!entry) return;
    if (entry.timer) clearTimeoutFn(entry.timer);
    sendByCmd.delete(entry.cmdId);
    messageState.markAccepted(entry.message);
    block.state = 'accepted';
    block.error = '';
    pendingSends.delete(block.clientMsgId);
  }

  function onSessions(payload) {
    const sessions = Array.isArray(payload.sessions) ? payload.sessions : [];
    state.sessions = sessions;
    state.sessionsUpdatedAt = now();
    store.saveSessions(sessionCacheKey(), sessions);
    emit('sessions', sessions);
    emit('session', {
      sessionId: state.currentSessionId,
      session: sessionList.findSession(sessions, state.currentSessionId)
    });
    if (state.reconcileRunState) {
      state.reconcileRunState = false;
      const summary = sessionList.findSession(sessions, state.currentSessionId);
      const model = models.get(state.currentSessionId);
      if (model && summary && !summary.running && summary.state !== 'running' && model.runState === 'running') {
        // A list refresh is authoritative: a lost run_state:idle must not leave
        // the phone thinking forever.
        model.runState = 'idle';
        model.runStartedAt = 0;
        emit('chat', { sessionId: state.currentSessionId });
      }
    }
  }

  function onResult(payload) {
    const permission = permissionRequests.get(payload.cmdId);
    if (permission) {
      permissionRequests.delete(payload.cmdId);
      if (permission.timer) clearTimeoutFn(permission.timer);
      if (payload.ok) permission.resolve(payload.data || {});
      else permission.reject(new Error(payload.message || '权限操作失败'));
      return;
    }
    const sendEntry = sendByCmd.get(payload.cmdId);
    if (sendEntry) {
      sendByCmd.delete(payload.cmdId);
      onSendResult(sendEntry, payload);
      return;
    }
    const entry = settleCommand(payload.cmdId);
    if (entry && entry.kind === 'resolve_permission') {
      const card = pendingPermissions.get(entry.requestId);
      if (card) {
        card.state = payload.ok ? 'submitted' : 'open';
        emit('pending', getPendingSnapshot());
      }
    }
    if (entry && entry.kind === 'answer') {
      const card = pendingQuestions.get(entry.requestId);
      if (card) {
        card.state = payload.ok ? 'submitted' : 'open';
        emit('pending', getPendingSnapshot());
      }
    }
    if (!payload.ok) {
      toast(payload.message || '主机返回失败', 'error');
    } else if (entry && entry.kind === 'new_session') {
      const newId = payload.data && payload.data.sessionId;
      refreshSessions();
      if (newId) {
        setTimeoutFn(() => {
          openSession(newId);
          refreshSessions();
        }, 400);
      }
    } else if (entry && (entry.kind === 'archive' || entry.kind === 'unarchive')) {
      refreshSessions();
    }
  }

  function clearImageRetry(block) {
    if (!block) return;
    if (block.retryTimer) {
      clearTimeoutFn(block.retryTimer);
      block.retryTimer = null;
    }
    block.retryPending = false;
  }

  function scheduleImageRetry(entry, block) {
    clearImageRetry(block);
    block.retryPending = true;
    block.retryTimer = setTimeoutFn(() => {
      block.retryTimer = null;
      if (!block.retryPending) return;
      block.retryPending = false;
      if (block.state !== 'failed' || block.fileFallbackSent) return;
      if (state.currentSessionId !== entry.sessionId) return;
      if (!connection || !connection.isReady()) return;
      const result = retrySend(entry.clientMsgId, { auto: true });
      if (!result.ok) {
        block.error = result.error || '自动重试失败';
        emit('chat', { sessionId: entry.sessionId });
      }
    }, IMAGE_RETRY_DELAY_MS);
  }

  function cancelImageRetry(clientMsgId) {
    const model = models.get(state.currentSessionId);
    const block = model ? model.byId.get(clientMsgId) : null;
    if (block) clearImageRetry(block);
  }

  function onSendResult(entry, payload) {
    const block = models.get(entry.sessionId) ? models.get(entry.sessionId).byId.get(entry.clientMsgId) : null;
    if (payload.ok) {
      if (entry.timer) clearTimeoutFn(entry.timer);
      if (block) {
        clearImageRetry(block);
        block.retryCount = 0;
      }
      messageState.markAccepted(entry.message);
      pendingSends.delete(entry.clientMsgId);
      if (block) {
        block.state = 'accepted';
        block.error = '';
        emit('chat', { sessionId: entry.sessionId });
      }
    } else {
      if (entry.timer) clearTimeoutFn(entry.timer);
      const hadImages = !!(block && (block.images || []).length);
      const raw = String(payload.message || '');
      const busyReject = hadImages && /prompt rejected/i.test(raw);
      const unsupported = hadImages && /does not support image input/i.test(raw);
      let message = payload.message || '发送失败';
      if (busyReject && block) {
        block.retryCount = (block.retryCount || 0) + 1;
        if (block.retryCount <= IMAGE_RETRY_LIMIT) {
          const seconds = Math.round(IMAGE_RETRY_DELAY_MS / 1000);
          message = `电脑正在处理上一轮，图片不能排队；${seconds} 秒后自动重试（第 ${block.retryCount}/${IMAGE_RETRY_LIMIT} 次）`;
          scheduleImageRetry(entry, block);
        } else {
          message = '图片仍未发出：电脑可能一直在忙。可以点“重试”，或“改成文件发送”。';
        }
      } else if (unsupported) {
        message = '当前模型不支持图片输入，请点“改成文件发送”。';
      }
      messageState.markFailed(entry.message, message);
      pendingSends.delete(entry.clientMsgId);
      if (block) {
        block.state = 'failed';
        block.error = message;
        emit('chat', { sessionId: entry.sessionId });
      }
      const finalFailure = !busyReject || (block && block.retryCount > IMAGE_RETRY_LIMIT);
      if (!entry.autoRetry || finalFailure) toast(message, 'error');
    }
  }

  function onPermissionRequest(payload) {
    const card = {
      requestId: payload.requestId,
      sessionId: payload.sessionId || '',
      action: payload.action || '',
      resource: payload.resource || '',
      reason: payload.reason || '',
      options: Array.isArray(payload.options) ? payload.options : [],
      expiresAt: payload.expiresAt || '',
      state: 'open',
      receivedAt: now()
    };
    pendingPermissions.set(card.requestId, card);
    emit('pending', getPendingSnapshot());
    emit('chat', { sessionId: state.currentSessionId });
  }

  function onPermissionResolved(payload) {
    const card = pendingPermissions.get(payload.requestId);
    if (card) {
      card.state = 'resolved';
      card.by = payload.by || 'desktop';
      emit('pending', getPendingSnapshot());
      emit('chat', { sessionId: state.currentSessionId });
    }
  }

  function onQuestionRequest(payload) {
    const card = {
      requestId: payload.requestId,
      sessionId: payload.sessionId || '',
      questions: Array.isArray(payload.questions) ? payload.questions : [],
      expiresAt: payload.expiresAt || '',
      state: 'open',
      receivedAt: now()
    };
    pendingQuestions.set(card.requestId, card);
    emit('pending', getPendingSnapshot());
    emit('chat', { sessionId: state.currentSessionId });
  }

  function onQuestionResolved(payload) {
    const card = pendingQuestions.get(payload.requestId);
    if (card) {
      card.state = 'resolved';
      card.by = payload.by || 'desktop';
      emit('pending', getPendingSnapshot());
      emit('chat', { sessionId: state.currentSessionId });
    }
  }

  function getPendingSnapshot() {
    return {
      permissions: Array.from(pendingPermissions.values()),
      questions: Array.from(pendingQuestions.values()),
      count:
        Array.from(pendingPermissions.values()).filter((card) => card.state === 'open').length +
        Array.from(pendingQuestions.values()).filter((card) => card.state === 'open').length
    };
  }

  // --------------------------------------------------------------------- send

  function sendPrompt(text, attachments) {
    const sessionId = state.currentSessionId;
    if (!sessionId) return { ok: false, error: '请先进入一个会话' };
    if (!connection || !connection.isReady()) return { ok: false, error: '未连接主机' };
    const images = (attachments && attachments.images) || [];
    const files = (attachments && attachments.files) || [];
    const check = payloads.validatePrompt({ text, images, files });
    if (!check.ok) return { ok: false, error: check.error };
    const clientMsgId = makeId('u');
    const cmdId = makeId('cmd');
    const message = messageState.createMessage(text, clientMsgId);
    messageState.transition(message, 'sending');
    const model = ensureModel(sessionId);
    const block = chatModel.addLocalUserMessage(model, {
      clientMsgId,
      text,
      images,
      files,
      state: 'sending',
      at: now()
    });
    const payload = payloads.sendPrompt(cmdId, { sessionId, text, images, files });
    const sent = connection.sendCommand(payload);
    if (!sent) {
      messageState.markFailed(message, '未连接');
      block.state = 'failed';
      block.error = '未连接';
      emit('chat', { sessionId });
      return { ok: false, error: '未连接主机' };
    }
    const timer = setTimeoutFn(() => {
      const entry = pendingSends.get(clientMsgId);
      if (!entry) return;
      // The frame left the device: never mark it failed and never offer a retry
      // that could double-send. Keep the entry so a late ack/echo can still clear it.
      entry.timer = null;
      entry.timedOut = true;
      entry.block.state = 'uncertain';
      entry.block.error = '已发送，等待主机确认';
      emit('chat', { sessionId });
    }, SEND_TIMEOUT_MS);
    const entry = { clientMsgId, cmdId, sessionId, text, images, files, message, block, timer };
    pendingSends.set(clientMsgId, entry);
    sendByCmd.set(cmdId, entry);
    emit('chat', { sessionId });
    return { ok: true, clientMsgId };
  }

  function retrySend(clientMsgId, options) {
    const existing = pendingSends.get(clientMsgId);
    if (existing) return { ok: false, error: '还在发送中' };
    if (!state.currentSessionId) return { ok: false, error: '请先进入会话' };
    const model = models.get(state.currentSessionId);
    const block = model ? model.byId.get(clientMsgId) : null;
    if (!block || block.state !== 'failed') return { ok: false, error: '这条消息不需要重试' };
    if (block.fileFallbackSent) return { ok: false, error: '已经改成文件发送了' };
    if (!connection || !connection.isReady()) return { ok: false, error: '未连接主机' };
    clearImageRetry(block);
    const cmdId = makeId('cmd');
    const message = messageState.createMessage(
      block.parts.map((part) => part.text).join(''),
      clientMsgId
    );
    messageState.transition(message, 'sending');
    const payload = payloads.sendPrompt(cmdId, {
      sessionId: state.currentSessionId,
      text: message.text,
      images: block.images,
      files: block.files
    });
    if (!connection.sendCommand(payload)) return { ok: false, error: '未连接主机' };
    block.state = 'sending';
    block.error = '';
    const timer = setTimeoutFn(() => {
      const pending = pendingSends.get(clientMsgId);
      if (!pending) return;
      pending.timer = null;
      pending.timedOut = true;
      pending.block.state = 'uncertain';
      pending.block.error = '已发送，等待主机确认';
      emit('chat', { sessionId: state.currentSessionId });
    }, SEND_TIMEOUT_MS);
    const entry = {
      clientMsgId,
      cmdId,
      sessionId: state.currentSessionId,
      message,
      block,
      timer,
      autoRetry: !!(options && options.auto)
    };
    pendingSends.set(clientMsgId, entry);
    sendByCmd.set(cmdId, entry);
    emit('chat', { sessionId: state.currentSessionId });
    return { ok: true };
  }

  function getPermission() {
    return requestPermission(false, '');
  }

  function setPermission(preset) {
    return requestPermission(true, preset);
  }

  function requestPermission(isSet, preset) {
    return new Promise((resolve, reject) => {
      const sessionId = state.currentSessionId;
      if (!sessionId) {
        reject(new Error('请先进入一个会话'));
        return;
      }
      if (!connection || !connection.isReady()) {
        reject(new Error('未连接主机'));
        return;
      }
      const cmdId = makeId('perm');
      const timer = setTimeoutFn(() => {
        permissionRequests.delete(cmdId);
        reject(new Error('电脑没有响应'));
      }, 12000);
      permissionRequests.set(cmdId, { resolve, reject, timer });
      const payload = isSet
        ? payloads.setPermission(cmdId, { sessionId, preset })
        : payloads.getPermission(cmdId, { sessionId });
      if (!connection.sendCommand(payload)) {
        clearTimeoutFn(timer);
        permissionRequests.delete(cmdId);
        reject(new Error('未连接主机'));
      }
    });
  }

  function resolvePermission(requestId, decision, note) {
    const card = pendingPermissions.get(requestId);
    if (!card || !card.sessionId) return { ok: false, error: '审批不存在' };
    if (!connection || !connection.isReady()) return { ok: false, error: '未连接主机' };
    const cmdId = makeId('cmd');
    const sent = sendCommand(
      payloads.resolvePermission(cmdId, {
        sessionId: card.sessionId,
        requestId,
        decision,
        note
      }),
      { kind: 'resolve_permission', requestId }
    );
    if (!sent) return { ok: false, error: '未连接主机' };
    card.state = 'sending';
    emit('pending', getPendingSnapshot());
    return { ok: true };
  }

  function answerQuestion(requestId, answers) {
    const card = pendingQuestions.get(requestId);
    if (!card || !card.sessionId) return { ok: false, error: '提问不存在' };
    if (!connection || !connection.isReady()) return { ok: false, error: '未连接主机' };
    const cmdId = makeId('cmd');
    const sent = sendCommand(payloads.answer(cmdId, { sessionId: card.sessionId, requestId, answers }), {
      kind: 'answer',
      requestId
    });
    if (!sent) return { ok: false, error: '未连接主机' };
    card.state = 'sending';
    emit('pending', getPendingSnapshot());
    return { ok: true };
  }

  function interrupt(sessionId) {
    const target = sessionId || state.currentSessionId;
    if (!target) return false;
    return sendCommand(payloads.interrupt(makeId('cmd'), { sessionId: target }), { kind: 'interrupt' });
  }

  function newSession(workspace) {
    return sendCommand(payloads.newSession(makeId('cmd'), { workspace }), { kind: 'new_session' });
  }

  function archiveSession(sessionId, archived) {
    return sendCommand(payloads.archiveSession(makeId('cmd'), { sessionId, archived: archived !== false }), {
      kind: archived === false ? 'unarchive' : 'archive'
    });
  }

  function setKeepAwake(enabled, idleReleaseSec) {
    return sendCommand(payloads.keepAwake(makeId('cmd'), { enabled, idleReleaseSec }), {
      kind: 'keep_awake'
    });
  }

  function clearPendingCards() {
    pendingPermissions.clear();
    pendingQuestions.clear();
    emit('pending', getPendingSnapshot());
  }

  // ---------------------------------------------------------------------- init

  function init() {
    installId = store.ensureInstallId(() => `drc-${codec.randomBytes(8).reduce((t, b) => t + b.toString(16).padStart(2, '0'), '')}`);
    loadHosts();
    const host = activeHost();
    if (host) {
      state.mode = host.activeMode || state.mode;
      state.sessions = sessionList.normalizeSessions(store.loadSessions(sessionCacheKey()));
    }
    emit('sessions', state.sessions);
  }

  function destroy() {
    disconnect();
    for (const entry of pendingCommands.values()) {
      if (entry.timer) clearTimeoutFn(entry.timer);
    }
    pendingCommands.clear();
    for (const entry of permissionRequests.values()) {
      if (entry.timer) clearTimeoutFn(entry.timer);
    }
    permissionRequests.clear();
    sendByCmd.clear();
    for (const entry of pendingSends.values()) {
      if (entry.timer) clearTimeoutFn(entry.timer);
    }
    pendingSends.clear();
    for (const entry of historyReq.values()) {
      if (entry.timer) clearTimeoutFn(entry.timer);
    }
    historyReq.clear();
    historyBuffers.clear();
    destroyConnection();
    for (const key of Object.keys(listeners)) listeners[key] = [];
  }

  function exportConfig() {
    return JSON.stringify(
      {
        app: 'DSH Remoto',
        version: opts.softwareVersion || '0.3.1',
        exportedAt: new Date(now()).toISOString(),
        active: { hostId: state.activeHostId, mode: state.mode },
        hosts: state.hosts
      },
      null,
      2
    );
  }

  function importConfig(text) {
    let data;
    try {
      data = typeof text === 'string' ? JSON.parse(text) : text;
    } catch {
      throw new Error('JSON 格式不对');
    }
    if (!data || !Array.isArray(data.hosts) || data.hosts.length === 0) {
      throw new Error('没有可导入的主机');
    }
    const hosts = data.hosts
      .map(normalizeHost)
      .filter((host) => host.id && (host.endpoints.relay || host.endpoints.lan));
    if (!hosts.length) throw new Error('配置里没有有效的主机地址');

    destroyConnection();
    pendingPairData = null;
    for (const entry of pendingCommands.values()) {
      if (entry.timer) clearTimeoutFn(entry.timer);
    }
    pendingCommands.clear();
    for (const entry of permissionRequests.values()) {
      if (entry.timer) clearTimeoutFn(entry.timer);
    }
    permissionRequests.clear();
    sendByCmd.clear();
    for (const entry of pendingSends.values()) {
      if (entry.timer) clearTimeoutFn(entry.timer);
    }
    pendingSends.clear();
    for (const entry of historyReq.values()) {
      if (entry.timer) clearTimeoutFn(entry.timer);
    }
    historyReq.clear();
    historyBuffers.clear();
    historyStatus.clear();
    models.clear();
    pendingPermissions.clear();
    pendingQuestions.clear();

    state.hosts = hosts;
    const wanted = data.active && data.active.hostId;
    state.activeHostId = hosts.some((host) => host.id === wanted) ? wanted : hosts[0].id;
    const active = activeHost();
    state.mode = data.active && (data.active.mode === 'lan' || data.active.mode === 'relay')
      ? data.active.mode
      : active.activeMode || (active.endpoints.relay ? 'relay' : 'lan');
    active.activeMode = state.mode;
    state.currentSessionId = '';
    state.status = { phase: 'idle', detail: '', hostOnline: false, paired: false };
    state.pairing = { state: 'idle', sas: '', error: '', token: '' };
    state.sessions = sessionList.normalizeSessions(store.loadSessions(sessionCacheKey()));
    saveHosts();
    emit('hosts', getHostsSnapshot());
    emit('sessions', state.sessions);
    emit('pending', getPendingSnapshot());
    emit('state', getStateSnapshot());
    emit('session', { sessionId: '' });
    return hosts.length;
  }

  return {
    on,
    init,
    destroy,
    exportConfig,
    importConfig,
    addHost,
    updateHost,
    removeHost,
    selectHost,
    setMode,
    connect,
    disconnect,
    resume,
    pair,
    confirmPairing,
    cancelPair,
    forgetPairing,
    refreshSessions,
    getPending,
    openSession,
    loadEarlier,
    requestHistory,
    sendPrompt,
    retrySend,
    cancelImageRetry,
    getPermission,
    setPermission,
    resolvePermission,
    answerQuestion,
    interrupt,
    newSession,
    archiveSession,
    setKeepAwake,
    clearPendingCards,
    clearHistoryCaches,
    getHosts: getHostsSnapshot,
    getState: getStateSnapshot,
    getPairing: getPairingSnapshot,
    getSessions: () => state.sessions,
    getCurrentSessionId: () => state.currentSessionId,
    getModel: (sessionId) => models.get(sessionId || state.currentSessionId) || null,
    getHistoryStatus: (sessionId) => historyStatus.get(sessionId || state.currentSessionId) || { loading: false, error: '' },
    getPendingCards: getPendingSnapshot,
    getHostInfo: () => state.hostInfo,
    getLimits: () => state.limits,
    getKeepAwake: () => state.keepAwake,
    getDefaults: () => ({ relayUrl: defaults.relayUrl || DEFAULT_RELAY_URL }),
    isReady: () => !!(connection && connection.isReady()),
    _internals: { state, models, pendingSends, pendingPermissions, pendingQuestions, historyReq }
  };
}

module.exports = { createClient, DEFAULT_RELAY_URL, PAIR_FAIL_TEXT, ERROR_TEXT };

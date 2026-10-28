import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const codec = require('../../src/codec.js');
const frames = require('../../src/frames.js');

function emitter() {
  const listeners = new Map();
  const once = new Map();
  return {
    on(event, fn) {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event).push(fn);
      return () => {
        const list = listeners.get(event) || [];
        const index = list.indexOf(fn);
        if (index !== -1) list.splice(index, 1);
      };
    },
    emit(event, data) {
      for (const fn of (listeners.get(event) || []).slice()) fn(data);
      const waiting = once.get(event) || [];
      once.delete(event);
      for (const resolve of waiting) resolve(data);
    },
    waitFor(event, timeoutMs = 5000) {
      return new Promise((resolve, reject) => {
        if (!once.has(event)) once.set(event, []);
        const list = once.get(event);
        const timer = setTimeout(() => {
          const index = list.indexOf(wrapped);
          if (index !== -1) list.splice(index, 1);
          reject(new Error(`timeout waiting for ${event}`));
        }, timeoutMs);
        const wrapped = (data) => {
          clearTimeout(timer);
          resolve(data);
        };
        list.push(wrapped);
      });
    }
  };
}

export function createFakeHost(options) {
  const opts = options || {};
  const url = opts.url;
  const token = opts.token;
  const bus = emitter();
  const sessionId = 's_alpha';
  const state = {
    ws: null,
    hostId: 'dsh-test',
    clientId: '',
    channelId: '',
    psk: codec.toBase64(codec.randomBytes(16)),
    sas: '',
    keys: null,
    pairingToken: '',
    commands: [],
    payloads: [],
    sessions: [
      {
        id: 's_alpha',
        state: 'running',
        running: true,
        title: 'Alpha 会话',
        workspace: 'C:\\work\\alpha',
        updatedAt: new Date(Date.now() - 60 * 1000).toISOString()
      },
      {
        id: 's_beta',
        state: 'idle',
        title: 'Beta 文档',
        workspace: 'C:\\work\\beta',
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 's_old',
        state: 'archived',
        title: '旧会话',
        workspace: 'C:\\work\\old',
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    history: [
      { t: 'ev.message_delta', sessionId, messageId: 'm1', role: 'user', delta: '你好', done: true },
      { t: 'ev.message_delta', sessionId, messageId: 'm2', role: 'assistant', part: 0, delta: '你好，我是 Alpha。' },
      {
        t: 'ev.tool_event',
        sessionId,
        callId: 'call_1',
        tool: 'read_file',
        phase: 'completed',
        title: '读取 README.md',
        argsPreview: 'README.md',
        resultPreview: '# DSH'
      },
      {
        t: 'ev.todo',
        sessionId,
        todos: [
          { content: '读取规范', status: 'completed' },
          { content: '实现客户端', status: 'in_progress' }
        ]
      }
    ]
  };

  function sendFrame(frame) {
    if (!state.ws || state.ws.readyState !== 1) return false;
    state.ws.send(JSON.stringify(frame));
    return true;
  }

  function sendPayload(payload) {
    if (!state.keys) throw new Error('no keys');
    state.payloads.push(payload);
    const nonce = codec.randomBytes(24);
    const record = codec.seal(state.keys.sendKey, payload, nonce);
    return sendFrame(frames.encFrame(state.channelId, record.ciphertext));
  }

  function handlePairRequest(frame) {
    state.channelId = frame.sessionId;
    const hostKeys = codec.newKeyPair();
    const shared = codec.sharedKey(hostKeys.secretKey, codec.fromBase64(frame.clientPub));
    state.sas = codec.sasCode(shared);
    const wrapped = wrapPsk(shared, codec.pskBytes(state.psk));
    state.keys = {
      sendKey: codec.deriveKey(state.psk, 'h2c', state.channelId),
      recvKey: codec.deriveKey(state.psk, 'c2h', state.channelId)
    };
    sendFrame(
      frames.pairGrant(
        state.channelId,
        codec.toBase64(hostKeys.publicKey),
        wrapped.nonce,
        wrapped.wrappedPsk
      )
    );
    bus.emit('pair-request', { sas: state.sas, channelId: state.channelId });
  }

  function wrapPsk(shared, psk) {
    const key = codec.kdfHash([codec.KDF_NAMESPACE, 'dsh-rc/psk-wrap', shared]).slice(0, 32);
    // protocol uses SHA-512(shared || label)[0..32]
    const actualKey = codec.wrapKey(shared);
    void key;
    const nonce = codec.randomBytes(24);
    // Reuse codec.seal + manual nonce layout: unwrapPsk expects nonce and box separately.
    const box = require('../../vendor/tweetnacl.js').secretbox(psk, nonce, actualKey);
    return { nonce: codec.toBase64(nonce), wrappedPsk: codec.toBase64(box) };
  }

  function handleCommand(payload) {
    state.commands.push(payload);
    bus.emit('command', payload);
    switch (payload.t) {
      case 'cmd.list_sessions':
        sendPayload({ t: 'ev.session_changed', sessions: state.sessions, reason: 'list' });
        sendPayload({ t: 'ev.result', cmdId: payload.cmdId, ok: true });
        break;
      case 'cmd.session_history': {
        const items = state.history;
        const page = {
          t: 'ev.session_history',
          sessionId: payload.sessionId,
          cmdId: payload.cmdId,
          items,
          nextBeforeSeq: payload.beforeSeq ? undefined : 12,
          latestSeq: 20
        };
        if (!page.nextBeforeSeq) delete page.nextBeforeSeq;
        sendPayload(page);
        break;
      }
      case 'cmd.send_prompt': {
        const n = state.commands.filter((item) => item.t === 'cmd.send_prompt').length;
        sendPayload({
          t: 'ev.message_delta',
          sessionId: payload.sessionId,
          messageId: `echo_${n}`,
          role: 'user',
          delta: payload.text,
          done: true
        });
        sendPayload({ t: 'ev.result', cmdId: payload.cmdId, ok: true });
        if (/permission/.test(payload.text)) {
          sendPayload({
            t: 'ev.permission_request',
            sessionId: payload.sessionId,
            requestId: 'req_1',
            action: 'run_command',
            resource: 'npm test',
            reason: '需要执行测试',
            options: [
              { id: 'allow', label: '允许' },
              { id: 'deny', label: '拒绝' }
            ]
          });
          return;
        }
        if (/question/.test(payload.text)) {
          sendPayload({
            t: 'ev.question_request',
            sessionId: payload.sessionId,
            requestId: 'q_1',
            questions: [
              {
                id: 'q1',
                question: '选择分支',
                multi: false,
                options: [
                  { id: 'main', label: 'main' },
                  { id: 'dev', label: 'dev' }
                ]
              }
            ]
          });
          return;
        }
        sendPayload({ t: 'ev.run_state', sessionId: payload.sessionId, state: 'running' });
        sendPayload({
          t: 'ev.message_delta',
          sessionId: payload.sessionId,
          messageId: `assist_${n}`,
          role: 'assistant',
          part: 0,
          delta: '正在处理：'
        });
        sendPayload({
          t: 'ev.message_delta',
          sessionId: payload.sessionId,
          messageId: `assist_${n}`,
          role: 'assistant',
          part: 0,
          delta: payload.text
        });
        sendPayload({
          t: 'ev.tool_event',
          sessionId: payload.sessionId,
          callId: `call_${n}`,
          tool: 'bash',
          phase: 'started',
          title: '执行命令'
        });
        sendPayload({
          t: 'ev.tool_event',
          sessionId: payload.sessionId,
          callId: `call_${n}`,
          tool: 'bash',
          phase: 'completed',
          title: '执行命令',
          resultPreview: 'ok'
        });
        sendPayload({
          t: 'ev.message_delta',
          sessionId: payload.sessionId,
          messageId: `assist_${n}`,
          role: 'assistant',
          part: 0,
          delta: '完成。',
          done: true
        });
        sendPayload({ t: 'ev.run_state', sessionId: payload.sessionId, state: 'idle' });
        break;
      }
      case 'cmd.resolve_permission':
        sendPayload({ t: 'ev.result', cmdId: payload.cmdId, ok: true });
        if (payload.requestId === 'req_1') {
          sendPayload({
            t: 'ev.permission_resolved',
            requestId: payload.requestId,
            sessionId: payload.sessionId,
            by: 'desktop'
          });
        }
        break;
      case 'cmd.answer':
        sendPayload({ t: 'ev.result', cmdId: payload.cmdId, ok: true });
        sendPayload({
          t: 'ev.question_resolved',
          requestId: payload.requestId,
          sessionId: payload.sessionId,
          by: 'desktop'
        });
        break;
      case 'cmd.interrupt':
        sendPayload({ t: 'ev.result', cmdId: payload.cmdId, ok: true });
        sendPayload({ t: 'ev.run_state', sessionId: payload.sessionId, state: 'idle' });
        break;
      case 'cmd.new_session':
        sendPayload({ t: 'ev.result', cmdId: payload.cmdId, ok: true, data: { sessionId: 's_new' } });
        break;
      case 'cmd.archive_session': {
        const target = state.sessions.find((item) => item.id === payload.sessionId);
        if (target) target.state = payload.archived === false ? 'idle' : 'archived';
        sendPayload({ t: 'ev.result', cmdId: payload.cmdId, ok: true });
        sendPayload({ t: 'ev.session_changed', sessions: state.sessions, reason: 'archive' });
        break;
      }
      case 'cmd.get_pending':
        sendPayload({ t: 'ev.result', cmdId: payload.cmdId, ok: true });
        break;
      case 'cmd.keep_awake':
        sendPayload({ t: 'ev.result', cmdId: payload.cmdId, ok: true });
        sendPayload({
          t: 'ev.keep_awake_state',
          enabled: payload.enabled,
          active: payload.enabled,
          platform: 'win32',
          backend: 'unsupported'
        });
        break;
      default:
        sendPayload({ t: 'ev.result', cmdId: payload.cmdId, ok: false, message: 'unknown command' });
    }
  }

  async function open() {
    await new Promise((resolve, reject) => {
      const socket = new WebSocket(url);
      state.ws = socket;
      socket.onopen = () => resolve();
      socket.onerror = (event) => reject(new Error(`socket error: ${event && event.message}`));
      socket.onmessage = (event) => {
        const frame = frames.parseFrame(String(event.data));
        if (!frame) return;
        switch (frame.t) {
          case 'hello-ok':
            state.hostId = frame.hostId || state.hostId;
            bus.emit('hello-ok', frame);
            break;
          case 'pair-ready':
            state.pairingToken = frame.pairingToken;
            bus.emit('pair-ready', frame);
            break;
          case 'pair-request':
            handlePairRequest(frame);
            break;
          case 'enc':
            if (!state.keys) return;
            {
              const payload = codec.open(state.keys.recvKey, frame);
              if (payload) handleCommand(payload);
            }
            break;
          case 'ping':
            sendFrame(frames.pong(frame.ts));
            break;
          case 'error':
            bus.emit('relay-error', frame);
            break;
          default:
            break;
        }
      };
    });
    sendFrame(frames.helloHost({ token, hostId: state.hostId, label: 'fake-host' }));
    await bus.waitFor('hello-ok');
  }

  function beginPair(tokenValue) {
    state.pairingToken = tokenValue;
    sendFrame(frames.pairBegin(tokenValue));
    return bus.waitFor('pair-ready');
  }

  function close() {
    return new Promise((resolve) => {
      const socket = state.ws;
      if (!socket || socket.readyState >= 2) return resolve();
      const timer = setTimeout(() => resolve(), 1500);
      socket.onclose = () => {
        clearTimeout(timer);
        resolve();
      };
      try {
        socket.close();
      } catch {
        clearTimeout(timer);
        resolve();
      }
    });
  }

  return {
    open,
    beginPair,
    close,
    bus,
    state,
    sendPayload,
    get commands() {
      return state.commands;
    },
    get sas() {
      return state.sas;
    },
    get psk() {
      return state.psk;
    },
    get channelId() {
      return state.channelId;
    }
  };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { startRelay } from './helpers/relay.mjs';
import { createFakeHost } from './helpers/fake-host.mjs';

const require = createRequire(import.meta.url);
const { createConnection } = require('../src/connection.js');
const payloads = require('../src/payloads.js');

function waitEvent(conn, event, predicate, timeoutMs = 6000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      off();
      reject(new Error(`timeout waiting for ${event}`));
    }, timeoutMs);
    const off = conn.on(event, (data) => {
      if (predicate && !predicate(data)) return;
      clearTimeout(timer);
      off();
      resolve(data);
    });
  });
}

function waitPayload(conn, type, predicate, timeoutMs = 6000) {
  return waitEvent(conn, 'payload', (data) => data && data.t === type && (!predicate || predicate(data)), timeoutMs);
}

test('protocol 0.5.4 end-to-end: pair, list, history, stream, approvals', async () => {
  const relay = await startRelay();
  const host = createFakeHost({ url: relay.url, token: relay.token });
  await host.open();
  const token = '473921';
  await host.beginPair(token);

  const conn = createConnection({
    url: relay.url,
    clientId: 'client-test-1',
    label: 'test client',
    config: { autoReconnect: false, heartbeatMs: 60000, handshakeTimeoutMs: 5000 }
  });
  const states = [];
  conn.on('state', (data) => states.push(data.state));

  const paired = waitEvent(conn, 'pair', (data) => data.stage === 'paired');
  const ready = waitEvent(conn, 'ready', (data) => data.paired === true);
  conn.connect();
  conn.beginPair(token);

  const pairing = await paired;
  assert.match(pairing.channelId, /^c_/);
  assert.equal(pairing.sas, host.sas, 'client SAS must equal host SAS');
  assert.equal(pairing.psk, host.psk, 'client must unwrap the host PSK');

  conn.configureSession({
    channelId: pairing.channelId,
    hostId: pairing.hostId,
    psk: pairing.psk,
    clientId: pairing.clientId
  });
  await ready;
  assert.equal(conn.isReady(), true);
  assert.ok(states.includes('connecting'));
  assert.ok(states.includes('handshaking'));
  assert.ok(states.includes('pairing'));
  assert.ok(states.includes('ready'));

  // list_sessions
  const sessionsPayload = waitPayload(conn, 'ev.session_changed');
  const listResult = waitPayload(conn, 'ev.result', (data) => data.cmdId === 'cmd-list-1');
  assert.equal(conn.sendCommand(payloads.listSessions('cmd-list-1')), true);
  const sessions = await sessionsPayload;
  assert.equal(sessions.sessions.length, 3);
  assert.equal((await listResult).ok, true);

  // history
  const historyPayload = waitPayload(conn, 'ev.session_history');
  conn.sendCommand(payloads.sessionHistory('cmd-hist-1', { sessionId: 's_alpha', limit: 50 }));
  const history = await historyPayload;
  assert.equal(history.sessionId, 's_alpha');
  assert.equal(history.items.length, 4);
  assert.equal(history.latestSeq, 20);

  // send_prompt: echo + streamed assistant + tool events + run state
  const echo = waitPayload(conn, 'ev.message_delta', (data) => data.role === 'user');
  const assistDone = waitPayload(conn, 'ev.message_delta', (data) => data.role === 'assistant' && data.done);
  const toolDone = waitPayload(conn, 'ev.tool_event', (data) => data.callId === 'call_1' && data.phase === 'completed');
  const idle = waitPayload(conn, 'ev.run_state', (data) => data.state === 'idle');
  conn.sendCommand(payloads.sendPrompt('cmd-send-1', { sessionId: 's_alpha', text: 'hello from client' }));
  assert.equal((await echo).delta, 'hello from client');
  assert.equal((await assistDone).done, true);
  assert.equal((await toolDone).title, '执行命令');
  assert.equal((await idle).state, 'idle');
  assert.equal(host.commands.some((cmd) => cmd.t === 'cmd.send_prompt' && cmd.text === 'hello from client'), true);

  // permission card + resolve
  const permission = waitPayload(conn, 'ev.permission_request');
  conn.sendCommand(payloads.sendPrompt('cmd-send-2', { sessionId: 's_alpha', text: 'permission please' }));
  const card = await permission;
  assert.equal(card.requestId, 'req_1');
  assert.deepEqual(card.options.map((option) => option.id), ['allow', 'deny']);
  const resolved = waitPayload(conn, 'ev.permission_resolved');
  conn.sendCommand(
    payloads.resolvePermission('cmd-res-1', {
      sessionId: 's_alpha',
      requestId: card.requestId,
      decision: 'allow'
    })
  );
  assert.equal((await resolved).requestId, 'req_1');
  assert.equal(host.commands.some((cmd) => cmd.t === 'cmd.resolve_permission' && cmd.decision === 'allow'), true);

  // question card + answer
  const question = waitPayload(conn, 'ev.question_request');
  conn.sendCommand(payloads.sendPrompt('cmd-send-3', { sessionId: 's_alpha', text: 'question please' }));
  const ask = await question;
  assert.equal(ask.questions[0].id, 'q1');
  const answered = waitPayload(conn, 'ev.question_resolved');
  conn.sendCommand(
    payloads.answer('cmd-ans-1', {
      sessionId: 's_alpha',
      requestId: ask.requestId,
      answers: [{ questionId: 'q1', selected: ['main'] }]
    })
  );
  await answered;
  assert.equal(host.commands.some((cmd) => cmd.t === 'cmd.answer' && cmd.answers[0].selected[0] === 'main'), true);

  // archive + new session + keep awake
  const changed = waitPayload(conn, 'ev.session_changed', (data) => data.reason === 'archive');
  conn.sendCommand(payloads.archiveSession('cmd-arch-1', { sessionId: 's_beta' }));
  assert.equal((await changed).sessions.find((item) => item.id === 's_beta').state, 'archived');

  const created = waitPayload(conn, 'ev.result', (data) => data.cmdId === 'cmd-new-1');
  conn.sendCommand(payloads.newSession('cmd-new-1', {}));
  assert.equal((await created).data.sessionId, 's_new');

  const keep = waitPayload(conn, 'ev.keep_awake_state');
  conn.sendCommand(payloads.keepAwake('cmd-keep-1', { enabled: true }));
  assert.equal((await keep).enabled, true);

  conn.stop();
  await host.close();
  await relay.stop();
});

test('pairing fails with a bad code and the connection stays usable', async () => {
  const relay = await startRelay();
  const host = createFakeHost({ url: relay.url, token: relay.token });
  await host.open();
  await host.beginPair('111111');

  const conn = createConnection({
    url: relay.url,
    clientId: 'client-test-2',
    config: { autoReconnect: false, heartbeatMs: 60000, handshakeTimeoutMs: 5000 }
  });
  const failure = waitEvent(conn, 'pair', (data) => data.stage === 'fail');
  conn.connect();
  conn.beginPair('222222');
  assert.equal((await failure).reason, 'invalid_or_expired');
  assert.equal(conn.isReady(), false);
  conn.stop();
  await host.close();
  await relay.stop();
});

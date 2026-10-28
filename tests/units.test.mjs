import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const chat = require('../src/chat-model.js');
const sessions = require('../src/session-list.js');
const pairing = require('../src/pairing-flow.js');
const codec = require('../src/codec.js');
const payloads = require('../src/payloads.js');
const { createClient } = require('../src/client.js');
const { memoryBackend } = require('../src/store.js');
const nacl = require('../vendor/tweetnacl.js');

test('chat model: one message, multiple parts, done flag', () => {
  const model = chat.createChatModel();
  chat.applyEvent(model, { t: 'ev.message_delta', sessionId: 's1', messageId: 'm1', role: 'assistant', part: 0, delta: 'hello' });
  chat.applyEvent(model, { t: 'ev.message_delta', sessionId: 's1', messageId: 'm1', role: 'assistant', part: 0, delta: ' world' });
  chat.applyEvent(model, { t: 'ev.message_delta', sessionId: 's1', messageId: 'm1', role: 'assistant', part: 1, delta: 'second' });
  chat.applyEvent(model, { t: 'ev.message_delta', sessionId: 's1', messageId: 'm1', role: 'assistant', part: 1, delta: ' part', done: true });
  const block = model.byId.get('m1');
  assert.equal(block.parts.length, 2);
  assert.equal(block.parts[0].text, 'hello world');
  assert.equal(block.parts[1].text, 'second part');
  assert.equal(block.done, true);
  assert.equal(block.role, 'assistant');
});

test('chat model: user echo folds into the optimistic bubble exactly once', () => {
  const model = chat.createChatModel();
  const local = chat.addLocalUserMessage(model, { clientMsgId: 'u_1', text: '你好', state: 'sending' });
  chat.applyEvent(model, {
    t: 'ev.message_delta',
    sessionId: 's1',
    messageId: 'm_user',
    role: 'user',
    delta: '你好',
    done: true
  });
  assert.equal(model.blocks.filter((block) => block.kind === 'message' && block.role === 'user').length, 1);
  assert.equal(local.id, 'm_user');
  assert.equal(model.byId.get('m_user'), local);
  assert.equal(model.byId.get('u_1'), undefined);
  assert.equal(local.local, false);
  assert.equal(local.state, 'accepted');
  // A second echo (live duplicate) must not append the same text again.
  chat.applyEvent(model, {
    t: 'ev.message_delta',
    sessionId: 's1',
    messageId: 'm_user',
    role: 'user',
    delta: '你好',
    done: true
  });
  assert.equal(model.blocks.length, 1);
});

test('chat model: history replay merges instead of duplicating', () => {
  const model = chat.createChatModel();
  chat.applyHistoryPage(model, [
    { t: 'ev.message_delta', messageId: 'm1', role: 'assistant', part: 0, delta: '你好，' },
    { t: 'ev.message_delta', messageId: 'm2', role: 'user', delta: '同学', done: true }
  ]);
  assert.equal(model.byId.get('m1').parts[0].text, '你好，');
  // Overlapping replay: same full text, then an extension.
  chat.applyHistoryPage(model, [
    { t: 'ev.message_delta', messageId: 'm1', role: 'assistant', part: 0, delta: '你好，' },
    { t: 'ev.message_delta', messageId: 'm1', role: 'assistant', part: 0, delta: '你好，世界' }
  ]);
  assert.equal(model.byId.get('m1').parts[0].text, '你好，世界');
  assert.equal(model.blocks.filter((block) => block.kind === 'message').length, 2);
});

test('chat model: older page is prepended in order', () => {
  const model = chat.createChatModel();
  chat.applyEvent(model, { t: 'ev.message_delta', messageId: 'new', role: 'assistant', delta: 'new' });
  chat.applyHistoryPage(
    model,
    [
      { t: 'ev.message_delta', messageId: 'old1', role: 'assistant', delta: 'one' },
      { t: 'ev.message_delta', messageId: 'old2', role: 'assistant', delta: 'two' }
    ],
    { older: true }
  );
  assert.deepEqual(
    model.blocks.filter((block) => block.kind === 'message').map((block) => block.id),
    ['old1', 'old2', 'new']
  );
});

test('chat model: tools update in place and todo is a snapshot', () => {
  const model = chat.createChatModel();
  chat.applyEvent(model, { t: 'ev.tool_event', callId: 'c1', phase: 'started', tool: 'bash', title: 'run' });
  chat.applyEvent(model, { t: 'ev.tool_event', callId: 'c1', phase: 'completed', resultPreview: 'ok' });
  assert.equal(model.blocks.length, 1);
  assert.equal(model.toolIndex.get('c1').phase, 'completed');
  assert.equal(model.toolIndex.get('c1').resultPreview, 'ok');
  chat.applyEvent(model, { t: 'ev.todo', todos: [{ content: 'a', status: 'pending' }] });
  chat.applyEvent(model, { t: 'ev.todo', todos: [] });
  assert.deepEqual(model.todo, []);
});

test('chat model: retry and compaction become notices, run state is tracked', () => {
  const model = chat.createChatModel();
  chat.applyEvent(model, { t: 'ev.retry', sessionId: 's', attempt: 2, max: 5, reason: 'TRANSPORT' });
  chat.applyEvent(model, { t: 'ev.compaction', sessionId: 's', state: 'failed', error: 'empty' });
  chat.applyEvent(model, { t: 'ev.run_state', sessionId: 's', state: 'running' });
  assert.equal(model.blocks.filter((block) => block.kind === 'notice').length, 2);
  assert.match(model.blocks[0].text, /2\/5/);
  assert.equal(model.runState, 'running');
});

test('session list: title fallback, grouping and relative time', () => {
  assert.equal(sessions.titleOf({ id: 's1', workspace: 'C:\\work\\alpha' }), 'alpha');
  assert.equal(sessions.titleOf({ id: 's1' }), 's1');
  assert.equal(sessions.stateOf({ id: 's', running: true }), 'running');
  assert.equal(sessions.stateOf({ id: 's', state: 'awaiting-permission' }), 'awaiting-permission');

  const now = Date.parse('2026-10-27T12:00:00+08:00');
  assert.equal(sessions.formatRelative(now - 30 * 1000, now), '刚刚');
  assert.equal(sessions.formatRelative(now - 5 * 60 * 1000, now), '5 分钟前');
  assert.equal(sessions.formatRelative(now - 3 * 60 * 60 * 1000, now), '3 小时前');
  assert.equal(sessions.formatRelative(now - 24 * 60 * 60 * 1000, now), '昨天');

  const grouped = sessions.groupSessions([
    { id: 'a', state: 'running', title: 'A', updatedAt: '2026-10-27T00:00:00Z' },
    { id: 'b', state: 'idle', title: 'B', updatedAt: '2026-10-26T00:00:00Z' },
    { id: 'c', state: 'archived', title: 'C', updatedAt: '2026-10-20T00:00:00Z' }
  ]);
  assert.deepEqual(grouped.running.map((item) => item.id), ['a']);
  assert.deepEqual(grouped.recent.map((item) => item.id), ['b']);
  assert.deepEqual(grouped.archived.map((item) => item.id), ['c']);
});

test('pairing flow: grant before paired and paired before grant', () => {
  const psk = codec.toBase64(codec.randomBytes(16));

  function makeGrant(clientPub) {
    const host = codec.newKeyPair();
    const shared = codec.sharedKey(host.secretKey, codec.fromBase64(clientPub));
    const nonce = codec.randomBytes(24);
    const wrapped = nacl.secretbox(codec.pskBytes(psk), nonce, codec.wrapKey(shared));
    return {
      hostPub: codec.toBase64(host.publicKey),
      nonce: codec.toBase64(nonce),
      wrappedPsk: codec.toBase64(wrapped),
      sas: codec.sasCode(shared)
    };
  }

  // grant first, then paired
  const first = pairing.createPairingFlow();
  const started = pairing.start(first, '123456');
  assert.equal(started.ok, true);
  const grantA = makeGrant(started.frame.clientPub);
  pairing.onGrant(first, { ...grantA, sessionId: 'c_a' });
  assert.equal(first.sas, grantA.sas);
  assert.equal(first.state, 'claiming');
  pairing.onPaired(first, { sessionId: 'c_a', hostId: 'h' });
  assert.equal(first.state, 'paired');
  assert.equal(pairing.result(first).psk, psk);

  // paired first, then grant
  const second = pairing.createPairingFlow();
  const startedB = pairing.start(second, '654321');
  pairing.onPaired(second, { sessionId: 'c_b', hostId: 'h' });
  assert.equal(second.state, 'claiming');
  const grantB = makeGrant(startedB.frame.clientPub);
  pairing.onGrant(second, { ...grantB, sessionId: 'c_b' });
  assert.equal(second.state, 'paired');
  assert.equal(pairing.result(second).channelId, 'c_b');
});

test('pairing flow: channel mismatch and expiry fail', () => {
  const psk = codec.toBase64(codec.randomBytes(16));
  const host = codec.newKeyPair();
  const flow = pairing.createPairingFlow({ now: () => 1000, ttlMs: 1000 });
  const started = pairing.start(flow, '111111', 1000);
  const shared = codec.sharedKey(host.secretKey, codec.fromBase64(started.frame.clientPub));
  const nonce = codec.randomBytes(24);
  const wrapped = nacl.secretbox(codec.pskBytes(psk), nonce, codec.wrapKey(shared));
  pairing.onPaired(flow, { sessionId: 'c_one', hostId: 'h' });
  pairing.onGrant(flow, {
    sessionId: 'c_two',
    hostPub: codec.toBase64(host.publicKey),
    nonce: codec.toBase64(nonce),
    wrappedPsk: codec.toBase64(wrapped)
  });
  assert.equal(flow.state, 'failed');
  assert.equal(flow.reason, 'invalid_or_expired');

  const expired = pairing.createPairingFlow({ now: () => 1000, ttlMs: 1000 });
  pairing.start(expired, '222222', 1000);
  pairing.tick(expired, 2500);
  assert.equal(expired.state, 'failed');
  assert.equal(expired.reason, 'timeout');
});

test('client host model: endpoint fallback when the chosen mode has no URL', () => {
  const client = createClient({ backend: memoryBackend(), config: { autoReconnect: false } });
  client.init();
  const relayOnly = client.addHost({ label: 'relay only', relayUrl: 'wss://relay.example', mode: 'lan' });
  assert.equal(relayOnly.activeMode, 'relay');
  const lanOnly = client.addHost({ label: 'lan only', lanAddress: '192.168.1.9', mode: 'relay' });
  assert.equal(lanOnly.activeMode, 'lan');
  client.destroy();
});

test('client host switch clears the other host chat models', () => {
  const client = createClient({ backend: memoryBackend(), config: { autoReconnect: false } });
  client.init();
  const first = client.addHost({ label: 'first', relayUrl: 'wss://relay-a.example' });
  client.addHost({ label: 'second', relayUrl: 'wss://relay-b.example' });
  client.openSession('s_shared');
  assert.ok(client.getModel('s_shared'));
  client.selectHost(first.id);
  assert.equal(client.getModel('s_shared'), null);
  assert.equal(client.getCurrentSessionId(), '');
  client.destroy();
});

test('payload validation enforces attachment budgets', () => {
  const small = Buffer.alloc(1024).toString('base64');
  const big = Buffer.alloc(300 * 1024).toString('base64');
  assert.equal(payloads.validatePrompt({ text: 'hi' }).ok, true);
  assert.match(payloads.validatePrompt({ text: '   ' }).error, /为空/);
  assert.equal(payloads.validatePrompt({ text: '', images: [{ name: 'a.jpg', mediaType: 'image/jpeg', data: small }] }).ok, true);
  assert.match(
    payloads.validatePrompt({
      text: 'x',
      images: Array.from({ length: 5 }, (_, i) => ({ name: `${i}.jpg`, mediaType: 'image/jpeg', data: small }))
    }).error,
    /最多 4/
  );
  assert.match(
    payloads.validatePrompt({ text: 'x', files: [{ name: 'a.bin', data: big }, { name: 'b.bin', data: big }] }).error,
    /512KB/
  );
  assert.equal(payloads.validatePrompt({ text: 'x'.repeat(20001) }).ok, false);
});

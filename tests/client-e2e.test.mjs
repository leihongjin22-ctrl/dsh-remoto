import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { startRelay } from './helpers/relay.mjs';
import { createFakeHost } from './helpers/fake-host.mjs';

const require = createRequire(import.meta.url);
const { createClient } = require('../src/client.js');
const { memoryBackend } = require('../src/store.js');

function waitClient(client, event, predicate, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      off();
      reject(new Error(`timeout waiting for client ${event}`));
    }, timeoutMs);
    const off = client.on(event, (data) => {
      if (predicate && !predicate(data)) return;
      clearTimeout(timer);
      off();
      resolve(data);
    });
  });
}

function until(check, timeoutMs = 6000, interval = 40) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    const tick = () => {
      let value;
      try {
        value = check();
      } catch {}
      if (value) return resolve(value);
      if (Date.now() > deadline) return reject(new Error('until timeout'));
      setTimeout(tick, interval);
    };
    tick();
  });
}

const clientOptions = () => ({
  config: { autoReconnect: false, heartbeatMs: 60000, handshakeTimeoutMs: 5000 }
});

test('client controller: pair, sessions, history, send, approvals, cache', async () => {
  const relay = await startRelay();
  const host = createFakeHost({ url: relay.url, token: relay.token });
  await host.open();
  const token = '564123';
  const hostReady = host.beginPair(token);

  const backend = memoryBackend();
  const client = createClient({ backend, ...clientOptions() });
  client.init();
  client.addHost({ label: '测试主机', relayUrl: relay.url });

  const verify = waitClient(client, 'pair', (data) => data.state === 'verify' && !!data.sas);
  client.pair(token);
  await hostReady;
  const verified = await verify;
  assert.match(verified.sas, /^\d{6}$/);
  assert.equal(
    client.getHosts().hosts[0].endpoints.relay.paired,
    false,
    'PSK must not be installed before the user confirms the digits'
  );
  const paired = waitClient(client, 'pair', (data) => data.state === 'paired');
  assert.equal(client.confirmPairing(), true);
  await paired;
  assert.equal(client.getState().paired, true);
  assert.equal(client.getState().phase, 'ready');
  assert.equal(client.getHosts().hosts[0].endpoints.relay.paired, true);

  const sessions = await waitClient(client, 'sessions', (list) => list.length === 3);
  assert.equal(sessions[0].id, 's_alpha');
  assert.equal(sessions[0].state, 'running');

  // open session: fresh history page
  client.openSession('s_alpha');
  await until(() => {
    const model = client.getModel('s_alpha');
    return model && model.historyLoaded && model.blocks.length >= 3;
  });
  let model = client.getModel('s_alpha');
  assert.equal(model.byId.get('m1').parts[0].text, '你好');
  assert.equal(model.byId.get('m2').parts[0].text, '你好，我是 Alpha。');
  assert.equal(model.toolIndex.get('call_1').phase, 'completed');
  assert.equal(model.todo.length, 2);
  assert.equal(model.nextBeforeSeq, 12);

  // send prompt: optimistic bubble folds into the host echo exactly once
  const result = client.sendPrompt('hello from client');
  assert.equal(result.ok, true);
  await until(() => {
    const chat = client.getModel('s_alpha');
    return Array.from(chat.byId.values()).some(
      (block) => block.role === 'assistant' && block.done && block.parts[0].text.includes('完成')
    );
  });
  model = client.getModel('s_alpha');
  const userBubbles = model.blocks.filter(
    (block) => block.kind === 'message' && block.role === 'user' && block.parts[0].text === 'hello from client'
  );
  assert.equal(userBubbles.length, 1, 'echo must not create a duplicate user bubble');
  assert.equal(userBubbles[0].state, 'accepted');
  assert.equal(userBubbles[0].local, false);
  const assistant = Array.from(model.byId.values()).find(
    (block) => block.role === 'assistant' && block.parts[0].text.includes('hello from client')
  );
  assert.ok(assistant, 'streamed assistant text');
  assert.equal(assistant.done, true);

  // approval card
  client.sendPrompt('permission please');
  const pending = await waitClient(client, 'pending', (data) =>
    data.permissions.some((card) => card.state === 'open')
  );
  const card = pending.permissions.find((item) => item.requestId === 'req_1');
  assert.deepEqual(card.options.map((option) => option.id), ['allow', 'deny']);
  client.resolvePermission('req_1', 'allow');
  await until(() => {
    const cards = client.getPendingCards();
    const target = cards.permissions.find((item) => item.requestId === 'req_1');
    return target && target.state === 'resolved';
  });
  assert.equal(
    host.commands.some((cmd) => cmd.t === 'cmd.resolve_permission' && cmd.decision === 'allow'),
    true
  );

  // question card
  client.sendPrompt('question please');
  const asked = await waitClient(client, 'pending', (data) =>
    data.questions.some((item) => item.requestId === 'q_1')
  );
  assert.equal(asked.questions[0].questions[0].id, 'q1');
  client.answerQuestion('q_1', [{ questionId: 'q1', selected: ['main'] }]);
  await until(() => {
    const target = client.getPendingCards().questions.find((item) => item.requestId === 'q_1');
    return target && target.state === 'resolved';
  });
  assert.equal(
    host.commands.some((cmd) => cmd.t === 'cmd.answer' && cmd.answers[0].selected[0] === 'main'),
    true
  );

  // load earlier must not duplicate replayed items
  const before = client.getModel('s_alpha').blocks.length;
  assert.equal(client.loadEarlier(), true);
  await new Promise((resolve) => setTimeout(resolve, 400));
  const after = client.getModel('s_alpha').blocks.length;
  assert.equal(after, before, 'duplicate history replay must be merged by messageId');
  assert.equal(client.getModel('s_alpha').byId.get('m1').parts[0].text, '你好');

  // archive + new session commands reach the host
  client.archiveSession('s_beta', true);
  await waitClient(client, 'sessions', (list) => list.find((item) => item.id === 's_beta').state === 'archived');
  client.newSession();
  await until(() => host.commands.some((cmd) => cmd.t === 'cmd.new_session'));

  // cache-first: a fresh client on the same backend renders the cached chat offline
  client.disconnect();
  const offline = createClient({ backend, ...clientOptions() });
  offline.init();
  offline.openSession('s_alpha');
  const cached = offline.getModel('s_alpha');
  assert.ok(cached.blocks.length >= 3, 'cached history is shown before any network I/O');
  assert.equal(offline.getHistoryStatus('s_alpha').error, '离线，显示本地缓存');
  assert.equal(offline.requestHistory('s_alpha'), false);
  assert.ok(offline.getModel('s_alpha').blocks.length >= 3, 'failed refresh must not clear the cache');

  offline.destroy();
  client.destroy();
  await host.close();
  await relay.stop();
});

test('a user can add a LAN host, edit it, and keep it across restarts', async () => {
  const backend = memoryBackend();
  const client = createClient({ backend, ...clientOptions() });
  client.init();
  const host = client.addHost({ label: '家里电脑', lanAddress: '192.168.31.20' });
  assert.equal(client.getHosts().hosts[0].endpoints.lan.url, 'ws://192.168.31.20:8787');
  client.setMode('lan');
  client.updateHost(host.id, { lanAddress: '192.168.31.21:9000' });
  assert.equal(client.getHosts().hosts[0].endpoints.lan.url, 'ws://192.168.31.21:9000');

  const reloaded = createClient({ backend, ...clientOptions() });
  reloaded.init();
  assert.equal(reloaded.getHosts().hosts.length, 1);
  assert.equal(reloaded.getHosts().mode, 'lan');
  assert.equal(reloaded.getHosts().hosts[0].label, '家里电脑');
  reloaded.destroy();
  client.destroy();
});

test('relay and LAN endpoints keep separate PSKs', () => {
  const hosts = require('../src/hosts.js');
  const host = hosts.createHost('h1', 'PC');
  hosts.setEndpoint(host, 'relay', 'wss://relay.example');
  hosts.setEndpoint(host, 'lan', 'ws://192.168.1.2:8787');
  hosts.setPairing(host, 'relay', { channelId: 'c_relay', psk: 'AAAA', hostId: 'h', clientId: 'c' });
  hosts.setPairing(host, 'lan', { channelId: 'c_lan', psk: 'BBBB', hostId: 'h', clientId: 'c' });
  assert.equal(hosts.pairingOf(host, 'relay').psk, 'AAAA');
  assert.equal(hosts.pairingOf(host, 'lan').psk, 'BBBB');
  hosts.clearPairing(host, 'relay');
  assert.equal(hosts.hasPairing(host, 'relay'), false);
  assert.equal(hosts.hasPairing(host, 'lan'), true);
  assert.equal(hosts.activeEndpoint(host), null);
});

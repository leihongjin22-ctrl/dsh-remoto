import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createClient } = require('../src/client.js');
const { memoryBackend } = require('../src/store.js');

test('connection config can be exported and imported with both endpoints', () => {
  const source = createClient({ backend: memoryBackend(), config: { autoReconnect: false } });
  source.init();
  const host = source.addHost({ label: 'PC', relayUrl: 'wss://relay.example', lanAddress: '192.168.1.8' });
  const relayPairing = { channelId: 'c_relay', hostId: 'h1', psk: 'AAAA', clientId: 'c1', pairedAt: 1, sendSeq: 0 };
  const lanPairing = { channelId: 'c_lan', hostId: 'h1', psk: 'BBBB', clientId: 'c1', pairedAt: 2, sendSeq: 0 };
  host.endpoints.relay.pairing = relayPairing;
  host.endpoints.lan.pairing = lanPairing;
  source.setMode('lan');
  const json = source.exportConfig();
  const parsed = JSON.parse(json);
  assert.equal(parsed.hosts.length, 1);
  assert.equal(parsed.active.mode, 'lan');
  assert.equal(parsed.hosts[0].endpoints.relay.pairing.psk, 'AAAA');

  const target = createClient({ backend: memoryBackend(), config: { autoReconnect: false } });
  target.init();
  const count = target.importConfig(json);
  assert.equal(count, 1);
  assert.equal(target.getHosts().mode, 'lan');
  assert.equal(target.getHosts().hosts[0].endpoints.lan.paired, true);
  assert.equal(target.getHosts().hosts[0].endpoints.relay.paired, true);
  assert.throws(() => target.importConfig('not json'), /JSON/);
  assert.throws(() => target.importConfig('{"hosts":[]}'), /没有可导入/);
  source.destroy();
  target.destroy();
});

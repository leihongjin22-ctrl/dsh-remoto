import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createConnection, setState, shouldForceReconnect } = require('../src/connection-state.js');

test('ready only after connecting', () => {
  const c = createConnection('lan', 'ws://192.168.1.2:8787');
  setState(c, 'connecting');
  setState(c, 'ready');
  assert.equal(c.state, 'ready');
});

test('illegal transition is rejected', () => {
  const c = createConnection('relay', 'wss://r');
  assert.throws(() => setState(c, 'ready'), /illegal/);
});

test('offline bumps generation and force reconnect', () => {
  const c = createConnection('relay', 'wss://r');
  setState(c, 'connecting');
  setState(c, 'ready');
  const g = c.generation;
  setState(c, 'offline');
  assert.ok(c.generation > g);
  assert.equal(shouldForceReconnect(c, 0), true);
});

test('long background forces reconnect even if still ready', () => {
  const c = createConnection('lan', 'ws://l');
  setState(c, 'connecting');
  setState(c, 'ready');
  assert.equal(shouldForceReconnect(c, 6000), true);
  assert.equal(shouldForceReconnect(c, 1000), false);
});

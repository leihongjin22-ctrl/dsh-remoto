import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createHost, setEndpoint, activate, nextMode } = require('../src/hosts.js');

test('both endpoints survive mode switching', () => {
  const h = createHost('drc-x', 'PC');
  setEndpoint(h, 'relay', 'wss://relay.example');
  setEndpoint(h, 'lan', 'ws://192.168.1.2:8787');
  activate(h, 'relay');
  activate(h, 'lan');
  activate(h, 'relay');
  assert.equal(h.endpoints.relay.url, 'wss://relay.example');
  assert.equal(h.endpoints.lan.url, 'ws://192.168.1.2:8787');
  assert.equal(h.activeMode, 'relay');
});

test('psk key is scoped per mode', () => {
  const h = createHost('drc-x');
  setEndpoint(h, 'relay', 'wss://r');
  setEndpoint(h, 'lan', 'ws://l');
  assert.equal(h.endpoints.relay.pskKey, 'psk:relay');
  assert.equal(h.endpoints.lan.pskKey, 'psk:lan');
});

test('switching to an unconfigured endpoint fails', () => {
  const h = createHost('drc-x');
  assert.throws(() => activate(h, 'lan'), /not configured/);
});

test('next mode toggles', () => {
  const h = createHost('drc-x');
  setEndpoint(h, 'relay', 'wss://r');
  setEndpoint(h, 'lan', 'ws://l');
  activate(h, 'relay');
  assert.equal(nextMode(h), 'lan');
  activate(h, 'lan');
  assert.equal(nextMode(h), 'relay');
});

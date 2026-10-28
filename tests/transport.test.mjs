import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createTransport } = require('../src/transport.js');

function fakeSocket() {
  return { readyState: 0, sent: [], send(v) { this.sent.push(v); }, close() { this.readyState = 3; } };
}

test('opens, sends and closes through one boundary', () => {
  const s = fakeSocket();
  let opened = 0;
  const t = createTransport('ws://192.168.1.2:8787', () => s, { onOpen: () => opened++ });
  t.connect();
  s.readyState = 1;
  s.onopen();
  assert.equal(t.send('x'), true);
  assert.deepEqual(s.sent, ['x']);
  t.close();
  assert.equal(s.readyState, 3);
  assert.equal(opened, 1);
});

test('send before open fails without throwing', () => {
  const s = fakeSocket();
  const t = createTransport('wss://relay', () => s, {});
  t.connect();
  assert.equal(t.send('x'), false);
});

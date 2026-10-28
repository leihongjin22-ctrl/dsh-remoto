import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createMessage, markFailed, markAccepted, canRetry } = require('../src/message-state.js');
const { createHistoryCache } = require('../src/history-cache.js');

test('accepted wins over a later timeout', () => {
  const m = createMessage('hello', 'c1');
  m.state = 'sending';
  markAccepted(m);
  markFailed(m, 'timeout');
  assert.equal(m.state, 'accepted');
  assert.equal(canRetry(m), false);
});

test('late ack clears failure and blocks duplicate retry', () => {
  const m = createMessage('hello', 'c2');
  m.state = 'sending';
  markFailed(m, 'timeout');
  assert.equal(canRetry(m), true);
  markAccepted(m);
  assert.equal(m.state, 'accepted');
  assert.equal(canRetry(m), false);
});

test('history cache is isolated by host and session', () => {
  const map = new Map();
  const storage = {
    getItem: (k) => map.get(k) || null,
    setItem: (k, v) => map.set(k, v)
  };
  const cache = createHistoryCache(storage, 3);
  cache.write('hostA', 's1', [{ id: '1' }, { id: '2' }]);
  cache.write('hostB', 's1', [{ id: 'b1' }]);
  assert.deepEqual(cache.read('hostA', 's1').map((m) => m.id), ['1', '2']);
  assert.deepEqual(cache.read('hostB', 's1').map((m) => m.id), ['b1']);
});

test('merge deduplicates while preserving order', () => {
  const cache = createHistoryCache(new Map(), 10);
  const merged = cache.merge([{ id: '1' }, { id: '2' }], [{ id: '2' }, { id: '3' }]);
  assert.deepEqual(merged.map((m) => m.id), ['1', '2', '3']);
});

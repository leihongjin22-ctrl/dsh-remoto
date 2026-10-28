import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createRequestGuard } = require('../src/request-guard.js');

test('latest request wins', () => {
  const g = createRequestGuard();
  const a = g.begin('history');
  const b = g.begin('history');
  assert.equal(g.accept(a), false);
  assert.equal(g.accept(b), true);
});

test('invalidate rejects everything pending', () => {
  const g = createRequestGuard();
  const a = g.begin('history');
  g.invalidate();
  assert.equal(g.accept(a), false);
});

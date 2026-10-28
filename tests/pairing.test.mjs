import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createPairing, issue, verify } = require('../src/pairing.js');

test('code verifies once', () => {
  let t = 1000;
  const p = createPairing(() => t, 1000);
  issue(p, '123456');
  assert.equal(verify(p, '123456').ok, true);
  assert.equal(verify(p, '123456').ok, false);
});

test('expired code fails', () => {
  let t = 1000;
  const p = createPairing(() => t, 1000);
  issue(p, '123456');
  t = 2500;
  assert.equal(verify(p, '123456').reason, 'expired');
});

test('wrong code fails', () => {
  const p = createPairing(() => 1, 1000);
  issue(p, '123456');
  assert.equal(verify(p, '000000').reason, 'mismatch');
});

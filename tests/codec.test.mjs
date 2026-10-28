import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { derivePskKey, noncePrefix as vendorNoncePrefix, buildCounterNonce, PSK_BYTES } from '../vendor/protocol/dist/src/crypto/keys.js';

const require = createRequire(import.meta.url);
const codec = require('../src/codec.js');

const PSK = 'AAECAwQFBgcICQoLDA0ODw==';

test('KDF matches the frozen protocol implementation', () => {
  for (const direction of ['c2h', 'h2c']) {
    const mine = codec.deriveKey(PSK, direction, 'c_0123456789ab');
    const theirs = derivePskKey(PSK, direction, 'c_0123456789ab');
    assert.deepEqual(Array.from(mine), Array.from(theirs));
  }
});

test('nonce prefix and counter nonce match the protocol implementation', () => {
  const minePrefix = codec.noncePrefix(PSK, 'c_0123456789ab', 'install-1');
  const theirPrefix = vendorNoncePrefix(PSK, 'c_0123456789ab', 'install-1');
  assert.deepEqual(Array.from(minePrefix), Array.from(theirPrefix));
  for (const counter of [0, 1, 4294967295, 4294967296, 9007199254740991]) {
    assert.deepEqual(
      Array.from(codec.counterNonce(minePrefix, counter)),
      Array.from(buildCounterNonce(minePrefix, counter))
    );
  }
});

test('psk must decode to exactly 16 bytes', () => {
  assert.throws(() => codec.deriveKey('AAAA', 'c2h', 'c_x'), /16 bytes/);
  assert.equal(codec.pskBytes(PSK).length, PSK_BYTES);
});

test('sealed records round-trip and reject tampering', () => {
  const key = codec.deriveKey(PSK, 'c2h', 'c_0123456789ab');
  const nonce = codec.counterNonce(codec.noncePrefix(PSK, 'c_0123456789ab', 'install-1'), 7);
  const record = codec.seal(key, { t: 'cmd.interrupt', text: '你好' }, nonce);
  assert.equal(typeof record.ciphertext, 'string');
  assert.deepEqual(codec.open(key, record), { t: 'cmd.interrupt', text: '你好' });
  const tampered = { ciphertext: record.ciphertext.slice(0, -4) + 'AAAA' };
  assert.equal(codec.open(key, tampered), null);
  assert.equal(codec.open(codec.deriveKey(PSK, 'h2c', 'c_0123456789ab'), record), null);
  assert.equal(codec.open(key, { ciphertext: 'not-base64' }), null);
});

test('pairing wrap round-trips and SAS is stable', () => {
  const client = codec.newKeyPair();
  const host = codec.newKeyPair();
  const clientShared = codec.sharedKey(client.secretKey, host.publicKey);
  const hostShared = codec.sharedKey(host.secretKey, client.publicKey);
  assert.deepEqual(Array.from(clientShared), Array.from(hostShared));
  assert.equal(codec.sasCode(clientShared), codec.sasCode(hostShared));
  assert.match(codec.sasCode(clientShared), /^\d{6}$/);

  const pskBytes = codec.randomBytes(16);
  const key = codec.wrapKey(hostShared);
  const nacl = require('../vendor/tweetnacl.js');
  const nonce = codec.randomBytes(24);
  const box = nacl.secretbox(pskBytes, nonce, key);
  const unwrapped = codec.unwrapPsk(clientShared, codec.toBase64(nonce), codec.toBase64(box));
  assert.equal(unwrapped, codec.toBase64(pskBytes));
  assert.equal(codec.unwrapPsk(clientShared, codec.toBase64(nonce), codec.toBase64(box.slice(1))), null);
});

test('utf8 and base64 handle non-ascii and padding', () => {
  for (const text of ['', 'a', 'ab', 'abc', '你好，世界', '🙂 emoji']) {
    assert.equal(codec.fromUtf8(codec.utf8(text)), text);
    assert.equal(codec.toBase64(codec.utf8(text)), Buffer.from(text, 'utf8').toString('base64'));
    assert.equal(codec.fromUtf8(codec.fromBase64(codec.toBase64(codec.utf8(text)))), text);
  }
});

test('random source refuses to invent randomness', () => {
  assert.ok(codec.randomBytes(16) instanceof Uint8Array);
  assert.equal(codec.randomBytes(16).length, 16);
  const a = codec.randomBytes(32);
  const b = codec.randomBytes(32);
  assert.notDeepEqual(Array.from(a), Array.from(b));
});

'use strict';

// Frozen wire crypto for DSH Remote protocol 0.5.4.
//
//   KDF:    SHA-512(part0 | 0x1f | part1 | 0x1f | ... | partN | 0x1f)[0..32]
//   nonce:  SHA-512("dsh-rc/v1/nonce" | installId | convId | psk)[0..16] || counter(8B BE)
//   record: base64( nonce(24B) || secretbox(utf8(JSON), nonce, key) )
//   wrap:   key = SHA-512(shared | "dsh-rc/psk-wrap")[0..32]; secretbox(psk, nonce, key)
//   sas:    uint32BE(SHA-512(shared | "dsh-rc/sas")[0..4]) % 1e6, zero padded
//
// The implementation stays dependency free apart from the vendored tweetnacl. All
// randomness comes from the platform CSPRNG; there is deliberately no fallback.

const nacl = require('../vendor/tweetnacl.js');

const KDF_NAMESPACE = 'dsh-rc/v1';
const NONCE_NAMESPACE = 'dsh-rc/v1/nonce';
const WRAP_LABEL = 'dsh-rc/psk-wrap';
const SAS_LABEL = 'dsh-rc/sas';
const UNIT_SEPARATOR = 0x1f;

const KEY_BYTES = 32;
const NONCE_BYTES = 24;
const PSK_BYTES = 16;
const NONCE_PREFIX_BYTES = NONCE_BYTES - 8;

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const B64_INDEX = (() => {
  const table = Object.create(null);
  for (let i = 0; i < B64.length; i += 1) table[B64.charAt(i)] = i;
  return table;
})();

function utf8(text) {
  if (typeof text !== 'string') text = String(text);
  const out = [];
  for (let i = 0; i < text.length; i += 1) {
    let code = text.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
      const next = text.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00);
        i += 1;
      }
    }
    if (code < 0x80) out.push(code);
    else if (code < 0x800) out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    else if (code < 0x10000) out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    else {
      out.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    }
  }
  return new Uint8Array(out);
}

function fromUtf8(bytes) {
  let out = '';
  let i = 0;
  while (i < bytes.length) {
    const b = bytes[i++];
    let code;
    if (b < 0x80) code = b;
    else if (b >= 0xc2 && b <= 0xdf) code = ((b & 0x1f) << 6) | (bytes[i++] & 0x3f);
    else if (b >= 0xe0 && b <= 0xef) {
      code = ((b & 0x0f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f);
    } else if (b >= 0xf0 && b <= 0xf4) {
      code =
        ((b & 0x07) << 18) |
        ((bytes[i++] & 0x3f) << 12) |
        ((bytes[i++] & 0x3f) << 6) |
        (bytes[i++] & 0x3f);
    } else code = 0xfffd;
    if (code > 0xffff) {
      code -= 0x10000;
      out += String.fromCharCode(0xd800 + (code >> 10), 0xdc00 + (code & 0x3ff));
    } else out += String.fromCharCode(code);
  }
  return out;
}

function toBase64(bytes) {
  let out = '';
  let i = 0;
  while (i < bytes.length) {
    const a = bytes[i++];
    const hasB = i < bytes.length;
    const b = hasB ? bytes[i++] : 0;
    const hasC = i < bytes.length;
    const c = hasC ? bytes[i++] : 0;
    const n = (a << 16) | (b << 8) | c;
    out += B64.charAt((n >> 18) & 63);
    out += B64.charAt((n >> 12) & 63);
    out += hasB ? B64.charAt((n >> 6) & 63) : '=';
    out += hasC ? B64.charAt(n & 63) : '=';
  }
  return out;
}

function fromBase64(text) {
  if (typeof text !== 'string') return new Uint8Array(0);
  const clean = text.replace(/[^A-Za-z0-9+/=]/g, '');
  const out = [];
  let i = 0;
  while (i < clean.length) {
    const c1 = clean.charAt(i++);
    const c2 = clean.charAt(i++);
    const c3 = clean.charAt(i++);
    const c4 = clean.charAt(i++);
    const n1 = B64_INDEX[c1];
    const n2 = B64_INDEX[c2];
    if (n1 === undefined || n2 === undefined) break;
    const n3 = c3 === '=' || c3 === '' ? 0 : B64_INDEX[c3];
    const n4 = c4 === '=' || c4 === '' ? 0 : B64_INDEX[c4];
    if (n3 === undefined || n4 === undefined) break;
    const n = (n1 << 18) | (n2 << 12) | (n3 << 6) | n4;
    out.push((n >> 16) & 0xff);
    if (c3 !== '=' && c3 !== '') out.push((n >> 8) & 0xff);
    if (c4 !== '=' && c4 !== '') out.push(n & 0xff);
  }
  return new Uint8Array(out);
}

function concat(parts) {
  let total = 0;
  for (const part of parts) total += part.length;
  const out = new Uint8Array(total);
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}

function kdfHash(parts) {
  const encoded = parts.map((p) => (typeof p === 'string' ? utf8(p) : p));
  let total = 0;
  for (const bytes of encoded) total += bytes.length + 1;
  const joined = new Uint8Array(total);
  let at = 0;
  for (const bytes of encoded) {
    joined.set(bytes, at);
    at += bytes.length;
    joined[at++] = UNIT_SEPARATOR;
  }
  return nacl.hash(joined).slice(0, KEY_BYTES);
}

function pskBytes(pskBase64) {
  const bytes = fromBase64(pskBase64);
  if (bytes.length !== PSK_BYTES) {
    throw new Error(`PSK must decode to ${PSK_BYTES} bytes, got ${bytes.length}`);
  }
  return bytes;
}

function deriveKey(pskBase64, direction, conversationId) {
  if (direction !== 'c2h' && direction !== 'h2c') throw new Error('bad direction');
  if (!conversationId) throw new Error('conversationId required');
  return kdfHash([KDF_NAMESPACE, direction, conversationId, pskBytes(pskBase64)]);
}

function noncePrefix(pskBase64, conversationId, installId) {
  if (!installId) throw new Error('installId required');
  return kdfHash([NONCE_NAMESPACE, installId, conversationId, pskBytes(pskBase64)]).slice(
    0,
    NONCE_PREFIX_BYTES
  );
}

function counterNonce(prefix, counter) {
  if (!prefix || prefix.length !== NONCE_PREFIX_BYTES) throw new Error('bad nonce prefix');
  if (!Number.isInteger(counter) || counter < 0 || counter > Number.MAX_SAFE_INTEGER) {
    throw new Error('bad nonce counter');
  }
  const high = Math.floor(counter / 0x100000000);
  const low = counter >>> 0;
  const out = new Uint8Array(NONCE_BYTES);
  out.set(prefix, 0);
  out[16] = (high >>> 24) & 0xff;
  out[17] = (high >>> 16) & 0xff;
  out[18] = (high >>> 8) & 0xff;
  out[19] = high & 0xff;
  out[20] = (low >>> 24) & 0xff;
  out[21] = (low >>> 16) & 0xff;
  out[22] = (low >>> 8) & 0xff;
  out[23] = low & 0xff;
  return out;
}

function seal(key, payload, nonce) {
  if (!key || key.length !== KEY_BYTES) throw new Error('key must be 32 bytes');
  if (!nonce || nonce.length !== NONCE_BYTES) throw new Error('nonce must be 24 bytes');
  const text = JSON.stringify(payload);
  if (text === undefined) throw new Error('payload is not JSON serializable');
  const box = nacl.secretbox(utf8(text), nonce, key);
  return { ciphertext: toBase64(concat([nonce, box])) };
}

function open(key, record) {
  try {
    if (!record || typeof record.ciphertext !== 'string') return null;
    const merged = fromBase64(record.ciphertext);
    if (merged.length < NONCE_BYTES + 16) return null;
    const box = nacl.secretbox.open(merged.subarray(NONCE_BYTES), merged.subarray(0, NONCE_BYTES), key);
    if (!box) return null;
    return JSON.parse(fromUtf8(box));
  } catch {
    return null;
  }
}

function wrapKey(shared) {
  return nacl.hash(concat([shared, utf8(WRAP_LABEL)])).slice(0, KEY_BYTES);
}

function unwrapPsk(shared, nonceBase64, wrappedBase64) {
  try {
    const key = wrapKey(shared);
    const nonce = fromBase64(nonceBase64);
    const wrapped = fromBase64(wrappedBase64);
    if (nonce.length !== NONCE_BYTES || wrapped.length === 0) return null;
    const psk = nacl.secretbox.open(wrapped, nonce, key);
    if (!psk || psk.length !== PSK_BYTES) return null;
    return toBase64(psk);
  } catch {
    return null;
  }
}

function sasCode(shared) {
  const bytes = nacl.hash(concat([shared, utf8(SAS_LABEL)])).slice(0, 4);
  const view = new DataView(bytes.buffer, bytes.byteOffset, 4);
  return String(view.getUint32(0) % 1000000).padStart(6, '0');
}

function randomBytes(length) {
  const size = Number(length) | 0;
  if (size <= 0) throw new Error('length must be positive');
  const out = new Uint8Array(size);
  const webcrypto = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
  if (!webcrypto || typeof webcrypto.getRandomValues !== 'function') {
    throw new Error('secure random source unavailable');
  }
  for (let i = 0; i < size; i += 65536) {
    webcrypto.getRandomValues(out.subarray(i, Math.min(size, i + 65536)));
  }
  return out;
}

function keyPairFromSecret(secret) {
  if (!secret || secret.length !== 32) throw new Error('secret must be 32 bytes');
  const pair = nacl.box.keyPair.fromSecretKey(secret);
  return { publicKey: pair.publicKey, secretKey: pair.secretKey };
}

function newKeyPair() {
  return nacl.box.keyPair.fromSecretKey(randomBytes(32));
}

function sharedKey(secretKey, peerPublicKey) {
  if (!secretKey || secretKey.length !== nacl.box.secretKeyLength) throw new Error('bad secret key');
  if (!peerPublicKey || peerPublicKey.length !== nacl.box.publicKeyLength) throw new Error('bad public key');
  return nacl.box.before(peerPublicKey, secretKey);
}

function randomId(prefix, byteLength) {
  const bytes = randomBytes(byteLength || 8);
  let out = prefix || '';
  for (let i = 0; i < bytes.length; i += 1) out += bytes[i].toString(16).padStart(2, '0');
  return out;
}

// Wire-size helper: the relay budget counts the base64 ciphertext, not the plaintext.
function estimateWireBytes(payload) {
  const text = JSON.stringify(payload);
  const raw = utf8(text).length;
  const envelope = 160; // t/sessionId/ciphertext JSON scaffolding
  return Math.ceil(((raw + 16) * 4) / 3) + envelope;
}

module.exports = {
  KDF_NAMESPACE,
  NONCE_NAMESPACE,
  KEY_BYTES,
  NONCE_BYTES,
  PSK_BYTES,
  NONCE_PREFIX_BYTES,
  utf8,
  fromUtf8,
  toBase64,
  fromBase64,
  concat,
  kdfHash,
  pskBytes,
  deriveKey,
  noncePrefix,
  counterNonce,
  seal,
  open,
  wrapKey,
  unwrapPsk,
  sasCode,
  randomBytes,
  keyPairFromSecret,
  newKeyPair,
  sharedKey,
  randomId,
  estimateWireBytes
};

'use strict';

// Pairing is transport independent: the same 6-digit flow is used for relay
// and LAN. Codes are short-lived and one-use.
function createPairing(now, ttlMs) {
  return { code: '', createdAt: 0, ttlMs: ttlMs || 90000, used: false, now: now || Date.now };
}

function issue(pairing, code) {
  if (!/^\d{6}$/.test(String(code))) throw new Error('bad code');
  pairing.code = String(code);
  pairing.createdAt = pairing.now();
  pairing.used = false;
  return pairing;
}

function verify(pairing, code) {
  if (!pairing.code || pairing.used) return { ok: false, reason: 'no_code' };
  if (String(code) !== pairing.code) return { ok: false, reason: 'mismatch' };
  if (pairing.now() - pairing.createdAt > pairing.ttlMs) return { ok: false, reason: 'expired' };
  pairing.used = true;
  return { ok: true };
}

module.exports = { createPairing, issue, verify };

'use strict';

// Control-plane frames (relay-readable). Names and shapes are frozen by
// protocol 0.5.4: adding names is safe, reusing a name with new semantics is not.

const PROTOCOL_VERSION = 1;
const PAIRING_TOKEN_RE = /^\d{6}$/;

const ENDPOINT_FRAMES = ['hello', 'pair-begin', 'pair-begin-client', 'pair-grant', 'resync', 'enc', 'enc-batch', 'session-leave', 'summary', 'ping'];
const RELAY_FRAMES = ['hello-ok', 'pair-ready', 'pair-request', 'pair-grant', 'paired', 'pair-fail', 'peer-joined', 'peer-left', 'error', 'pong', 'enc', 'enc-batch', 'resume-gap'];

const PAIR_FAIL_REASONS = ['invalid_or_expired', 'already_used', 'host_offline', 'bad_token'];

function helloClient(options) {
  const opts = options || {};
  const frame = {
    t: 'hello',
    role: 'client',
    protocol: PROTOCOL_VERSION,
    clientId: opts.clientId
  };
  frame.clientMeta = {
    platform: opts.platform || 'android',
    label: opts.label || 'DSH Remoto'
  };
  if (opts.softwareVersion) frame.softwareVersion = opts.softwareVersion;
  return frame;
}

function helloHost(options) {
  const opts = options || {};
  const frame = {
    t: 'hello',
    role: 'host',
    protocol: PROTOCOL_VERSION,
    token: opts.token
  };
  if (opts.hostId) frame.hostId = opts.hostId;
  if (opts.label) frame.label = opts.label;
  if (opts.softwareVersion) frame.softwareVersion = opts.softwareVersion;
  return frame;
}

function pairClaim(token, clientPub) {
  const frame = { t: 'pair-begin-client', pairingToken: String(token) };
  if (clientPub) frame.clientPub = clientPub;
  return frame;
}

function pairBegin(token) {
  return { t: 'pair-begin', pairingToken: String(token) };
}

function pairGrant(sessionId, hostPub, nonce, wrappedPsk) {
  return { t: 'pair-grant', sessionId, hostPub, nonce, wrappedPsk };
}

function encFrame(sessionId, ciphertext) {
  return { t: 'enc', sessionId, ciphertext };
}

function encBatchFrame(sessionId, items) {
  return { t: 'enc-batch', sessionId, items };
}

function sessionLeave(sessionId) {
  return { t: 'session-leave', sessionId };
}

function resync(sessionIds) {
  return { t: 'resync', sessionIds };
}

function ping(ts) {
  const frame = { t: 'ping' };
  if (typeof ts === 'number') frame.ts = ts;
  return frame;
}

function pong(ts) {
  const frame = { t: 'pong' };
  if (typeof ts === 'number') frame.ts = ts;
  return frame;
}

function parseFrame(text) {
  if (typeof text !== 'string' || text.length === 0) return null;
  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    if (typeof value.t !== 'string') return null;
    return value;
  } catch {
    return null;
  }
}

function isKnownRelayFrame(name) {
  return RELAY_FRAMES.indexOf(name) !== -1;
}

function isKnownEndpointFrame(name) {
  return ENDPOINT_FRAMES.indexOf(name) !== -1;
}

// Lenient classification for the client side. Unknown names are reported, never
// thrown: a newer relay may add frames that this client must simply skip.
function classifyRelayFrame(value) {
  if (!value || typeof value !== 'object') return { ok: false, reason: 'not_object' };
  if (typeof value.t !== 'string') return { ok: false, reason: 'no_frame_type' };
  if (!isKnownRelayFrame(value.t)) return { ok: false, reason: 'unknown_frame', frameType: value.t };
  if (value.t === 'pair-fail' && PAIR_FAIL_REASONS.indexOf(value.reason) === -1) {
    return { ok: false, reason: 'bad_frame', frameType: value.t };
  }
  return { ok: true, frame: value };
}

module.exports = {
  PROTOCOL_VERSION,
  PAIRING_TOKEN_RE,
  PAIR_FAIL_REASONS,
  ENDPOINT_FRAMES,
  RELAY_FRAMES,
  helloClient,
  helloHost,
  pairClaim,
  pairBegin,
  pairGrant,
  encFrame,
  encBatchFrame,
  sessionLeave,
  resync,
  ping,
  pong,
  parseFrame,
  isKnownRelayFrame,
  isKnownEndpointFrame,
  classifyRelayFrame
};

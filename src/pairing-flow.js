'use strict';

// Client-side pairing state machine. Two wire orders are legal and both occur in
// production: the relay may send `paired` before the host's `pair-grant` (the
// channel is created when the claim is forwarded) or after it. Neither order may
// lose the pairing, and a channel id mismatch invalidates the whole attempt.

const codec = require('./codec.js');

const DEFAULT_TTL_MS = 120000;

function createPairingFlow(options) {
  const opts = options || {};
  const now = opts.now || (() => Date.now());
  const makeKeyPair = opts.makeKeyPair || codec.newKeyPair;
  return {
    state: 'idle',
    token: '',
    ttlMs: opts.ttlMs || DEFAULT_TTL_MS,
    expiresAt: 0,
    keyPair: null,
    channel: null,
    grant: null,
    sas: '',
    reason: '',
    now,
    makeKeyPair
  };
}

function start(flow, token, at) {
  if (!/^\d{6}$/.test(String(token || ''))) {
    flow.state = 'failed';
    flow.reason = 'bad_token';
    return { ok: false, reason: 'bad_token' };
  }
  flow.token = String(token);
  flow.state = 'claiming';
  flow.reason = '';
  flow.expiresAt = (typeof at === 'number' ? at : flow.now()) + flow.ttlMs;
  flow.keyPair = flow.makeKeyPair();
  flow.channel = null;
  flow.grant = null;
  flow.sas = '';
  return {
    ok: true,
    frame: {
      t: 'pair-begin-client',
      pairingToken: flow.token,
      clientPub: codec.toBase64(flow.keyPair.publicKey)
    }
  };
}

function onPairReady(flow, frame) {
  if (flow.state === 'idle' || flow.state === 'failed') return flow;
  const ttl = Number(frame && frame.ttlMs);
  if (Number.isFinite(ttl) && ttl > 0) {
    flow.ttlMs = ttl;
    flow.expiresAt = flow.now() + ttl;
  }
  return flow;
}

function onPaired(flow, frame) {
  if (flow.state === 'idle' || flow.state === 'failed') return flow;
  if (!frame || !frame.sessionId) return flow;
  if (flow.candidateChannel && flow.candidateChannel !== frame.sessionId) {
    return fail(flow, 'invalid_or_expired');
  }
  flow.channel = { channelId: frame.sessionId, hostId: frame.hostId || '' };
  return maybeComplete(flow);
}

function onGrant(flow, frame) {
  if (flow.state === 'idle' || flow.state === 'failed' || !flow.keyPair) return flow;
  try {
    if (!frame || !frame.sessionId) return fail(flow, 'invalid_or_expired');
    if (flow.channel && flow.channel.channelId !== frame.sessionId) {
      return fail(flow, 'invalid_or_expired');
    }
    const shared = codec.sharedKey(flow.keyPair.secretKey, codec.fromBase64(frame.hostPub));
    const psk = codec.unwrapPsk(shared, frame.nonce, frame.wrappedPsk);
    if (!psk) return fail(flow, 'invalid_or_expired');
    flow.grant = {
      channelId: frame.sessionId,
      psk,
      sas: codec.sasCode(shared)
    };
    flow.sas = flow.grant.sas;
    flow.candidateChannel = frame.sessionId;
    return maybeComplete(flow);
  } catch {
    return fail(flow, 'invalid_or_expired');
  }
}

function maybeComplete(flow) {
  if (!flow.channel || !flow.grant) return flow;
  if (flow.channel.channelId !== flow.grant.channelId) return fail(flow, 'invalid_or_expired');
  flow.state = 'paired';
  return flow;
}

function fail(flow, reason) {
  flow.state = 'failed';
  flow.reason = reason || 'invalid_or_expired';
  return flow;
}

function isExpired(flow, at) {
  if (!flow.expiresAt) return false;
  return (typeof at === 'number' ? at : flow.now()) > flow.expiresAt;
}

function tick(flow, at) {
  if (flow.state === 'claiming' && isExpired(flow, at)) fail(flow, 'timeout');
  return flow;
}

function result(flow) {
  if (flow.state !== 'paired') return null;
  return {
    channelId: flow.channel.channelId,
    hostId: flow.channel.hostId,
    psk: flow.grant.psk,
    sas: flow.grant.sas
  };
}

function reset(flow) {
  flow.state = 'idle';
  flow.token = '';
  flow.keyPair = null;
  flow.channel = null;
  flow.grant = null;
  flow.sas = '';
  flow.reason = '';
  flow.expiresAt = 0;
  flow.candidateChannel = '';
  return flow;
}

module.exports = {
  DEFAULT_TTL_MS,
  createPairingFlow,
  start,
  onPairReady,
  onPaired,
  onGrant,
  fail,
  isExpired,
  tick,
  result,
  reset
};

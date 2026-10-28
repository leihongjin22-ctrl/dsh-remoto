'use strict';

// Host model: one identity, two endpoints (relay + LAN), one PSK per endpoint.
// Switching mode must never overwrite the other endpoint or its pairing.

const MODES = ['relay', 'lan'];
const DEFAULT_LAN_PORT = 8787;

function createHost(id, label) {
  return {
    id: String(id || ''),
    label: label || 'host',
    endpoints: { relay: null, lan: null },
    activeMode: '',
    createdAt: 0
  };
}

function isWsUrl(url) {
  return /^wss?:\/\/[^\s]+$/i.test(String(url || ''));
}

function normalizeRelayUrl(input) {
  let text = String(input || '').trim();
  if (!text) throw new Error('empty url');
  if (/^https?:\/\//i.test(text)) text = text.replace(/^http/i, 'ws');
  if (!/^[a-z]+:\/\//i.test(text)) text = `wss://${text}`;
  if (!isWsUrl(text)) throw new Error(`bad url: ${text}`);
  return text.replace(/\/+$/, '');
}

function normalizeLanUrl(input, port) {
  let text = String(input || '').trim();
  if (!text) throw new Error('empty address');
  if (/^https?:\/\//i.test(text)) text = text.replace(/^http/i, 'ws');
  if (!/^[a-z]+:\/\//i.test(text)) {
    const defaultPort = port || DEFAULT_LAN_PORT;
    if (/^[^:/]+$/.test(text)) text = `ws://${text}:${defaultPort}`;
    else text = `ws://${text}`;
  }
  if (!isWsUrl(text)) throw new Error(`bad address: ${text}`);
  return text;
}

function setEndpoint(host, mode, url) {
  if (mode !== 'relay' && mode !== 'lan') throw new Error('bad mode');
  const resolved = mode === 'lan' ? normalizeLanUrl(url) : normalizeRelayUrl(url);
  const previous = host.endpoints[mode];
  host.endpoints[mode] = {
    url: resolved,
    pskKey: `psk:${mode}`,
    pairing: previous ? previous.pairing || null : null
  };
  return host;
}

function setPairing(host, mode, pairing) {
  const endpoint = host.endpoints[mode];
  if (!endpoint) throw new Error('endpoint not configured');
  endpoint.pairing = pairing
    ? {
        channelId: pairing.channelId,
        hostId: pairing.hostId || '',
        psk: pairing.psk,
        clientId: pairing.clientId || '',
        pairedAt: pairing.pairedAt || 0,
        sendSeq: pairing.sendSeq || 0
      }
    : null;
  return host;
}

function pairingOf(host, mode) {
  const endpoint = host && host.endpoints ? host.endpoints[mode] : null;
  return (endpoint && endpoint.pairing) || null;
}

function hasPairing(host, mode) {
  const pairing = pairingOf(host, mode);
  return !!(pairing && pairing.channelId && pairing.psk);
}

function clearPairing(host, mode) {
  const endpoint = host.endpoints[mode];
  if (endpoint) endpoint.pairing = null;
  return host;
}

function activate(host, mode, available) {
  if (!host.endpoints[mode]) throw new Error('endpoint not configured');
  host.activeMode = mode;
  const endpoint = host.endpoints[mode];
  return { mode, url: endpoint.url, available: available !== false, pairing: endpoint.pairing || null };
}

function activeEndpoint(host) {
  if (!host || !host.activeMode) return null;
  const endpoint = host.endpoints[host.activeMode];
  if (!endpoint) return null;
  return { mode: host.activeMode, url: endpoint.url, pairing: endpoint.pairing || null };
}

function nextMode(host) {
  return host.activeMode === 'lan' ? 'relay' : 'lan';
}

function describeMode(mode) {
  return mode === 'lan' ? '局域网' : '中继';
}

module.exports = {
  MODES,
  DEFAULT_LAN_PORT,
  createHost,
  isWsUrl,
  normalizeRelayUrl,
  normalizeLanUrl,
  setEndpoint,
  setPairing,
  pairingOf,
  hasPairing,
  clearPairing,
  activate,
  activeEndpoint,
  nextMode,
  describeMode
};

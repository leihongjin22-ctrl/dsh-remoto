'use strict';

// Connection lifecycle for both relay and LAN endpoints. Generation prevents a
// stale history/send response from a previous session or reconnect being used.
function createConnection(mode, url) {
  if (!/^wss?:\/\//.test(String(url))) throw new Error('bad url');
  return { mode, url, state: 'idle', generation: 0, lastPongAt: 0 };
}

const NEXT = {
  idle: ['connecting'],
  connecting: ['ready', 'offline'],
  ready: ['offline', 'closed'],
  offline: ['connecting', 'closed'],
  closed: []
};

function setState(c, next) {
  if (!NEXT[c.state] || !NEXT[c.state].includes(next)) {
    throw new Error(`illegal ${c.state} -> ${next}`);
  }
  c.state = next;
  if (next === 'ready') c.lastPongAt = Date.now();
  if (next === 'offline' || next === 'closed') c.generation += 1;
  return c;
}

function shouldForceReconnect(c, hiddenForMs) {
  return !!c && (c.state !== 'ready' || hiddenForMs > 5000);
}

module.exports = { createConnection, setState, shouldForceReconnect };

'use strict';

// Small persistence layer. Everything goes through a localStorage-shaped backend
// so the same code runs in a WebView (localStorage) and in Node tests (memory).

const PREFIX = 'drc.';
const HISTORY_LIMIT = 80;

function memoryBackend() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear()
  };
}

function createStore(backend, options) {
  const opts = options || {};
  const storage = backend || memoryBackend();
  function read(key, fallback) {
    try {
      const raw = storage.getItem(PREFIX + key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      storage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Quota or private mode: the app still works in memory.
    }
  }
  function remove(key) {
    try {
      storage.removeItem(PREFIX + key);
    } catch {}
  }

  return {
    read,
    write,
    remove,
    loadInstallId() {
      return read('installId', '');
    },
    ensureInstallId(makeId) {
      const existing = read('installId', '');
      if (existing) return existing;
      const created = makeId ? makeId() : `drc-${Math.random().toString(16).slice(2)}`;
      write('installId', created);
      return created;
    },
    loadHosts() {
      const hosts = read('hosts', []);
      return Array.isArray(hosts) ? hosts : [];
    },
    saveHosts(hosts) {
      write('hosts', Array.isArray(hosts) ? hosts : []);
    },
    loadActive() {
      const value = read('active', null);
      if (!value || typeof value !== 'object') return null;
      return { hostId: value.hostId || '', mode: value.mode === 'lan' ? 'lan' : 'relay' };
    },
    saveActive(active) {
      write('active', active || null);
    },
    loadSessions(hostId) {
      const list = read(`sessions.${hostId}`, []);
      return Array.isArray(list) ? list : [];
    },
    saveSessions(hostId, sessions) {
      write(`sessions.${hostId}`, Array.isArray(sessions) ? sessions : []);
    },
    loadHistory(hostId, sessionId) {
      const value = read(`history.${hostId}.${sessionId}`, null);
      if (Array.isArray(value)) return { items: value.slice(-HISTORY_LIMIT), nextBeforeSeq: 0, latestSeq: 0 };
      if (!value || typeof value !== 'object') return { items: [], nextBeforeSeq: 0, latestSeq: 0 };
      return {
        items: Array.isArray(value.items) ? value.items.slice(-HISTORY_LIMIT) : [],
        nextBeforeSeq: Number(value.nextBeforeSeq) || 0,
        latestSeq: Number(value.latestSeq) || 0
      };
    },
    saveHistory(hostId, sessionId, state) {
      const value = state || {};
      write(`history.${hostId}.${sessionId}`, {
        items: Array.isArray(value.items) ? value.items.slice(-HISTORY_LIMIT) : [],
        nextBeforeSeq: Number(value.nextBeforeSeq) || 0,
        latestSeq: Number(value.latestSeq) || 0
      });
    },
    loadCounter(channelId, clientId) {
      const value = read(`counter.${channelId}.${clientId}`, 0);
      return Number.isSafeInteger(value) && value >= 0 ? value : 0;
    },
    saveCounter(channelId, clientId, value) {
      if (Number.isSafeInteger(value) && value >= 0) write(`counter.${channelId}.${clientId}`, value);
    },
    clearHistory(hostId) {
      // localStorage cannot enumerate through the adapter; drop the known keys by
      // walking hosts is done by the caller. Here we only clear the current list.
      remove(`sessions.${hostId}`);
    }
  };
}

module.exports = { PREFIX, HISTORY_LIMIT, memoryBackend, createStore };

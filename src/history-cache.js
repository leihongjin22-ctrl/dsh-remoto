'use strict';

// Cache-first history. A response is accepted only for the current request
// generation, so switching sessions cannot leak old history into the new one.
function createHistoryCache(storage, maxMessages) {
  const limit = maxMessages || 60;
  const key = (hostId, sessionId) => `drc.history.${hostId}.${sessionId}`;

  function read(hostId, sessionId) {
    try {
      const raw = storage.getItem(key(hostId, sessionId));
      if (!raw) return [];
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  function write(hostId, sessionId, messages) {
    try {
      const trimmed = (messages || []).slice(-limit);
      storage.setItem(key(hostId, sessionId), JSON.stringify(trimmed));
    } catch {}
  }

  function merge(existing, incoming) {
    const seen = new Set();
    const out = [];
    for (const item of (existing || []).concat(incoming || [])) {
      if (!item || !item.id || seen.has(item.id)) continue;
      seen.add(item.id);
      out.push(item);
    }
    return out;
  }

  return { read, write, merge };
}

module.exports = { createHistoryCache };

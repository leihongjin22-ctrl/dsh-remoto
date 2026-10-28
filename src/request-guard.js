'use strict';

// Every history/session request gets a generation + id. Stale responses are
// dropped, which is the fix for cross-session history leaks.
function createRequestGuard() {
  let current = 0;
  let id = 0;
  return {
    begin(kind) {
      current += 1;
      id += 1;
      return { generation: current, id: `${kind}:${id}`, kind };
    },
    accept(token) {
      return !!token && token.generation === current;
    },
    invalidate() { current += 1; return current; },
    current() { return current; }
  };
}

module.exports = { createRequestGuard };

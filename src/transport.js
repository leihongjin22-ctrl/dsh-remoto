'use strict';

// Thin transport boundary. Both relay and LAN use the same frame callback;
// the protocol layer must not depend on where the socket points.
function createTransport(url, factory, handlers) {
  if (!/^wss?:\/\//.test(String(url))) throw new Error('bad url');
  let socket = null;
  let closed = false;

  function connect() {
    if (closed) return;
    socket = factory(url);
    socket.onopen = () => handlers.onOpen && handlers.onOpen();
    socket.onmessage = (event) => handlers.onMessage && handlers.onMessage(String(event.data));
    socket.onclose = () => handlers.onClose && handlers.onClose();
    socket.onerror = (event) => handlers.onError && handlers.onError(event);
  }

  function send(text) {
    if (!socket || socket.readyState !== 1) return false;
    socket.send(text);
    return true;
  }

  function close() {
    closed = true;
    if (socket && socket.close) socket.close();
  }

  return { connect, send, close, current: () => socket };
}

module.exports = { createTransport };

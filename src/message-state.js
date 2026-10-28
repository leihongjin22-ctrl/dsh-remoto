'use strict';

// Message send state machine. It deliberately allows "accepted" to win over a
// later local timeout: a host ack or user echo proves the prompt was received.
const ALLOWED = {
  queued: ['sending', 'cancelled'],
  sending: ['accepted', 'failed', 'cancelled'],
  accepted: ['done'],
  failed: ['queued', 'cancelled'],
  done: [],
  cancelled: []
};

function createMessage(text, clientMsgId) {
  return {
    clientMsgId,
    text,
    state: 'queued',
    error: '',
    attempts: 0,
    acceptedAt: 0
  };
}

function transition(message, next, at) {
  if (!message || !ALLOWED[message.state]) throw new Error('bad current state');
  if (!ALLOWED[message.state].includes(next)) {
    throw new Error(`illegal transition ${message.state} -> ${next}`);
  }
  message.state = next;
  if (next === 'sending') message.attempts += 1;
  if (next === 'accepted') {
    message.acceptedAt = at || Date.now();
    message.error = '';
  }
  if (next === 'failed') message.error = message.error || 'send failed';
  return message;
}

function markFailed(message, error, at) {
  if (!message) return message;
  if (message.state === 'accepted' || message.state === 'done') return message;
  if (message.state === 'failed') return message;
  message.error = error || 'send failed';
  return transition(message, 'failed', at);
}

function markAccepted(message, at) {
  if (!message) return message;
  if (message.state === 'accepted' || message.state === 'done') return message;
  if (message.state === 'failed') {
    // A late ack proves the host received it. Re-open the state so the UI can
    // clear the red failure and never offer a duplicate retry.
    message.state = 'sending';
  }
  return transition(message, 'accepted', at);
}

function canRetry(message) {
  return !!message && message.state === 'failed';
}

module.exports = { createMessage, transition, markFailed, markAccepted, canRetry };

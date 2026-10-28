import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const chat = require('../src/chat-model.js');
const sessions = require('../src/session-list.js');

test('run state records a start time and clears it on idle', () => {
  const model = chat.createChatModel();
  chat.applyEvent(model, { t: 'ev.run_state', sessionId: 's1', state: 'running' });
  assert.equal(model.runState, 'running');
  assert.ok(model.runStartedAt > 0);
  const started = model.runStartedAt;
  chat.applyEvent(model, { t: 'ev.run_state', sessionId: 's1', state: 'running' });
  assert.equal(model.runStartedAt, started, 'a repeated running event keeps the original start');
  chat.applyEvent(model, { t: 'ev.run_state', sessionId: 's1', state: 'idle' });
  assert.equal(model.runState, 'idle');
  assert.equal(model.runStartedAt, 0);
});

test('never-used sessions are marked empty; used sessions are not', () => {
  const created = Date.parse('2026-10-27T15:15:59+08:00');
  const empty = sessions.normalizeSession({
    id: 's_empty',
    workspace: 'C:\\work',
    createdAt: new Date(created).toISOString(),
    updatedAt: new Date(created + 800).toISOString()
  });
  assert.equal(empty.empty, true);

  const titled = sessions.normalizeSession({
    id: 's_titled',
    title: 'hello',
    createdAt: new Date(created).toISOString(),
    updatedAt: new Date(created + 800).toISOString()
  });
  assert.equal(titled.empty, false);

  const used = sessions.normalizeSession({
    id: 's_used',
    workspace: 'C:\\work',
    createdAt: new Date(created).toISOString(),
    updatedAt: new Date(created + 60 * 60 * 1000).toISOString()
  });
  assert.equal(used.empty, false);
});

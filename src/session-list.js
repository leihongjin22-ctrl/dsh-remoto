'use strict';

// Session list derivation. The UI never guesses: title falls back workspace -> id,
// time falls back to "unknown", and state maps to one of the six protocol values.

const STATE_META = {
  running: { label: '运行中', tone: 'running' },
  'awaiting-permission': { label: '待审批', tone: 'warn' },
  'awaiting-answer': { label: '待回答', tone: 'warn' },
  idle: { label: '空闲', tone: 'idle' },
  detached: { label: '已断开', tone: 'muted' },
  archived: { label: '已归档', tone: 'muted' }
};

function stateOf(session) {
  const state = session && session.state;
  if (state && STATE_META[state]) return state;
  if (session && session.running) return 'running';
  return 'idle';
}

function titleOf(session) {
  const title = session && typeof session.title === 'string' ? session.title.trim() : '';
  if (title) return title;
  const workspace = session && typeof session.workspace === 'string' ? session.workspace.trim() : '';
  if (workspace) return workspace.split(/[\\/]/).filter(Boolean).pop() || workspace;
  return (session && session.id) || '未命名会话';
}

function timeOf(session) {
  const raw = session && session.updatedAt;
  if (!raw) return 0;
  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeSession(session) {
  const state = stateOf(session);
  const title = session && typeof session.title === 'string' ? session.title.trim() : '';
  const created = session && session.createdAt ? Date.parse(session.createdAt) || 0 : 0;
  const updated = timeOf(session);
  return {
    id: String((session && session.id) || ''),
    title: titleOf(session),
    hasTitle: !!title,
    workspace: (session && session.workspace) || '',
    state,
    running: state === 'running' || !!(session && session.running),
    archived: state === 'archived',
    updatedAt: updated,
    createdAt: created,
    // A session created from the phone but never used has no title and no
    // updates; the desktop list hides it, so the phone list should too (unless
    // it is the session currently open).
    empty: !title && created > 0 && updated > 0 && Math.abs(updated - created) < 5000,
    origin: (session && session.origin) || '',
    meta: STATE_META[state]
  };
}

function normalizeSessions(sessions) {
  const seen = new Set();
  const out = [];
  for (const raw of Array.isArray(sessions) ? sessions : []) {
    const session = normalizeSession(raw);
    if (!session.id || seen.has(session.id)) continue;
    seen.add(session.id);
    out.push(session);
  }
  out.sort((a, b) => {
    if (a.running !== b.running) return a.running ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
  return out;
}

function groupSessions(sessions) {
  const list = normalizeSessions(sessions);
  const groups = { running: [], recent: [], archived: [] };
  for (const session of list) {
    if (session.archived) groups.archived.push(session);
    else if (session.state === 'running' || session.state === 'awaiting-permission' || session.state === 'awaiting-answer') {
      groups.running.push(session);
    } else groups.recent.push(session);
  }
  return groups;
}

function formatRelative(updatedAt, now) {
  if (!updatedAt) return '';
  const current = typeof now === 'number' ? now : Date.now();
  const diff = Math.max(0, current - updatedAt);
  const minute = 60000;
  if (diff < minute) return '刚刚';
  if (diff < 60 * minute) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < 24 * 60 * minute) return `${Math.floor(diff / (60 * minute))} 小时前`;
  const date = new Date(updatedAt);
  const today = new Date(current);
  const yesterday = new Date(current - 24 * 60 * minute);
  if (date.toDateString() === yesterday.toDateString()) return '昨天';
  if (date.getFullYear() === today.getFullYear()) return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

function findSession(sessions, id) {
  for (const session of Array.isArray(sessions) ? sessions : []) {
    if (session && session.id === id) return session;
  }
  return null;
}

module.exports = {
  STATE_META,
  stateOf,
  titleOf,
  normalizeSession,
  normalizeSessions,
  groupSessions,
  formatRelative,
  findSession
};

'use strict';

// Data-plane payload catalogue (inside the sealed record) and the shared numeric
// budgets. Only the ten commands that protocol 0.5.4 defines are produced here.

const MAX_IMAGE_ATTACHMENTS = 4;
const MAX_FILE_ATTACHMENTS = 4;
const MAX_ATTACHMENT_BYTES = 512 * 1024;
const MAX_ATTACHMENT_TOTAL_BYTES = 512 * 1024;
const MAX_TEXT_CHARS = 20000;
const MAX_RELAY_MESSAGE_BYTES = 1024 * 1024;

const COMMAND_TIMEOUT_MS = 12000;

const CMD_TYPES = [
  'cmd.send_prompt',
  'cmd.answer',
  'cmd.resolve_permission',
  'cmd.interrupt',
  'cmd.list_sessions',
  'cmd.keep_awake',
  'cmd.session_history',
  'cmd.new_session',
  'cmd.get_pending',
  'cmd.archive_session'
];

const EV_TYPES = [
  'ev.session_changed',
  'ev.message_delta',
  'ev.tool_event',
  'ev.permission_request',
  'ev.permission_resolved',
  'ev.question_request',
  'ev.question_resolved',
  'ev.run_state',
  'ev.todo',
  'ev.retry',
  'ev.compaction',
  'ev.keep_awake_state',
  'ev.host_info',
  'ev.model',
  'ev.result',
  'ev.session_history',
  'ev.artifact'
];

const SESSION_STATES = ['idle', 'running', 'detached', 'archived', 'awaiting-permission', 'awaiting-answer'];

function listSessions(cmdId) {
  return { t: 'cmd.list_sessions', cmdId };
}

function sessionHistory(cmdId, fields) {
  const payload = { t: 'cmd.session_history', cmdId, sessionId: fields.sessionId };
  if (fields.beforeSeq) payload.beforeSeq = fields.beforeSeq;
  if (fields.since) payload.since = fields.since;
  if (fields.limit) payload.limit = fields.limit;
  return payload;
}

function sendPrompt(cmdId, fields) {
  const payload = { t: 'cmd.send_prompt', cmdId, sessionId: fields.sessionId, text: fields.text || '' };
  if (fields.images && fields.images.length) payload.images = fields.images;
  if (fields.files && fields.files.length) payload.files = fields.files;
  return payload;
}

function answer(cmdId, fields) {
  return {
    t: 'cmd.answer',
    cmdId,
    sessionId: fields.sessionId,
    requestId: fields.requestId,
    answers: fields.answers || []
  };
}

function resolvePermission(cmdId, fields) {
  const payload = {
    t: 'cmd.resolve_permission',
    cmdId,
    sessionId: fields.sessionId,
    requestId: fields.requestId,
    decision: String(fields.decision)
  };
  if (fields.note) payload.note = fields.note;
  return payload;
}

function interrupt(cmdId, fields) {
  return { t: 'cmd.interrupt', cmdId, sessionId: fields.sessionId };
}

function newSession(cmdId, fields) {
  const payload = { t: 'cmd.new_session', cmdId };
  if (fields && fields.workspace) payload.workspace = fields.workspace;
  return payload;
}

function archiveSession(cmdId, fields) {
  const payload = { t: 'cmd.archive_session', cmdId, sessionId: fields.sessionId };
  if (fields.archived === false) payload.archived = false;
  return payload;
}

function getPermission(cmdId, fields) {
  return { t: 'cmd.get_permission', cmdId, sessionId: fields.sessionId };
}

function setPermission(cmdId, fields) {
  return { t: 'cmd.set_permission', cmdId, sessionId: fields.sessionId, preset: fields.preset };
}

function getPending(cmdId, fields) {
  const payload = { t: 'cmd.get_pending', cmdId };
  if (fields && fields.sessionId) payload.sessionId = fields.sessionId;
  return payload;
}

function keepAwake(cmdId, fields) {
  const payload = { t: 'cmd.keep_awake', cmdId, enabled: !!fields.enabled };
  if (fields.idleReleaseSec) payload.idleReleaseSec = fields.idleReleaseSec;
  return payload;
}

function isCmdType(name) {
  return CMD_TYPES.indexOf(name) !== -1;
}

function isEvType(name) {
  return EV_TYPES.indexOf(name) !== -1;
}

function b64Bytes(text) {
  // Fast estimate without decoding: base64 length -> bytes.
  if (typeof text !== 'string') return 0;
  const clean = text.replace(/[^A-Za-z0-9+/=]/g, '');
  const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((clean.length * 3) / 4) - padding);
}

function validatePrompt(fields) {
  const text = String(fields.text || '');
  if (text.length > MAX_TEXT_CHARS) return { ok: false, error: `正文超过 ${MAX_TEXT_CHARS} 字上限` };
  const images = fields.images || [];
  const files = fields.files || [];
  if (images.length > MAX_IMAGE_ATTACHMENTS) return { ok: false, error: `图片最多 ${MAX_IMAGE_ATTACHMENTS} 张` };
  if (files.length > MAX_FILE_ATTACHMENTS) return { ok: false, error: `文件最多 ${MAX_FILE_ATTACHMENTS} 个` };
  let total = 0;
  for (const image of images) {
    if (!image || image.mediaType !== 'image/jpeg') return { ok: false, error: '图片只支持 JPEG' };
    if (!image.name) return { ok: false, error: '图片缺少文件名' };
    const bytes = b64Bytes(image.data);
    if (bytes > MAX_ATTACHMENT_BYTES) return { ok: false, error: `图片 ${image.name} 超过 512KB` };
    total += bytes;
  }
  for (const file of files) {
    if (!file || !file.name) return { ok: false, error: '文件缺少文件名' };
    const bytes = b64Bytes(file.data);
    if (bytes > MAX_ATTACHMENT_BYTES) return { ok: false, error: `文件 ${file.name} 超过 512KB` };
    total += bytes;
  }
  if (total > MAX_ATTACHMENT_TOTAL_BYTES) {
    return { ok: false, error: `附件合计超过 ${Math.round(MAX_ATTACHMENT_TOTAL_BYTES / 1024)}KB 上限` };
  }
  if (!text.trim() && images.length === 0 && files.length === 0) {
    return { ok: false, error: '内容为空' };
  }
  return { ok: true };
}

module.exports = {
  MAX_IMAGE_ATTACHMENTS,
  MAX_FILE_ATTACHMENTS,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENT_TOTAL_BYTES,
  MAX_TEXT_CHARS,
  MAX_RELAY_MESSAGE_BYTES,
  COMMAND_TIMEOUT_MS,
  CMD_TYPES,
  EV_TYPES,
  SESSION_STATES,
  listSessions,
  sessionHistory,
  sendPrompt,
  answer,
  resolvePermission,
  interrupt,
  newSession,
  archiveSession,
  getPermission,
  setPermission,
  getPending,
  keepAwake,
  isCmdType,
  isEvType,
  b64Bytes,
  validatePrompt
};

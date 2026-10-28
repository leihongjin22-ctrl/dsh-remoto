'use strict';

// Rendering model for one chat. History replay and live streaming both go
// through applyEvent(), so "live looks right, history looks odd" cannot happen
// by construction. Messages are keyed by messageId and split by `part`.

const MAX_PART_CHARS = 20000;
const MAX_BLOCKS = 800;

function createChatModel() {
  return {
    blocks: [],
    byId: new Map(),
    toolIndex: new Map(),
    todo: [],
    runState: 'idle',
    runStartedAt: 0,
    model: null,
    nextBeforeSeq: 0,
    historyLoaded: false,
    historyEmpty: false,
    truncated: false
  };
}

function findMessage(model, id) {
  return id ? model.byId.get(id) || null : null;
}

function makeMessageBlock(ev, local) {
  return {
    kind: 'message',
    id: ev.messageId || ev.clientMsgId || '',
    role: ev.role || 'assistant',
    parts: [],
    done: false,
    local: !!local,
    clientMsgId: ev.clientMsgId || '',
    state: ev.state || '',
    error: '',
    images: ev.images || [],
    files: ev.files || [],
    at: ev.at || 0
  };
}

function partText(block, part) {
  const segment = block.parts.find((item) => item.part === part);
  return segment ? segment.text : '';
}

function appendDelta(block, part, delta) {
  const text = typeof delta === 'string' ? delta : String(delta || '');
  if (!text) return false;
  let segment = block.parts.find((item) => item.part === part);
  if (!segment) {
    segment = { part, text: '' };
    block.parts.push(segment);
    block.parts.sort((a, b) => a.part - b.part);
  }
  if (segment.text.length >= MAX_PART_CHARS) return false;
  const room = MAX_PART_CHARS - segment.text.length;
  segment.text += text.length > room ? text.slice(0, room) : text;
  return true;
}

// History replay can overlap a live echo. Treat a delta that is already the tail
// of the segment as seen, and a delta that extends it as replacement text.
function mergeHistoryDelta(block, part, delta) {
  const text = typeof delta === 'string' ? delta : String(delta || '');
  if (!text) return false;
  const current = partText(block, part);
  if (current === text) return false;
  if (current.endsWith(text)) return false;
  if (text.startsWith(current)) {
    const segment = block.parts.find((item) => item.part === part);
    if (segment) segment.text = text.slice(0, MAX_PART_CHARS);
    return true;
  }
  return appendDelta(block, part, text);
}

function applyMessageDelta(model, ev, opts) {
  const messageId = String(ev.messageId || '');
  if (!messageId) return null;
  let block = model.byId.get(messageId);
  let created = false;
  if (!block) {
    // A user message echoed by the host must fold into the optimistic bubble,
    // whether it arrives live or as part of a history page.
    if (ev.role === 'user' && (ev.done || opts.history)) {
      const pending = findPendingUser(model, ev.delta);
      if (pending) {
        adoptLocalMessage(model, pending, messageId);
        if (ev.done) pending.done = true;
        return pending;
      }
    }
    block = makeMessageBlock(ev, false);
    model.byId.set(messageId, block);
    if (opts.collect) opts.collect.push(block);
    else model.blocks.push(block);
    created = true;
  }
  const part = Number.isFinite(Number(ev.part)) ? Number(ev.part) : 0;
  const echoedAgain = !created && ev.role === 'user' && partText(block, part) === String(ev.delta || '');
  if (echoedAgain) {
    if (ev.done) block.done = true;
    return block;
  }
  if (created || opts.replace) {
    if (ev.delta) appendDelta(block, part, ev.delta);
  } else if (opts.history) {
    mergeHistoryDelta(block, part, ev.delta);
  } else {
    appendDelta(block, part, ev.delta);
  }
  if (ev.role) block.role = ev.role;
  if (ev.done) block.done = true;
  return block;
}

function applyToolEvent(model, ev, opts) {
  const callId = String(ev.callId || '');
  if (!callId) return null;
  let block = model.toolIndex.get(callId);
  let created = false;
  if (!block) {
    block = {
      kind: 'tool',
      id: callId,
      callId,
      tool: ev.tool || '',
      title: ev.title || '',
      phase: ev.phase || 'started',
      argsPreview: ev.argsPreview || '',
      resultPreview: ev.resultPreview || ''
    };
    model.toolIndex.set(callId, block);
    if (opts.collect) opts.collect.push(block);
    else model.blocks.push(block);
    created = true;
  }
  if (ev.tool) block.tool = ev.tool;
  if (ev.title) block.title = ev.title;
  if (ev.phase) block.phase = ev.phase;
  if (ev.argsPreview !== undefined) block.argsPreview = ev.argsPreview || '';
  if (ev.resultPreview !== undefined) block.resultPreview = ev.resultPreview || '';
  return block;
}

function applyEvent(model, ev, options) {
  const opts = options || {};
  if (!ev || typeof ev.t !== 'string') return { changed: false, created: null };
  const collect = opts.collect;
  let block = null;
  let created = null;
  switch (ev.t) {
    case 'ev.message_delta':
      block = applyMessageDelta(model, ev, { ...opts, collect });
      if (block && block.parts.length === 0 && opts.collect) {
        // Nothing to show yet: keep the block so later chunks land in place.
        created = block;
      }
      break;
    case 'ev.tool_event':
      block = applyToolEvent(model, ev, { ...opts, collect });
      created = block && opts.collect ? block : null;
      break;
    case 'ev.todo':
      model.todo = Array.isArray(ev.todos) ? ev.todos : [];
      return { changed: true, created: null };
    case 'ev.artifact': {
      const id = String(ev.artifactId || `artifact:${model.blocks.length}:${ev.name || ''}`);
      if (model.byId.has(id)) return { changed: false, created: null };
      const block = {
        kind: 'artifact',
        id,
        name: String(ev.name || '文件'),
        mediaType: String(ev.mediaType || 'application/octet-stream'),
        bytes: Number(ev.bytes) || 0,
        data: typeof ev.data === 'string' ? ev.data : '',
        description: String(ev.description || ''),
        error: String(ev.error || '')
      };
      model.blocks.push(block);
      model.byId.set(id, block);
      return { changed: true, created: block };
    }
    case 'ev.run_state': {
      const next = ev.state === 'running' ? 'running' : 'idle';
      if (next === 'running' && model.runState !== 'running') model.runStartedAt = Date.now();
      if (next === 'idle') model.runStartedAt = 0;
      model.runState = next;
      return { changed: true, created: null };
    }
    case 'ev.model':
      model.model = {
        provider: ev.provider || '',
        model: ev.model || '',
        canSwitch: !!ev.canSwitch,
        options: Array.isArray(ev.options) ? ev.options : [],
        reason: ev.reason || ''
      };
      return { changed: true, created: null };
    case 'ev.retry':
      pushNotice(model, {
        noticeKind: 'retry',
        text: `模型重试 ${ev.attempt}/${ev.max}${ev.reason ? ` · ${ev.reason}` : ''}`
      });
      return { changed: true, created: null };
    case 'ev.compaction':
      pushNotice(model, {
        noticeKind: 'compaction',
        text:
          ev.state === 'started'
            ? '正在压缩上下文…'
            : ev.state === 'failed'
              ? `上下文压缩失败${ev.error ? `：${ev.error}` : ''}`
              : '上下文压缩完成'
      });
      return { changed: true, created: null };
    default:
      return { changed: false, created: null };
  }
  return { changed: true, created: created || (block && block.id ? block : null) };
}

function pushNotice(model, notice) {
  model.blocks.push({ kind: 'notice', id: `n_${model.blocks.length}`, ...notice });
  trimBlocks(model);
}

function trimBlocks(model) {
  if (model.blocks.length <= MAX_BLOCKS) return;
  const dropped = model.blocks.splice(0, model.blocks.length - MAX_BLOCKS);
  model.truncated = true;
  for (const block of dropped) {
    if (block.kind === 'message' && block.id) model.byId.delete(block.id);
    if (block.kind === 'tool' && block.callId) model.toolIndex.delete(block.callId);
  }
}

function applyHistoryPage(model, items, options) {
  const opts = options || {};
  const list = Array.isArray(items) ? items : [];
  const collect = [];
  let changed = false;
  for (const item of list) {
    if (!item || typeof item.t !== 'string') continue;
    if (item.t === 'ev.run_state' || item.t === 'ev.session_changed') continue;
    const result = applyEvent(model, item, { history: true, replace: false, collect });
    if (result.changed) changed = true;
  }
  const existing = new Set(model.blocks);
  const fresh = collect.filter((block) => !existing.has(block));
  if (fresh.length) {
    // Older pages must appear above everything already on screen; the first page
    // appends below cache/local blocks.
    if (opts.older) model.blocks.unshift(...fresh);
    else model.blocks.push(...fresh);
  }
  if (opts.nextBeforeSeq !== undefined) model.nextBeforeSeq = opts.nextBeforeSeq || 0;
  if (opts.historyEmpty !== undefined) model.historyEmpty = opts.historyEmpty;
  model.historyLoaded = true;
  return changed;
}

function addLocalUserMessage(model, fields) {
  const block = makeMessageBlock(
    {
      clientMsgId: fields.clientMsgId,
      role: 'user',
      at: fields.at,
      state: fields.state || 'sending',
      images: fields.images || [],
      files: fields.files || []
    },
    true
  );
  block.parts = [{ part: 0, text: String(fields.text || '') }];
  block.done = false;
  model.blocks.push(block);
  model.byId.set(block.clientMsgId, block);
  return block;
}

function findPendingUser(model, text, clientMsgId) {
  const wanted = String(text || '').trim();
  for (let i = model.blocks.length - 1; i >= 0; i -= 1) {
    const block = model.blocks[i];
    if (block.kind !== 'message' || block.role !== 'user' || !block.local) continue;
    if (clientMsgId && block.clientMsgId === clientMsgId) return block;
    if (block.clientMsgId && wanted && partText(block, 0).trim() === wanted) return block;
  }
  return null;
}

function adoptLocalMessage(model, block, messageId) {
  if (!block || !messageId) return block;
  if (block.clientMsgId && model.byId.get(block.clientMsgId) === block) {
    model.byId.delete(block.clientMsgId);
  }
  block.id = messageId;
  block.local = false;
  block.done = true;
  block.state = 'accepted';
  model.byId.set(messageId, block);
  return block;
}

function updateLocalState(model, clientMsgId, state, error) {
  const block = model.byId.get(clientMsgId);
  if (!block) return null;
  block.state = state;
  if (error !== undefined) block.error = error || '';
  if (state === 'accepted') block.local = false;
  return block;
}

function partCount(model) {
  return model.blocks.filter((block) => block.kind === 'message').length;
}

module.exports = {
  MAX_PART_CHARS,
  createChatModel,
  findMessage,
  partText,
  applyEvent,
  applyHistoryPage,
  addLocalUserMessage,
  findPendingUser,
  adoptLocalMessage,
  updateLocalState,
  partCount
};

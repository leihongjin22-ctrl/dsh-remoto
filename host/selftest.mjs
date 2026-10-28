#!/usr/bin/env node
'use strict';

// Host-side self test.
//
// It walks the same path the plugin walks: read the effective relay + token,
// claim a token when needed, open a host WebSocket, register with `hello`, then
// publish a pairing code and wait for `pair-ready`. It does not need DSH to be
// running and it does not touch any pairing state.
//
//   node selftest.mjs [--relay wss://...] [--token <48 hex>] [--timeout 12000]

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
function arg(name, fallback) {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] || fallback;
}
const timeoutMs = Number(arg('timeout', '12000')) || 12000;

const dataDir = path.join(os.homedir(), '.dsh', 'dsh-remote-control');
const userConfigPath = path.join(dataDir, 'user-config.json');
const hostIdPath = path.join(dataDir, 'host-id');

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function readJson(file) {
  try {
    return JSON.parse(readText(file));
  } catch {
    return null;
  }
}

function hex(bytes) {
  return crypto.randomBytes(bytes).toString('hex');
}

function httpBaseOf(serverUrl) {
  const url = new URL(serverUrl);
  url.protocol = url.protocol === 'wss:' ? 'https:' : 'http:';
  return url.toString().replace(/\/+$/, '');
}

function log(message) {
  console.log(message);
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

const userConfig = readJson(userConfigPath) || {};
const relayFile = readText(path.join(root, 'relay.txt')).trim();
const tokenFile = readText(path.join(root, 'token.txt')).trim();
const serverUrl = arg('relay', userConfig.serverUrl || relayFile);
let token = arg('token', userConfig.hostToken || tokenFile);
const hostId = readText(hostIdPath).trim() || arg('host-id', `drc-${hex(6)}`);

if (!serverUrl) fail('no relay URL configured (relay.txt / user-config.json)');
if (!/^wss?:\/\//.test(serverUrl)) fail(`relay URL must start with ws:// or wss://: ${serverUrl}`);

log(`relay    : ${serverUrl}`);
log(`host id  : ${hostId}${fs.existsSync(hostIdPath) ? '' : ' (not installed yet, generated for this test)'}`);

// 1. HTTP health (only when the relay exposes it)
try {
  const response = await fetch(`${httpBaseOf(serverUrl)}/healthz`, {
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (response.ok) {
    const body = await response.json();
    log(`health   : ok, relay ${body.version}, hosts=${body.hosts}, pendingPairs=${body.pendingPairs}`);
  } else {
    log(`health   : HTTP ${response.status} (relay may not expose /healthz)`);
  }
} catch (error) {
  log(`health   : unreachable (${String(error.message || error)})`);
}

// 2. Claim a token when the plugin would claim one (no token configured)
if (!token) {
  try {
    const response = await fetch(`${httpBaseOf(serverUrl)}/api/claim-token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ hostId }),
      signal: AbortSignal.timeout(timeoutMs)
    });
    const text = await response.text();
    if (!response.ok) fail(`claim-token HTTP ${response.status}: ${text.slice(0, 160)}`);
    const body = JSON.parse(text);
    if (!/^[0-9a-f]{48}$/.test(body.token || '')) fail(`claim-token returned an unexpected shape: ${text.slice(0, 160)}`);
    token = body.token;
    log(`claim    : ok (${token.length} hex chars)`);
  } catch (error) {
    if (String(error.message || error).startsWith('FAIL')) throw error;
    fail(`claim-token failed: ${String(error.message || error)}`);
  }
} else {
  log(`token    : configured (${token.length} chars)`);
}

if (typeof WebSocket !== 'function') fail('this Node runtime has no global WebSocket (need Node 22+)');

// 3. Host registration + pairing code
const result = await new Promise((resolve) => {
  const socket = new WebSocket(serverUrl);
  let stage = 0;
  const timer = setTimeout(() => {
    try {
      socket.close();
    } catch {}
    resolve({ ok: false, reason: `timeout after ${timeoutMs}ms at stage ${stage}` });
  }, timeoutMs);

  function finish(value) {
    clearTimeout(timer);
    try {
      socket.close();
    } catch {}
    resolve(value);
  }

  socket.onopen = () => {
    stage = 1;
    const hello = { t: 'hello', role: 'host', protocol: 1, hostId, label: 'dsh-remoto-selftest' };
    if (token) hello.token = token;
    socket.send(JSON.stringify(hello));
  };

  socket.onmessage = (event) => {
    let frame;
    try {
      frame = JSON.parse(String(event.data));
    } catch {
      return;
    }
    if (frame.t === 'hello-ok') {
      log(`hello-ok : relay protocol ${frame.protocol}, capabilities=${(frame.capabilities || []).join(',') || '(none)'}`);
      stage = 2;
      const code = String(Math.floor(Math.random() * 900000) + 100000);
      socket.send(JSON.stringify({ t: 'pair-begin', pairingToken: code }));
      return;
    }
    if (frame.t === 'pair-ready') {
      log(`pair-ready: ok, ttl=${frame.ttlMs}ms (pairing code expires automatically)`);
      finish({ ok: true, hostId: frame.hostId || hostId });
      return;
    }
    if (frame.t === 'error') {
      finish({ ok: false, reason: `${frame.code}${frame.message ? ': ' + frame.message : ''}` });
    }
  };

  socket.onerror = () => finish({ ok: false, reason: 'websocket error' });
  socket.onclose = () => {
    if (stage < 3) finish({ ok: false, reason: `socket closed at stage ${stage}` });
  };
});

if (!result.ok) fail(result.reason);
log('');
log('PASS: relay, token and the host pairing path all work.');
log(`Next: start DSH, open the Remote Control pill, click Refresh, then pair the phone.`);
process.exit(0);

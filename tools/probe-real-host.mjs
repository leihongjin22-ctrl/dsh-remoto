#!/usr/bin/env node
'use strict';

// Live probe against a running DSH host (default: the desktop app on this PC).
// It asks the host's pill route for a fresh 6-digit code, pairs over the
// configured relay, verifies the SAS both sides compute, then reads sessions and
// one page of history. Nothing is written to the phone; the pairing is left in
// place so the host UI can show it.
//
//   node tools/probe-real-host.mjs [http://127.0.0.1:60141]

const { createRequire } = await import('node:module');

const requireLocal = createRequire(import.meta.url);
const { createConnection } = requireLocal('../src/connection.js');
const payloads = requireLocal('../src/payloads.js');

const webUrl = (process.argv[2] || process.env.DSH_WEB_URL || 'http://127.0.0.1:60141').replace(/\/+$/, '');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

async function getStatus() {
  const response = await fetch(`${webUrl}/plugins/dsh-remote-control/status`, {
    headers: { 'x-drc-pair': '1' }
  });
  if (!response.ok) throw new Error(`status ${response.status}`);
  return response.json();
}

async function newPairing() {
  const response = await fetch(`${webUrl}/plugins/dsh-remote-control/pairing/new`, {
    method: 'POST',
    headers: { 'x-drc-pair': '1' }
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`pairing/new ${response.status}: ${JSON.stringify(body)}`);
  if (body.state !== 'ready' || !body.token) throw new Error(`pairing unavailable: ${JSON.stringify(body)}`);
  return body;
}

function waitEvent(conn, event, predicate, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout waiting for ${event}`)), timeoutMs || 15000);
    const off = conn.on(event, (data) => {
      if (predicate && !predicate(data)) return;
      clearTimeout(timer);
      off();
      resolve(data);
    });
  });
}

async function main() {
  const status = await getStatus();
  console.log(`host      : ${status.serverUrl} (plugin ${status.version}, relay ${status.relay})`);
  if (status.relay !== 'online') fail('host relay is offline');
  const pairing = await newPairing();
  console.log(`pairing   : code issued, expires in ${Math.round(pairing.expiresInMs / 1000)}s`);

  const conn = createConnection({
    url: status.serverUrl,
    clientId: `probe-${Date.now().toString(36)}`,
    label: 'newapp probe',
    softwareVersion: '0.3.8',
    config: { autoReconnect: false, heartbeatMs: 60000, handshakeTimeoutMs: 15000 }
  });

  const stateLog = [];
  conn.on('state', (data) => stateLog.push(data.state));
  const paired = waitEvent(conn, 'pair', (data) => data.stage === 'paired');
  conn.connect();
  conn.beginPair(pairing.token);

  const result = await paired;
  console.log(`paired    : channel ${result.channelId}, hostId ${result.hostId || '(none)'}`);
  console.log(`SAS       : ${result.sas}`);

  const readyPromise = waitEvent(conn, 'ready', (data) => data.paired === true);
  conn.configureSession({
    channelId: result.channelId,
    hostId: result.hostId,
    psk: result.psk,
    clientId: result.clientId
  });
  await readyPromise;

  const payloadLog = [];
  conn.on('payload', (payload) => payloadLog.push(payload));

  const sessionsPromise = waitEvent(conn, 'payload', (payload) => payload.t === 'ev.session_changed');
  conn.sendCommand(payloads.listSessions('probe-list'));
  const sessionsEvent = await sessionsPromise;
  const sessions = Array.isArray(sessionsEvent.sessions) ? sessionsEvent.sessions : [];
  console.log(`sessions  : ${sessions.length}`);
  for (const session of sessions.slice(0, 10)) {
    console.log(`  - ${session.id} [${session.state || (session.running ? 'running' : 'idle')}] ${session.title || session.workspace || ''}`);
  }

  const target = sessions.find((session) => session.state === 'running') || sessions[0];
  if (target) {
    const historyPromise = waitEvent(conn, 'payload', (payload) => payload.t === 'ev.session_history');
    conn.sendCommand(payloads.sessionHistory('probe-hist', { sessionId: target.id, limit: 40 }));
    const history = await historyPromise;
    const items = Array.isArray(history.items) ? history.items : [];
    console.log(`history   : session ${target.id}, ${items.length} items, nextBeforeSeq=${history.nextBeforeSeq ?? '-'} latestSeq=${history.latestSeq ?? '-'}`);
    for (const item of items.slice(0, 10)) {
      if (item.t === 'ev.message_delta') {
        console.log(`  ${item.role || 'assistant'}${item.done ? ' (done)' : ''}: ${String(item.delta || '').replace(/\s+/g, ' ').slice(0, 90)}`);
      } else if (item.t === 'ev.tool_event') {
        console.log(`  tool ${item.phase}: ${item.tool || ''} ${item.title || ''}`.trim());
      } else if (item.t === 'ev.todo') {
        console.log(`  todo: ${item.todos.length} items`);
      }
    }
  }

  const hostInfo = payloadLog.find((payload) => payload.t === 'ev.host_info');
  if (hostInfo) {
    console.log(`host_info : ${hostInfo.host.platform}/${hostInfo.host.arch} dsh=${hostInfo.host.dshVersion || '?'} limits=${JSON.stringify(hostInfo.limits)}`);
  }
  console.log(`frames    : ${payloadLog.length} payloads, states=${Array.from(new Set(stateLog)).join('>')}`);
  conn.stop();
  console.log('OK');
}

main().catch((error) => fail(error && error.message ? error.message : String(error)));

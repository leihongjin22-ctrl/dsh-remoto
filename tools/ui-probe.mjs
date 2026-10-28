#!/usr/bin/env node
'use strict';

// Minimal Edge CDP driver for UI checks: launches headless Edge, navigates to a
// file:// URL, evaluates an expression and optionally takes a screenshot.
//
//   node tools/ui-probe.mjs <url> <out.png> "<js expression>"

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = process.argv[2];
const shotPath = process.argv[3];
const expression = process.argv[4] || 'document.title';
const port = 9411 + Math.floor(Math.random() * 40);
const profile = path.join(os.tmpdir(), `drc-edge-${port}`);

const child = spawn(
  edgePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--window-size=412,880',
    'about:blank'
  ],
  { stdio: 'ignore', windowsHide: true }
);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitEndpoint() {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {}
    await delay(150);
  }
  throw new Error('edge CDP endpoint did not start');
}

async function newTab(targetUrl) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(targetUrl)}`, {
    method: 'PUT'
  });
  if (!response.ok) throw new Error(`new tab failed: ${response.status}`);
  return response.json();
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(wsUrl);
    const pending = new Map();
    let id = 0;
    socket.onopen = () => {
      resolve({
        send(method, params) {
          return new Promise((res, rej) => {
            const messageId = ++id;
            pending.set(messageId, { res, rej });
            socket.send(JSON.stringify({ id: messageId, method, params }));
          });
        },
        close() {
          socket.close();
        }
      });
    };
    socket.onerror = (event) => reject(new Error('ws error'));
    socket.onmessage = (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id) return;
      const entry = pending.get(message.id);
      if (!entry) return;
      pending.delete(message.id);
      if (message.error) entry.rej(new Error(message.error.message));
      else entry.res(message.result);
    };
  });
}

async function main() {
  await waitEndpoint();
  const tab = await newTab('about:blank');
  const client = await connect(tab.webSocketDebuggerUrl);
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 412,
    height: 880,
    deviceScaleFactor: 2,
    mobile: true
  });
  await client.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await client.send('Page.navigate', { url });
  await delay(1500);
  const evaluated = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  console.log(JSON.stringify(evaluated.result && evaluated.result.value, null, 2));
  if (shotPath) {
    const shot = await client.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`screenshot -> ${shotPath}`);
  }
  client.close();
  child.kill();
  await delay(200);
  try {
    fs.rmSync(profile, { recursive: true, force: true });
  } catch {}
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  child.kill();
  process.exit(1);
});

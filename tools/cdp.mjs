'use strict';

// Small Chrome DevTools Protocol driver (Edge/Chromium) used by the UI checks.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function launchBrowser(options = {}) {
  const width = options.width || 412;
  const height = options.height || 880;
  const port = options.port || 9500 + Math.floor(Math.random() * 200);
  const profile = path.join(os.tmpdir(), `drc-cdp-${port}-${Date.now()}`);
  const executable = fs.existsSync(EDGE) ? EDGE : CHROME;
  const child = spawn(
    executable,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--hide-scrollbars',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      `--window-size=${width},${height}`,
      'about:blank'
    ],
    { stdio: 'ignore', windowsHide: true }
  );

  const deadline = Date.now() + 15000;
  let ready = false;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await delay(150);
  }
  if (!ready) {
    child.kill();
    throw new Error('browser CDP endpoint did not start');
  }

  const tabResponse = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
  const tab = await tabResponse.json();

  const socket = await new Promise((resolve, reject) => {
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    ws.onopen = () => resolve(ws);
    ws.onerror = () => reject(new Error('cdp socket error'));
  });

  let messageId = 0;
  const pending = new Map();
  const events = [];
  socket.onmessage = (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id) {
      events.push(message);
      return;
    }
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message.result);
  };

  function send(method, params) {
    return new Promise((resolve, reject) => {
      const id = ++messageId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });

  const api = {
    send,
    events,
    async navigate(url) {
      await send('Page.navigate', { url });
      await delay(options.settle || 700);
    },
    async evaluate(expression) {
      const result = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      if (result.exceptionDetails) {
        const text = result.exceptionDetails.exception
          ? result.exceptionDetails.exception.description || result.exceptionDetails.text
          : result.exceptionDetails.text;
        throw new Error(text);
      }
      return result.result ? result.result.value : undefined;
    },
    async waitFor(expression, timeoutMs = 8000, interval = 120) {
      const end = Date.now() + timeoutMs;
      let last;
      while (Date.now() < end) {
        try {
          last = await api.evaluate(expression);
          if (last) return last;
        } catch (error) {
          last = String(error.message);
        }
        await delay(interval);
      }
      throw new Error(`waitFor timeout: ${expression} (last=${JSON.stringify(last)})`);
    },
    async screenshot(filePath) {
      const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
      return filePath;
    },
    async close() {
      try {
        socket.close();
      } catch {}
      child.kill();
      await delay(300);
      try {
        fs.rmSync(profile, { recursive: true, force: true });
      } catch {}
    }
  };

  return api;
}

export { delay };

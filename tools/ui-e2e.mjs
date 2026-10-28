'use strict';

// UI end-to-end check: real headless Edge + real WebSocket + the fake host from
// the test suite. Drives the same client API the UI uses, then screenshots each
// screen and asserts there are no page exceptions.

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { startRelay } from '../tests/helpers/relay.mjs';
import { createFakeHost } from '../tests/helpers/fake-host.mjs';
import { launchBrowser, delay } from './cdp.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const requireLocal = createRequire(import.meta.url);
const { memoryBackend } = requireLocal('../src/store.js');

const shots = path.join(root, 'build', 'screenshots');
fs.mkdirSync(shots, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const relay = await startRelay();
const host = createFakeHost({ url: relay.url, token: relay.token });
await host.open();
const token = '827451';
await host.beginPair(token);

const pageFile = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, 'dist', 'web', 'index.html');
const pageUrl = pathToFileURL(pageFile).href;
const browser = await launchBrowser({ width: 412, height: 880 });
try {
  await browser.navigate(pageUrl);
  await browser.evaluate(`document.getElementById("toastWrap").style.display = "none"`);
  await browser.waitFor('!!window.__drc');

  // Clean any leftover state and add a host (what the add-host sheet does).
  await browser.evaluate(`(() => {
    try { localStorage.clear(); } catch {}
    __drc.addHost({ label: '测试电脑', relayUrl: ${JSON.stringify(relay.url)} });
    return true;
  })()`);

  await browser.evaluate(`location.hash = '#/hosts'`);
  await delay(400);
  await browser.screenshot(path.join(shots, '02-hosts-unpaired.png'));

  await browser.evaluate(`location.hash = '#/pair'`);
  await delay(300);
  await browser.evaluate(`__drc.pair(${JSON.stringify(token)})`);
  await browser.waitFor(`__drc.getPairing().state === 'verify'`);
  const sas = await browser.evaluate(`__drc.getPairing().sas`);
  assert(/^\d{6}$/.test(sas), 'SAS must be 6 digits');
  assert(sas === host.sas, `SAS mismatch UI=${sas} host=${host.sas}`);
  await browser.screenshot(path.join(shots, '03-pair-verify.png'));

  await browser.evaluate(`__drc.confirmPairing()`);
  await browser.waitFor(`__drc.getState().phase === 'ready'`);
  await browser.waitFor(`__drc.getSessions().length === 3`);
  await browser.evaluate(`location.hash = '#/sessions'`);
  await delay(500);
  await browser.screenshot(path.join(shots, '04-sessions.png'));

  await browser.evaluate(`location.hash = '#/chat/s_alpha'`);
  await browser.waitFor(`(() => { const m = __drc.getModel('s_alpha'); return m && m.historyLoaded && m.blocks.length >= 3; })()`);
  await delay(300);
  await browser.screenshot(path.join(shots, '05-chat-history.png'));

  await browser.evaluate(`__drc.sendPrompt('hello from UI')`);
  await browser.waitFor(`(() => { const m = __drc.getModel('s_alpha'); return [...m.byId.values()].some(b => b.role === 'assistant' && b.done && (b.parts[0]?.text || '').includes('完成')); })()`);
  await delay(300);
  await browser.screenshot(path.join(shots, '06-chat-streamed.png'));

  await browser.evaluate(`__drc.sendPrompt('permission please')`);
  await browser.waitFor(`__drc.getPendingCards().permissions.some(c => c.state === 'open')`);
  await delay(300);
  await browser.screenshot(path.join(shots, '07-chat-approval.png'));

  await browser.evaluate(`__drc.sendPrompt('question please')`);
  await browser.waitFor(`__drc.getPendingCards().questions.some(c => c.state === 'open')`);
  await delay(300);
  await browser.screenshot(path.join(shots, '08-chat-question.png'));

  // Exercise the actual card buttons, not just the client API.
  await browser.evaluate(`(() => {
    const button = document.querySelector('[data-action="approve"]');
    if (!button) return false;
    button.click();
    return true;
  })()`);
  await browser.waitFor(`__drc.getPendingCards().permissions.some(c => c.requestId === 'req_1' && c.state === 'resolved')`);

  const answerClicked = await browser.evaluate(`(() => {
    const option = document.querySelector('[data-action="choose-option"]');
    if (!option) return false;
    option.click();
    const submit = document.querySelector('[data-action="submit-answer"]');
    if (!submit) return false;
    submit.click();
    return true;
  })()`);
  assert(answerClicked, 'question options should render and be clickable');
  await browser.waitFor(`__drc.getPendingCards().questions.some(c => c.requestId === 'q_1' && c.state === 'resolved')`);

  await browser.evaluate(`location.hash = '#/hosts'`);
  await delay(400);
  await browser.screenshot(path.join(shots, '09-hosts-paired.png'));

  await browser.evaluate(`location.hash = '#/settings'`);
  await delay(400);
  await browser.screenshot(path.join(shots, '10-settings.png'));

  await browser.evaluate(`location.hash = '#/tutorial'`);
  await delay(400);
  await browser.screenshot(path.join(shots, '11-tutorial.png'));

  const layout = await browser.evaluate(`JSON.stringify({
    iw: innerWidth,
    app: document.querySelector('.app').offsetWidth,
    overflow: [...document.querySelectorAll('*')].filter(el => el.scrollWidth > document.documentElement.clientWidth + 1 && el.offsetParent).slice(0, 6).map(el => [el.tagName, String(el.className), el.scrollWidth])
  })`);
  const parsed = JSON.parse(layout);
  assert(parsed.iw === parsed.app, `app width ${parsed.app} != viewport ${parsed.iw}`);
  assert(parsed.overflow.length === 0, `horizontal overflow: ${JSON.stringify(parsed.overflow)}`);

  const exceptions = browser.events.filter((event) => event.method === 'Runtime.exceptionThrown');
  assert(exceptions.length === 0, `page exceptions: ${JSON.stringify(exceptions.slice(0, 2))}`);
  const consoleErrors = browser.events.filter(
    (event) => event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error'
  );
  assert(consoleErrors.length === 0, `console errors: ${JSON.stringify(consoleErrors.slice(0, 2))}`);

  console.log(`OK: UI end-to-end, SAS=${sas}, screenshots in ${shots}`);
} finally {
  await browser.close();
  await host.close();
  await relay.stop();
}
process.exit(0);

#!/usr/bin/env node
'use strict';

// Packages the Windows host bundle:
//   dist/DSH-remoto-host-0.3.9.zip
// containing the plugin, LAN relay, scripts, docs and the APK.

import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const stageRoot = path.join(buildDir, 'stage');
const hostVersion = '0.4.0';
const apkVersion = '0.4.0';
const stage = path.join(stageRoot, `DSH-remoto-host-${hostVersion}`);
const apk = path.join(buildDir, `DSH-remoto-${apkVersion}.apk`);
const zip = path.join(buildDir, `DSH-remoto-host-${hostVersion}.zip`);

const skip = new Set([
  'relay.log',
  'relay.log.err',
  'relay.pid',
  'relay-state.json',
  'install-state.json'
]);

function skipEntry(name) {
  return skip.has(name) || name.startsWith('backup-') || name.endsWith('.bak');
}

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (skipEntry(entry.name)) continue;
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function main() {
  if (!fs.existsSync(apk)) {
    throw new Error(`APK missing: ${apk}. Run "node tools/build-apk.mjs" first.`);
  }
  fs.rmSync(stageRoot, { recursive: true, force: true });
  copyDir(path.join(root, 'host'), stage);
  fs.copyFileSync(apk, path.join(stage, `DSH-remoto-${apkVersion}.apk`));

  fs.rmSync(zip, { force: true });
  const command = `Compress-Archive -Path '${stage}' -DestinationPath '${zip}' -CompressionLevel Optimal -Force`;
  const result = spawnSync(
    'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
    ['-NoProfile', '-NonInteractive', '-Command', command],
    { stdio: 'inherit' }
  );
  if (result.status !== 0) throw new Error(`Compress-Archive failed with ${result.status}`);

  const size = fs.statSync(zip).size;
  const lines = [
    `${sha256(apk)}  DSH-remoto-${apkVersion}.apk`,
    `${sha256(zip)}  DSH-remoto-host-${hostVersion}.zip`
  ];
  fs.writeFileSync(path.join(buildDir, 'SHA256SUMS.txt'), `${lines.join('\n')}\n`);

  console.log(`host bundle -> ${zip} (${(size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`apk sha256  ${sha256(apk)}`);
  console.log(`zip sha256  ${sha256(zip)}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

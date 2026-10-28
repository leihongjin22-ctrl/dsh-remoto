#!/usr/bin/env node
'use strict';

// Builds the WebView bundle with esbuild. Prefer the local devDependency;
// fall back to the original development checkout for the maintainer's machine.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const localRequire = createRequire(path.join(root, 'package.json'));
let esbuild;
try {
  esbuild = localRequire('esbuild');
} catch {
  const androidApp = path.resolve(root, '..', 'android-app');
  const fallbackRequire = createRequire(path.join(androidApp, 'package.json'));
  esbuild = fallbackRequire('esbuild');
}

const outDir = path.join(root, 'dist', 'web');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const result = await esbuild.build({
    entryPoints: [path.join(root, 'web', 'app.js')],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['chrome90'],
    outfile: path.join(outDir, 'app.js'),
    logLevel: 'warning',
    minify: false,
    sourcemap: false,
    define: { 'process.env.NODE_ENV': '"production"' }
  });
  if (result.errors.length) {
    console.error(result.errors);
    process.exit(1);
  }
  for (const file of ['index.html', 'app.css', 'theme-light.css']) {
    fs.copyFileSync(path.join(root, 'web', file), path.join(outDir, file));
  }
  const size = fs.statSync(path.join(outDir, 'app.js')).size;
  console.log(`web bundle -> ${path.join(outDir, 'app.js')} (${(size / 1024).toFixed(1)} KB)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

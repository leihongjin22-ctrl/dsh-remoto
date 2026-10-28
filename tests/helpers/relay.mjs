import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const relayPath = path.resolve(here, '../../host/relay.mjs');

export function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

export async function startRelay(options = {}) {
  const port = options.port || (await freePort());
  const token = options.token || 'test-token-0123456789abcdef0123456789abcdef';
  const stateFile = path.join(os.tmpdir(), `drc-relay-state-${port}-${Date.now()}.json`);
  const child = spawn(process.execPath, [relayPath], {
    env: {
      ...process.env,
      DRC_PORT: String(port),
      DRC_BIND: '127.0.0.1',
      DRC_HOST_TOKEN: token,
      DRC_STATE_FILE: stateFile,
      DRC_PUBLIC_URL: `ws://127.0.0.1:${port}`,
      DRC_LOG_LEVEL: 'error'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const logs = [];
  child.stdout.on('data', (chunk) => logs.push(String(chunk)));
  child.stderr.on('data', (chunk) => logs.push(String(chunk)));
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/healthz`);
      if (response.ok) {
        return {
          port,
          token,
          url: `ws://127.0.0.1:${port}`,
          stateFile,
          logs,
          async stop() {
            const exited = new Promise((resolve) => {
              if (child.exitCode !== null) return resolve();
              child.once('exit', resolve);
            });
            child.kill();
            await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 1500))]);
            try {
              child.stdout.destroy();
              child.stderr.destroy();
            } catch {}
            try {
              fs.unlinkSync(stateFile);
            } catch {}
          }
        };
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  child.kill();
  throw new Error(`relay did not start: ${logs.join('')}`);
}

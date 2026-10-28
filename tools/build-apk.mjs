#!/usr/bin/env node
'use strict';

// Builds the test APK:
//   1. bundles the web UI with esbuild
//   2. copies assets into the Android project
//   3. runs the cached Gradle 8.2.1 with JDK 17 + Android SDK 34
//   4. copies and hashes the release APK into build/

import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const workspace = path.resolve(root, '..', '..');
const androidDir = path.join(root, 'android');
const assetsDir = path.join(androidDir, 'app', 'src', 'main', 'assets', 'www');
const distWeb = path.join(root, 'dist', 'web');
const buildDir = path.join(root, 'build');

const jdkHome = path.join(workspace, '_android', 'jdk17', 'jdk-17.0.20.1+1');
const sdkDir = path.join(workspace, '_android', 'sdk');
const gradleHome = path.join(workspace, '_gradle');
const gradleBat = path.join(
  gradleHome,
  'wrapper',
  'dists',
  'gradle-8.2.1-all',
  'd8pvvlun5bx6sdtwqhf8y9z4b',
  'gradle-8.2.1',
  'bin',
  'gradle.bat'
);

function runNode(script) {
  const result = spawnSync(process.execPath, [path.join(root, 'tools', script)], {
    cwd: root,
    stdio: 'inherit'
  });
  if (result.status !== 0) throw new Error(`${script} failed with ${result.status}`);
}

function copyAssets() {
  fs.rmSync(assetsDir, { recursive: true, force: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  for (const file of ['index.html', 'app.css', 'theme-light.css', 'app.js']) {
    fs.copyFileSync(path.join(distWeb, file), path.join(assetsDir, file));
  }
  console.log(`assets -> ${assetsDir}`);
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function main() {
  fs.mkdirSync(buildDir, { recursive: true });
  runNode('build-web.mjs');
  copyAssets();

  if (!fs.existsSync(gradleBat)) throw new Error(`gradle not found: ${gradleBat}`);
  if (!fs.existsSync(path.join(jdkHome, 'bin', 'java.exe'))) throw new Error(`JDK not found: ${jdkHome}`);

  const tempDir = path.join(workspace, '_tmp', 'gradle-temp');
  fs.mkdirSync(tempDir, { recursive: true });
  const env = {
    ...process.env,
    JAVA_HOME: jdkHome,
    ANDROID_HOME: sdkDir,
    ANDROID_SDK_ROOT: sdkDir,
    GRADLE_USER_HOME: gradleHome,
    TEMP: tempDir,
    TMP: tempDir,
    JAVA_TOOL_OPTIONS: `-Djava.io.tmpdir=${tempDir}`,
    PATH: `${path.join(jdkHome, 'bin')};${path.join(sdkDir, 'platform-tools')};${process.env.PATH}`
  };
  const args = [
    '/c',
    gradleBat,
    '-p',
    androidDir,
    'assembleRelease',
    '--no-daemon',
    '--console=plain',
    '-Dorg.gradle.jvmargs=-Xmx2048m'
  ];
  console.log('running gradle assembleRelease...');
  const result = spawnSync('cmd.exe', args, { cwd: root, env, stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`gradle failed with ${result.status}`);

  const source = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
  if (!fs.existsSync(source)) throw new Error(`APK missing: ${source}`);
  const target = path.join(buildDir, 'DSH-remoto-0.4.0.apk');
  fs.copyFileSync(source, target);
  const size = fs.statSync(target).size;
  console.log(`APK -> ${target} (${(size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`sha256 ${sha256(target)}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

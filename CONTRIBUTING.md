# Contributing

Thanks for helping. This is a small, independent project; clear bug reports and
focused pull requests are appreciated.

## Before opening an issue

- Search existing issues.
- Include the APK/host version, Android/Windows version, connection mode
  (LAN/relay), and whether the host is connected.
- Include the relevant app/host log lines. Do not paste PSKs, pair codes,
  `relay.txt`, `token.txt`, `user-config.json`, or exported connection configs.

Security issues: email **3309219254@qq.com**, not a public issue.

## Development

```bash
npm install
npm test
npm run test:ui
npm run build:web
```

Source layout and build details are in [README.md](README.md). The Android app is
a WebView shell; most UI work lives in `web/` and `src/`.

## Pull requests

- Keep changes focused.
- Add or update tests for protocol/controller changes.
- Do not commit build artifacts (`dist/`, `build/`, `node_modules/`) or local
  host state (`host/relay.txt`, `host/token.txt`, `host/install-state.json`).
- Do not commit real PSKs, private keys or production signing keys.
- Update both `README.md` and `README.zh-CN.md` for user-facing behavior changes.
- By contributing, you agree that your contribution is licensed under MIT.

## Translations

Chinese/English documentation should stay in sync. UI strings are primarily
Chinese today; an English UI is a welcome future contribution.

## Code of conduct

Be respectful. Harassment, doxxing and malicious use of the remote-control
capabilities are not welcome.

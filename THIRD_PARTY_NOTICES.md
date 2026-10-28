# Third-party notices

This project contains or depends on the following third-party components.

| Component | Location | License |
| --- | --- | --- |
| DeepSeek Harness | external | See the DeepSeek Harness distribution |
| `@dsh-remote/plugin` 0.5.3 | `host/plugin/` | MIT |
| `@dsh-remote/protocol` 0.5.4 | `vendor/protocol/` | See `vendor/protocol/LICENSE` |
| TweetNaCl.js | `vendor/tweetnacl.js` | Public domain / MIT-style |
| `ws` (bundled inside `host/relay.mjs`) | `host/relay.mjs` | MIT |
| `qrcode` (bundled inside `host/qr.cjs`) | `host/qr.cjs` | MIT |
| ZXing core | Android dependency | Apache-2.0 |
| AndroidX / Gradle / AGP | build tooling | Apache-2.0 and respective licenses |

The vendored upstream packages retain their own license files where present.
If you redistribute a modified host bundle, keep the upstream notices and make
it clear that the patched copy is not an official upstream release.

The DSH Remoto project itself is MIT-licensed; see [LICENSE](LICENSE).

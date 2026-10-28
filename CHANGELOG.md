# Changelog

## 0.4.0 — 2026-10-28

### Added

- Self-hosted relay workflow: no public relay address is shipped.
- In-app **3.5 Self-hosted relay (VPS)** tutorial with Caddy/Node instructions
  and copyable prompts for DSH.
- Phone-side relay/LAN connection chooser; one address field per connection.
- Desktop **Configure relay address** button and empty `relay.txt` default.
- Author/contact in Settings and tutorial.
- Persistent patched-plugin link so installing other DSH plugins does not
  overwrite the image/artifact/permission patches.
- Cleaner approval cards: resolved/submitted cards no longer stay below new
  messages.

### Fixed

- Approval card placement in the chat timeline.
- Large artifact payloads no longer abort rendering on localStorage quota.
- File card layout: full-width **Save to phone** button.
- QR temporary image is deleted after two minutes or when the switcher closes.
- Phone QR scanner uses the system camera + ZXing core decode instead of a
  crashing CaptureActivity.
- Computer-to-phone images/files over both LAN and relay.
- Image prompt rejection caused by non-JSON DSH kernel events.

### Notes

- Host plugin is a patched `@dsh-remote/plugin 0.5.3`.
- The APK is test-signed; not production-signed.

## 0.3.10 and earlier

See the repository history. Earlier builds added the white mobile UI, Markdown
rendering, streaming, approvals/questions, LAN QR pairing, file transfer and
permission presets.

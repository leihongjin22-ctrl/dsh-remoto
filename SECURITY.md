# Security

DSH Remoto is an experimental remote-control client for DeepSeek Harness. It has
not been audited. Treat it as beta software.

## Reporting a vulnerability

Please email **3309219254@qq.com** with:

- affected version (APK / host package),
- platform and Android/Windows version,
- steps to reproduce,
- impact and any logs/screenshots.

Do not open a public issue for an unpatched vulnerability.

## Threat model

### Protected

- Prompt text, streamed replies, approvals, questions, images and files between
  the phone and the Windows host.
- The per-endpoint PSK installed after pairing.
- The relay cannot decrypt payloads.

### Visible to the relay

- Connection metadata: IP addresses, timing, frame sizes, host/client identifiers,
  and whether a channel is active.
- Traffic analysis is possible even though contents are encrypted.

### Trusted

- The Windows computer running DSH and the host plugin.
- The Android device after pairing.
- The relay server operator for availability (not confidentiality).

### Out of scope

- A compromised phone or PC.
- A malicious DSH plugin or a modified host package.
- Screenshots/notifications produced by the operating system.
- Denial of service against the relay.

## Pairing

- The 6-digit pair code is a short-lived capability. Do not share it publicly.
- The QR code only fills in the LAN address; it does not bypass the code or SAS.
- Always compare the 6-digit SAS on both screens before confirming.
- Per-endpoint PSKs are independent for relay and LAN.

## Cryptography

- X25519 for key agreement.
- XSalsa20-Poly1305 (TweetNaCl) for records.
- SAS derived from the pairing transcript.
- Persisted nonce counters on the client; nonce reuse is a bug worth reporting.

## Release signing

The published 0.4.0 APK is signed with a throwaway test key
(`CN=DSH Remoto Test`). The private keystore is **not** part of the public source
repository. Source builds use Gradle's local debug signing key. If you build a
release for other people, configure your own signing key and document it; do not
reuse the published test identity.

## Host plugin

The host package vendors a patched `@dsh-remote/plugin 0.5.3` under
`host/plugin`. The patch adds:

- an image-prompt path that avoids a non-JSON DSH kernel event,
- computer-to-phone artifact events,
- permission preset commands.

A DSH plugin reinstall can replace the linked copy. Run `run-update.bat` to
restore it.

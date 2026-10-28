# Architecture notes

## Components

- **Android shell** (`android/`): a minimal `Activity` + `WebView` with a
  JavaScript bridge for file picking, saving received artifacts, and QR capture
  via the system camera.
- **Web UI** (`web/`): vanilla HTML/CSS/JS. No framework, no remote assets.
- **Client core** (`src/`): transport-independent state machines for pairing,
  connection, framing, crypto, sessions, chat, hosts and storage.
- **Host plugin** (`host/plugin/`): patched `@dsh-remote/plugin 0.5.3`. Bridges
  protocol commands to DSH and forwards session events.
- **Relay** (`host/relay.mjs`): a self-contained Node WebSocket forwarder with
  optional JSON state persistence.

## Pairing sequence (simplified)

```text
phone                         relay                         host
  │  request pair code?          │                             │
  │─────────────────────────────▶│                             │
  │                             │◀──── host token / channel ───│
  │  pair-begin-client          │                             │
  │─────────────────────────────▶│──── pair-request ──────────▶│
  │                             │◀──── pair-grant ─────────────│
  │  derive X25519 + SAS        │                             │
  │  confirm SAS (user)         │                             │
  │  wrapped PSK                │                             │
  │─────────────────────────────▶│──── paired ────────────────▶│
  │                             │                             │
  │  encrypted command frames   │                             │
  │◀───────────────────────────▶│◀───────────────────────────▶│
```

The relay never receives the PSK or plaintext.

## Records

- AES/XSalsa-style secretbox record: `base64(nonce || box(JSON, nonce, key))`.
- KDF and SAS must match `vendor/protocol` byte-for-byte; the tests compare these
  against the vendored implementation.
- Nonce counters are persisted per install/channel to avoid reuse after a
  restart.

## Message flow

- Phone commands: `send_prompt`, `answer`, `resolve_permission`, `interrupt`,
  `list_sessions`, `keep_awake`, `session_history`, `new_session`,
  `get_pending`, `archive_session`.
- Host events: session changes, streaming deltas, tool calls, approvals,
  questions, run state, todo lists, retries, compaction, host info, model info,
  results and history pages.
- Artifacts: `deliverables/presented` from DSH is read on the host and forwarded
  as `ev.artifact` with base64 payload (≤512 KB), so the phone can display or
  save the file.

## Storage

- Phone: `localStorage` for hosts, endpoints, PSKs, cached sessions/history and
  settings. Export/import produces a JSON backup; treat it as secret.
- Host: `%USERPROFILE%\.dsh\dsh-remote-control\` for `user-config.json`,
  `relay.txt`, host id, patched plugin and optional state.
- Relay: `relay-state.json` next to `relay.mjs` unless `DRC_STATE_FILE` is set.

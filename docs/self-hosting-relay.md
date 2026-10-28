# Self-hosting the DSH Remoto relay

DSH Remoto does not ship with a public relay. You run a small Node.js WebSocket
server and put TLS in front of it. The phone and the Windows host both connect to
the same relay URL.

The relay only forwards encrypted frames. It does not need DSH, a database, or an
account system.

## 1. Requirements

- A Linux VPS with a public IP (a small 1 vCPU / 512 MB instance is enough).
- A domain or subdomain, e.g. `relay.example.com`.
- Node.js **20 or newer**.
- Caddy or Nginx for TLS. Examples below use Caddy because it obtains
  certificates automatically.

## 2. Copy the relay

From the host package (`DSH-remoto-host-0.4.0.zip`) copy `relay.mjs`:

```bash
sudo mkdir -p /opt/dsh-remote
sudo cp relay.mjs /opt/dsh-remote/relay.mjs
sudo useradd --system --home /opt/dsh-remote --shell /usr/sbin/nologin dsh-relay
sudo chown -R dsh-relay:dsh-relay /opt/dsh-remote
```

Do not expose `8787` to the internet. It should listen on localhost and be
proxied by Caddy.

## 3. Run it with systemd

`/etc/systemd/system/dsh-remoto-relay.service`:

```ini
[Unit]
Description=DSH Remoto relay
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=dsh-relay
WorkingDirectory=/opt/dsh-remote
Environment=DRC_PORT=8787
Environment=DRC_BIND=127.0.0.1
Environment=DRC_PUBLIC_URL=wss://relay.example.com
Environment=DRC_STATE_FILE=/opt/dsh-remote/relay-state.json
ExecStart=/usr/bin/node /opt/dsh-remote/relay.mjs
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now dsh-remoto-relay
curl http://127.0.0.1:8787/healthz
```

You should see a JSON response with `"ok":true`.

## 4. Put Caddy in front

`/etc/caddy/Caddyfile`:

```caddyfile
relay.example.com {
  reverse_proxy 127.0.0.1:8787
}
```

```bash
sudo systemctl reload caddy
curl https://relay.example.com/healthz
```

Open only **TCP 443** in the VPS firewall. Do not open 8787.

The resulting relay URL is:

```text
wss://relay.example.com/v05
```

`/v05` is the path convention used by the app. The relay accepts the WebSocket
upgrade; the reverse proxy must forward the path and the `Upgrade` headers
(Caddy does this by default).

## 5. Configure the Windows host

1. Open the desktop shortcut **DSH Remoto 连接模式**.
2. Click **配置中继地址**.
3. Enter `wss://relay.example.com/v05`.
4. Click **中继模式** and confirm. DSH restarts and the host claims a host token
   from the relay.
5. Open DSH and refresh the **Remote Control** pill to get a 6-digit pair code.

The host package starts with a blank relay address and defaults to LAN mode. The
address is stored in `relay.txt` in the host folder.

## 6. Configure the phone

1. Open DSH Remoto → **主机** → **添加主机**.
2. Connection type: **中继服务器**.
3. Relay address: `wss://relay.example.com/v05`.
4. Tap **配对**, enter the 6-digit code, compare the SAS.

The phone and PC must use exactly the same URL, including `wss://` and the path.

## Optional: a copyable prompt for DSH on the computer

You can ask DSH to configure the host side for you:

```text
请帮我把 DSH Remoto 配置成使用我自己的中继服务器：
中继地址：wss://relay.example.com/v05
不要重置现有配对和 user-config。
请把中继地址写入 DSH Remoto 主机目录的 relay.txt，然后运行一次 switch-to-relay.bat。
```

## Optional: a prompt to deploy the relay on a VPS

```text
请帮我在 VPS 上部署 DSH Remoto 中继：
把主机包里的 host/relay.mjs 上传到 /opt/dsh-remote/relay.mjs，
用 Node 20 监听 127.0.0.1:8787，用 Caddy 反代到 wss://relay.example.com，
开放 443；不要修改 DSH 本体。
```

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Host says relay offline | `curl https://relay.example.com/healthz`, systemd logs (`journalctl -u dsh-remoto-relay`), VPS firewall 443 |
| Phone cannot pair | Same URL on both sides, code not expired, clock roughly correct |
| TLS handshake fails | Domain DNS points to VPS, Caddy certificate obtained, no mixed `ws://` on an HTTPS relay |
| Works on Wi-Fi, not mobile data | Phone can reach the relay domain; try `curl` or a browser on the phone |
| LAN mode shows offline | Start LAN mode from the desktop shortcut; allow TCP 8787 in Windows Firewall |

## Security notes

- Keep `8787` bound to localhost.
- Use a real TLS certificate; do not disable certificate verification.
- The relay sees metadata, not message contents.
- Back up `relay-state.json` only if you need to preserve host tokens across
  rebuilds. It contains no plaintext prompts.
- Rotate/replace the relay if you suspect abuse; paired clients will need to
  re-pair after the host token changes.

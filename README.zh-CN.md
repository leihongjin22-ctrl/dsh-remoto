# DSH Remoto

### 把 DeepSeek Harness 装进手机——端到端加密、自托管、无需云账号。

[English](README.md) · [简体中文](README.zh-CN.md)

![platform](https://img.shields.io/badge/platform-Android%207%2B%20%7C%20Windows%2010%2F11-1f6feb)
![status](https://img.shields.io/badge/status-beta-orange)
![license](https://img.shields.io/badge/license-MIT-green)
![protocol](https://img.shields.io/badge/protocol-0.5.4%20%2F%20wire%201-6f42c1)

<a href="docs/screenshots/06-chat-streamed.png"><img src="docs/screenshots/06-chat-streamed.png" width="300" alt="聊天与流式输出" /></a>
<a href="docs/screenshots/07-chat-approval.png"><img src="docs/screenshots/07-chat-approval.png" width="300" alt="审批卡" /></a>
<a href="docs/screenshots/13-add-host-relay.png"><img src="docs/screenshots/13-add-host-relay.png" width="300" alt="中继或局域网" /></a>

DSH Remoto 是一个**独立的 Android 客户端 + Windows 主机服务**，用来远程操作
[DeepSeek Harness](https://github.com/deepseek-ai)。电脑继续跑 DSH，手机上可以看
会话、流式回复、审批、发图片/文件，以及切换电脑权限。

中继不是一个云账号，也不是 App 里写死的第三方服务。你可以在同一个 Wi-Fi 下用
本机局域网中继，也可以在自己的 VPS 上部署中继。中继只转发密文，正文在手机和
宿主插件之间端到端加密。

> **状态：内测 / 实验性。** APK 使用自签测试证书，宿主插件是打了本地补丁的
> `@dsh-remote/plugin 0.5.3`，项目没有经过安全审计。涉及敏感数据前请先阅读
> [安全模型](#安全模型)。

---

## 功能

| 模块 | 能力 |
| --- | --- |
| **连接** | 本地局域网（`ws://192.168.x.x:8787`）或你自己的中继（`wss://relay.example.com/v05`）。每台主机保存两套端点，各自独立 PSK。 |
| **配对** | 6 位配对码 + 两端必须一致的 6 位 SAS；局域网还支持扫码填地址。 |
| **会话** | 运行中 / 最近 / 已归档、相对时间、状态点、缓存优先的历史。 |
| **聊天** | 流式 Markdown、标题/列表/加粗/代码、多段消息、可折叠工具调用、待办、重试/压缩提示。 |
| **审批** | 内联卡片显示动作、资源、原因；「允许一次」「始终允许（本会话）」「拒绝」。手机和电脑都能处理，先点的算。 |
| **提问** | 多问题卡片，支持单选/多选和自由文本。 |
| **图片与文件** | 手机发压缩图片（合计 ≤512KB）和任意文件；电脑发来的图片/文件显示为卡片（单个 ≤512KB）。 |
| **权限** | 手机读取/切换电脑的 DSH 权限预设：只读 / 工作区内修改 / 完全权限。 |
| **体验** | 白色 ChatGPT 风格 UI、自动跳最新、思考计时、送达回执、连接配置导出/导入、防休眠。 |
| **主机工具** | 一键切中继/局域网、二维码、安装/更新/回滚、自检、防火墙提示、保留数据的升级。 |

### 它不是什么

- 不是 DeepSeek 官方产品，与 DeepSeek 没有隶属关系。
- 不是托管服务：没有账号、没有遥测后端、**没有内置公共中继地址**。
- 不是 DSH 的替代品，只是电脑上 DSH 的远程控制面板。

---

## 安全模型

- **配对**：X25519 密钥交换 + 两端显示的 6 位 SAS + 包裹 PSK。手机必须确认 SAS
  后才保存 PSK。6 位配对码是接入凭证；二维码只预填地址，**不会绕过配对码/SAS**。
- **传输**：中继只转发 WebSocket 帧，无法解密正文。记录使用
  XSalsa20-Poly1305 加密；nonce 使用持久化计数器，避免重启后复用。
- **信任边界**：中继能看到连接元数据（IP、时间、大小、主机/客户端标识）；电脑
  本身必须可信，因为它持有 DSH 会话和已配对的 PSK。
- **测试签名**：发布 APK 使用一次性测试证书 `CN=DSH Remoto Test`；仓库
  **不包含**对应私钥。源码构建使用 Gradle 本地 debug 签名；正式分发前请
  替换为你自己的 release 密钥。
- **实验性宿主补丁**：图片 prompt 修复、电脑→手机 artifact、权限命令都是在
  `@dsh-remote/plugin 0.5.3` 上的本地补丁。重装 DSH 插件可能恢复成上游版本；
  运行 `run-update.bat` 可以恢复链接的补丁副本。

安全问题请私下发到 **3309219254@qq.com**，不要开公开 issue。详见
[SECURITY.md](SECURITY.md)。

---

## 快速开始

### 1. 下载

| 文件 | SHA-256 |
| --- | --- |
| [DSH-remoto-0.4.0.apk](releases/0.4.0/DSH-remoto-0.4.0.apk) | `6c2e7e7f…52d153c20` |
| [DSH-remoto-host-0.4.0.zip](releases/0.4.0/DSH-remoto-host-0.4.0.zip) | `5e29412c…8a649bfc` |

完整校验和：[`releases/0.4.0/SHA256SUMS.txt`](releases/0.4.0/SHA256SUMS.txt)。

前置条件：

- Windows 10/11，已安装 DeepSeek Harness，并且至少启动过一次。
- Android 7.0+（API 24+），不需要 Google Play 服务。
- 局域网模式需要手机和电脑在同一个 Wi-Fi；中继模式需要手机和电脑都能上网。

### 2. 安装 Windows 主机

1. 完全退出 DSH，包括托盘图标；
2. 把 `DSH-remoto-host-0.4.0.zip` 解压到固定目录，不要只把 bat 拖出来；
3. 运行 `run-install.bat`，看到 `Install complete`；
4. 重新打开 DSH，底部会出现「远程控制」胶囊；
5. 桌面会出现「DSH Remoto 连接模式」快捷方式。

安装器会备份旧插件并保留 `user-config.json`、hostId 和局域网 token。补丁插件
放在 `%USERPROFILE%\.dsh\dsh-remote-control\plugin-patched`，通过 pnpm link
接入 DSH，所以安装其他 DSH 插件不会把它覆盖掉。

### 3. 局域网连接

1. 手机和电脑连同一个 Wi-Fi；
2. 桌面快捷方式 →「局域网模式」，DSH 会重启，本机中继监听 TCP 8787；
3. 复制窗口里的 `ws://192.168.x.x:8787`，或点「显示扫码二维码」；
4. 手机 →「主机」→「添加主机」→ 连接方式选「本地局域网」→ 粘贴地址/扫码；
5. 点「配对」，输入 DSH 胶囊里的 6 位码，核对 SAS 后确认。

Windows 防火墙放行 TCP 8787。访客 Wi-Fi / AP 隔离会阻断局域网模式。

### 4. 中继连接

0.4.0 起 App 和主机包都**不内置中继地址**。

1. 在 VPS 上部署 `host/relay.mjs`（Node 20），用 Caddy/Nginx 配 TLS；
2. 电脑桌面窗口 →「配置中继地址」→ 填 `wss://relay.example.com/v05` →
   点「中继模式」；
3. 手机 →「添加主机」→ 连接方式选「中继服务器」→ 填同一个 `wss://` 地址；
4. 用 6 位配对码 + SAS 完成配对。

完整教程（含可复制给 DSH 的指令）见
[docs/self-hosting-relay.md](docs/self-hosting-relay.md)。

### 5. 安装 Android App

用新版 APK 直接覆盖旧版，不要先卸载；versionCode 递增，主机/端点/PSK 会保留。
新手机直接安装即可。

第一次「添加主机」只能二选一：**本地局域网** 或 **中继服务器**。中继地址框
默认是空白的。

---

## 自建中继

中继是一个小型 Node.js WebSocket 服务，不需要 DSH 或数据库；状态默认保存在
`relay.mjs` 旁边。

```bash
# VPS 上
mkdir -p /opt/dsh-remote
# 把 host/relay.mjs 复制到 /opt/dsh-remote/relay.mjs
cd /opt/dsh-remote
DRC_PORT=8787 \
DRC_BIND=127.0.0.1 \
DRC_PUBLIC_URL=wss://relay.example.com \
node relay.mjs
```

Caddy（自动 HTTPS）：

```caddyfile
relay.example.com {
  reverse_proxy 127.0.0.1:8787
}
```

电脑和手机都填：

```text
wss://relay.example.com/v05
```

`/v05` 是 App 使用的约定路径；中继接受 WebSocket upgrade，反向代理要保留路径。
只开放 **443**，8787 只绑定本机。

更完整步骤：[docs/self-hosting-relay.md](docs/self-hosting-relay.md)。

---

## 架构

```text
┌─────────────────────┐        加密 WebSocket          ┌──────────────────────┐
│  Android WebView    │  ───────────────────────────▶  │  relay.mjs           │
│  ├─ web UI          │                                │  (VPS 或局域网)       │
│  ├─ src/client.js   │  ◀───────────────────────────  │  只转发密文           │
│  └─ src/codec.js    │                                └──────────┬───────────┘
└─────────────────────┘                                           │
                                                                  │ 加密 WebSocket
                                                                  ▼
                                                       ┌──────────────────────┐
                                                       │  DSH 宿主插件         │
                                                       │  @dsh-remote/plugin  │
                                                       │  + 本地补丁           │
                                                       └──────────┬───────────┘
                                                                  │ 进程内桥接
                                                                  ▼
                                                       ┌──────────────────────┐
                                                       │  DeepSeek Harness    │
                                                       │  会话 / 工具          │
                                                       └──────────────────────┘
```

手机不直接连接 DSH：先通过中继（公网或局域网）与宿主配对，再发
`send_prompt`、`resolve_permission`、`list_sessions`、`session_history` 等命令；
宿主插件把它们桥接到 DSH，并把事件流推回手机。

---

## 仓库结构

```text
.
├─ src/                  协议客户端、加密、状态机、模型
├─ web/                  原生 JS/CSS WebView UI（无框架）
├─ android/              Gradle Android 壳
├─ host/                 Windows 主机包：
│  ├─ install.ps1        备份 + 安装 + link 补丁插件
│  ├─ mode.ps1           中继/局域网切换、本机中继生命周期
│  ├─ switch-ui.ps1      桌面控制窗口
│  ├─ relay.mjs          可自托管中继
│  ├─ qr.cjs             二维码生成
│  └─ plugin/            打了补丁的 @dsh-remote/plugin 0.5.3
├─ vendor/               protocol 0.5.4 快照 + TweetNaCl
├─ tests/                node:test 单元/协议测试
├─ tools/                Web/APK/主机构建、CDP UI E2E、真实主机探针
├─ docs/                 中继教程、截图、架构说明
└─ releases/0.4.0/       预编译 APK、主机 zip、SHA256SUMS
```

---

## 从源码构建

### Web UI

```bash
npm install
npm run build:web          # 输出 dist/web
```

`tools/build-web.mjs` 使用本地 `esbuild` devDependency；如果存在旧的开发
checkout，也会回退到那份副本。

### Android APK

1. 安装 JDK 17 和 Android SDK 34；
2. 创建 `android/local.properties`，写入 `sdk.dir=...`；
3. 打包 Web UI 并复制进 App：
   ```bash
   npm run build:web
   # 复制 dist/web/* 到 android/app/src/main/assets/www/
   ```
4. 构建：
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

仓库不包含签名 keystore。`./gradlew assembleRelease` 使用 Gradle 本地
debug 签名；正式分发前请创建你自己的 release keystore。源码构建出的
debug 签名 APK 不能直接覆盖已发布的测试签名 APK，需要先卸载旧版。

`node tools/build-apk.mjs` 针对原始开发工作区路径（JDK/SDK/Gradle），新机器
建议直接用 Android Studio 或 Gradle。

### 主机 zip

```bash
# 需要 build/ 中已有 APK
node tools/build-host.mjs
```

### 测试

```bash
npm test                         # 协议/加密/控制器/模型测试
npm run test:ui                  # 真浏览器 + 假主机 + 截图
npm run test:host                # 中继/token/配对自检
npm run probe:host -- http://127.0.0.1:60141
                                 # 对真实 DSH 做配对/会话/历史探针
```

---

## 已知限制

- 目前宿主端只有 **Windows**；中继本身可以跑在 Linux。
- 只有 **Android** 客户端，没有 iOS。
- 单个附件上限 **512KB**；电脑→手机的图片/文件是实时显示，尚未持久化到
  手机端历史缓存。
- 宿主插件是 `@dsh-remote/plugin 0.5.3` 的**本地补丁副本**，不是上游正式
  版本。重装 DSH 插件可能覆盖它；运行 `run-update.bat` 恢复链接副本。
- 发布 APK 使用**自签测试证书**。
- 没有推送通知；App 回到前台时重连。
- 中继延迟取决于 VPS，建议选近的地区。

---

## 常见问题

**必须租服务器吗？**  
不用。同一个 Wi-Fi 下走局域网即可；只有手机和电脑不在同一网络时才需要中继。

**中继能看到我的 prompt 和文件吗？**  
不能。中继只转发加密记录，能看到连接元数据，无法解密正文、图片、文件或审批
内容。

**有默认公共中继吗？**  
没有。0.4.0 故意把中继地址留空，让每个用户选择和掌控自己的中继。

**能配其他 DSH 版本吗？**  
宿主插件锁定 `0.5.3` 加本地补丁。请先备份并在你的 DSH 版本上测试；需要时用
`rollback.ps1` 回滚。

**局域网显示电脑离线？**  
从桌面快捷方式点一次「局域网模式」，确认 8787 上的本机中继已启动；并在
Windows 防火墙中允许 Node/DSH 访问专用网络。

**数据在哪里？**  
主机配置：`%USERPROFILE%\.dsh\dsh-remote-control`。  
DSH profile：`%USERPROFILE%\.dsh\profiles\desktop`。  
中继状态默认在 `relay.mjs` 旁边（或 `DRC_STATE_FILE`）。

---

## 参与贡献

欢迎 issue 和 PR，请先读 [CONTRIBUTING.md](CONTRIBUTING.md)。安全问题请发
**3309219254@qq.com**，不要开公开 issue。

## 作者

**呆瓜的呆瓜** · [3309219254@qq.com](mailto:3309219254@qq.com)

## 许可证

MIT，见 [LICENSE](LICENSE)。第三方组件及许可证见
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

DeepSeek Harness 和上游 remote 插件是独立项目；本仓库是独立社区客户端，
不代表 DeepSeek 官方立场。

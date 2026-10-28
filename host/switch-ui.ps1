param(
  [string]$ProfilePath = "$env:USERPROFILE\.dsh\profiles\desktop",
  [string]$DataDir = ''
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $DataDir) { $DataDir = Join-Path $env:USERPROFILE '.dsh\dsh-remote-control' }
$userConfigPath = Join-Path $DataDir 'user-config.json'
$statusPath = Join-Path $DataDir 'status.json'
$patchPath = Join-Path $ProfilePath 'cordis.patch.yml'
$relayFile = Join-Path $root 'relay.txt'
$port = 8787

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
try {
  Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class DshConsole {
  [DllImport("kernel32.dll")] public static extern IntPtr GetConsoleWindow();
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@
  $console = [DshConsole]::GetConsoleWindow()
  if ($console -ne [IntPtr]::Zero) { [void][DshConsole]::ShowWindow($console, 0) }
} catch {}

function Read-Text([string]$path) {
  if (-not (Test-Path $path)) { return '' }
  $value = [string](Get-Content $path -Raw -Encoding UTF8)
  if ($null -eq $value) { return '' }
  return $value.Trim()
}

function Get-ConfigServerUrl {
  try {
    if (Test-Path $userConfigPath) {
      $cfg = Get-Content $userConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json
      if ($cfg.serverUrl) { return [string]$cfg.serverUrl }
    }
  } catch {}
  $patchUrl = ''
  if (Test-Path $patchPath) {
    $match = [regex]::Match((Get-Content $patchPath -Raw -Encoding UTF8), 'serverUrl:\s*"([^"]+)"')
    if ($match.Success) { $patchUrl = $match.Groups[1].Value }
  }
  if ($patchUrl) { return $patchUrl }
  return (Read-Text $relayFile)
}

function Get-LanIps {
  $ips = @()
  try {
    $ips = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
      Where-Object {
        $_.IPAddress -notlike '127.*' -and
        $_.IPAddress -notlike '169.254.*' -and
        $_.InterfaceAlias -notlike '*Loopback*'
      } |
      Select-Object -ExpandProperty IPAddress
  } catch {}
  if (-not $ips) {
    try {
      $ips = ipconfig | Select-String -Pattern 'IPv4' | ForEach-Object { ($_.Line -split ':')[-1].Trim() } |
        Where-Object { $_ -notlike '127.*' -and $_ -notlike '169.254.*' }
    } catch {}
  }
  return @($ips)
}

function Test-RelayHealth([string]$url) {
  if (-not $url) { return $false }
  try {
    if ($url -match '^ws://(127\.0\.0\.1|localhost)') {
      $health = 'http://127.0.0.1:' + $port + '/healthz'
      return (Invoke-WebRequest -UseBasicParsing -TimeoutSec 3 $health).StatusCode -eq 200
    }
    $health = ($url -replace '^ws', 'http').TrimEnd('/') + '/healthz'
    return (Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 $health).StatusCode -eq 200
  } catch {
    return $false
  }
}

function Get-StatusField([string]$name) {
  if (-not (Test-Path $statusPath)) { return '' }
  try {
    $raw = Get-Content $statusPath -Raw -Encoding UTF8
    $match = [regex]::Match($raw, '"' + [regex]::Escape($name) + '":\s*"?([^",\r\n]+)"?')
    if ($match.Success) { return $match.Groups[1].Value.Trim() }
  } catch {}
  return ''
}

function Get-PluginVersion {
  $pkg = Join-Path $ProfilePath 'node_modules\@dsh-remote\plugin\package.json'
  if (-not (Test-Path $pkg)) { return '未安装' }
  try { return (Get-Content $pkg -Raw -Encoding UTF8 | ConvertFrom-Json).version } catch { return '未知' }
}

function Find-DshExe {
  foreach ($candidate in @('E:\deepseek\DeepSeek Harness.exe', 'E:\deepseek\deepseek.exe', "$env:LOCALAPPDATA\Programs\deepseek\DeepSeek Harness.exe")) {
    if (Test-Path $candidate) { return $candidate }
  }
  $proc = Get-Process -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -like '*DeepSeek Harness*' -or $_.ProcessName -in @('DSH', 'dsh', 'deepseek')
  } | Select-Object -First 1
  if ($proc) {
    try { return $proc.Path } catch {}
  }
  return ''
}

function Find-Node {
  $cmd = Get-Command node.exe -ErrorAction SilentlyContinue
  if ($cmd -and $cmd.Source) { return $cmd.Source }
  $candidates = Get-ChildItem "$env:USERPROFILE\.dsh\dsh-runtimes" -Recurse -Filter node.exe -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($candidates) { return $candidates.FullName }
  foreach ($candidate in @("$env:ProgramFiles\nodejs\node.exe", "$env:LOCALAPPDATA\Programs\nodejs\node.exe")) {
    if (Test-Path $candidate) { return $candidate }
  }
  return ''
}

function Test-DshRunning {
  return [bool](Get-Process -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -like '*DeepSeek Harness*' -or $_.ProcessName -in @('DSH', 'dsh', 'deepseek')
  })
}

function Invoke-Mode([string]$mode) {
  $exe = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
  $arguments = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $root 'mode.ps1'), '-Mode', $mode, '-Restart')
  Start-Process -FilePath $exe -ArgumentList $arguments -WorkingDirectory $root -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $root 'switch-ui.log') -RedirectStandardError (Join-Path $root 'switch-ui.log.err') | Out-Null
}

# ------------------------------------------------------------------ layout
$form = New-Object System.Windows.Forms.Form
$form.Text = 'DSH Remoto 连接模式'
$form.ClientSize = New-Object System.Drawing.Size(430, 400)
$form.StartPosition = 'CenterScreen'
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
$form.MinimizeBox = $false
$form.BackColor = [System.Drawing.Color]::FromArgb(11, 13, 16)
$form.ForeColor = [System.Drawing.Color]::FromArgb(230, 237, 243)
$form.Font = New-Object System.Drawing.Font('Microsoft YaHei UI', 9)
try { $form.Icon = [System.Drawing.SystemIcons]::Application } catch {}

$title = New-Object System.Windows.Forms.Label
$title.Text = '连接模式'
$title.Font = New-Object System.Drawing.Font('Microsoft YaHei UI', 16, [System.Drawing.FontStyle]::Bold)
$title.SetBounds(22, 16, 380, 34)
$form.Controls.Add($title)

$modeLabel = New-Object System.Windows.Forms.Label
$modeLabel.SetBounds(22, 54, 386, 24)
$modeLabel.ForeColor = [System.Drawing.Color]::FromArgb(139, 152, 165)
$form.Controls.Add($modeLabel)

$relayLabel = New-Object System.Windows.Forms.Label
$relayLabel.SetBounds(22, 78, 386, 22)
$relayLabel.ForeColor = [System.Drawing.Color]::FromArgb(139, 152, 165)
$form.Controls.Add($relayLabel)

$lanLabel = New-Object System.Windows.Forms.Label
$lanLabel.SetBounds(22, 102, 386, 44)
$lanLabel.ForeColor = [System.Drawing.Color]::FromArgb(77, 163, 255)
$form.Controls.Add($lanLabel)

$pluginLabel = New-Object System.Windows.Forms.Label
$pluginLabel.SetBounds(22, 150, 386, 22)
$pluginLabel.ForeColor = [System.Drawing.Color]::FromArgb(95, 107, 120)
$form.Controls.Add($pluginLabel)

function New-ModeButton($text, $x, $y, $width, $primary) {
  $button = New-Object System.Windows.Forms.Button
  $button.Text = $text
  $button.SetBounds($x, $y, $width, 46)
  $button.FlatStyle = 'Flat'
  $button.FlatAppearance.BorderSize = 1
  if ($primary) {
    $button.BackColor = [System.Drawing.Color]::FromArgb(77, 163, 255)
    $button.ForeColor = [System.Drawing.Color]::FromArgb(6, 17, 31)
    $button.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(77, 163, 255)
  } else {
    $button.BackColor = [System.Drawing.Color]::FromArgb(26, 31, 38)
    $button.ForeColor = [System.Drawing.Color]::FromArgb(230, 237, 243)
    $button.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(37, 45, 55)
  }
  return $button
}

$relayButton = New-ModeButton '中继模式' 22 184 190 $false
$lanButton = New-ModeButton '局域网模式' 220 184 188 $true
$form.Controls.Add($relayButton)
$form.Controls.Add($lanButton)

$refreshButton = New-ModeButton '刷新状态' 22 244 120 $false
$copyButton = New-ModeButton '复制手机地址' 150 244 140 $false
$openButton = New-ModeButton '打开 DSH' 298 244 110 $false
$qrButton = New-ModeButton '显示扫码二维码' 22 286 190 $false
$relayConfigButton = New-ModeButton '配置中继地址' 220 286 188 $false
$form.Controls.Add($refreshButton)
$form.Controls.Add($copyButton)
$form.Controls.Add($openButton)
$form.Controls.Add($qrButton)
$form.Controls.Add($relayConfigButton)

$hint = New-Object System.Windows.Forms.Label
$hint.SetBounds(22, 342, 386, 46)
$hint.ForeColor = [System.Drawing.Color]::FromArgb(95, 107, 120)
$hint.Text = '切换模式会重启 DSH（当前对话会中断）。中继模式前先点「配置中继地址」填自己的 wss 地址；局域网可点「显示扫码二维码」。'
$form.Controls.Add($hint)

$script:currentUrl = ''
$script:currentIps = @()
$script:preferredIp = ''

function Refresh-Status {
  $url = Get-ConfigServerUrl
  $script:currentUrl = $url
  $script:currentIps = @(Get-LanIps)
  $script:preferredIp = ''
  # Prefer the interface the phone is actually connected to (established 8787),
  # then the default-route interface, then the first IPv4 address.
  try {
    $conn = Get-NetTCPConnection -LocalPort $port -State Established -ErrorAction SilentlyContinue |
      Where-Object { $_.LocalAddress -notlike '127.*' } | Select-Object -First 1
    if ($conn) { $script:preferredIp = $conn.LocalAddress }
  } catch {}
  if (-not $script:preferredIp) {
    try {
      $route = Get-NetRoute -DestinationPrefix '0.0.0.0/0' -ErrorAction SilentlyContinue |
        Sort-Object RouteMetric | Select-Object -First 1
      if ($route) {
        $addr = Get-NetIPAddress -InterfaceIndex $route.InterfaceIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue |
          Select-Object -First 1
        if ($addr) { $script:preferredIp = $addr.IPAddress }
      }
    } catch {}
  }
  if (-not $script:preferredIp -and $script:currentIps.Count -gt 0) { $script:preferredIp = $script:currentIps[0] }
  $isLan = $url -match '127\.0\.0\.1|localhost'
  $modeLabel.Text = $(if ($isLan) { '当前模式：局域网（本机中继）' } else { '当前模式：中继（远程）' })
  $modeLabel.ForeColor = $(if ($isLan) { [System.Drawing.Color]::FromArgb(61, 220, 151) } else { [System.Drawing.Color]::FromArgb(77, 163, 255) })
  $relayLabel.Text = '地址：' + $(if ($url) { $url } else { '未配置' })
  if ($isLan) {
    if ($script:currentIps.Count -gt 0) {
      $primary = "ws://$($script:preferredIp):$port"
      $others = @($script:currentIps | Where-Object { $_ -ne $script:preferredIp } | ForEach-Object { "ws://$($_):$port" })
      $text = "手机填写：$primary（手机用这个）"
      if ($others.Count -gt 0) { $text += "`n其他网卡（可能不通）：" + ($others -join '    ') }
      $lanLabel.Text = $text
    } else {
      $lanLabel.Text = '没有找到局域网 IPv4 地址'
    }
  } else {
    $lanLabel.Text = '切换局域网后会在这里显示手机可填写的 ws:// 地址'
  }
  $pluginLabel.Text = '插件版本：' + (Get-PluginVersion) + '    中继状态：' + (Get-StatusField 'relay') + '    已配对：' + (Get-StatusField 'pairedClients')
  $copyButton.Enabled = $isLan -and $script:preferredIp
  $qrButton.Enabled = $isLan -and $script:preferredIp
  $openButton.Enabled = -not (Test-DshRunning)
}

$refreshButton.Add_Click({ Refresh-Status })
$copyButton.Add_Click({
  if (-not $script:preferredIp) { return }
  $text = "ws://$($script:preferredIp):$port"
  [System.Windows.Forms.Clipboard]::SetText($text)
  [System.Windows.Forms.MessageBox]::Show('已复制：' + $text, 'DSH Remoto') | Out-Null
})
$qrButton.Add_Click({
  if ($script:currentUrl -notmatch '127\.0\.0\.1|localhost') {
    [System.Windows.Forms.MessageBox]::Show('请先切换到局域网模式，再生成扫码二维码。', 'DSH Remoto', 'OK', 'Information') | Out-Null
    return
  }
  if (-not $script:preferredIp) {
    [System.Windows.Forms.MessageBox]::Show('没有找到可用的局域网 IP。', 'DSH Remoto', 'OK', 'Warning') | Out-Null
    return
  }
  $node = Find-Node
  if (-not $node) {
    [System.Windows.Forms.MessageBox]::Show('找不到 Node.js，无法生成二维码。请先用「复制手机地址」手动填写。', 'DSH Remoto', 'OK', 'Warning') | Out-Null
    return
  }
  $qrFile = Join-Path $env:TEMP 'dsh-remoto-lan-qr.png'
  $deep = 'dshremote://lan?url=' + [uri]::EscapeDataString("ws://$($script:preferredIp):$port")
  try {
    Remove-Item $qrFile -Force -ErrorAction SilentlyContinue
    $process = Start-Process -FilePath $node -ArgumentList @((Join-Path $root 'qr.cjs'), $qrFile, $deep) -WorkingDirectory $root -WindowStyle Hidden -Wait -PassThru
    if ($process.ExitCode -ne 0 -or -not (Test-Path $qrFile)) { throw '二维码生成失败' }
    Start-Process -FilePath $qrFile
    if ($script:qrCleanupTimer) { $script:qrCleanupTimer.Stop() }
    $script:qrCleanupTimer = New-Object System.Windows.Forms.Timer
    $script:qrCleanupTimer.Interval = 120000
    $script:qrCleanupTimer.Add_Tick({
      Remove-Item (Join-Path $env:TEMP 'dsh-remoto-lan-qr.png') -Force -ErrorAction SilentlyContinue
      $script:qrCleanupTimer.Stop()
    })
    $script:qrCleanupTimer.Start()
  } catch {
    [System.Windows.Forms.MessageBox]::Show('二维码生成失败：' + $_.Exception.Message, 'DSH Remoto', 'OK', 'Error') | Out-Null
  }
})
$relayConfigButton.Add_Click({
  Add-Type -AssemblyName Microsoft.VisualBasic
  $current = Get-ConfigServerUrl
  if ($current -match '127\.0\.0\.1|localhost|^ws://192\.|^ws://10\.') { $current = '' }
  $value = [Microsoft.VisualBasic.Interaction]::InputBox(
    '输入你自己的中继服务器地址（wss://你的域名/v05）。中继服务器部署方法见 App 教程。',
    '配置中继服务器',
    $current
  )
  if ($null -eq $value) { return }
  $value = $value.Trim()
  if (-not $value) { return }
  if ($value -notmatch '^wss?://') {
    [System.Windows.Forms.MessageBox]::Show('地址要以 wss:// 或 ws:// 开头。', 'DSH Remoto', 'OK', 'Warning') | Out-Null
    return
  }
  [System.IO.File]::WriteAllText($relayFile, $value, (New-Object System.Text.UTF8Encoding($false)))
  [System.Windows.Forms.MessageBox]::Show("已保存中继地址：$value`n`n点「中继模式」后生效。", 'DSH Remoto', 'OK', 'Information') | Out-Null
  Refresh-Status
})
$openButton.Add_Click({
  $exe = Find-DshExe
  if (-not $exe) {
    [System.Windows.Forms.MessageBox]::Show('找不到 DSH 可执行文件，请手动打开。', 'DSH Remoto', 'OK', 'Warning') | Out-Null
    return
  }
  Start-Process -FilePath $exe
  Start-Sleep -Seconds 2
  Refresh-Status
})

$relayButton.Add_Click({
  $relayValue = ''
  if (Test-Path $relayFile) { $relayValue = ([string](Get-Content $relayFile -Raw)).Trim() }
  if (-not $relayValue) {
    $currentRelay = Get-ConfigServerUrl
    if ($currentRelay -and $currentRelay -notmatch '127\.0\.0\.1|localhost|^ws://192\.|^ws://10\.') { $relayValue = $currentRelay }
  }
  if (-not $relayValue) {
    [System.Windows.Forms.MessageBox]::Show('还没有配置中继地址。请先点「配置中继地址」填入你自己的 wss:// 地址。', 'DSH Remoto', 'OK', 'Warning') | Out-Null
    return
  }
  $answer = [System.Windows.Forms.MessageBox]::Show('切换到中继模式会重启 DSH，当前对话会中断。继续？', 'DSH Remoto', 'YesNo', 'Question')
  if ($answer -ne 'Yes') { return }
  Invoke-Mode 'relay'
  $modeLabel.Text = '正在切换到中继模式，DSH 会重启…'
  $modeLabel.ForeColor = [System.Drawing.Color]::FromArgb(255, 180, 84)
})
$lanButton.Add_Click({
  $answer = [System.Windows.Forms.MessageBox]::Show('切换到局域网模式会启动本机中继并重启 DSH，当前对话会中断。继续？', 'DSH Remoto', 'YesNo', 'Question')
  if ($answer -ne 'Yes') { return }
  Invoke-Mode 'lan'
  $modeLabel.Text = '正在切换到局域网模式，DSH 会重启…'
  $modeLabel.ForeColor = [System.Drawing.Color]::FromArgb(255, 180, 84)
})

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 5000
$timer.Add_Tick({ Refresh-Status })
$timer.Start()

$form.Add_FormClosed({
  if ($script:qrCleanupTimer) { $script:qrCleanupTimer.Stop() }
  Remove-Item (Join-Path $env:TEMP 'dsh-remoto-lan-qr.png') -Force -ErrorAction SilentlyContinue
  Remove-Item (Join-Path $root 'lan-qr.png') -Force -ErrorAction SilentlyContinue
})

Refresh-Status
[void]$form.ShowDialog()

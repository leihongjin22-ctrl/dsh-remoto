param(
  [ValidateSet('status', 'relay', 'lan')]
  [string]$Mode = 'status',
  [switch]$Restart,
  [switch]$OpenFirewall,
  [switch]$KeepToken,
  [string]$ProfilePath = "$env:USERPROFILE\.dsh\profiles\desktop",
  [string]$DataDir = ''
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$relayScript = Join-Path $root 'relay.mjs'
$relayFile = Join-Path $root 'relay.txt'
$tokenFile = Join-Path $root 'token.txt'
$pidFile = Join-Path $root 'relay.pid'
$logFile = Join-Path $root 'relay.log'
$stateFile = Join-Path $root 'relay-state.json'
if (-not $DataDir) { $DataDir = Join-Path $env:USERPROFILE '.dsh\dsh-remote-control' }
$dataDir = $DataDir
$userConfigPath = Join-Path $dataDir 'user-config.json'
$statusPath = Join-Path $dataDir 'status.json'
$patchPath = Join-Path $ProfilePath 'cordis.patch.yml'
$port = 8787

function Say($text, $color = 'Gray') { Write-Host $text -ForegroundColor $color }
function Step($text) { Write-Host "[*] $text" -ForegroundColor Cyan }
function Ok($text) { Write-Host "[+] $text" -ForegroundColor Green }
function Warn($text) { Write-Host "[!] $text" -ForegroundColor Yellow }

function Read-Config {
  if (-not (Test-Path $userConfigPath)) { return [ordered]@{} }
  try {
    $value = Get-Content $userConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $cfg = [ordered]@{}
    foreach ($property in $value.PSObject.Properties) { $cfg[$property.Name] = $property.Value }
    return $cfg
  } catch {
    return [ordered]@{}
  }
}

function Write-Config($cfg) {
  New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
  $json = $cfg | ConvertTo-Json -Depth 10
  [System.IO.File]::WriteAllText($userConfigPath, $json, (New-Object System.Text.UTF8Encoding($false)))
}

function Update-Patch([string]$serverUrl, [switch]$ClearToken) {
  if (-not (Test-Path $patchPath)) { return }
  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  Copy-Item $patchPath "$patchPath.bak-$stamp" -Force
  $text = Get-Content $patchPath -Raw -Encoding UTF8
  $text = [regex]::Replace($text, 'serverUrl:\s*"[^"]*"', "serverUrl: `"$serverUrl`"", 1)
  if ($ClearToken) {
    $text = [regex]::Replace($text, '(?m)^\s*hostToken:.*\r?\n', '')
  }
  [System.IO.File]::WriteAllText($patchPath, $text, (New-Object System.Text.UTF8Encoding($false)))
  Ok "Profile patch updated (backup: $patchPath.bak-$stamp)"
}

function Find-Node {
  $cmd = Get-Command node.exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $found = Get-ChildItem (Join-Path $env:USERPROFILE '.dsh\dsh-runtimes') -Recurse -Filter 'node.exe' -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($found) { return $found.FullName }
  foreach ($candidate in @('C:\Program Files\nodejs\node.exe', 'C:\Program Files (x86)\nodejs\node.exe')) {
    if (Test-Path $candidate) { return $candidate }
  }
  throw 'node.exe not found. Start DSH once, then run this again.'
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
      $ips = ipconfig | Select-String -Pattern 'IPv4' | ForEach-Object {
        ($_.Line -split ':')[-1].Trim()
      } | Where-Object { $_ -notlike '127.*' -and $_ -notlike '169.254.*' }
    } catch {}
  }
  return @($ips)
}

function Test-RelayHealth([int]$port) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -TimeoutSec 4 "http://127.0.0.1:$port/healthz"
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

function Stop-LanRelay {
  if (Test-Path $pidFile) {
    $old = (Get-Content $pidFile -Raw).Trim()
    if ($old) {
      $process = Get-Process -Id ([int]$old) -ErrorAction SilentlyContinue
      if ($process) {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        Ok "Local relay stopped (pid $($process.Id))"
      }
    }
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
  }
}

function Read-TokenFile {
  if (-not (Test-Path $tokenFile)) { return '' }
  $value = [string](Get-Content $tokenFile -Raw)
  if ($null -eq $value) { return '' }
  return $value.Trim()
}

function Get-OrCreateLanToken {
  $token = Read-TokenFile
  if ($token) { return $token }
  # Upgrade path: a new package folder has an empty token.txt, but the old LAN
  # pairing token is still in user-config. Reuse it so the phone keeps working.
  try {
    $cfg = Read-Config
    if ($cfg['hostToken'] -match '^[0-9a-f]{48}$') {
      $token = $cfg['hostToken']
      [System.IO.File]::WriteAllText($tokenFile, $token, (New-Object System.Text.UTF8Encoding($false)))
      Ok 'Restored the local relay token from user-config.json'
      return $token
    }
  } catch {}
  $bytes = New-Object byte[] 24
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  $token = ($bytes | ForEach-Object { $_.ToString('x2') }) -join ''
  [System.IO.File]::WriteAllText($tokenFile, $token, (New-Object System.Text.UTF8Encoding($false)))
  Ok 'Generated a new local relay token (token.txt)'
  return $token
}

function Start-LanRelay {
  if (Test-RelayHealth $port) {
    Ok "Local relay already running on port $port"
    return
  }
  Stop-LanRelay
  $token = Get-OrCreateLanToken
  $node = Find-Node
  $lanIps = Get-LanIps
  $lanIp = if ($lanIps.Count -gt 0) { $lanIps[0] } else { '127.0.0.1' }
  $env:DRC_PORT = "$port"
  $env:DRC_BIND = '0.0.0.0'
  $env:DRC_HOST_TOKEN = $token
  $env:DRC_STATE_FILE = $stateFile
  $env:DRC_PUBLIC_URL = "ws://$lanIp`:$port"
  $env:DRC_LOG_LEVEL = 'info'
  $process = Start-Process -FilePath $node -ArgumentList "`"$relayScript`"" `
    -WorkingDirectory $root -WindowStyle Hidden `
    -RedirectStandardOutput $logFile -RedirectStandardError "$logFile.err" -PassThru
  Set-Content -Path $pidFile -Value $process.Id
  for ($i = 0; $i -lt 20; $i += 1) {
    Start-Sleep -Milliseconds 500
    if (Test-RelayHealth $port) {
      Ok "Local relay started (pid $($process.Id), port $port, bind 0.0.0.0)"
      return
    }
  }
  Warn "Local relay did not answer on port $port. See $logFile and $logFile.err"
}

function Open-FirewallRule {
  try {
    netsh advfirewall firewall add rule name="DSH Remoto LAN 8787" dir=in action=allow protocol=TCP localport=8787 | Out-Null
    Ok 'Windows Firewall rule added for TCP 8787'
  } catch {
    Warn 'Could not add a firewall rule (needs an elevated prompt). Run this as administrator, or allow node.exe on the private network when Windows asks.'
  }
}

function Restart-Dsh {
  $process = Get-Process -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -like '*DeepSeek Harness*' -or $_.ProcessName -in @('DSH', 'dsh', 'deepseek')
  } | Select-Object -First 1
  $exe = $null
  if ($process) {
    try { $exe = $process.Path } catch {}
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
  }
  if (-not $exe) {
    foreach ($candidate in @('E:\deepseek\deepseek.exe', "$env:LOCALAPPDATA\Programs\deepseek\deepseek.exe")) {
      if (Test-Path $candidate) { $exe = $candidate; break }
    }
  }
  if (-not $exe) {
    Warn 'DSH executable not found. Start DSH manually.'
    return
  }
  Start-Process -FilePath $exe
  Ok 'DSH restarted'
}

function Read-StatusField($name) {
  if (-not (Test-Path $statusPath)) { return '' }
  try {
    $raw = Get-Content $statusPath -Raw -Encoding UTF8
    $match = [regex]::Match($raw, '"' + [regex]::Escape($name) + '":\s*"?([^",\r\n]+)"?')
    if ($match.Success) { return $match.Groups[1].Value.Trim() }
  } catch {}
  return ''
}

function Show-Status {
  Say 'DSH Remoto host status' 'White'
  $cfg = Read-Config
  $serverUrl = $cfg['serverUrl']
  if (-not $serverUrl -and (Test-Path $relayFile)) {
    $rawRelay = [string](Get-Content $relayFile -Raw)
    if ($null -ne $rawRelay) { $serverUrl = $rawRelay.Trim() }
  }
  if (-not $serverUrl -and (Test-Path $patchPath)) {
    $match = [regex]::Match((Get-Content $patchPath -Raw -Encoding UTF8), 'serverUrl:\s*"([^"]+)"')
    if ($match.Success) { $serverUrl = $match.Groups[1].Value }
  }
  $mode = if ($serverUrl -match '127\.0\.0\.1|localhost') { 'LAN (local relay)' } else { 'Relay (remote)' }
  Say "mode          : $mode"
  Say "server url    : $serverUrl"
  $token = $cfg['hostToken']
  if (-not $token) {
    $storedTokenPath = Join-Path $dataDir 'host-token.json'
    if (Test-Path $storedTokenPath) {
      try {
        $stored = Get-Content $storedTokenPath -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($stored.serverUrl -eq $serverUrl) { $token = $stored.token }
      } catch {}
    }
  }
  Say "host token    : $(if ($token) { $token.Substring(0, [Math]::Min(8, $token.Length)) + '...' } else { 'not set for this relay (auto-claim on first connect)' })"
  Say "host id       : $(Read-StatusField 'hostId')"
  $runningRelay = Read-StatusField 'serverUrl'
  if ($runningRelay -and $runningRelay -ne $serverUrl) {
    Warn "DSH is still connected to $runningRelay. Restart DSH after switching modes."
  }
  Say "relay state   : $(Read-StatusField 'relay')"
  Say "paired clients: $(Read-StatusField 'pairedClients')  pending pairs: $(Read-StatusField 'pendingPairs')"
  $pluginPkg = Join-Path $ProfilePath 'node_modules\@dsh-remote\plugin\package.json'
  if (Test-Path $pluginPkg) {
    try { Say "plugin version: $((Get-Content $pluginPkg -Raw -Encoding UTF8 | ConvertFrom-Json).version)" } catch {}
  }
  if ($mode -like 'LAN*') {
    $healthy = Test-RelayHealth $port
    Say "local relay   : $(if ($healthy) { 'listening on port ' + $port } else { 'not running' })"
    Say 'phone address :'
    foreach ($ip in Get-LanIps) { Say "  ws://$ip`:$port" }
    if (-not $healthy) { Warn 'Local relay is not running. Run switch-to-lan.bat.' }
  } else {
    try {
      $parse = [uri]$serverUrl
      $healthUrl = ($serverUrl -replace '^ws', 'http').TrimEnd('/') + '/healthz'
      $health = Invoke-WebRequest -UseBasicParsing -TimeoutSec 6 $healthUrl
      $body = $health.Content | ConvertFrom-Json
      Say "relay health  : ok, version $($body.version), hosts $($body.hosts)"
    } catch {
      Warn "Relay health check failed: $($_.Exception.Message)"
    }
  }
  Say ''
  Say 'Commands: switch-to-relay.bat | switch-to-lan.bat | status.bat | run-selftest.bat'
}

Step "mode: $Mode"

if ($Mode -eq 'status') {
  Show-Status
  exit 0
}

if ($Mode -eq 'relay') {
  Stop-LanRelay
  $relayUrl = [string](Get-Content $relayFile -Raw)
  if ($null -eq $relayUrl) { $relayUrl = '' } else { $relayUrl = $relayUrl.Trim() }
  if (-not $relayUrl) { throw 'relay.txt is empty' }
  $cfg = Read-Config
  $cfg['serverUrl'] = $relayUrl
  if (-not $KeepToken) {
    if ($cfg.Contains('hostToken')) { $cfg.Remove('hostToken') }
  }
  Write-Config $cfg
  Update-Patch $relayUrl -ClearToken:(!$KeepToken)
  Ok "Relay mode configured: $relayUrl"
  if (-not $KeepToken) {
    Say 'The old host token was cleared so the plugin can claim a token for this relay.'
    Say 'Pairings made against the previous relay will no longer work.'
  }
  if ($Restart) { Restart-Dsh } else { Warn 'Quit DSH completely and start it again for the change to take effect.' }
  exit 0
}

if ($Mode -eq 'lan') {
  Start-LanRelay
  if ($OpenFirewall) { Open-FirewallRule }
  $token = Read-TokenFile
  $lanUrl = "ws://127.0.0.1:$port"
  $cfg = Read-Config
  $cfg['serverUrl'] = $lanUrl
  $cfg['hostToken'] = $token
  Write-Config $cfg
  Update-Patch $lanUrl -ClearToken
  Ok "LAN mode configured: $lanUrl"
  Say ''
  Say 'Phone address (same Wi-Fi, enter the IP in the app):' 'White'
  foreach ($ip in Get-LanIps) { Say "  ws://$ip`:$port" }
  Say ''
  if ($Restart) { Restart-Dsh } else { Warn 'Quit DSH completely and start it again for the change to take effect.' }
  Say 'If the phone cannot connect: allow node.exe on the private network, or run this script as administrator with -OpenFirewall.'
  exit 0
}

param(
  [string]$ProfilePath = "$env:USERPROFILE\.dsh\profiles\desktop",
  [string]$DataDir = '',
  [switch]$DryRun,
  [switch]$Force,
  [switch]$KeepConfig,
  [switch]$ResetConfig
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$pluginSrc = Join-Path $root 'plugin'
$relayUrl = ''
$relayPath = Join-Path $root 'relay.txt'
if (Test-Path $relayPath) { $relayUrl = [string](Get-Content $relayPath -Raw); if ($null -eq $relayUrl) { $relayUrl = '' } else { $relayUrl = $relayUrl.Trim() } }
$token = ''
$tokenPath = Join-Path $root 'token.txt'
if (Test-Path $tokenPath) { $token = [string](Get-Content $tokenPath -Raw); if ($null -eq $token) { $token = '' } else { $token = $token.Trim() } }
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
if (-not $DataDir) { $DataDir = Join-Path $env:USERPROFILE '.dsh\dsh-remote-control' }
$dataDir = $DataDir
$userConfigPath = Join-Path $dataDir 'user-config.json'
$backupDir = Join-Path $root "backup-$stamp"
$pluginDst = Join-Path $ProfilePath 'node_modules\@dsh-remote\plugin'
$stablePlugin = Join-Path $dataDir 'plugin-patched'
$pkgPath = Join-Path $ProfilePath 'package.json'
$lockPath = Join-Path $ProfilePath 'pnpm-lock.yaml'
$pluginLinkSpec = 'link:' + ($stablePlugin -replace '\\', '/')
$expectedVersion = '0.5.3'

function Say($text, $color = 'Gray') { Write-Host $text -ForegroundColor $color }
function Step($text) { Write-Host "[*] $text" -ForegroundColor Cyan }
function Ok($text) { Write-Host "[+] $text" -ForegroundColor Green }
function Warn($text) { Write-Host "[!] $text" -ForegroundColor Yellow }
function Bad($text) { Write-Host "[-] $text" -ForegroundColor Red }

function Write-JsonFile($path, $value) {
  $json = $value | ConvertTo-Json -Depth 30
  [System.IO.File]::WriteAllText($path, $json, (New-Object System.Text.UTF8Encoding($false)))
}

function Remove-PluginPath($path) {
  if (-not (Test-Path $path)) { return }
  $item = Get-Item $path -Force
  if ($item.LinkType) {
    & "$env:SystemRoot\System32\cmd.exe" /c rmdir "$path" | Out-Null
  } else {
    Remove-Item $path -Recurse -Force
  }
}

function Install-PluginJunction($target, $link) {
  Remove-PluginPath $link
  New-Item -ItemType Directory -Force -Path (Split-Path $link) | Out-Null
  New-Item -ItemType Junction -Path $link -Target $target | Out-Null
}

function Get-DshProcesses {
  Get-Process -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -like '*DeepSeek Harness*' -or $_.ProcessName -in @('DSH', 'dsh', 'deepseek')
  }
}

function Get-PatchValue([string]$name) {
  $patchPath = Join-Path $ProfilePath 'cordis.patch.yml'
  if (-not (Test-Path $patchPath)) { return '' }
  try {
    $raw = Get-Content $patchPath -Raw -Encoding UTF8
    $match = [regex]::Match($raw, '(?m)^\s*' + [regex]::Escape($name) + ':\s*["'']([^"'']+)["'']')
    if ($match.Success) { return $match.Groups[1].Value.Trim() }
  } catch {}
  return ''
}

$patchRelay = Get-PatchValue 'serverUrl'
$patchToken = Get-PatchValue 'hostToken'
$existingConfig = $null
if (Test-Path $userConfigPath) {
  try { $existingConfig = Get-Content $userConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json } catch {}
}
$existingRelay = if ($existingConfig -and $existingConfig.serverUrl) { [string]$existingConfig.serverUrl } else { '' }
$existingToken = if ($existingConfig -and $existingConfig.hostToken) { [string]$existingConfig.hostToken } else { '' }
$effectiveRelay = if ($existingRelay) { $existingRelay } elseif ($patchRelay) { $patchRelay } elseif ($relayUrl) { $relayUrl } else { 'ws://127.0.0.1:8787' }
$effectiveToken = if ($existingToken) { $existingToken } elseif ($patchToken) { $patchToken } else { $token }
if ($ResetConfig) {
  $effectiveRelay = if ($relayUrl) { $relayUrl } else { 'ws://127.0.0.1:8787' }
  $effectiveToken = ''
}

Say 'DSH Remoto host installer 0.4.0' 'White'
Say "profile : $ProfilePath"
Say "relay   : $effectiveRelay$(if ($effectiveRelay -ne $relayUrl) { ' (kept from the current profile)' } else { '' })"
Say "token   : $(if ($effectiveToken) { 'kept/configured' } else { 'auto-claim on first connect' })"
Say "plugin  : $expectedVersion"
Say ''

if (-not (Test-Path $ProfilePath)) { throw "DSH profile not found: $ProfilePath. Start DSH once, then run this again." }
if (-not (Test-Path (Join-Path $pluginSrc 'package.json'))) { throw "Missing plugin payload: $pluginSrc" }

$running = Get-DshProcesses
if ($running -and -not $Force -and -not $DryRun) {
  Bad 'DSH is running. Quit DSH completely (including the tray icon), then run this again.'
  Bad 'Use -Force to install while DSH is running (not recommended).'
  exit 2
}

if ($DryRun) {
  Step 'Dry run only, nothing is written.'
  Say "would back up to       : $backupDir"
  Say "would install plugin to: $stablePlugin"
  Say "would link              : $pluginDst"
  Say "would update           : $pkgPath"
  Say "would write            : $userConfigPath"
  Say "would create           : $(Join-Path $env:USERPROFILE 'Documents\dsh-remote-uploads')"
  exit 0
}

Step 'Creating backup'
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
if (Test-Path $pkgPath) { Copy-Item $pkgPath (Join-Path $backupDir 'package.json') -Force }
if (Test-Path $lockPath) { Copy-Item $lockPath (Join-Path $backupDir 'pnpm-lock.yaml') -Force }
if (Test-Path $userConfigPath) { Copy-Item $userConfigPath (Join-Path $backupDir 'user-config.json') -Force }
if (Test-Path $stablePlugin) {
  Copy-Item $stablePlugin (Join-Path $backupDir 'plugin-patched') -Recurse -Force
  Ok 'Previous stable plugin backed up'
}
if (Test-Path $pluginDst) {
  $oldItem = Get-Item $pluginDst -Force
  if ($oldItem.LinkType) {
    Ok 'Old plugin is a link; its target is backed up above'
  } else {
    try {
      Move-Item $pluginDst (Join-Path $backupDir 'plugin') -Force
    } catch {
      Copy-Item $pluginDst (Join-Path $backupDir 'plugin') -Recurse -Force
    }
    Ok "Old plugin backed up to $backupDir\plugin"
  }
} else {
  Ok 'No previous plugin found (fresh install)'
}

Step 'Installing stable host plugin'
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
Remove-PluginPath $stablePlugin
New-Item -ItemType Directory -Force -Path $stablePlugin | Out-Null
Copy-Item (Join-Path $pluginSrc '*') $stablePlugin -Recurse -Force
Ok "Plugin installed: $stablePlugin"

Step 'Linking plugin into the DSH profile'
Install-PluginJunction $stablePlugin $pluginDst
Ok "Plugin link created: $pluginDst -> $stablePlugin"

Step 'Updating the DSH profile package.json'
if (-not (Test-Path $pkgPath)) { throw "Missing profile package.json: $pkgPath" }
$pkg = Get-Content $pkgPath -Raw -Encoding UTF8 | ConvertFrom-Json
if (-not $pkg.dependencies) {
  $pkg | Add-Member -NotePropertyName dependencies -NotePropertyValue ([pscustomobject]@{}) -Force
}
$pkg.dependencies | Add-Member -NotePropertyName '@dsh-remote/plugin' -NotePropertyValue $pluginLinkSpec -Force
if (-not $pkg.dsh) { $pkg | Add-Member -NotePropertyName dsh -NotePropertyValue ([pscustomobject]@{}) -Force }
if (-not $pkg.dsh.profile) { $pkg.dsh | Add-Member -NotePropertyName profile -NotePropertyValue ([pscustomobject]@{}) -Force }
if (-not $pkg.dsh.profile.bundles) { $pkg.dsh.profile | Add-Member -NotePropertyName bundles -NotePropertyValue @() -Force }
$bundles = @($pkg.dsh.profile.bundles)
if (-not ($bundles -contains '@dsh-remote/plugin')) {
  $bundles += '@dsh-remote/plugin'
  $pkg.dsh.profile.bundles = $bundles
}
Write-JsonFile $pkgPath $pkg
Ok "Profile package.json updated to $pluginLinkSpec (other plugins preserved)"

$runtime = Join-Path $env:USERPROFILE '.dsh\dsh-runtimes\dsh-primary-runtime\dependencies'
$nodeExe = Join-Path $runtime 'node\bin\node.exe'
$pnpmCli = Join-Path $runtime 'pnpm\bin\pnpm.cjs'
if ((Test-Path $nodeExe) -and (Test-Path $pnpmCli)) {
  Step 'Refreshing pnpm lockfile for the plugin link'
  $pnpmOutput = & $nodeExe $pnpmCli install --dir $ProfilePath --prefer-offline --no-frozen-lockfile 2>&1
  if ($LASTEXITCODE -eq 0) {
    Ok 'pnpm lockfile updated; other installed plugins were preserved'
  } else {
    Warn 'pnpm could not update the lockfile; the junction still works for now.'
    $pnpmOutput | Select-Object -Last 4 | ForEach-Object { Warn ([string]$_) }
  }
} else {
  Warn 'pnpm runtime not found; the plugin junction is installed, but pnpm-lock.yaml was not refreshed.'
}

Step 'Writing host configuration'
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
$cfg = [ordered]@{}
$hadConfig = Test-Path $userConfigPath
if ($hadConfig -and -not $ResetConfig) {
  try {
    $existing = Get-Content $userConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($property in $existing.PSObject.Properties) { $cfg[$property.Name] = $property.Value }
    Ok 'Existing user-config.json loaded and preserved'
  } catch {
    Warn 'Existing user-config.json could not be parsed; it will be replaced (backup kept)'
  }
}
if ($ResetConfig -or -not $cfg.Contains('serverUrl')) {
  $cfg['serverUrl'] = $effectiveRelay
}
if ($ResetConfig) {
  if ($cfg.Contains('hostToken')) { $cfg.Remove('hostToken') }
}
if ($effectiveToken -and -not $cfg.Contains('hostToken')) {
  $cfg['hostToken'] = $effectiveToken
}
if (-not ($KeepConfig -and $hadConfig)) {
  Write-JsonFile $userConfigPath $cfg
  Ok "Wrote $userConfigPath"
} else {
  Ok 'Keeping the existing user-config.json unchanged (-KeepConfig)'
}

if ($ResetConfig) {
  $patchPath = Join-Path $ProfilePath 'cordis.patch.yml'
  if (Test-Path $patchPath) {
    Copy-Item $patchPath "$patchPath.bak-$stamp" -Force
    $text = Get-Content $patchPath -Raw -Encoding UTF8
    $text = [regex]::Replace($text, 'serverUrl:\s*"[^"]*"', "serverUrl: `"$relayUrl`"", 1)
    $text = [regex]::Replace($text, '(?m)^\s*hostToken:.*\r?\n', '')
    [System.IO.File]::WriteAllText($patchPath, $text, (New-Object System.Text.UTF8Encoding($false)))
    Ok "Profile patch reset to $relayUrl (backup: $patchPath.bak-$stamp)"
  }
}

New-Item -ItemType Directory -Force -Path (Join-Path $env:USERPROFILE 'Documents\dsh-remote-uploads') | Out-Null

$state = [ordered]@{
  version = '0.4.0'
  pluginVersion = $expectedVersion
  installedAt = (Get-Date).ToString('o')
  profile = $ProfilePath
  relay = $effectiveRelay
  backup = $backupDir
}
Write-JsonFile (Join-Path $root 'install-state.json') $state

try {
  $desktop = [Environment]::GetFolderPath('Desktop')
  $shortcutPath = Join-Path $desktop 'DSH Remoto 连接模式.lnk'
  $wsh = New-Object -ComObject WScript.Shell
  $shortcut = $wsh.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = Join-Path $root 'switch-mode.bat'
  $shortcut.WorkingDirectory = $root
  $shortcut.Description = 'DSH Remoto 连接模式'
  $shortcut.IconLocation = "$env:SystemRoot\System32\shell32.dll,21"
  $shortcut.Save()
  Ok "Desktop shortcut created: $shortcutPath"
} catch {
  Warn "Could not create the desktop shortcut: $($_.Exception.Message)"
}

Say ''
Ok 'Install complete.'
Say ''
Say 'Next steps:' 'White'
Say '  1. Start DSH again.'
Say '  2. Click the "Remote Control" pill at the bottom and press Refresh to get a 6-digit code.'
Say '  3. Open DSH Remoto on the phone, add the host, and enter the code.'
Say '  4. Compare the 6 digits on both screens and confirm on the phone.'
Say ''
Say 'Connection modes:' 'White'
Say '  - Desktop app : switch-mode.bat (one-click relay/LAN switch, restarts DSH)'
Say '  - Relay mode  : switch-to-relay.bat (official relay, token claimed automatically)'
Say '  - LAN mode    : switch-to-lan.bat (local relay on port 8787, same Wi-Fi)'
Say '  - Status      : status.bat'
Say '  - Self test   : run-selftest.bat'
Say ''
Say "Rollback: run rollback.ps1 (backup: $backupDir)"

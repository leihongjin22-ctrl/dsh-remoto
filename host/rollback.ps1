param(
  [string]$ProfilePath = "$env:USERPROFILE\.dsh\profiles\desktop",
  [switch]$Force
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dataDir = Join-Path $env:USERPROFILE '.dsh\dsh-remote-control'
$pluginDst = Join-Path $ProfilePath 'node_modules\@dsh-remote\plugin'
$stablePlugin = Join-Path $dataDir 'plugin-patched'
$pkgPath = Join-Path $ProfilePath 'package.json'
$lockPath = Join-Path $ProfilePath 'pnpm-lock.yaml'
$userConfigPath = Join-Path $dataDir 'user-config.json'

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

$backups = Get-ChildItem $root -Directory -Filter 'backup-*' -ErrorAction SilentlyContinue | Sort-Object Name -Descending
if (-not $backups -or $backups.Count -eq 0) { throw 'No backup-* folder found next to this script.' }
$backup = $backups[0]

$running = Get-Process -ErrorAction SilentlyContinue | Where-Object {
  $_.MainWindowTitle -like '*DeepSeek Harness*' -or $_.ProcessName -in @('DSH', 'dsh', 'deepseek')
}
if ($running -and -not $Force) {
  Write-Host 'DSH is running. Quit it completely (including the tray icon), then run this again.' -ForegroundColor Red
  exit 2
}

Write-Host "Rolling back from $($backup.Name)" -ForegroundColor Cyan

if (Test-Path (Join-Path $backup.FullName 'plugin')) {
  Remove-PluginPath $pluginDst
  if (Test-Path $stablePlugin) { Remove-Item $stablePlugin -Recurse -Force }
  New-Item -ItemType Directory -Force -Path (Split-Path $pluginDst) | Out-Null
  Copy-Item (Join-Path $backup.FullName 'plugin') $pluginDst -Recurse -Force
  Write-Host 'Plugin restored (direct copy).' -ForegroundColor Green
} elseif (Test-Path (Join-Path $backup.FullName 'plugin-patched')) {
  Remove-Item $stablePlugin -Recurse -Force -ErrorAction SilentlyContinue
  Copy-Item (Join-Path $backup.FullName 'plugin-patched') $stablePlugin -Recurse -Force
  Install-PluginJunction $stablePlugin $pluginDst
  Write-Host 'Plugin restored (linked).' -ForegroundColor Green
}
if (Test-Path (Join-Path $backup.FullName 'package.json')) {
  Copy-Item (Join-Path $backup.FullName 'package.json') $pkgPath -Force
  Write-Host 'Profile package.json restored.' -ForegroundColor Green
}
if (Test-Path (Join-Path $backup.FullName 'pnpm-lock.yaml')) {
  Copy-Item (Join-Path $backup.FullName 'pnpm-lock.yaml') $lockPath -Force
  Write-Host 'pnpm-lock.yaml restored.' -ForegroundColor Green
}
if (Test-Path (Join-Path $backup.FullName 'user-config.json')) {
  New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
  Copy-Item (Join-Path $backup.FullName 'user-config.json') $userConfigPath -Force
  Write-Host 'user-config.json restored.' -ForegroundColor Green
}

Write-Host ''
Write-Host 'Rollback complete. Start DSH again.' -ForegroundColor Green

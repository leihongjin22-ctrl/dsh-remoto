@echo off
setlocal
chcp 65001 >nul
set "NODE_EXE="
where node >nul 2>nul && set "NODE_EXE=node"
if not defined NODE_EXE (
  for /d %%D in ("%USERPROFILE%\.dsh\dsh-runtimes\*") do (
    if exist "%%D\dependencies\node\bin\node.exe" set "NODE_EXE=%%D\dependencies\node\bin\node.exe"
  )
)
if not defined NODE_EXE (
  if exist "C:\Program Files\nodejs\node.exe" set "NODE_EXE=C:\Program Files\nodejs\node.exe"
)
if not defined NODE_EXE (
  echo node.exe not found. Start DSH once, then try again.
  echo.
  pause
  exit /b 1
)
"%NODE_EXE%" "%~dp0selftest.mjs" %*
echo.
if not defined DSH_NO_PAUSE pause

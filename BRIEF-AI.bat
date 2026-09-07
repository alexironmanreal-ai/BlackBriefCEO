@echo off
cd /d "%~dp0"
title BRIEF AI
echo.
echo  BRIEF AI — arranque local
echo  ========================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] No se encontro Node.js.
  echo Descargalo de https://nodejs.org  ^(LTS^) e instala.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo Fallo npm install
    pause
    exit /b 1
  )
)

echo Abriendo http://localhost:8080 ...
start "" "http://localhost:8080/"
call npm run dev
pause

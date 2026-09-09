@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title BRIEF AI
color 0A

echo.
echo  ========================================
echo   BRIEF AI - arranque
echo  ========================================
echo  Carpeta: %CD%
echo.

REM --- Node ---
where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] No esta Node.js en el PATH.
  echo.
  echo 1. Descarga LTS: https://nodejs.org
  echo 2. Instala con "Add to PATH" marcado
  echo 3. Cierra y abre de nuevo esta ventana
  echo.
  pause
  exit /b 1
)

echo [OK] Node:
node -v
echo [OK] npm:
call npm -v
echo.

REM --- Liberar puerto 8080 si esta ocupado ---
echo Revisando puerto 8080...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
  echo Puerto 8080 ocupado por PID %%p - cerrando...
  taskkill /F /PID %%p >nul 2>&1
)
echo.

REM --- Dependencias ---
if not exist "node_modules\" (
  echo Instalando dependencias ^(puede tardar varios minutos^)...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install fallo.
    pause
    exit /b 1
  )
)

if not exist "node_modules\vite\" (
  echo [ERROR] Falta vite. Ejecutando npm install de nuevo...
  call npm install
)

echo.
echo Iniciando servidor en http://localhost:8080
echo Deja esta ventana ABIERTA.
echo Para cortar: Ctrl+C
echo.

REM Abrir navegador unos segundos despues (en paralelo)
start "" cmd /c "timeout /t 6 /nobreak >nul & start http://localhost:8080/"

call npm run dev
set ERR=%ERRORLEVEL%

echo.
if not "%ERR%"=="0" (
  echo [ERROR] El servidor salio con codigo %ERR%
  echo.
  echo Prueba manualmente:
  echo   npm install
  echo   npm run dev
  echo.
)
pause
exit /b %ERR%

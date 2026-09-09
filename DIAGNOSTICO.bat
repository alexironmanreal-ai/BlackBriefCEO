@echo off
cd /d "%~dp0"
echo === DIAGNOSTICO BRIEF AI ===
echo Carpeta: %CD%
echo.
echo --- node ---
where node
node -v 2>&1
echo.
echo --- npm ---
where npm
call npm -v 2>&1
echo.
echo --- package.json scripts ---
findstr /C:"\"dev\"" package.json
echo.
echo --- node_modules ---
if exist node_modules (echo SI existe node_modules) else (echo NO existe node_modules)
if exist node_modules\vite (echo SI existe vite) else (echo NO existe vite)
echo.
echo --- puerto 8080 ---
netstat -ano | findstr :8080
echo.
echo --- git ---
where git
git status -sb 2>&1
echo.
pause

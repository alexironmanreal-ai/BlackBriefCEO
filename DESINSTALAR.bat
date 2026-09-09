@echo off
setlocal EnableExtensions
title BRIEF AI - Desinstalar
echo.
echo  ========================================
echo   Desinstalar BRIEF AI / BlackBriefCEO
echo  ========================================
echo.

taskkill /F /IM "BRIEF AI.exe" >nul 2>&1
taskkill /F /IM "BlackBriefCEO.exe" >nul 2>&1
taskkill /F /IM electron.exe >nul 2>&1

for %%D in (
  "%LocalAppData%\Programs\BRIEF AI"
  "%LocalAppData%\Programs\BlackBriefCEO"
  "%LocalAppData%\Programs\brief-ai"
  "%ProgramFiles%\BRIEF AI"
  "%ProgramFiles%\BlackBriefCEO"
  "%ProgramFiles(x86)%\BRIEF AI"
  "%ProgramFiles(x86)%\BlackBriefCEO"
) do (
  if exist "%%~D\Uninstall BRIEF AI.exe" (
    echo Ejecutando: %%~D\Uninstall BRIEF AI.exe
    start /wait "" "%%~D\Uninstall BRIEF AI.exe" /S
  )
  if exist "%%~D\Uninstall BlackBriefCEO.exe" (
    echo Ejecutando: %%~D\Uninstall BlackBriefCEO.exe
    start /wait "" "%%~D\Uninstall BlackBriefCEO.exe" /S
  )
  if exist "%%~D\uninstall.exe" (
    echo Ejecutando: %%~D\uninstall.exe
    start /wait "" "%%~D\uninstall.exe" /S
  )
)

for %%D in (
  "%LocalAppData%\Programs\BRIEF AI"
  "%LocalAppData%\Programs\BlackBriefCEO"
  "%LocalAppData%\brief-ai"
  "%LocalAppData%\BlackBriefCEO"
  "%AppData%\BRIEF AI"
  "%AppData%\BlackBriefCEO"
  "%AppData%\brief-ai"
) do (
  if exist "%%~D" (
    echo Borrando %%~D
    rmdir /S /Q "%%~D" 2>nul
  )
)

del /F /Q "%UserProfile%\Desktop\BRIEF AI.lnk" 2>nul
del /F /Q "%UserProfile%\Desktop\BlackBriefCEO.lnk" 2>nul
del /F /Q "%Public%\Desktop\BRIEF AI.lnk" 2>nul
del /F /Q "%Public%\Desktop\BlackBriefCEO.lnk" 2>nul
rmdir /S /Q "%AppData%\Microsoft\Windows\Start Menu\Programs\BRIEF AI" 2>nul
rmdir /S /Q "%AppData%\Microsoft\Windows\Start Menu\Programs\BlackBriefCEO" 2>nul

echo.
echo Listo. Si Windows sigue mostrando la app:
echo   Configuracion ^> Aplicaciones ^> buscar BRIEF o BlackBrief ^> Desinstalar
echo.
pause

@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Registro la pubblicazione automatica (ogni ora)...
schtasks /create /tn "BFBR-Pubblica" /tr "\"%~dp0PUBBLICA-AUTO.bat\"" /sc hourly /f
echo.
if %errorlevel%==0 (
  echo OK - Pubblicazione automatica registrata: gira ogni ora.
  echo Deploya da solo i siti nuovi o modificati in ..\siti\
  echo L'esito di ogni giro finisce in  log-pubblicazione.txt
) else (
  echo Errore nella registrazione del task.
)
echo.
pause

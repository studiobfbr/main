@echo off
chcp 65001 >nul
echo Rimozione del task di auto-push delle 11:00...
schtasks /delete /tn "BFBR-AutoPush" /f
if %errorlevel%==0 (
  echo.
  echo OK - Task "BFBR-AutoPush" rimosso.
) else (
  echo.
  echo Il task non esisteva o e' gia' stato rimosso.
)
echo.
echo Da ora il push lo fa Claude direttamente. Puoi chiudere questa finestra.
pause

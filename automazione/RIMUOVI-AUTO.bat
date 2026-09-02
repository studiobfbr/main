@echo off
chcp 65001 >nul
echo Rimuovo la pubblicazione automatica...
schtasks /delete /tn "BFBR-Pubblica" /f
echo.
echo Fatto. Da ora la pubblicazione e' solo manuale (PUBBLICA.bat).
pause

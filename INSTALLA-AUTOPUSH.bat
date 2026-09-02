@echo off
REM ============================================================
REM  Registra l'auto-push giornaliero alle 11:00
REM  (crea un'attivita' pianificata di Windows che lancia AUTO-PUSH.bat)
REM  Doppio clic una volta sola.
REM ============================================================
schtasks /create /tn "BFBR-AutoPush" /tr "\"%~dp0AUTO-PUSH.bat\"" /sc daily /st 11:00 /f

echo.
echo ============================================================
echo  Se sopra leggi "SUCCESS" o "OPERAZIONE RIUSCITA",
echo  l'auto-push e' impostato: ogni giorno alle 11:00 il PC
echo  fara' commit + push da solo (se il PC e' acceso).
echo.
echo  Per verificarlo: apri "Utilita' di pianificazione" e cerca
echo  l'attivita' "BFBR-AutoPush".
echo ============================================================
pause

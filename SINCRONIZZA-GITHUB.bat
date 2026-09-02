@echo off
REM ============================================================
REM  BFBR - Sincronizza tutto su GitHub (doppio clic)
REM  Fa: aggiungi tutto -> commit -> push su studiobfbr/main
REM  Usa le credenziali gia' salvate (nessun login richiesto).
REM ============================================================
cd /d "%~dp0"

echo Aggiungo le modifiche...
git add -A

echo Creo il commit...
git commit -m "Aggiornamento del %date% %time%"

echo Invio su GitHub...
git push

echo.
echo ============================================================
echo  FATTO. Se non c'erano modifiche, e' normale vedere
echo  "nothing to commit". Se vedi errori, mandameli.
echo ============================================================
pause

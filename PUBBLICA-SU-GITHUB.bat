@echo off
REM ============================================================
REM  BFBR - Pubblica il progetto su GitHub (doppio clic per eseguire)
REM  Prerequisito: aver creato un repo VUOTO su github.com
REM  (New repository -> nome: bfbr-web-agency -> NIENTE readme/gitignore)
REM  Usa le credenziali gia' salvate da GitHub Desktop.
REM ============================================================
cd /d "%~dp0"

echo.
echo Collego il repo remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/studiobfbr/bfbr-web-agency.git

echo Rinomino il branch in main...
git branch -M main

echo Eseguo il push su GitHub...
git push -u origin main

echo.
echo ============================================================
echo  FATTO. Se vedi errori qui sopra, leggili e mandameli.
echo  (errore comune: il repo remoto non esiste ancora -> crealo vuoto su github.com)
echo ============================================================
pause

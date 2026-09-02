@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   BFBR - Pubblicazione automatica siti
echo ============================================
echo.
node bfbr-pubblica.mjs %*
echo.
echo ============================================
pause

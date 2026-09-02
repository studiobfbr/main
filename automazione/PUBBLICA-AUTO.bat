@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo. >> "%~dp0log-pubblicazione.txt"
echo ===== %date% %time% ===== >> "%~dp0log-pubblicazione.txt"
node bfbr-pubblica.mjs >> "%~dp0log-pubblicazione.txt" 2>&1

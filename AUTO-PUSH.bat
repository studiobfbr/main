@echo off
REM Auto-push schedulato: commit + push su studiobfbr/main.
REM Nessuna pausa: pensato per l'Utilita' di pianificazione di Windows.
cd /d "%~dp0"
git add -A
git commit -m "Auto-sync %date% %time%"
git push

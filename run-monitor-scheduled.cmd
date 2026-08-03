@echo off
cd /d "%~dp0"
if not exist data mkdir data
call npm run scheduled >> data\monitor.log 2>&1
exit /b %errorlevel%

@echo off
REM 4 Bilder 1 Wort - Setup Script für Windows

echo 🎮 4 Bilder 1 Wort - Setup
echo =============================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js ist nicht installiert!
    echo Bitte installiere Node.js von: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js gefunden: %NODE_VERSION%
echo.

REM Install dependencies
echo 📦 Installiere Dependencies...
call npm install

echo.
echo ✓ Setup abgeschlossen!
echo.
echo 🚀 Starte Entwicklungsserver...
echo    URL: http://localhost:3000
echo    Admin: http://localhost:3000/admin
echo    Passwort: admin123
echo.
echo Drücke Ctrl+C zum Stoppen
echo.

REM Start dev server
call npm run dev
pause

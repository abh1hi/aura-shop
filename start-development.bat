@echo off
REM Aura Shop Development Startup Script for Windows
REM This script starts both frontend and backend servers

setlocal enabledelayedexpansion

echo.
echo 🚀 Starting Aura Shop Development Environment...
echo =====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node --version') do set NODE_MAJOR=%%a
set NODE_MAJOR=%NODE_MAJOR:v=%
if %NODE_MAJOR% lss 18 (
    echo ERROR: Node.js version is too old. Please upgrade to Node.js 18+
    pause
    exit /b 1
)

echo ✓ Node.js version is compatible

REM Setup Backend
echo.
echo Setting up backend...
cd metainflu\backend

REM Check if .env exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo IMPORTANT: Please edit .env file with your configuration
    echo Press any key after updating .env file...
    pause >nul
)

REM Install backend dependencies if needed
if not exist node_modules (
    echo Installing backend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)

echo ✓ Backend setup complete

REM Setup Frontend
echo.
echo Setting up frontend...
cd ..\adminpanel\frontend\admin-new-ui

REM Check if .env.local exists
if not exist .env.local (
    echo Creating frontend .env.local file...
    copy .env.example .env.local
)

REM Install frontend dependencies if needed
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

echo ✓ Frontend setup complete

REM Start servers
echo.
echo Starting development servers...
echo.

REM Start backend in new window
echo Starting backend server...
start "Aura Shop Backend" cmd /k "cd /d %~dp0metainflu\backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo Starting frontend server...
start "Aura Shop Frontend" cmd /k "cd /d %~dp0metainflu\adminpanel\frontend\admin-new-ui && npm run dev"

REM Wait for servers to start
timeout /t 5 /nobreak >nul

REM Display information
echo.
echo ✅ Both servers are starting in separate windows...
echo.
echo 🌐 Access URLs:
echo   Backend API: http://localhost:5000
echo   Admin Panel: http://localhost:5174
echo   API Health: http://localhost:5000/health
echo   API Info: http://localhost:5000/api/info
echo.
echo 📝 Server windows have been opened separately.
echo 📋 Check the console windows for server status.
echo 📱 The admin panel will open automatically in your browser.
echo.
echo Press any key to close this window...
pause >nul
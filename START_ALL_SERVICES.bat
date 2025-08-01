@echo off
echo ============================================
echo    EXPENSE TRACKER WITH AI CHATBOT
echo ============================================
echo.
echo Starting all services...
echo.

REM Check if Node.js services are already running
echo [1/3] Checking existing services...
tasklist /FI "IMAGENAME eq node.exe" | find /I "node.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Node.js services already running
) else (
    echo ⚠️  No Node.js services found - you may need to start backend/frontend separately
)

REM Start Backend API Server
echo.
echo [2/3] Starting Backend API Server (Port 5000)...
cd /d "c:\Users\SANJANA\OneDrive\Desktop\expenses\backend"
start "Backend Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul

REM Start Frontend React App
echo.
echo [3/3] Starting Frontend React App (Port 3000)...
cd /d "c:\Users\SANJANA\OneDrive\Desktop\expenses"
start "Frontend App" cmd /k "npm start"
timeout /t 3 /nobreak >nul

REM Start AI Chatbot
echo.
echo [4/4] Starting AI Chatbot (Port 8503)...
cd /d "c:\Users\SANJANA\OneDrive\Desktop\expenses\chatbot"
start "AI Chatbot" cmd /k "streamlit run app.py"
timeout /t 2 /nobreak >nul

echo.
echo ============================================
echo 🎉 ALL SERVICES STARTED!
echo ============================================
echo.
echo 📱 Frontend (React):     http://localhost:3000
echo 🔧 Backend (Node.js):    http://localhost:5000  
echo 🤖 AI Chatbot (Groq):    http://localhost:8503
echo.
echo 🔑 Test Login Credentials:
echo    Mobile: 9876543210
echo    Password: TestPass123!
echo.
echo Press any key to open all services in browser...
pause >nul

REM Open all services in browser
start http://localhost:3000
timeout /t 2 /nobreak >nul
start http://localhost:8503

echo.
echo ✅ Project is fully running!
echo ✅ Groq AI is powering your chatbot
echo.
echo To stop all services: Close all terminal windows
echo.
pause

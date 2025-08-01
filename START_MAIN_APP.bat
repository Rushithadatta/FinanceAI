@echo off
echo ============================================
echo      MAIN APP ONLY (FRONTEND + BACKEND)
echo ============================================
echo.

REM Start Backend
echo [1/2] Starting Backend API Server...
cd /d "c:\Users\SANJANA\OneDrive\Desktop\expenses\backend"
start "Backend Server" cmd /k "echo Backend API Server (Port 5000) && npm start"
timeout /t 3 /nobreak >nul

REM Start Frontend  
echo [2/2] Starting Frontend React App...
cd /d "c:\Users\SANJANA\OneDrive\Desktop\expenses"
start "Frontend App" cmd /k "echo Frontend React App (Port 3000) && npm start"

echo.
echo ============================================
echo 🎉 MAIN APP STARTED!
echo ============================================
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo.
echo 🔑 Test Login:
echo    Mobile: 9876543210  
echo    Password: TestPass123!
echo.
echo Press any key to open frontend...
pause >nul
start http://localhost:3000

echo.
echo ✅ Main app is running!
pause

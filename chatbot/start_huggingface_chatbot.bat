@echo off
echo ========================================
echo  EXPENSE TRACKER - HUGGING FACE SETUP
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo Error: Failed to create virtual environment
        echo Please make sure Python is installed and in your PATH
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
echo Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt

REM Test Hugging Face setup
echo.
echo Testing Hugging Face integration...
python test_huggingface.py

if errorlevel 1 (
    echo.
    echo ⚠️  Hugging Face test failed!
    echo Please check your HUGGINGFACE_TOKEN in the .env file
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Hugging Face setup verified!
echo.
echo Starting Expense Tracker Chatbot with Hugging Face AI...
echo (This will open in your default web browser)
echo.
echo Press Ctrl+C to stop the application
echo.

REM Start the chatbot
streamlit run app.py --server.port=8501 --server.address=localhost

pause

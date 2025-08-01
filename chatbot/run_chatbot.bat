@echo off
echo Starting Expense Tracker AI Chatbot...

REM Activate conda environment
call conda activate expense-chatbot

REM Check if activation was successful
if %ERRORLEVEL% NEQ 0 (
    echo Failed to activate conda environment 'expense-chatbot'
    echo Please run setup.bat first
    pause
    exit /b 1
)

REM Start Streamlit app
streamlit run app.py --server.port 8501

pause

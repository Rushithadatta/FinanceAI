@echo off
echo Setting up Expense Tracker AI Chatbot...

REM Check if conda is available
where conda >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Conda is not installed or not in PATH. Please install Miniconda first.
    echo Download from: https://docs.conda.io/en/latest/miniconda.html
    pause
    exit /b 1
)

REM Create conda environment
echo Creating conda environment 'expense-chatbot'...
conda create -n expense-chatbot python=3.10 -y

REM Activate environment and install packages
echo Activating environment and installing packages...
call conda activate expense-chatbot
pip install -r requirements.txt

echo.
echo Setup complete! 
echo.
echo Next steps:
echo 1. Update the .env file with your tokens:
echo    - HUGGINGFACE_TOKEN: Get from https://huggingface.co/settings/tokens
echo    - IBM_WATSONX_API_KEY: Get from IBM Cloud
echo    - IBM_WATSONX_PROJECT_ID: Your Watson project ID
echo.
echo 2. Run the chatbot with: run_chatbot.bat
echo.
pause

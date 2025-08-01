@echo off
echo Starting Simple Financial AI Assistant...
echo Using Python environment: expense-chatbot
echo.

cd /d "c:\Users\SANJANA\OneDrive\Desktop\expense\chatbot"

echo Activating conda environment and starting chatbot...
conda run --no-capture-output --name expense-chatbot streamlit run app_simple.py --server.port=8502 --server.address=localhost

echo.
echo Chatbot has stopped.
pause

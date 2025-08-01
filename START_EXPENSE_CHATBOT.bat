@echo off
echo Starting Expense Tracker AI Assistant...
echo.

cd /d "c:\Users\SANJANA\OneDrive\Desktop\expense\chatbot"
conda run --live-stream --name expense-chatbot streamlit run app.py --server.port=8502 --server.address=localhost

pause

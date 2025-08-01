@echo off
echo Starting Groq-powered Expense Chatbot...
cd /d "c:\Users\SANJANA\OneDrive\Desktop\expenses\chatbot"
conda activate expense-chatbot
streamlit run app.py --server.port 8501
pause

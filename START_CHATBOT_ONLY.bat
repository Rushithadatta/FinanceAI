@echo off
echo ============================================
echo         AI CHATBOT ONLY (GROQ POWERED)
echo ============================================
echo.
echo Starting Groq-powered AI Chatbot...
echo.

cd /d "c:\Users\SANJANA\OneDrive\Desktop\expenses\chatbot"
echo 🤖 Initializing Groq AI with Mixtral-8x7B model...
echo 📍 Location: http://localhost:8503
echo.

streamlit run app.py

echo.
echo Chatbot stopped.
pause

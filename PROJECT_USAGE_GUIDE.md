# 🚀 How to Run Your Expense Tracker Project

## 📋 **What You Have Built**

✅ **Frontend**: React expense tracker with integrated chatbot widget  
✅ **Backend**: Node.js API server with MongoDB and JWT authentication  
✅ **AI Chatbot**: Streamlit app powered by Groq AI (Mixtral-8x7B model)  
✅ **Database**: MongoDB for storing users, expenses, and budgets  

---

## 🎯 **Startup Options**

### **Option 1: Complete System (Recommended)**
```bash
# Double-click this file:
START_ALL_SERVICES.bat
```
**What it starts:**
- ✅ Backend API Server (Port 5000)
- ✅ Frontend React App (Port 3000) 
- ✅ AI Chatbot (Port 8503)

### **Option 2: Main App Only**
```bash
# Double-click this file:
START_MAIN_APP.bat
```
**What it starts:**
- ✅ Backend API Server (Port 5000)
- ✅ Frontend React App (Port 3000)

### **Option 3: AI Chatbot Only**
```bash
# Double-click this file:
START_CHATBOT_ONLY.bat
```
**What it starts:**
- ✅ AI Chatbot (Port 8503)

### **Option 4: Manual Startup (Advanced)**
```powershell
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend  
cd .
npm start

# Terminal 3: Chatbot
cd chatbot
streamlit run app.py
```

---

## 🌐 **Access Your Application**

| Service | URL | Purpose |
|---------|-----|---------|
| **Main App** | http://localhost:3000 | Complete expense tracker with login |
| **API Server** | http://localhost:5000 | Backend API endpoints |
| **AI Chatbot** | http://localhost:8503 | Standalone chatbot interface |

---

## 🔑 **Test Credentials**

**Mobile**: `9876543210`  
**Password**: `TestPass123!`  
**User Type**: Student

---

## 🤖 **AI Features**

### **Groq AI Integration** ⚡
- **Model**: Mixtral-8x7B-32768
- **Speed**: Lightning fast responses (~500ms)
- **Capabilities**: 
  - Demographic-aware responses (student/professional/general)
  - Expense analysis and advice
  - Financial planning suggestions
  - Budget optimization tips

### **Test Queries**:

**For Students:**
```
"Help me create a simple budget for college"
"What are good saving habits for students?"
```

**For Professionals:** 
```
"Analyze my quarterly expense patterns"
"Suggest budget optimization strategies"  
```

**General:**
```
"How can I reduce my monthly expenses?"
"What are my biggest spending categories?"
```

---

## 📱 **How to Use**

### **Step 1: Start Services**
Double-click `START_ALL_SERVICES.bat`

### **Step 2: Login to Main App**
1. Go to http://localhost:3000
2. Login with test credentials
3. Add some expenses

### **Step 3: Test AI Chatbot**
1. Use floating chat widget in main app, OR
2. Go to http://localhost:8503 for standalone chatbot
3. Ask questions about your expenses

### **Step 4: Explore Features**
- Add expenses and budgets
- View monthly/annual reports  
- Get AI-powered financial advice
- Analyze spending patterns

---

## 🛠 **Technology Stack**

### **Frontend**
- React 18
- React Router
- Context API for state management
- CSS3 for styling

### **Backend** 
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

### **AI/ML**
- **Primary**: Groq API (Mixtral-8x7B)
- **Fallback**: IBM Watson (commented out)
- Streamlit for chatbot UI
- HuggingFace Transformers

### **Environment**
- Node.js v16+
- Python 3.10 (conda environment)
- MongoDB Community Edition

---

## 🔥 **Quick Commands**

```bash
# Start everything at once
START_ALL_SERVICES.bat

# Stop all services
# Close all terminal windows

# Check running services
netstat -an | findstr ":3000 :5000 :8503"

# View logs
# Check individual terminal windows
```

---

## 🎉 **You're Ready!**

Your complete expense tracking system with AI chatbot is ready to use. The Groq integration provides blazing-fast, intelligent responses for all your financial questions!

**Recommended**: Start with `START_ALL_SERVICES.bat` for the full experience.

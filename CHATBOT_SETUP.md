# Expense Tracker with AI Chatbot - Complete Setup Guide

## Overview
This enhanced expense tracker now includes an AI-powered conversational chatbot using IBM Granite 3B model with demographic-aware communication and conversational NLP experience.

## Prerequisites

### 1. Install Miniconda
- Download from: https://docs.conda.io/en/latest/miniconda.html
- Install and make sure `conda` is in your system PATH
- Restart your command prompt after installation

### 2. Get Required API Tokens

#### HuggingFace Token
1. Go to https://huggingface.co/
2. Create an account or sign in
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token

#### IBM Watson AI Credentials
1. Go to https://cloud.ibm.com/
2. Create an account or sign in
3. Create a Watson Machine Learning service
4. Go to Service Credentials
5. Create new credentials and copy:
   - API Key
   - Project ID (from Watson Studio project)
   - Service URL

## Installation Steps

### Step 1: Setup the Chatbot Environment

1. **Navigate to the chatbot directory**:
   ```bash
   cd chatbot
   ```

2. **Run the automated setup**:
   ```bash
   setup.bat
   ```

   This will:
   - Create a conda environment named 'expense-chatbot'
   - Install Python 3.10
   - Install all required packages

3. **Configure your environment variables**:
   - Open `chatbot/.env` file
   - Replace the placeholder values with your actual tokens:
   ```env
   HUGGINGFACE_TOKEN=hf_your_actual_token_here
   IBM_WATSONX_API_KEY=your_actual_api_key_here
   IBM_WATSONX_PROJECT_ID=your_actual_project_id_here
   IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
   BACKEND_API_URL=https://finance-backend-zncc.onrender.com
   STREAMLIT_SERVER_PORT=8501
   STREAMLIT_SERVER_ADDRESS=localhost
   ```

### Step 2: Install Frontend Dependencies

1. **Navigate to the main project directory**:
   ```bash
   cd ..
   ```

2. **Install React dependencies** (if not already done):
   ```bash
   npm install
   ```

### Step 3: Install Backend Dependencies

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install backend dependencies** (if not already done):
   ```bash
   npm install
   ```

## Running the Complete Application

### Option 1: Using Batch Files (Recommended)

1. **Start the main application** (from root directory):
   ```bash
   start.bat
   ```

2. **Start the AI chatbot** (in a new terminal):
   ```bash
   cd chatbot
   run_chatbot.bat
   ```

### Option 2: Manual Startup

1. **Start MongoDB** (make sure it's running)

2. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Start the React frontend** (in a new terminal):
   ```bash
   npm start
   ```

4. **Start the AI chatbot** (in a new terminal):
   ```bash
   cd chatbot
   conda activate expense-chatbot
   streamlit run app.py
   ```

## Application URLs

- **Main App**: http://localhost:3000
- **Backend API**: https://finance-backend-zncc.onrender.com
- **AI Chatbot**: http://localhost:8501

## Features of the AI Chatbot

### 1. Demographic-Aware Communication
The chatbot automatically detects user types and adjusts its communication style:

- **Student Mode**: Simple language, educational content, encouraging tone
- **Professional Mode**: Formal language, business terminology, strategic insights
- **General Mode**: Conversational, practical advice

### 2. Conversational NLP Experience
- Powered by IBM Granite 3B model
- Natural language understanding
- Context-aware responses
- Financial advice and expense analysis

### 3. Integration Features
- Connects to your expense data via JWT authentication
- Real-time expense analysis
- Interactive visualizations
- Quick question suggestions

## Testing the Chatbot

1. **Login to your expense tracker** at http://localhost:3000
2. **Add some expenses** to have data for analysis
3. **Open the AI chatbot** floating button (bottom-right corner)
4. **Try these example questions**:
   - "Analyze my spending patterns" (triggers analysis mode)
   - "Help me understand my budget" (triggers student mode)
   - "Provide quarterly expense analysis" (triggers professional mode)
   - "How can I save money on food?" (general advice)

## Troubleshooting

### Common Issues

1. **Conda command not found**
   ```bash
   # Add conda to PATH or use full path
   C:\Users\[YourUsername]\Miniconda3\Scripts\conda.exe
   ```

2. **IBM Watson authentication fails**
   - Verify your API key is correct
   - Check if your Watson ML service is active
   - Ensure project ID matches your Watson Studio project

3. **Chatbot not connecting to backend**
   - Make sure backend is running on port 5000
   - Check if BACKEND_API_URL in .env is correct
   - Verify CORS settings in backend

4. **Streamlit app won't start**
   ```bash
   # Try updating streamlit
   conda activate expense-chatbot
   pip install --upgrade streamlit
   ```

5. **Package installation fails**
   ```bash
   # Try installing packages individually
   conda activate expense-chatbot
   pip install streamlit transformers torch huggingface_hub
   pip install ibm-watsonx-ai pandas numpy plotly
   ```

### Performance Optimization

- **Model Loading**: First response might take 10-15 seconds as the model loads
- **Subsequent Responses**: Should be 2-5 seconds
- **Memory Usage**: Granite 3B requires ~6GB RAM
- **For Development**: You can switch to smaller models if needed

### Development Tips

1. **Test with Demo Data**: Add various expense categories to test analysis
2. **Monitor Logs**: Check browser console and terminal outputs
3. **API Testing**: Use Postman to test backend endpoints
4. **Model Testing**: Start with simple questions before complex analysis

## Advanced Configuration

### Custom User Types
You can extend the user type detection in `chatbot/app.py`:
```python
def detect_user_type(self, message: str) -> str:
    # Add your custom logic here
    custom_indicators = ['your', 'keywords']
    # ... rest of the logic
```

### Model Parameters
Adjust the IBM Granite model parameters in `app.py`:
```python
self.model_params = {
    GenParams.TEMPERATURE: 0.7,  # Adjust creativity (0.1-1.0)
    GenParams.MAX_NEW_TOKENS: 500,  # Adjust response length
    GenParams.TOP_P: 1.0,  # Adjust diversity
}
```

## Next Steps

1. **Add more expense categories** for better analysis
2. **Customize user types** based on your needs
3. **Extend visualization options** in the chatbot
4. **Add voice input/output** for enhanced UX
5. **Implement chat history persistence**

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure all services are running on correct ports
4. Check logs in terminal outputs for specific error messages

The AI chatbot will enhance your expense tracking experience with intelligent insights and personalized financial advice!

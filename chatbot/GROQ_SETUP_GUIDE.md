# 🚀 Groq AI Setup Guide for Your Expense Chatbot

## Step 1: Get Your Free Groq API Key

1. **Visit Groq Console**: Go to [https://console.groq.com](https://console.groq.com)

2. **Sign Up/Login**: 
   - Click "Sign Up" if you don't have an account
   - Use your GitHub, Google, or email to register
   - It's completely FREE to start!

3. **Create API Key**:
   - Once logged in, go to "API Keys" section
   - Click "Create API Key"
   - Give it a name like "ExpenseTracker-Chatbot"
   - Copy the API key (starts with `gsk_...`)

4. **Update Your .env File**:
   ```bash
   # Replace this line in your .env file:
   GROQ_API_KEY=your_groq_api_key_here
   
   # With your actual key:
   GROQ_API_KEY=gsk_your_actual_key_here
   ```

## Step 2: Why Groq is Amazing for Your Chatbot

✅ **Lightning Fast**: Responses in milliseconds (vs seconds with other APIs)
✅ **Free Tier**: Generous free usage limits 
✅ **High Quality**: Uses Mixtral-8x7B and other top models
✅ **Reliable**: 99.9% uptime with robust infrastructure
✅ **Cost Effective**: Much cheaper than OpenAI for production use

## Step 3: Test Your Setup

### Quick Test Command:
```bash
# Run this in your chatbot directory:
conda run -n expense-chatbot streamlit run app.py
```

### Expected Behavior:
- ✅ "Groq AI initialized successfully!" message
- 🤖 Fast, intelligent responses about expenses
- 🎯 Demographic-aware communication (student/professional/general)
- 📊 Integration with your expense data

## Step 4: Available AI Models in Your Chatbot

Your chatbot now supports multiple AI providers:

1. **Primary: Groq AI** (Fast & Free)
   - Model: Mixtral-8x7B-32768
   - Speed: ~500ms response time
   - Quality: Excellent for financial advice

2. **Fallback: IBM Watson** (Enterprise Grade)
   - Model: IBM Granite-3B-Code-Instruct  
   - Speed: ~2-3s response time
   - Quality: Specialized for business use

## Step 5: Testing Scenarios

Try these queries to test different user types:

### For Students:
- "Help me understand basic budgeting"
- "I need simple advice for managing my allowance"
- "Can you explain what a budget is?"

### For Professionals:
- "Analyze my quarterly expense reports"
- "What's the ROI on my business expenses?"
- "Help me optimize my departmental budget"

### General Users:
- "How can I save money on groceries?"
- "What are my biggest spending categories?"
- "Give me tips to reduce monthly expenses"

## Troubleshooting

### If Groq fails:
- Check your internet connection
- Verify API key is correct
- System automatically falls back to IBM Watson

### If both AI services fail:
- Basic expense tracking still works
- Manual analysis features available
- Check your .env file configuration

## Next Steps

Once Groq is working:
1. Test the integrated chatbot widget in your React app
2. Try the standalone Streamlit chatbot
3. Experiment with different query types
4. Explore the expense analysis features

---

🎉 **You're all set!** Your expense chatbot now has cutting-edge AI capabilities with Groq!

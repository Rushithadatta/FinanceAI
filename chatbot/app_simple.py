import os
import requests
import streamlit as st
from datetime import datetime, date
from typing import Dict, List, Optional, Any
import json
from dotenv import load_dotenv
import pandas as pd
import plotly.express as px

# Load environment variables
load_dotenv()

class ExpenseChatbot:
    def __init__(self):
        self.backend_url = os.getenv('BACKEND_API_URL', 'https://finance-backend-zncc.onrender.com')
        
    def detect_user_type(self, message: str) -> str:
        """Detect user type based on message content and complexity"""
        professional_indicators = ['budget', 'financial', 'analysis', 'report', 'quarterly', 'ROI']
        student_indicators = ['homework', 'assignment', 'simple', 'basic', 'learn', 'help me understand']
        
        message_lower = message.lower()
        
        if any(indicator in message_lower for indicator in professional_indicators):
            return "professional"
        elif any(indicator in message_lower for indicator in student_indicators):
            return "student"
        else:
            return "general"
    
    def get_expense_data(self, token: str, year: int = None, month: int = None) -> Dict:
        """Fetch expense data from backend API"""
        try:
            headers = {'Authorization': f'Bearer {token}'}
            
            if year and month is not None:
                url = f"{self.backend_url}/api/expenses/{year}/{month}"
            elif year:
                url = f"{self.backend_url}/api/expenses/annual/{year}"
            else:
                # Get current year data
                current_year = datetime.now().year
                url = f"{self.backend_url}/api/expenses/annual/{current_year}"
            
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Failed to fetch data: {response.status_code}"}
                
        except Exception as e:
            return {"error": f"API call failed: {str(e)}"}
    
    def analyze_expenses(self, data: Dict) -> str:
        """Analyze expense data and provide insights"""
        if "error" in data:
            return f"I couldn't fetch your expense data: {data['error']}"
        
        if not data:
            return "You don't have any expenses recorded yet. Start by adding some expenses to get insights!"
        
        # Calculate total expenses
        total = 0
        categories = {}
        monthly_totals = {}
        
        for month_key, expenses in data.items():
            if isinstance(expenses, list):
                month_total = sum(expense.get('amount', 0) for expense in expenses)
                monthly_totals[month_key] = month_total
                total += month_total
                
                # Categorize expenses
                for expense in expenses:
                    name = expense.get('name', '').lower()
                    amount = expense.get('amount', 0)
                    
                    # Simple categorization logic
                    if any(word in name for word in ['food', 'restaurant', 'grocery']):
                        categories['Food'] = categories.get('Food', 0) + amount
                    elif any(word in name for word in ['transport', 'fuel', 'bus', 'taxi']):
                        categories['Transportation'] = categories.get('Transportation', 0) + amount
                    elif any(word in name for word in ['rent', 'utilities', 'electricity']):
                        categories['Housing'] = categories.get('Housing', 0) + amount
                    else:
                        categories['Other'] = categories.get('Other', 0) + amount
        
        # Generate insights
        insights = f"💰 **Total Expenses**: ₹{total:.2f}\n\n"
        
        if categories:
            insights += "📊 **Expense Categories**:\n"
            for category, amount in sorted(categories.items(), key=lambda x: x[1], reverse=True):
                percentage = (amount / total) * 100 if total > 0 else 0
                insights += f"- {category}: ₹{amount:.2f} ({percentage:.1f}%)\n"
        
        if monthly_totals and len(monthly_totals) > 1:
            insights += f"\n📈 **Monthly Spending Pattern**:\n"
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            for month_num, amount in monthly_totals.items():
                if int(month_num) < len(months):
                    insights += f"- {months[int(month_num)]}: ₹{amount:.2f}\n"
        
        return insights
    
    def generate_financial_advice(self, query: str, user_type: str, expense_data: Dict = None) -> str:
        """Generate financial advice based on user type and query"""
        
        # Create context from expense data
        context = ""
        if expense_data and "error" not in expense_data:
            context = self.analyze_expenses(expense_data)
        
        # Professional financial advice templates
        if user_type == "professional":
            if "save" in query.lower() and "20%" in query:
                advice = """🎯 **Professional Financial Strategy: Save 20% of Your Earnings**

📊 **Step-by-Step Plan:**

**1. Assess Your Current Situation:**
- Calculate your monthly take-home salary
- Track all expenses for 1-2 months
- Identify your spending patterns

**2. Apply the 50/30/20 Rule:**
- 50% for Needs (rent, utilities, groceries, EMIs)
- 30% for Wants (dining out, entertainment, shopping)
- 20% for Savings & Investments ✅

**3. Automate Your Savings:**
- Set up automatic transfers to savings account
- Use SIPs for mutual funds
- Consider PPF, ELSS for tax benefits

**4. Investment Strategy:**
- Emergency Fund: 6-12 months expenses
- Equity Mutual Funds (SIP): 60-70%
- Debt Funds/FDs: 20-30%
- Gold/REITs: 5-10%

**5. Tax Optimization:**
- Use Section 80C (₹1.5L limit)
- HRA exemption if applicable
- Health insurance deductions

💡 **Pro Tips:**
- Review and rebalance portfolio annually
- Increase SIP amount with salary hikes
- Track expenses using apps like this one!

Would you like a personalized budget breakdown based on your salary range?"""
            else:
                advice = f"""🎯 **Professional Financial Guidance**

Based on your query: "{query}"

As a working professional, here's my step-by-step advice:

**1. Analysis Phase:**
- Understand your current financial position
- Set clear short-term and long-term goals
- Calculate your risk tolerance

**2. Action Plan:**
- Create a detailed budget (50/30/20 rule)
- Build an emergency fund (6-12 months expenses)
- Start systematic investments

**3. Investment Strategy:**
- Diversify across asset classes
- Use tax-saving instruments effectively
- Regular portfolio review and rebalancing

**4. Risk Management:**
- Adequate health and term insurance
- Avoid high-interest debt
- Maintain good credit score

Would you like me to provide specific recommendations based on your expense data?"""
        
        elif user_type == "student":
            advice = f"""🎓 **Student Financial Guidance**

Based on your query: "{query}"

As a student, here's simple, practical advice:

**1. Budget Basics:**
- Track every rupee you spend
- Separate needs vs wants
- Try the 50/30/20 rule (adapted for pocket money)

**2. Smart Saving Tips:**
- Use student discounts everywhere
- Cook instead of ordering food
- Share textbooks and resources

**3. Early Financial Habits:**
- Start a small SIP (even ₹500/month)
- Learn about investments
- Avoid unnecessary EMIs

**4. Income Ideas:**
- Part-time tutoring
- Freelancing (writing, design)
- Campus jobs or internships

💡 **Student Pro Tips:**
- Use free financial apps for tracking
- Attend financial literacy workshops
- Build good credit history early

Would you like specific budgeting tips for students?"""
        
        else:
            advice = f"""💰 **Personal Financial Guidance**

Based on your query: "{query}"

Here's comprehensive financial advice:

**1. Foundation:**
- Track all income and expenses
- Create a realistic monthly budget
- Build an emergency fund

**2. Smart Spending:**
- Distinguish between needs and wants
- Use comparison shopping
- Avoid impulse purchases

**3. Saving & Investment:**
- Start with small amounts consistently
- Understand different investment options
- Consider tax implications

**4. Financial Discipline:**
- Automate savings and bill payments
- Regular financial health checkups
- Stay updated with financial knowledge

💡 **General Tips:**
- Use apps like this for expense tracking
- Set specific financial goals
- Review and adjust plans regularly

Would you like personalized advice based on your expense patterns?"""
        
        # Add expense context if available
        if context:
            advice += f"\n\n📊 **Your Expense Analysis:**\n{context}\n\nBased on your spending patterns, I can provide more specific recommendations!"
        
        return advice
    
    def create_expense_visualization(self, data: Dict) -> Optional[Any]:
        """Create visualizations for expense data"""
        if "error" in data or not data:
            return None
        
        # Prepare data for visualization
        months = []
        amounts = []
        
        for month_key, expenses in data.items():
            if isinstance(expenses, list):
                month_total = sum(expense.get('amount', 0) for expense in expenses)
                months.append(int(month_key))
                amounts.append(month_total)
        
        if not months:
            return None
        
        # Create DataFrame
        df = pd.DataFrame({
            'Month': months,
            'Amount': amounts
        })
        
        # Sort by month
        df = df.sort_values('Month')
        
        # Create line chart
        fig = px.line(df, x='Month', y='Amount', 
                     title='Monthly Expense Trend',
                     labels={'Month': 'Month', 'Amount': 'Amount (₹)'})
        
        return fig

def main():
    st.set_page_config(
        page_title="Expense Tracker AI Assistant",
        page_icon="💰",
        layout="wide"
    )
    
    st.title("💰 Personal Finance AI Assistant")
    st.markdown("*Your expert guide for saving, taxes, and investments*")
    
    # Initialize chatbot
    if 'chatbot' not in st.session_state:
        st.session_state.chatbot = ExpenseChatbot()
    
    # Auto-read token from URL parameters (for seamless integration)
    query_params = st.query_params
    auto_token = query_params.get("token", [None])[0] if isinstance(query_params.get("token"), list) else query_params.get("token")
    
    # Initialize chat history
    if 'messages' not in st.session_state:
        if auto_token:
            st.session_state.messages = [
                {"role": "assistant", "content": "🎉 **Welcome back!** I've automatically connected to your expense data!\n\n💰 I'm your smart, helpful, and friendly financial assistant!\n\nI'm here to guide you step-by-step through:\n🎯 Expense tracking & budgeting (with YOUR data!)\n💰 Saving strategies & goal planning\n📊 Tax planning & optimization\n📈 Investment guidance\n🏦 Financial management tips\n\nSince you're logged in, I can provide **personalized advice** based on your actual spending patterns!\n\nTry asking me:\n• \"Analyze my spending patterns\"\n• \"How can I save 20% of my income?\"\n• \"Show me where I'm overspending\"\n\nI'll break everything down into clear steps and help you create actionable plans! 🚀"}
            ]
        else:
            st.session_state.messages = [
                {"role": "assistant", "content": "Hello! 👋 I'm your smart, helpful, and friendly financial assistant! 💰\n\nI'm here to guide you step-by-step through:\n🎯 Expense tracking & budgeting\n💰 Saving strategies & goal planning\n📊 Tax planning & optimization\n📈 Investment guidance\n🏦 Financial management tips\n\nWhether you're a student or a working professional, I'll provide detailed, practical, and personalized advice just for you!\n\nTo get started, let me know:\n• Are you a student or a working professional?\n• What's your main financial goal or question today?\n\nI'll break everything down into clear steps and help you create actionable plans! 🚀"}
            ]
    
    # Sidebar for configuration
    with st.sidebar:
        st.header("Configuration")
        
        # Authentication token input (auto-filled if from URL)
        auth_token = st.text_input("Enter your auth token:", 
                                 type="password", 
                                 key="auth_token",
                                 value=auto_token if auto_token else "")
        
        if auto_token and not st.session_state.get('auto_analyzed', False):
            st.success("🔗 **Auto-connected!** Token received from your expense tracker app!")
            st.session_state['auto_analyzed'] = True
        
        # Year and month selection for data analysis
        current_year = datetime.now().year
        selected_year = st.selectbox("Select Year for Analysis:", 
                                   range(current_year - 5, current_year + 1), 
                                   index=5)
        
        # User type selection (for demo purposes)
        user_type_manual = st.selectbox("User Type (optional):", 
                                      ["Auto-detect", "Student", "Professional", "General"])
        
        if st.button("Analyze My Expenses"):
            if auth_token:
                with st.spinner("Fetching your expense data..."):
                    expense_data = st.session_state.chatbot.get_expense_data(auth_token, selected_year)
                    analysis = st.session_state.chatbot.analyze_expenses(expense_data)
                    
                    # Add analysis to chat
                    st.session_state.messages.append({
                        "role": "assistant", 
                        "content": f"Here's your expense analysis for {selected_year}:\n\n{analysis}"
                    })
                    
                    # Create visualization
                    fig = st.session_state.chatbot.create_expense_visualization(expense_data)
                    if fig:
                        st.plotly_chart(fig, use_container_width=True)
                    
                    st.rerun()
            else:
                st.error("Please enter your authentication token first.")
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Ask me about saving, taxes, investments, or financial planning..."):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Display user message
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Generate assistant response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                # Detect user type
                if user_type_manual == "Auto-detect":
                    user_type = st.session_state.chatbot.detect_user_type(prompt)
                else:
                    user_type = user_type_manual.lower()
                
                # Get expense data if auth token is available
                expense_data = None
                if st.session_state.get('auth_token'):
                    expense_data = st.session_state.chatbot.get_expense_data(
                        st.session_state.auth_token, selected_year
                    )
                
                # Generate response
                response = st.session_state.chatbot.generate_financial_advice(
                    prompt, user_type, expense_data
                )
                
                st.markdown(response)
                
                # Add assistant response to chat history
                st.session_state.messages.append({
                    "role": "assistant", 
                    "content": response
                })

if __name__ == "__main__":
    main()

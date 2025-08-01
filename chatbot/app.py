import os
import requests
import streamlit as st
from datetime import datetime, date
from typing import Dict, List, Optional, Any
import json
from dotenv import load_dotenv
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
from huggingface_hub import HfApi
from groq import Groq
from ibm_watsonx_ai.foundation_models import Model
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai import Credentials
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Load environment variables
load_dotenv()

class ExpenseChatbot:
    def __init__(self):
        self.backend_url = os.getenv('BACKEND_API_URL', 'http://localhost:5000')
        self.setup_huggingface()
        self.setup_groq()
        self.setup_watson()
        
    def setup_huggingface(self):
        """Initialize Hugging Face AI client"""
        try:
            hf_token = os.getenv('HUGGINGFACE_TOKEN')
            if hf_token and hf_token != 'your_huggingface_token_here':
                # Use a lightweight, efficient model for financial advice
                model_name = "microsoft/DialoGPT-small"  # Faster loading and inference
                
                self.hf_tokenizer = AutoTokenizer.from_pretrained(model_name, token=hf_token)
                
                # Add pad token if it doesn't exist
                if self.hf_tokenizer.pad_token is None:
                    self.hf_tokenizer.pad_token = self.hf_tokenizer.eos_token
                
                # Use pipeline for easier inference
                self.hf_pipeline = pipeline(
                    "text-generation",
                    model=model_name,
                    tokenizer=self.hf_tokenizer,
                    token=hf_token,
                    max_new_tokens=200,  # Use max_new_tokens instead of max_length
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=self.hf_tokenizer.eos_token_id
                )
                st.success("✅ Hugging Face AI initialized successfully!")
                st.info(f"🤖 Using model: {model_name}")
            else:
                self.hf_pipeline = None
                self.hf_tokenizer = None
                st.warning("⚠️ Hugging Face token not provided. Using fallback mode.")
        except Exception as e:
            st.error(f"Failed to initialize Hugging Face AI: {str(e)}")
            self.hf_pipeline = None
            self.hf_tokenizer = None
        
    def setup_groq(self):
        """Initialize Groq AI client (now as fallback)"""
        try:
            groq_api_key = os.getenv('GROQ_API_KEY')
            if groq_api_key and groq_api_key != 'your_groq_api_key_here':
                self.groq_client = Groq(api_key=groq_api_key)
                st.info("✅ Groq AI initialized as fallback service!")
            else:
                self.groq_client = None
                st.info("ℹ️ Groq API key not provided. Using other fallback modes.")
        except Exception as e:
            st.warning(f"Groq AI initialization failed: {str(e)}")
            self.groq_client = None
        
    def setup_watson(self):
        """Initialize IBM Watson AI with Granite model"""
        try:
            # Watson AI credentials
            credentials = Credentials(
                url=os.getenv('IBM_WATSONX_URL', 'https://us-south.ml.cloud.ibm.com'),
                api_key=os.getenv('IBM_WATSONX_API_KEY')
            )
            
            # Model parameters for IBM Granite 3B
            self.model_params = {
                GenParams.DECODING_METHOD: "greedy",
                GenParams.MAX_NEW_TOKENS: 500,
                GenParams.MIN_NEW_TOKENS: 1,
                GenParams.TEMPERATURE: 0.7,
                GenParams.TOP_P: 1.0,
                GenParams.REPETITION_PENALTY: 1.1
            }
            
            # Initialize Granite 3B model
            self.model = Model(
                model_id="ibm/granite-3b-code-instruct",
                params=self.model_params,
                credentials=credentials,
                project_id=os.getenv('IBM_WATSONX_PROJECT_ID')
            )
            
        except Exception as e:
            st.error(f"Failed to initialize Watson AI: {str(e)}")
            self.model = None
    
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
    
    def adjust_response_tone(self, response: str, user_type: str) -> str:
        """Adjust response tone based on user type"""
        tone_prompts = {
            "student": "Simplify this explanation and make it more educational and encouraging: ",
            "professional": "Make this response more formal and include relevant business terminology: ",
            "general": "Make this response conversational and helpful: "
        }
        
        if self.model and user_type in tone_prompts:
            try:
                adjusted_prompt = tone_prompts[user_type] + response
                adjusted_response = self.model.generate_text(prompt=adjusted_prompt)
                return adjusted_response
            except:
                return response
        return response
    
    def generate_huggingface_response(self, prompt: str, user_type: str = "general") -> str:
        """Generate response using Hugging Face AI (Primary service)"""
        if not self.hf_pipeline:
            return "Hugging Face AI not available. Please configure HUGGINGFACE_TOKEN."
        
        try:
            # System prompts for different user types based on comprehensive financial assistant approach
            system_prompts = {
                "student": """You are a smart, helpful, and friendly financial assistant specifically for students. Your job is to guide users step-by-step through financial topics including expense tracking, budgeting, saving strategies, and taxes. Your answers should be detailed, practical, and personalized for students.

🟢 When a student asks a financial question:
- Start by understanding their financial situation (income, expenses, goals)
- Ask clarifying questions if needed (e.g., pocket money, rent, location, goals)
- Break down the response into clear steps or strategies
- Provide helpful tools or formulas (e.g., savings rate, emergency fund calculations)
- Warn about common student financial mistakes and suggest best practices
- Include practical tips for students (part-time work, student discounts, etc.)

🧠 Focus on student-specific scenarios like:
- Budgeting pocket money or part-time income
- Saving for gadgets, books, or education expenses
- Managing hostel/PG expenses
- Building early financial habits

🔐 Assume user data privacy and never store or share user info.
🚀 Goal: Make financial literacy simple, actionable, and achievable for Indian students.

Always conclude with: "Would you like a summary, a downloadable guide, or help creating a plan now?" """,

                "professional": """You are a smart, helpful, and friendly financial assistant specifically for working professionals. Your job is to guide users step-by-step through financial topics including expense tracking, budgeting, saving strategies, taxes, and investments. Your answers should be detailed, practical, and personalized for professionals.

🟢 When a professional asks a financial question:
- Start by understanding their career stage and financial situation (salary, family, goals)
- Ask clarifying questions if needed (e.g., income, EMIs, dependents, investment goals)
- Break down the response into clear steps or strategies
- Provide advanced tools or formulas (e.g., tax calculations, investment returns, retirement planning)
- Warn about common professional financial mistakes and suggest best practices
- Include professional-specific advice (tax savings, career investments, insurance)

🧠 Focus on professional scenarios like:
- Salary budgeting and tax planning
- Investment strategies and portfolio management
- Home loans, insurance, and major purchases
- Retirement planning and wealth building

🔐 Assume user data privacy and never store or share user info.
🚀 Goal: Make advanced financial planning simple, actionable, and achievable for Indian professionals.

Always conclude with: "Would you like a summary, a downloadable guide, or help creating a plan now?" """,

                "general": """You are a smart, helpful, and friendly financial assistant for both students and professionals. Your job is to guide users step-by-step through financial topics including expense tracking, budgeting, saving strategies, and taxes. Your answers should be detailed, practical, and personalized based on whether the user is a student or a working professional.

🟢 When a user asks a financial question:
- Start by understanding if they are a student or a working professional (if not already known)
- Ask clarifying questions if needed to personalize the answer (e.g., income, rent, location, goals)
- Break down the response into clear steps or strategies
- Provide helpful tools or formulas (e.g., how to calculate savings rate, emergency fund, tax slab, etc.)
- Warn about common mistakes and suggest best practices
- Include links or references to trustworthy resources when necessary

🧠 You can handle queries like:
- "How to budget my monthly income?"
- "How much should I save as a student with ₹10,000 per month?"
- "I'm a professional earning ₹60,000/month—how much tax will I pay?"
- "How do I track my expenses?"
- "Suggest the best app or method to manage finances."

🔐 Assume user data privacy and never store or share user info.
🚀 Goal: Make financial literacy simple, actionable, and achievable for Indian users.

Always conclude with: "Would you like a summary, a downloadable guide, or help creating a plan now?" """
            }
            
            system_prompt = system_prompts.get(user_type, system_prompts["general"])
            
            # Enhanced prompt for step-by-step financial guidance
            enhanced_prompt = f"""
            {system_prompt}
            
            User query: {prompt}
            
            Response (provide detailed, step-by-step guidance):"""
            
            # Generate response using Hugging Face pipeline
            response = self.hf_pipeline(
                enhanced_prompt,
                max_new_tokens=200,  # Use max_new_tokens instead of max_length
                num_return_sequences=1,
                temperature=0.7,
                do_sample=True,
                pad_token_id=self.hf_tokenizer.eos_token_id
            )
            
            # Extract the generated text (remove the input prompt)
            generated_text = response[0]['generated_text']
            if "Response:" in generated_text:
                response_text = generated_text.split("Response:")[-1].strip()
            else:
                # Fallback: try to extract response after the prompt
                response_text = generated_text[len(enhanced_prompt):].strip()
            
            # Clean up the response
            response_text = response_text.replace("<|endoftext|>", "").strip()
            
            # Ensure we have a meaningful response
            if len(response_text) < 10:
                response_text = "I'd be happy to help you with comprehensive financial guidance! 🎯\n\nTo provide you with the most personalized and detailed advice, could you please tell me:\n• Are you a student or a working professional?\n• What's your specific financial question or goal?\n• Any details about your income or financial situation?\n\nI'll then break down my response into clear, actionable steps just for you!"
            
            return response_text
            
        except Exception as e:
            st.error(f"Hugging Face AI error: {str(e)}")
            return f"I apologize, but I'm experiencing technical difficulties with the AI service. Please try again later. Error: {str(e)}"

    def generate_groq_response(self, prompt: str, user_type: str = "general") -> str:
        """Generate response using Groq AI"""
        if not self.groq_client:
            return "Groq AI not available. Please configure GROQ_API_KEY."
        
        try:
            # System prompts for different user types based on comprehensive financial assistant approach
            system_prompts = {
                "student": """You are a smart, helpful, and friendly financial assistant specifically for students. Your job is to guide users step-by-step through financial topics including expense tracking, budgeting, saving strategies, and taxes. Your answers should be detailed, practical, and personalized for students.

🟢 When a student asks a financial question:
- Start by understanding their financial situation (income, expenses, goals)
- Ask clarifying questions if needed (e.g., pocket money, rent, location, goals)
- Break down the response into clear steps or strategies
- Provide helpful tools or formulas (e.g., savings rate, emergency fund calculations)
- Warn about common student financial mistakes and suggest best practices
- Include practical tips for students (part-time work, student discounts, etc.)

🧠 Focus on student-specific scenarios like:
- Budgeting pocket money or part-time income
- Saving for gadgets, books, or education expenses
- Managing hostel/PG expenses
- Building early financial habits

🔐 Assume user data privacy and never store or share user info.
🚀 Goal: Make financial literacy simple, actionable, and achievable for Indian students.

Always conclude with: "Would you like a summary, a downloadable guide, or help creating a plan now?" """,

                "professional": """You are a smart, helpful, and friendly financial assistant specifically for working professionals. Your job is to guide users step-by-step through financial topics including expense tracking, budgeting, saving strategies, taxes, and investments. Your answers should be detailed, practical, and personalized for professionals.

🟢 When a professional asks a financial question:
- Start by understanding their career stage and financial situation (salary, family, goals)
- Ask clarifying questions if needed (e.g., income, EMIs, dependents, investment goals)
- Break down the response into clear steps or strategies
- Provide advanced tools or formulas (e.g., tax calculations, investment returns, retirement planning)
- Warn about common professional financial mistakes and suggest best practices
- Include professional-specific advice (tax savings, career investments, insurance)

🧠 Focus on professional scenarios like:
- Salary budgeting and tax planning
- Investment strategies and portfolio management
- Home loans, insurance, and major purchases
- Retirement planning and wealth building

🔐 Assume user data privacy and never store or share user info.
🚀 Goal: Make advanced financial planning simple, actionable, and achievable for Indian professionals.

Always conclude with: "Would you like a summary, a downloadable guide, or help creating a plan now?" """,

                "general": """You are a smart, helpful, and friendly financial assistant for both students and professionals. Your job is to guide users step-by-step through financial topics including expense tracking, budgeting, saving strategies, and taxes. Your answers should be detailed, practical, and personalized based on whether the user is a student or a working professional.

🟢 When a user asks a financial question:
- Start by understanding if they are a student or a working professional (if not already known)
- Ask clarifying questions if needed to personalize the answer (e.g., income, rent, location, goals)
- Break down the response into clear steps or strategies
- Provide helpful tools or formulas (e.g., how to calculate savings rate, emergency fund, tax slab, etc.)
- Warn about common mistakes and suggest best practices
- Include links or references to trustworthy resources when necessary

🧠 You can handle queries like:
- "How to budget my monthly income?"
- "How much should I save as a student with ₹10,000 per month?"
- "I'm a professional earning ₹60,000/month—how much tax will I pay?"
- "How do I track my expenses?"
- "Suggest the best app or method to manage finances."

🔐 Assume user data privacy and never store or share user info.
🚀 Goal: Make financial literacy simple, actionable, and achievable for Indian users.

Always conclude with: "Would you like a summary, a downloadable guide, or help creating a plan now?" """
            }
            
            system_prompt = system_prompts.get(user_type, system_prompts["general"])
            
            # Enhanced prompt for step-by-step financial guidance
            enhanced_prompt = f"""
            {system_prompt}
            
            User query: {prompt}
            
            Please provide detailed, step-by-step guidance following the system instructions above.
            """
            
            # Generate response using Groq
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user", 
                        "content": enhanced_prompt
                    }
                ],
                model="mixtral-8x7b-32768",  # Fast and capable model
                temperature=0.7,
                max_tokens=500,
                top_p=1,
                stream=False
            )
            
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            st.error(f"Groq AI error: {str(e)}")
            return f"I apologize, but I'm experiencing technical difficulties. Please try again later. Error: {str(e)}"
    
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
                
                # Categorize expenses (you can enhance this based on expense names)
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
    
    def generate_expense_advice(self, query: str, user_type: str, expense_data: Dict = None) -> str:
        """Generate contextual advice using Hugging Face AI (primary) with Groq and IBM Watson as fallbacks"""
        
        # Create context from expense data
        context = ""
        if expense_data and "error" not in expense_data:
            context = self.analyze_expenses(expense_data)
        
        # Enhanced prompt with expense context
        if context:
            enhanced_query = f"""
            Here's my expense data context:
            {context}
            
            My question: {query}
            
            Please provide advice considering my actual spending patterns.
            """
        else:
            enhanced_query = query
        
        # Try Hugging Face first (primary service)
        if self.hf_pipeline:
            try:
                return self.generate_huggingface_response(enhanced_query, user_type)
            except Exception as e:
                st.warning(f"Hugging Face AI failed, trying Groq fallback: {str(e)}")
        
        # Try Groq as first fallback
        if self.groq_client:
            try:
                return self.generate_groq_response(enhanced_query, user_type)
            except Exception as e:
                st.warning(f"Groq AI failed, trying Watson fallback: {str(e)}")
        
        # Fallback to IBM Watson if both Hugging Face and Groq fail or aren't available
        if not self.model:
            return """I'm sorry, but all AI services are currently unavailable. 
            However, I can still help you with basic expense tracking and analysis. 
            Please make sure to configure your API keys in the .env file:
            - HUGGINGFACE_TOKEN for Hugging Face AI responses (primary)
            - GROQ_API_KEY for fast Groq AI responses (fallback)
            - IBM_WATSONX_API_KEY for IBM Watson fallback"""
        
        # Customize Watson prompt based on user type with comprehensive financial assistant approach
        if user_type == "student":
            system_prompt = """You are a smart, helpful, and friendly financial assistant specifically for students. Your job is to guide users step-by-step through financial topics including expense tracking, budgeting, saving strategies, and taxes. Your answers should be detailed, practical, and personalized for students.

🟢 When a student asks a financial question:
- Start by understanding their financial situation (income, expenses, goals)
- Ask clarifying questions if needed (e.g., pocket money, rent, location, goals)
- Break down the response into clear steps or strategies
- Provide helpful tools or formulas (e.g., savings rate, emergency fund calculations)
- Warn about common student financial mistakes and suggest best practices
- Include practical tips for students (part-time work, student discounts, etc.)

Focus on student-specific scenarios and always conclude with: "Would you like a summary, a downloadable guide, or help creating a plan now?" """
        elif user_type == "professional":
            system_prompt = """You are a smart, helpful, and friendly financial assistant specifically for working professionals. Your job is to guide users step-by-step through financial topics including expense tracking, budgeting, saving strategies, taxes, and investments. Your answers should be detailed, practical, and personalized for professionals.

🟢 When a professional asks a financial question:
- Start by understanding their career stage and financial situation (salary, family, goals)
- Ask clarifying questions if needed (e.g., income, EMIs, dependents, investment goals)
- Break down the response into clear steps or strategies
- Provide advanced tools or formulas (e.g., tax calculations, investment returns, retirement planning)
- Warn about common professional financial mistakes and suggest best practices
- Include professional-specific advice (tax savings, career investments, insurance)

Focus on professional scenarios and always conclude with: "Would you like a summary, a downloadable guide, or help creating a plan now?" """
        else:
            system_prompt = """You are a smart, helpful, and friendly financial assistant for both students and professionals. Your job is to guide users step-by-step through financial topics including expense tracking, budgeting, saving strategies, and taxes. Your answers should be detailed, practical, and personalized.

🟢 When a user asks a financial question:
- Start by understanding if they are a student or a working professional (if not already known)
- Ask clarifying questions if needed to personalize the answer (e.g., income, rent, location, goals)
- Break down the response into clear steps or strategies
- Provide helpful tools or formulas (e.g., how to calculate savings rate, emergency fund, tax slab, etc.)
- Warn about common mistakes and suggest best practices

Goal: Make financial literacy simple, actionable, and achievable for Indian users. Always conclude with: "Would you like a summary, a downloadable guide, or help creating a plan now?" """
        
        full_prompt = f"""
        {system_prompt}
        
        Context about user's expenses:
        {context}
        
        User question: {query}
        
        Provide a helpful response that addresses their specific question while considering their expense data.
        """
        
        try:
            response = self.model.generate_text(prompt=full_prompt)
            return response
        except Exception as e:
            return f"I encountered an error while generating advice: {str(e)}"
    
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
    st.markdown("*Powered by Hugging Face AI - Your expert guide for saving, taxes, and investments*")
    
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
                response = st.session_state.chatbot.generate_expense_advice(
                    prompt, user_type, expense_data
                )
                
                # Adjust tone based on user type
                final_response = st.session_state.chatbot.adjust_response_tone(response, user_type)
                
                st.markdown(final_response)
                
                # Add assistant response to chat history
                st.session_state.messages.append({
                    "role": "assistant", 
                    "content": final_response
                })

if __name__ == "__main__":
    main()

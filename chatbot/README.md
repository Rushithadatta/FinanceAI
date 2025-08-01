# Expense Tracker AI Chatbot

This intelligent chatbot integrates with your expense tracker application using Hugging Face AI models to provide conversational financial advice and expense analysis.

## Features

- **Demographic-Aware Communication**: Automatically detects and adjusts to user types (student, professional, general)
- **Conversational NLP**: Powered by Hugging Face transformers for natural language understanding
- **Expense Analysis**: Real-time analysis of your expense data with visualizations
- **Contextual Advice**: Personalized financial recommendations based on your spending patterns
- **Interactive Interface**: Clean Streamlit-based web interface
- **Multi-AI Support**: Primary Hugging Face AI with Groq and IBM Watson fallbacks

## Technologies Used

- **Python**: Core programming language
- **Streamlit**: Web application framework
- **Hugging Face Transformers**: Primary AI service for conversational responses
- **Groq AI**: Fast fallback AI service
- **IBM Watson AI**: Secondary fallback for accessing Granite models
- **Microsoft DialoGPT**: Conversational AI model
- **Plotly**: Data visualization
- **Pandas**: Data manipulation

## Setup Instructions

### Prerequisites

1. **Miniconda Installation**
   - Download and install Miniconda from: https://docs.conda.io/en/latest/miniconda.html
   - Make sure `conda` is added to your system PATH

2. **API Tokens Required**
   - **HuggingFace Token**: Get from https://huggingface.co/settings/tokens
   - **IBM Watson API Key**: Get from IBM Cloud Console
   - **IBM Watson Project ID**: From your Watson Machine Learning project

### Installation

1. **Run the setup script**:
   ```bash
   cd chatbot
   setup.bat
   ```

2. **Configure environment variables**:
   - Open `.env` file
   - Add your tokens:
     ```
     HUGGINGFACE_TOKEN=your_token_here
     IBM_WATSONX_API_KEY=your_api_key_here
     IBM_WATSONX_PROJECT_ID=your_project_id_here
     ```

3. **Start the chatbot**:
   ```bash
   run_chatbot.bat
   ```

### Manual Setup (Alternative)

If the batch files don't work, you can set up manually:

```bash
# Create conda environment
conda create -n expense-chatbot python=3.10 -y

# Activate environment
conda activate expense-chatbot

# Install dependencies
pip install -r requirements.txt

# Run the application
streamlit run app.py
```

## Usage

1. **Start your expense tracker backend** (make sure it's running on port 5000)
2. **Run the chatbot** using `run_chatbot.bat`
3. **Open browser** to http://localhost:8501
4. **Enter your auth token** in the sidebar
5. **Start chatting** with the AI assistant!

## User Types & Communication Styles

### Student Mode
- Simplified language and explanations
- Educational content focus
- Encouraging and supportive tone
- Basic budgeting concepts

### Professional Mode
- Formal business language
- Advanced financial terminology
- Strategic insights and analysis
- ROI and optimization focus

### General Mode
- Conversational and friendly tone
- Practical, actionable advice
- Easy-to-understand concepts

## Example Conversations

**Student**: "Help me understand my spending"
- Response includes basic budgeting education and simple breakdown

**Professional**: "Analyze my quarterly expense trends"
- Response includes professional terminology and strategic insights

**General**: "How can I save money on food?"
- Response provides practical, actionable tips

## API Integration

The chatbot integrates with your expense tracker backend:

- **GET /api/expenses/annual/:year** - Fetch annual expense data
- **GET /api/expenses/:year/:month** - Fetch monthly expense data
- Uses JWT authentication tokens

## Troubleshooting

### Common Issues

1. **Conda not found**
   - Install Miniconda and add to PATH
   - Restart command prompt

2. **IBM Watson authentication fails**
   - Verify API key and project ID
   - Check IBM Cloud service is active

3. **Backend connection fails**
   - Ensure expense tracker backend is running
   - Check BACKEND_API_URL in .env file

4. **Dependencies installation fails**
   - Try upgrading pip: `pip install --upgrade pip`
   - Install packages individually if needed

### Performance Tips

- The IBM Granite 3B model provides good performance balance
- Responses typically take 2-5 seconds
- For faster responses, consider using smaller models in development

## Contributing

Feel free to enhance the chatbot with:
- Additional user types
- More sophisticated expense categorization
- Advanced visualization options
- Multi-language support

## License

This project is part of the Expense Tracker application.

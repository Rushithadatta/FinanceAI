import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useAuth(); // Get auth token from context

  // Function to open Streamlit chatbot with auto-authentication
  const openStreamlitChatbot = () => {
    if (token) {
      // Pass token as URL parameter to Streamlit app
      const streamlitUrl = `http://localhost:8502?token=${encodeURIComponent(token)}`;
      window.open(streamlitUrl, '_blank');
    } else {
      alert('Please login first to use the AI Assistant');
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      // When opening chat, redirect to Streamlit
      openStreamlitChatbot();
    }
    setIsOpen(!isOpen);
  };

  const detectUserType = (message) => {
    const professionalIndicators = ['budget', 'financial', 'analysis', 'report', 'quarterly', 'ROI'];
    const studentIndicators = ['homework', 'assignment', 'simple', 'basic', 'learn', 'help me understand'];
    
    const messageLower = message.toLowerCase();
    
    if (professionalIndicators.some(indicator => messageLower.includes(indicator))) {
      return 'professional';
    } else if (studentIndicators.some(indicator => messageLower.includes(indicator))) {
      return 'student';
    } else {
      return 'general';
    }
  };

  const generateResponse = async (userMessage, userType) => {
    try {
      // In a real implementation, this would call your Streamlit backend
      // For now, we'll simulate the demographic-aware responses
      
      const responses = {
        student: {
          greeting: "Hi there! Let me help you understand your expenses in simple terms.",
          budgeting: "Budgeting is like planning your allowance! First, list all your income (like part-time job money), then your necessary expenses (like textbooks), and see what's left for fun stuff.",
          analysis: "Looking at your spending, I can see you spend most on food and transportation. That's normal for students! Try cooking more meals at home to save money.",
          saving: "Great question! Start small - even saving $5 a week adds up. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings."
        },
        professional: {
          greeting: "Good day. I'm here to provide strategic financial analysis and optimization recommendations.",
          budgeting: "Based on your expense portfolio, I recommend implementing a zero-based budgeting approach with quarterly reviews to maximize ROI on discretionary spending.",
          analysis: "Your expenditure patterns indicate a 15% variance from industry benchmarks. Consider reallocating resources from transportation to investment opportunities.",
          saving: "I suggest diversifying your savings strategy with automated transfers to high-yield accounts and exploring tax-advantaged investment vehicles."
        },
        general: {
          greeting: "Hello! I'm here to help you manage your money better. What's on your mind?",
          budgeting: "Let's create a simple budget together! Start by tracking where your money goes for a week, then we can find areas to improve.",
          analysis: "I can see from your expenses that you're doing pretty well! Your biggest categories are housing and food, which is typical for most people.",
          saving: "Saving money doesn't have to be hard! Start with small goals like $25 a week, and gradually increase as it becomes a habit."
        }
      };

      const userTypeResponses = responses[userType] || responses.general;
      
      // Simple keyword matching for demo
      const messageLower = userMessage.toLowerCase();
      let response;
      
      if (messageLower.includes('budget')) {
        response = userTypeResponses.budgeting;
      } else if (messageLower.includes('analyz') || messageLower.includes('spending')) {
        response = userTypeResponses.analysis;
      } else if (messageLower.includes('save') || messageLower.includes('money')) {
        response = userTypeResponses.saving;
      } else {
        response = userTypeResponses.greeting;
      }

      return response;
      
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Detect user type
      const userType = detectUserType(inputMessage);
      
      // Generate response
      const responseText = await generateResponse(inputMessage, userType);
      
      const botMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        userType: userType
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Analyze my spending patterns",
    "How can I save more money?",
    "Help me create a budget",
    "What are my biggest expenses?"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className={`chat-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="chat-icon">
          {isOpen ? '✕' : '💬'}
        </div>
        <div className="chat-label">AI Assistant</div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>🤖 AI Expense Assistant</h3>
            <p>Powered by IBM Granite 3B</p>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                    {message.userType && (
                      <span className={`user-type-badge ${message.userType}`}>
                        {message.userType}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="quick-questions">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>

          <div className="chatbot-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your expenses or financial advice..."
              rows="2"
            />
            <button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              {isLoading ? '⏳' : '📤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

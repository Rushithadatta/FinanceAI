import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ChatBot.css';

const ChatBot = () => {
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

  return (
    <>
      {/* AI Assistant Launcher Button */}
      <div className="chat-toggle" onClick={openStreamlitChatbot}>
        <div className="chat-icon">
          🤖
        </div>
        <div className="chat-label">AI Assistant</div>
      </div>
    </>
  );
};

export default ChatBot;

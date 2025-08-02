import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ChatBot.css';

const ChatBot = () => {
  const { token, isAuthenticated, user } = useAuth(); // Get auth token from context

  // Function to open Streamlit chatbot with auto-authentication
  const openStreamlitChatbot = () => {
    console.log('ChatBot Debug:', { token, isAuthenticated, user }); // Debug info
    
    if (token && isAuthenticated) {
      // Pass token as URL parameter to Streamlit app
      const streamlitUrl = `https://chatbot-60tp.onrender.com?token=${encodeURIComponent(token)}`;
      window.open(streamlitUrl, '_blank');
    } else {
      alert(`Please login first to use the AI Assistant. Status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}, Token: ${token ? 'Present' : 'Missing'}`);
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

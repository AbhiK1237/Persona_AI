// src/App.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import './App.css';
import { sendMessage } from './api';
import ThemeToggle from './components/ThemeToggle';
import { ThemeContext } from './contexts/ThemeContext';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [thoughtProcess, setThoughtProcess] = useState([]);
  const messagesEndRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thoughtProcess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setThinking(true);
    setThoughtProcess([]);

    try {
      // Make API call to your Python backend
      const response = await sendMessage(input);
      
      // Process the response steps
      const steps = response.steps || [];
      
      // Show thinking process for plan steps
      let thoughts = [];
      for (const step of steps) {
        if (step.step === 'plan') {
          thoughts.push(step.content);
          setThoughtProcess(thoughts);
          // Add a small delay to show thinking progression
          await new Promise(r => setTimeout(r, 500));
        }
      }

      // Find the output step and add as AI message
      const outputStep = steps.find(step => step.step === 'output');
      if (outputStep) {
        const aiMessage = { role: 'assistant', content: outputStep.content };
        setTimeout(() => {
          setMessages(prev => [...prev, aiMessage]);
          setThinking(false);
          setThoughtProcess([]);
        }, 500); // Small delay for UI transition
      }
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Arre yaar, kuch technical issue ho gaya. Chai piyo aur thodi der baad try karo!' 
      }]);
      setThinking(false);
      setThoughtProcess([]);
    }
  };

  // Format message content with code highlighting (basic implementation)
  const formatMessageContent = (content) => {
    // Simple code formatting for inline code
    const formattedContent = content.replace(
      /`([^`]+)`/g, 
      '<code>$1</code>'
    );
    
    return (
      <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
    );
  };

  return (
    <div className="app">
      <ThemeToggle />
      
      <header className="header">
        <h1>Chai aur Code with Hitesh</h1>
        <p>Ask anything about coding, tech, or learning resources</p>
      </header>

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <img src="/download.jpeg" alt="Hitesh logo" className="chai-icon" />
              <p>Haan ji! Kaise ho aap? Ask me anything about coding, tech, or learning!</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              {message.role === 'assistant' && (
                <div className="avatar">
                  <img src="/download.jpeg" alt="Hitesh" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                </div>
              )}
              <div className="message-content">
                {formatMessageContent(message.content)}
              </div>
            </div>
          ))}

          {thinking && (
            <div className="ai-thinking">
              <div className="avatar">
                <img src="/download.jpeg" alt="Hitesh thinking" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
              </div>
              <div className="thinking-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                
                {thoughtProcess.length > 0 && (
                  <div className="thought-process">
                    {thoughtProcess.map((thought, idx) => (
                      <p key={idx} className="thought-bubble">🧠 {thought}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            disabled={thinking}
            className="chat-input"
          />
          <button 
            type="submit" 
            disabled={thinking || !input.trim()} 
            className="send-button"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
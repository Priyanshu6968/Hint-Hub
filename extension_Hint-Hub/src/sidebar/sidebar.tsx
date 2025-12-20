import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { X, Send, Sparkles, Code, Trash2, Loader2 } from 'lucide-react';
import '../styles/globals.css';
import './sidebar.css';
import { ChatMessage, LeetCodeProblem } from '../shared/types';
import { sendMessageToBackground } from '../shared/messaging';

function Sidebar() {
  const [problem, setProblem] = useState<LeetCodeProblem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('javascript');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Notify parent that sidebar is ready
    window.parent.postMessage({ type: 'SIDEBAR_READY' }, '*');

    // Listen for messages from content script
    window.addEventListener('message', handleMessage);

    // Load conversation history
    loadConversation();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (problem) {
      loadConversation();
    }
  }, [problem?.problemId]);

  const handleMessage = (event: MessageEvent) => {
    const { type, payload } = event.data;

    switch (type) {
      case 'PROBLEM_DATA':
        setProblem(payload);
        break;
      case 'CURRENT_CODE':
        setCurrentCode(payload.code);
        setCurrentLanguage(payload.language);
        break;
    }
  };

  const loadConversation = async () => {
    if (!problem?.problemId) return;

    try {
      const response = await sendMessageToBackground({
        type: 'GET_CONVERSATION',
        payload: { problemId: problem.problemId },
      });

      if (response.success && response.messages) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !problem || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to UI immediately
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await sendMessageToBackground({
        type: 'GET_AI_RESPONSE',
        payload: {
          userMessage,
          problemContext: `${problem.title}\n\n${problem.description}`,
          code: currentCode,
          language: currentLanguage,
          problemId: problem.problemId,
        },
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Add AI response to messages
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, there was an error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCodeHelp = () => {
    // Request current code from content script
    window.parent.postMessage({ type: 'GET_CURRENT_CODE' }, '*');

    // Add message after a delay to allow code to be fetched
    setTimeout(() => {
      setInputMessage('Can you help me with my current code?');
    }, 500);
  };

  const handleClearConversation = async () => {
    if (!problem?.problemId) return;

    try {
      await sendMessageToBackground({
        type: 'CLEAR_CONVERSATION',
        payload: { problemId: problem.problemId },
      });
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  };

  const handleClose = () => {
    window.parent.postMessage({ type: 'CLOSE_SIDEBAR' }, '*');
  };

  return (
    <div className="sidebar-container">
      {/* Header */}
      <div className="sidebar-header">
        <div className="flex items-center gap-2">
          <div className="icon-gradient">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="sidebar-title">Hint Hub Assistant</h1>
            {problem && (
              <p className="problem-name">
                {problem.title}
                <span className={`difficulty difficulty-${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
              </p>
            )}
          </div>
        </div>
        <button onClick={handleClose} className="close-button">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <Sparkles size={48} className="empty-icon" />
            <h3>Ready to help!</h3>
            <p>Ask me anything about the problem or request hints.</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className={`message message-${msg.role}`}>
                <div className="message-content">
                  {msg.content.split('```').map((part, i) => {
                    if (i % 2 === 1) {
                      // Code block
                      return (
                        <pre key={i} className="code-block">
                          <code>{part}</code>
                        </pre>
                      );
                    }
                    return <p key={i}>{part}</p>;
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={handleGetCodeHelp} className="action-button" disabled={isLoading}>
          <Code size={16} />
          Help with Code
        </button>
        <button
          onClick={handleClearConversation}
          className="action-button"
          disabled={isLoading || messages.length === 0}
        >
          <Trash2 size={16} />
          Clear Chat
        </button>
      </div>

      {/* Input */}
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask for a hint..."
          className="message-input"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="send-button"
          disabled={!inputMessage.trim() || isLoading}
        >
          {isLoading ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Sidebar />);

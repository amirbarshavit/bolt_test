import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, ArrowUp, User, Bot } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage: Message = { text: inputText, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await axios.get(`http://localhost:3000/ask/?question=${encodeURIComponent(inputText)}`);
      const botMessage: Message = { text: response.data, isUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = 'Error fetching response from the server';
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Sorry, there was an error processing your request.', isUser: false },
        { text: errorMessage, isUser: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mr-3"></div>
          <h1 className="text-xl font-semibold text-gray-800">Sophisticated Chat</h1>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-5xl mx-auto w-full">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-lg p-4 shadow-md ${
              message.isUser ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-white'
            }`}>
              <div className={`flex items-center mb-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                {message.isUser ? (
                  <>
                    <span className="text-sm font-medium mr-2">You</span>
                    <User size={16} />
                  </>
                ) : (
                  <>
                    <Bot size={16} />
                    <span className="text-sm font-medium ml-2">Bot</span>
                  </>
                )}
              </div>
              <div className={`text-sm ${message.isUser ? 'text-white' : 'text-gray-800'}`}>
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white shadow-md p-4">
        <div className="flex items-center max-w-5xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border border-gray-300 rounded-l-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="Share your thoughts..."
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-r-full hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
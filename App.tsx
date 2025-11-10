
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { ChatInput } from './components/ChatInput';
import { ChatMessageComponent } from './components/ChatMessage';
import { startChat } from './services/geminiService';
import { ChatMessage, MessageRole } from './types';

function App() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = startChat();
    setChatHistory([
      {
        role: MessageRole.MODEL,
        text: "Welcome to the Public Sector AI Assistant. How can I assist you with matters of governance, policy, or public administration today?",
      },
    ]);
  }, []);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async (message: string) => {
    if (!chatRef.current) return;
    
    const userMessage: ChatMessage = { role: MessageRole.USER, text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessageStream({ message });
      let modelResponseText = '';
      
      setChatHistory(prev => [...prev, { role: MessageRole.MODEL, text: '...' }]);

      for await (const chunk of result) {
        modelResponseText += chunk.text;
        setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { role: MessageRole.MODEL, text: modelResponseText };
            return newHistory;
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: MessageRole.MODEL,
        text: "I'm sorry, but I encountered an error while processing your request. Please try again later.",
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Public Sector AI Assistant</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your guide to governance and public policy</p>
        </div>
      </header>
      
      <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto flex flex-col space-y-4">
              {chatHistory.map((msg, index) => (
                  <ChatMessageComponent key={index} message={msg} />
              ))}
              {isLoading && chatHistory[chatHistory.length - 1].role === MessageRole.USER && (
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-600 dark:text-gray-300">
                            <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 001.5 0V3.75a.75.75 0 00-1.5 0zM7.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 001.5 0V3.75a.75.75 0 00-1.5 0zM10.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 001.5 0V3.75a.75.75 0 00-1.5 0zM13.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 001.5 0V3.75a.75.75 0 00-1.5 0zM17.625 1.625a.75.75 0 00-1.125 0l-3 3a.75.75 0 000 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 000-1.06l-3-3z" clipRule="evenodd" />
                            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl px-5 py-3 rounded-2xl shadow-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                </div>
              )}
          </div>
      </main>

      <footer className="sticky bottom-0">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
}

export default App;

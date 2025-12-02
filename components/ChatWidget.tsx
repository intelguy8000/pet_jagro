'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: '#7CB9E8',
          boxShadow: '0 4px 20px rgba(124, 185, 232, 0.4)'
        }}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'w-[460px] h-[600px]'
              : 'w-96 h-[500px]'
          }`}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0'
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, #7CB9E8 0%, #5B9BD5 100%)',
              borderColor: '#E2E8F0'
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#86EFAC' }}></div>
              <h3 className="font-semibold text-white text-sm">Asistente J Agro</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:bg-white/20 text-xs px-2 py-1 rounded transition-colors"
                title={isExpanded ? 'Contraer' : 'Expandir'}
              >
                {isExpanded ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setMessages([])}
                className="text-white hover:bg-white/20 text-xs px-2 py-1 rounded transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: '#F8FAFC' }}>
            {messages.length === 0 && (
              <div className="text-center text-sm mt-8" style={{ color: '#64748B' }}>
                <p>Pregúntame sobre productos, pedidos,</p>
                <p>mensajeros o inventario</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'text-white'
                      : ''
                  }`}
                  style={{
                    backgroundColor: msg.role === 'user' ? '#7CB9E8' : '#FFFFFF',
                    color: msg.role === 'user' ? '#FFFFFF' : '#1E293B',
                    border: msg.role === 'user' ? 'none' : '1px solid #E2E8F0',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#7CB9E8' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#7CB9E8', animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#7CB9E8', animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t"
            style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: '#F8FAFC',
                  color: '#1E293B',
                  border: '1px solid #E2E8F0'
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 disabled:opacity-50"
                style={{ backgroundColor: '#7CB9E8' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#5B9BD5';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#7CB9E8';
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

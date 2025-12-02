'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

// Sugerencias de preguntas rápidas
const suggestions = [
  { icon: "📦", text: "¿Pedidos en proceso?" },
  { icon: "⚠️", text: "¿Productos con stock bajo?" },
  { icon: "💰", text: "Resumen de liquidaciones" },
  { icon: "🚚", text: "¿Pedidos para zona Norte?" },
  { icon: "🔍", text: "¿Qué tiene el pedido 2025-004?" }
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<{ upvotes: number; downvotes: number; total: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  // Calculate satisfaction rate
  const satisfactionRate = stats && Number(stats.total) > 0
    ? Math.round((Number(stats.upvotes) / Number(stats.total)) * 100)
    : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load stats when component mounts or feedback is given
  useEffect(() => {
    fetch('/api/feedback?type=stats')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setStats(data);
        }
      })
      .catch(() => {
        // Silently fail - stats are not critical
      });
  }, [feedbackGiven]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await sendMessage({ text: message });
  };

  const handleSuggestionClick = async (text: string) => {
    if (isLoading) return;
    await sendMessage({ text });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Helper function to extract text content from message parts
  const getMessageText = (msg: typeof messages[0]): string => {
    // UIMessage v5 uses parts array
    if (Array.isArray(msg.parts)) {
      return msg.parts
        .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
        .map(part => part.text)
        .join('');
    }
    return '';
  };

  // Find the previous user message for context
  const getPreviousUserMessage = (index: number): string => {
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        return getMessageText(messages[i]);
      }
    }
    return '';
  };

  // Send feedback to API
  const sendFeedback = async (messageId: string, rating: 'up' | 'down', userMsg: string, assistantMsg: string) => {
    setFeedbackGiven(prev => ({ ...prev, [messageId]: rating }));

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          userMessage: userMsg,
          assistantResponse: assistantMsg,
          rating
        })
      });
    } catch (error) {
      console.error('Error sending feedback:', error);
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
              {satisfactionRate !== null && (
                <span
                  className="text-xs ml-1 px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF'
                  }}
                  title={`Basado en ${stats?.total} valoraciones`}
                >
                  ✨ {satisfactionRate}% útil
                </span>
              )}
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
                onClick={() => {
                  setMessages([]);
                  setFeedbackGiven({});
                }}
                className="text-white hover:bg-white/20 text-xs px-2 py-1 rounded transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: '#F8FAFC' }}>
            {messages.length === 0 && (
              <>
                <div className="text-center text-sm mt-4" style={{ color: '#64748B' }}>
                  <p>Pregúntame sobre productos, pedidos,</p>
                  <p>mensajeros o inventario</p>
                </div>

                {/* Quick Suggestion Chips */}
                <div className="flex flex-wrap gap-2 justify-center mt-6 animate-fade-in">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      disabled={isLoading}
                      className="px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
                      style={{
                        backgroundColor: '#E0F2FE',
                        color: '#1E293B',
                        border: '1px solid #BAE6FD'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#BAE6FD';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#E0F2FE';
                      }}
                    >
                      <span className="mr-1">{suggestion.icon}</span>
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </>
            )}
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
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
                  {getMessageText(msg)}
                </div>

                {/* Feedback buttons for assistant messages */}
                {msg.role === 'assistant' && !isLoading && (
                  <div className="flex items-center gap-1 mt-1 ml-1">
                    {feedbackGiven[msg.id] ? (
                      <span className="text-xs" style={{ color: '#22C55E' }}>
                        ✓ ¡Gracias!
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => sendFeedback(
                            msg.id,
                            'up',
                            getPreviousUserMessage(index),
                            getMessageText(msg)
                          )}
                          className="p-1 rounded transition-all hover:scale-110"
                          style={{ color: '#94A3B8' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#22C55E';
                            e.currentTarget.style.backgroundColor = '#F0FDF4';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#94A3B8';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Buena respuesta"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => sendFeedback(
                            msg.id,
                            'down',
                            getPreviousUserMessage(index),
                            getMessageText(msg)
                          )}
                          className="p-1 rounded transition-all hover:scale-110"
                          style={{ color: '#94A3B8' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#EF4444';
                            e.currentTarget.style.backgroundColor = '#FEF2F2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#94A3B8';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Mala respuesta"
                        >
                          👎
                        </button>
                      </>
                    )}
                  </div>
                )}
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
                onChange={(e) => setInput(e.target.value)}
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

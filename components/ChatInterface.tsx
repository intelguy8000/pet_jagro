'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatMessage, Product, StockAlert } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  products: Product[];
  alerts: StockAlert[];
}

export default function ChatInterface({ products, alerts }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser] = useState({ id: '1', name: 'Admin User' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'System',
      content: 'Welcome to Pet Supply Inventory Chat! You can ask about products, check stock levels, or get alerts.',
      timestamp: new Date(),
      type: 'system',
    };
    setMessages([welcomeMessage]);

    // Add initial alerts as messages
    if (alerts.length > 0) {
      const alertMessages = alerts.map((alert): ChatMessage => ({
        id: uuidv4(),
        userId: 'system',
        userName: 'Inventory Alert',
        content: alert.message,
        timestamp: alert.timestamp,
        type: 'alert',
      }));
      setMessages(prev => [...prev, ...alertMessages]);
    }
  }, [alerts]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      userId: currentUser.id,
      userName: currentUser.name,
      content: inputMessage,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);

    // Process commands and queries
    processMessageCommand(inputMessage);

    setInputMessage('');
  };

  const processMessageCommand = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Search for products
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('look for')) {
      handleProductSearch(message);
    }
    // Check stock
    else if (lowerMessage.includes('stock') || lowerMessage.includes('inventory') || lowerMessage.includes('available')) {
      handleStockCheck(message);
    }
    // Low stock alerts
    else if (lowerMessage.includes('low stock') || lowerMessage.includes('alert') || lowerMessage.includes('warning')) {
      handleLowStockQuery();
    }
    // List all products
    else if (lowerMessage.includes('list all') || lowerMessage.includes('show all') || lowerMessage.includes('all products')) {
      handleListAllProducts();
    }
    // Help command
    else if (lowerMessage.includes('help') || lowerMessage.includes('commands')) {
      handleHelpCommand();
    }
  };

  const handleProductSearch = (query: string) => {
    const searchTerms = query.toLowerCase().split(' ').filter(word =>
      !['search', 'find', 'look', 'for', 'the', 'a', 'an'].includes(word)
    );

    const results = products.filter(product =>
      searchTerms.some(term => product.name.toLowerCase().includes(term))
    );

    let responseContent = '';
    if (results.length > 0) {
      responseContent = `Found ${results.length} product(s):\n\n` +
        results.map(p =>
          `📦 ${p.name}\n` +
          `   Category: ${p.category}\n` +
          `   Stock: ${p.stock} units\n` +
          `   Price: $${p.price.toFixed(2)}\n` +
          `   ${p.stock <= p.minStock ? '⚠️ LOW STOCK' : '✅ In Stock'}`
        ).join('\n\n');
    } else {
      responseContent = 'No products found matching your search. Try different keywords or use "list all" to see all products.';
    }

    const responseMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'Inventory Bot',
      content: responseContent,
      timestamp: new Date(),
      type: 'query',
      productQuery: {
        action: 'search',
        results,
      },
    };

    setTimeout(() => {
      setMessages(prev => [...prev, responseMessage]);
    }, 500);
  };

  const handleStockCheck = (query: string) => {
    const words = query.toLowerCase().split(' ');
    const productMatches = products.filter(product =>
      words.some(word => product.name.toLowerCase().includes(word))
    );

    let responseContent = '';
    if (productMatches.length > 0) {
      responseContent = productMatches.map(p =>
        `📊 ${p.name}: ${p.stock} units in stock\n` +
        `   Min required: ${p.minStock} units\n` +
        `   Status: ${p.stock === 0 ? '🔴 OUT OF STOCK' : p.stock <= p.minStock ? '🟡 LOW STOCK' : '🟢 GOOD'}`
      ).join('\n\n');
    } else {
      responseContent = 'Please specify a product name to check stock levels.';
    }

    const responseMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'Inventory Bot',
      content: responseContent,
      timestamp: new Date(),
      type: 'query',
      productQuery: {
        action: 'check_stock',
        results: productMatches,
      },
    };

    setTimeout(() => {
      setMessages(prev => [...prev, responseMessage]);
    }, 500);
  };

  const handleLowStockQuery = () => {
    const lowStockProducts = products.filter(p => p.stock <= p.minStock);

    let responseContent = '';
    if (lowStockProducts.length > 0) {
      responseContent = `⚠️ ${lowStockProducts.length} product(s) with low stock:\n\n` +
        lowStockProducts.map(p =>
          `${p.stock === 0 ? '🔴' : '🟡'} ${p.name}\n` +
          `   Current: ${p.stock} units\n` +
          `   Required: ${p.minStock} units\n` +
          `   ${p.stock === 0 ? 'URGENT: Restock immediately!' : 'Restock recommended'}`
        ).join('\n\n');
    } else {
      responseContent = '✅ All products are adequately stocked!';
    }

    const responseMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'Inventory Bot',
      content: responseContent,
      timestamp: new Date(),
      type: 'alert',
      productQuery: {
        action: 'low_stock_alert',
        results: lowStockProducts,
      },
    };

    setTimeout(() => {
      setMessages(prev => [...prev, responseMessage]);
    }, 500);
  };

  const handleListAllProducts = () => {
    const responseContent = `📋 All Products (${products.length} total):\n\n` +
      products.map((p, idx) =>
        `${idx + 1}. ${p.name}\n` +
        `   Category: ${p.category} | Stock: ${p.stock} | Price: $${p.price.toFixed(2)}\n` +
        `   ${p.stock === 0 ? '🔴 OUT' : p.stock <= p.minStock ? '🟡 LOW' : '🟢 OK'}`
      ).join('\n\n');

    const responseMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'Inventory Bot',
      content: responseContent,
      timestamp: new Date(),
      type: 'query',
    };

    setTimeout(() => {
      setMessages(prev => [...prev, responseMessage]);
    }, 500);
  };

  const handleHelpCommand = () => {
    const responseContent = `🤖 Available Commands:\n\n` +
      `• "search [product name]" - Search for products\n` +
      `• "stock [product name]" - Check stock levels\n` +
      `• "low stock" - View all low stock items\n` +
      `• "list all" - Show all products\n` +
      `• "help" - Show this help message\n\n` +
      `You can also just type naturally and I'll try to help!`;

    const responseMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'Inventory Bot',
      content: responseContent,
      timestamp: new Date(),
      type: 'system',
    };

    setTimeout(() => {
      setMessages(prev => [...prev, responseMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'system':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'alert':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'query':
        return 'bg-green-50 border-green-200 text-green-900';
      default:
        return 'bg-white border-gray-200 text-gray-900';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
        <h2 className="text-xl font-semibold">Inventory Chat</h2>
        <p className="text-sm text-primary-100 mt-1">Ask about products, check stock, get alerts</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-lg border p-4 ${getMessageStyle(message.type)} ${
              message.userId === currentUser.id ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[90%]'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-semibold text-sm">{message.userName}</span>
              <span className="text-xs opacity-75">
                {format(message.timestamp, 'HH:mm')}
              </span>
            </div>
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message or command (try 'help')..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Try: "search dog food", "stock cat litter", "low stock", "list all"
        </div>
      </div>
    </div>
  );
}

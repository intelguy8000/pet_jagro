'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatMessage, Product, StockAlert, categoryNames } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatInterfaceProps {
  products: Product[];
  alerts: StockAlert[];
}

export default function ChatInterface({ products, alerts }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser] = useState({ id: '1', name: 'Administrador' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll hacia abajo cuando llegan nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar con mensaje de bienvenida
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'Sistema',
      content: '¡Bienvenido al Chat de Inventario de Mascotas! Puedes consultar productos, verificar niveles de stock u obtener alertas.',
      timestamp: new Date(),
      type: 'system',
    };
    setMessages([welcomeMessage]);

    // Agregar alertas iniciales como mensajes
    if (alerts.length > 0) {
      const alertMessages = alerts.map((alert): ChatMessage => ({
        id: uuidv4(),
        userId: 'system',
        userName: 'Alerta de Inventario',
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

    // Procesar comandos y consultas
    processMessageCommand(inputMessage);

    setInputMessage('');
  };

  const processMessageCommand = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Buscar productos
    if (lowerMessage.includes('buscar') || lowerMessage.includes('busca') || lowerMessage.includes('busque') ||
        lowerMessage.includes('encontrar') || lowerMessage.includes('encuentra') || lowerMessage.includes('busco')) {
      handleProductSearch(message);
    }
    // Verificar stock
    else if (lowerMessage.includes('stock') || lowerMessage.includes('inventario') ||
             lowerMessage.includes('disponible') || lowerMessage.includes('hay') ||
             lowerMessage.includes('tiene') || lowerMessage.includes('cuanto')) {
      handleStockCheck(message);
    }
    // Alertas de stock bajo
    else if (lowerMessage.includes('bajo stock') || lowerMessage.includes('alerta') ||
             lowerMessage.includes('advertencia') || lowerMessage.includes('agotando') ||
             lowerMessage.includes('poco stock') || lowerMessage.includes('faltante')) {
      handleLowStockQuery();
    }
    // Listar todos los productos
    else if (lowerMessage.includes('listar') || lowerMessage.includes('mostrar') ||
             lowerMessage.includes('todos') || lowerMessage.includes('lista') ||
             lowerMessage.includes('ver todos')) {
      handleListAllProducts();
    }
    // Comando de ayuda
    else if (lowerMessage.includes('ayuda') || lowerMessage.includes('comandos') || lowerMessage.includes('help')) {
      handleHelpCommand();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleProductSearch = (query: string) => {
    const searchTerms = query.toLowerCase().split(' ').filter(word =>
      !['buscar', 'busca', 'busque', 'encontrar', 'encuentra', 'el', 'la', 'los', 'las', 'un', 'una'].includes(word)
    );

    const results = products.filter(product =>
      searchTerms.some(term => product.name.toLowerCase().includes(term))
    );

    let responseContent = '';
    if (results.length > 0) {
      responseContent = `Encontré ${results.length} producto(s):\n\n` +
        results.map(p =>
          `📦 ${p.name}\n` +
          `   Categoría: ${categoryNames[p.category]}\n` +
          `   Stock: ${p.stock} unidades\n` +
          `   Precio: ${formatPrice(p.price)}\n` +
          `   ${p.stock <= p.minStock ? '⚠️ STOCK BAJO' : '✅ Disponible'}`
        ).join('\n\n');
    } else {
      responseContent = 'No se encontraron productos que coincidan con tu búsqueda. Intenta con diferentes palabras clave o usa "listar todos" para ver todos los productos.';
    }

    const responseMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'Bot de Inventario',
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
        `📊 ${p.name}: ${p.stock} unidades en stock\n` +
        `   Mínimo requerido: ${p.minStock} unidades\n` +
        `   Estado: ${p.stock === 0 ? '🔴 AGOTADO' : p.stock <= p.minStock ? '🟡 STOCK BAJO' : '🟢 BUENO'}`
      ).join('\n\n');
    } else {
      responseContent = 'Por favor especifica el nombre del producto para verificar los niveles de stock.';
    }

    const responseMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'Bot de Inventario',
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
      responseContent = `⚠️ ${lowStockProducts.length} producto(s) con stock bajo:\n\n` +
        lowStockProducts.map(p =>
          `${p.stock === 0 ? '🔴' : '🟡'} ${p.name}\n` +
          `   Actual: ${p.stock} unidades\n` +
          `   Requerido: ${p.minStock} unidades\n` +
          `   ${p.stock === 0 ? '¡URGENTE: Reabastecer inmediatamente!' : 'Se recomienda reabastecer'}`
        ).join('\n\n');
    } else {
      responseContent = '✅ ¡Todos los productos tienen stock adecuado!';
    }

    const responseMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'Bot de Inventario',
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
    const responseContent = `📋 Todos los Productos (${products.length} en total):\n\n` +
      products.map((p, idx) =>
        `${idx + 1}. ${p.name}\n` +
        `   Categoría: ${categoryNames[p.category]} | Stock: ${p.stock} | Precio: ${formatPrice(p.price)}\n` +
        `   ${p.stock === 0 ? '🔴 AGOTADO' : p.stock <= p.minStock ? '🟡 BAJO' : '🟢 OK'}`
      ).join('\n\n');

    const responseMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'Bot de Inventario',
      content: responseContent,
      timestamp: new Date(),
      type: 'query',
    };

    setTimeout(() => {
      setMessages(prev => [...prev, responseMessage]);
    }, 500);
  };

  const handleHelpCommand = () => {
    const responseContent = `🤖 Comandos Disponibles:\n\n` +
      `• "buscar [producto]" - Buscar productos\n` +
      `• "stock [producto]" - Verificar niveles de stock\n` +
      `• "bajo stock" - Ver productos con stock bajo\n` +
      `• "listar todos" - Mostrar todos los productos\n` +
      `• "ayuda" - Mostrar este mensaje de ayuda\n\n` +
      `¡También puedes escribir de forma natural y trataré de ayudarte!`;

    const responseMessage: ChatMessage = {
      id: uuidv4(),
      userId: 'system',
      userName: 'Bot de Inventario',
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
      {/* Encabezado del Chat */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
        <h2 className="text-xl font-semibold">Chat de Inventario</h2>
        <p className="text-sm text-primary-100 mt-1">Consulta productos, verifica stock, recibe alertas</p>
      </div>

      {/* Área de Mensajes */}
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
                {format(message.timestamp, 'HH:mm', { locale: es })}
              </span>
            </div>
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Área de Entrada */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje o comando (prueba 'ayuda')..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Enviar
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Prueba: "buscar alimento perros", "stock arena gatos", "bajo stock", "listar todos"
        </div>
      </div>
    </div>
  );
}

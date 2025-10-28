'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import InventoryPanel from '@/components/InventoryPanel';
import { mockProducts } from '@/lib/mockData';
import { Product, StockAlert } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);

  // Check for low stock on mount and generate alerts
  useEffect(() => {
    const lowStockAlerts = products
      .filter(p => p.stock <= p.minStock)
      .map((product): StockAlert => ({
        id: `alert-${product.id}`,
        product,
        message: product.stock === 0
          ? `${product.name} is OUT OF STOCK!`
          : `${product.name} is running low (${product.stock} left)`,
        severity: product.stock === 0 ? 'out' : product.stock < (product.minStock / 2) ? 'critical' : 'low',
        timestamp: new Date(),
        acknowledged: false,
      }));

    setAlerts(lowStockAlerts);
  }, [products]);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Inventario de Suministros para Mascotas
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Sistema de Chat en Tiempo Real y Gestión de Inventario
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Conectado</span>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Bar */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-red-800">
                {alerts.length} producto{alerts.length > 1 ? 's' : ''} necesita{alerts.length > 1 ? 'n' : ''} atención
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Interface - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ChatInterface products={products} alerts={alerts} />
          </div>

          {/* Inventory Panel - Takes 1 column */}
          <div className="lg:col-span-1">
            <InventoryPanel products={products} setProducts={setProducts} />
          </div>
        </div>
      </div>
    </main>
  );
}

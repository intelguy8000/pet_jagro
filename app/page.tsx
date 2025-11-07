'use client';

import { useState } from 'react';
import Image from 'next/image';
import PickingView from '@/components/PickingView';
import TrackingView from '@/components/TrackingView';
import FacturacionView from '@/components/FacturacionView';
import IntegrationsView from '@/components/IntegrationsView';
import DesignDemo from '@/components/DesignDemo';
import { useTheme } from '@/contexts/ThemeContext';
import { Order } from '@/types';
import { mockOrders } from '@/lib/mockData';

type Tab = 'picking' | 'tracking' | 'billing' | 'integrations' | 'design';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('picking');
  const { theme, toggleTheme } = useTheme();
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header con logo J Agro */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b-4" style={{ borderColor: '#106BA4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/jotagro-logo.png"
                alt="J Agro"
                width={120}
                height={80}
                className="object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#106BA4' }}>
                  Sistema de Picking
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Gestión de Pedidos y Trazabilidad
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Botón de tema */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                {theme === 'light' ? (
                  <span className="text-2xl">🌙</span>
                ) : (
                  <span className="text-2xl">☀️</span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Conectado</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs de navegación */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('picking')}
              className={`px-6 py-3 font-semibold transition-all border-b-4 ${
                activeTab === 'picking'
                  ? 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              📦 Picking
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-6 py-3 font-semibold transition-all border-b-4 ${
                activeTab === 'billing'
                  ? 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              💰 Facturación
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-6 py-3 font-semibold transition-all border-b-4 ${
                activeTab === 'tracking'
                  ? 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              📊 Trazabilidad
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`px-6 py-3 font-semibold transition-all border-b-4 ${
                activeTab === 'integrations'
                  ? 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              🔗 Integraciones
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`px-6 py-3 font-semibold transition-all border-b-4 ${
                activeTab === 'design'
                  ? 'border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300'
                  : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              🎨 Diseño
            </button>
          </div>
        </div>
      </div>

      {/* Contenido según tab activo */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'picking' && <PickingView orders={orders} onUpdateOrder={handleUpdateOrder} />}
        {activeTab === 'billing' && <FacturacionView orders={orders} onUpdateOrder={handleUpdateOrder} />}
        {activeTab === 'tracking' && <TrackingView orders={orders} />}
        {activeTab === 'integrations' && <IntegrationsView />}
        {activeTab === 'design' && <DesignDemo />}
      </div>
    </main>
  );
}

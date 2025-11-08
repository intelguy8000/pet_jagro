'use client';

import { useState } from 'react';
import Image from 'next/image';
import PickingView from '@/components/PickingView';
import TrackingView from '@/components/TrackingView';
import FacturacionView from '@/components/FacturacionView';
import IntegrationsView from '@/components/IntegrationsView';
import { Order } from '@/types';
import { mockOrders } from '@/lib/mockData';

type Tab = 'picking' | 'tracking' | 'billing' | 'integrations';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('picking');
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  return (
    <main className="flex min-h-screen flex-col" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      {/* Header con logo J Agro */}
      <header className="shadow-md border-b" style={{ backgroundColor: '#252525', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Image
                src="/jotagro-logo.png"
                alt="J Agro"
                width={80}
                height={53}
                className="object-contain sm:w-[120px] sm:h-[80px]"
              />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold" style={{ color: '#C46849', letterSpacing: '-0.5px' }}>
                  Sistema de Picking
                </h1>
                <p className="text-xs sm:text-sm hidden sm:block" style={{ color: '#a0a0a0' }}>
                  Gestión de Pedidos y Trazabilidad
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#C46849' }}></div>
                <span className="text-sm" style={{ color: '#d0d0d0' }}>Conectado</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs de navegación */}
      <div className="shadow-sm overflow-x-auto" style={{ backgroundColor: '#252525', borderBottom: '1px solid #3a3a3a' }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex space-x-1 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('picking')}
              className="px-4 sm:px-6 py-3 font-semibold transition-all border-b-2 whitespace-nowrap text-sm sm:text-base"
              style={
                activeTab === 'picking'
                  ? { borderColor: '#C46849', color: '#f5f5f5', backgroundColor: 'rgba(196, 104, 73, 0.08)' }
                  : { borderColor: 'transparent', color: '#a0a0a0' }
              }
            >
              Picking
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className="px-4 sm:px-6 py-3 font-semibold transition-all border-b-2 whitespace-nowrap text-sm sm:text-base"
              style={
                activeTab === 'billing'
                  ? { borderColor: '#C46849', color: '#f5f5f5', backgroundColor: 'rgba(196, 104, 73, 0.08)' }
                  : { borderColor: 'transparent', color: '#a0a0a0' }
              }
            >
              Facturación
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className="px-4 sm:px-6 py-3 font-semibold transition-all border-b-2 whitespace-nowrap text-sm sm:text-base"
              style={
                activeTab === 'tracking'
                  ? { borderColor: '#C46849', color: '#f5f5f5', backgroundColor: 'rgba(196, 104, 73, 0.08)' }
                  : { borderColor: 'transparent', color: '#a0a0a0' }
              }
            >
              Trazabilidad
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className="px-4 sm:px-6 py-3 font-semibold transition-all border-b-2 whitespace-nowrap text-sm sm:text-base"
              style={
                activeTab === 'integrations'
                  ? { borderColor: '#C46849', color: '#f5f5f5', backgroundColor: 'rgba(196, 104, 73, 0.08)' }
                  : { borderColor: 'transparent', color: '#a0a0a0' }
              }
            >
              Integraciones
            </button>
          </div>
        </div>
      </div>

      {/* Contenido según tab activo */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6">
        {activeTab === 'picking' && <PickingView orders={orders} onUpdateOrder={handleUpdateOrder} />}
        {activeTab === 'billing' && <FacturacionView orders={orders} onUpdateOrder={handleUpdateOrder} />}
        {activeTab === 'tracking' && <TrackingView orders={orders} />}
        {activeTab === 'integrations' && <IntegrationsView />}
      </div>
    </main>
  );
}

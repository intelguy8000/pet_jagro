'use client';

import { useState } from 'react';
import Image from 'next/image';
import PickingView from '@/components/PickingView';
import TrackingView from '@/components/TrackingView';
import FacturacionView from '@/components/FacturacionView';
import LiquidacionesView from '@/components/LiquidacionesView';
import IntegrationsView from '@/components/IntegrationsView';
import { Order } from '@/types';
import { mockOrders } from '@/lib/mockData';

type Tab = 'picking' | 'billing' | 'liquidaciones' | 'tracking' | 'integrations';

interface MenuItem {
  id: Tab;
  label: string;
  icon: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('picking');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const menuItems: MenuItem[] = [
    { id: 'picking', label: 'Picking', icon: '📦' },
    { id: 'billing', label: 'Facturación', icon: '💰' },
    { id: 'liquidaciones', label: 'Liquidaciones', icon: '📋' },
    { id: 'tracking', label: 'Trazabilidad', icon: '🔍' },
    { id: 'integrations', label: 'Integraciones', icon: '🔌' },
  ];

  const handleMenuClick = (tabId: Tab) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Cerrar sidebar en móvil después de seleccionar
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Vertical */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 flex-shrink-0 border-r flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          backgroundColor: '#1f1f1f',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center space-x-3">
            <Image
              src="/jotagro-logo.png"
              alt="J Agro"
              width={50}
              height={33}
              className="object-contain"
            />
            <div>
              <h1 className="text-sm font-bold" style={{ color: '#C46849', letterSpacing: '-0.3px' }}>
                J AGRO
              </h1>
              <p className="text-xs" style={{ color: '#808080' }}>
                Sistema de Picking
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left"
              style={
                activeTab === item.id
                  ? {
                      backgroundColor: '#C46849',
                      color: '#ffffff',
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: '#a0a0a0',
                    }
              }
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.backgroundColor = 'rgba(196, 104, 73, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Section at Bottom */}
        <div
          className="p-4 border-t"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <div className="flex items-center space-x-3 px-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                backgroundColor: '#C46849',
                color: '#ffffff'
              }}
            >
              DC
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: '#f5f5f5' }}>
                Administrador
              </p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#10b981' }}></div>
                <span className="text-xs" style={{ color: '#808080' }}>Conectado</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Mobile Header with Hamburger */}
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30"
          style={{
            backgroundColor: '#252525',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#C46849' }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <Image
              src="/jotagro-logo.png"
              alt="J Agro"
              width={40}
              height={26}
              className="object-contain"
            />
            <h1 className="text-sm font-bold" style={{ color: '#C46849' }}>
              J AGRO
            </h1>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'picking' && <PickingView orders={orders} onUpdateOrder={handleUpdateOrder} />}
          {activeTab === 'billing' && <FacturacionView orders={orders} onUpdateOrder={handleUpdateOrder} />}
          {activeTab === 'liquidaciones' && <LiquidacionesView />}
          {activeTab === 'tracking' && <TrackingView orders={orders} />}
          {activeTab === 'integrations' && <IntegrationsView />}
        </div>
      </main>
    </div>
  );
}

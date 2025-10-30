'use client';

import { useState } from 'react';
import Image from 'next/image';
import PickingView from '@/components/PickingView';
import TrackingView from '@/components/TrackingView';

type Tab = 'picking' | 'tracking';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('picking');

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header con logo J Agro */}
      <header className="bg-white shadow-md border-b-4" style={{ borderColor: '#106BA4' }}>
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
                <p className="text-sm text-gray-600">
                  Gestión de Pedidos y Trazabilidad
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Conectado</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs de navegación */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('picking')}
              className={`px-6 py-3 font-semibold transition-all border-b-4 ${
                activeTab === 'picking'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📦 Picking
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-6 py-3 font-semibold transition-all border-b-4 ${
                activeTab === 'tracking'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📊 Trazabilidad
            </button>
          </div>
        </div>
      </div>

      {/* Contenido según tab activo */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'picking' ? <PickingView /> : <TrackingView />}
      </div>
    </main>
  );
}

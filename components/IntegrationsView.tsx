'use client';

import { useState, useEffect } from 'react';

// Tipos para las integraciones
type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'syncing';

interface HGIModule {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  lastSync?: Date;
  endpoint: string;
  enabled: boolean;
  syncCount?: number;
  errorMessage?: string;
}

interface SyncLog {
  id: string;
  module: string;
  timestamp: Date;
  status: 'success' | 'error';
  message: string;
  recordsProcessed?: number;
}

export default function IntegrationsView() {
  const [modules, setModules] = useState<HGIModule[]>([
    {
      id: 'billing',
      name: 'Facturación Electrónica',
      description: 'Integración con módulo de facturación de HGI',
      status: 'connected',
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      endpoint: 'https://api.hgi.com.co/v1/billing',
      enabled: true,
      syncCount: 1247,
    },
    {
      id: 'inventory',
      name: 'Inventarios',
      description: 'Sincronización de productos y stock',
      status: 'connected',
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      endpoint: 'https://api.hgi.com.co/v1/inventory',
      enabled: true,
      syncCount: 3891,
    },
    {
      id: 'customers',
      name: 'Clientes',
      description: 'Base de datos de clientes y contactos',
      status: 'connected',
      lastSync: new Date(Date.now() - 10 * 60 * 1000),
      endpoint: 'https://api.hgi.com.co/v1/customers',
      enabled: true,
      syncCount: 856,
    },
    {
      id: 'orders',
      name: 'Pedidos',
      description: 'Gestión de órdenes de compra y venta',
      status: 'syncing',
      lastSync: new Date(Date.now() - 1 * 60 * 1000),
      endpoint: 'https://api.hgi.com.co/v1/orders',
      enabled: true,
      syncCount: 2134,
    },
    {
      id: 'accounting',
      name: 'Contabilidad',
      description: 'Integración con módulo contable',
      status: 'disconnected',
      endpoint: 'https://api.hgi.com.co/v1/accounting',
      enabled: false,
      syncCount: 0,
    },
    {
      id: 'reports',
      name: 'Reportes',
      description: 'Generación de informes y analytics',
      status: 'error',
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      endpoint: 'https://api.hgi.com.co/v1/reports',
      enabled: true,
      syncCount: 445,
      errorMessage: 'Timeout en la conexión - Reintentando...',
    },
  ]);

  const [logs, setLogs] = useState<SyncLog[]>([
    {
      id: '1',
      module: 'Inventarios',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      status: 'success',
      message: 'Sincronización completada exitosamente',
      recordsProcessed: 22,
    },
    {
      id: '2',
      module: 'Facturación',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'success',
      message: 'Facturas enviadas a HGI',
      recordsProcessed: 8,
    },
    {
      id: '3',
      module: 'Clientes',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: 'success',
      message: 'Base de datos actualizada',
      recordsProcessed: 3,
    },
    {
      id: '4',
      module: 'Reportes',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'error',
      message: 'Error de timeout en la conexión',
    },
  ]);

  const [apiKey, setApiKey] = useState('hgi_sk_live_••••••••••••••••4a2f');
  const [showApiKey, setShowApiKey] = useState(false);

  const getStatusColor = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 dark:bg-green-900 dark:bg-opacity-30 text-green-800 dark:text-green-300';
      case 'syncing':
        return 'bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 text-blue-800 dark:text-blue-300';
      case 'error':
        return 'bg-red-100 dark:bg-red-900 dark:bg-opacity-30 text-red-800 dark:text-red-300';
      case 'disconnected':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return '✓';
      case 'syncing':
        return '↻';
      case 'error':
        return '✕';
      case 'disconnected':
        return '○';
    }
  };

  const getStatusText = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return 'CONECTADO';
      case 'syncing':
        return 'SINCRONIZANDO';
      case 'error':
        return 'ERROR';
      case 'disconnected':
        return 'DESCONECTADO';
    }
  };

  const handleToggleModule = (moduleId: string) => {
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        const newEnabled = !module.enabled;
        return {
          ...module,
          enabled: newEnabled,
          status: newEnabled ? 'connected' : 'disconnected' as IntegrationStatus,
        };
      }
      return module;
    }));
  };

  const handleSyncModule = (moduleId: string) => {
    setModules(modules.map(module => {
      if (module.id === moduleId && module.enabled) {
        return { ...module, status: 'syncing' as IntegrationStatus };
      }
      return module;
    }));

    // Simular sincronización
    setTimeout(() => {
      setModules(modules.map(module => {
        if (module.id === moduleId) {
          return {
            ...module,
            status: 'connected' as IntegrationStatus,
            lastSync: new Date(),
            syncCount: (module.syncCount || 0) + Math.floor(Math.random() * 20),
          };
        }
        return module;
      }));

      const moduleName = modules.find(m => m.id === moduleId)?.name || '';
      const newLog: SyncLog = {
        id: Date.now().toString(),
        module: moduleName,
        timestamp: new Date(),
        status: 'success',
        message: 'Sincronización manual completada',
        recordsProcessed: Math.floor(Math.random() * 50) + 1,
      };
      setLogs([newLog, ...logs].slice(0, 10));
    }, 2000);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Hace menos de 1 minuto';
    if (diffMins === 1) return 'Hace 1 minuto';
    if (diffMins < 60) return `Hace ${diffMins} minutos`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return 'Hace 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;

    return `Hace ${Math.floor(diffHours / 24)} días`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold dark:text-gray-100">Integraciones HGI</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Conecta J Agro con el sistema HGI para sincronizar facturación, inventarios y más
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Estado General</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {modules.filter(m => m.status === 'connected').length}/{modules.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">módulos activos</div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h3 className="font-semibold mb-3 dark:text-gray-100">Configuración de API</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Key de HGI
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 font-mono text-sm"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-semibold dark:text-gray-200"
                >
                  {showApiKey ? '🔒' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL Base
              </label>
              <input
                type="text"
                value="https://api.hgi.com.co/v1"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Módulos de Integración */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Módulos Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 dark:bg-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-lg dark:text-gray-100">{module.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{module.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(module.status)}`}>
                  {getStatusIcon(module.status)} {getStatusText(module.status)}
                </span>
              </div>

              {module.errorMessage && (
                <div className="mb-3 p-2 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-300">
                  ⚠️ {module.errorMessage}
                </div>
              )}

              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-mono">
                {module.endpoint}
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <div className="dark:text-gray-300">
                  <span className="font-semibold">Última sincronización:</span>{' '}
                  {module.lastSync ? formatRelativeTime(module.lastSync) : 'Nunca'}
                </div>
                {module.syncCount !== undefined && (
                  <div className="text-gray-600 dark:text-gray-400">
                    {module.syncCount.toLocaleString()} registros
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleModule(module.id)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm ${
                    module.enabled
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {module.enabled ? 'Desconectar' : 'Conectar'}
                </button>
                <button
                  onClick={() => handleSyncModule(module.id)}
                  disabled={!module.enabled || module.status === 'syncing'}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm ${
                    module.enabled && module.status !== 'syncing'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {module.status === 'syncing' ? '⟳ Sincronizando...' : '↻ Sincronizar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registro de Actividad */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Registro de Actividad</h3>
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-lg border-l-4 ${
                log.status === 'success'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900 dark:bg-opacity-20'
                  : 'border-red-500 bg-red-50 dark:bg-red-900 dark:bg-opacity-20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold dark:text-gray-100">{log.module}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {log.timestamp.toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{log.message}</div>
                  {log.recordsProcessed && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {log.recordsProcessed} registros procesados
                    </div>
                  )}
                </div>
                <div className="text-2xl">
                  {log.status === 'success' ? '✓' : '✕'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

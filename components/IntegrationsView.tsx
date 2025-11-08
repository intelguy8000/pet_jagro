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

  const getStatusStyle = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
      case 'syncing':
        return { backgroundColor: 'rgba(196, 104, 73, 0.2)', color: '#C46849' };
      case 'error':
        return { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
      case 'disconnected':
        return { backgroundColor: '#3a3a3a', color: '#a0a0a0' };
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
      <div className="rounded-xl p-6" style={{ backgroundColor: '#252525' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#f5f5f5', letterSpacing: '-0.5px' }}>Integraciones HGI</h2>
            <p className="mt-1" style={{ color: '#a0a0a0' }}>
              Conecta J Agro con el sistema HGI para sincronizar facturación, inventarios y más
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm" style={{ color: '#a0a0a0' }}>Estado General</div>
            <div className="text-2xl font-bold" style={{ color: '#10b981' }}>
              {modules.filter(m => m.status === 'connected').length}/{modules.length}
            </div>
            <div className="text-xs" style={{ color: '#a0a0a0' }}>módulos activos</div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="pt-4 mt-4" style={{ borderTop: '1px solid #3a3a3a' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#f5f5f5' }}>Configuración de API</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d0d0d0' }}>
                API Key de HGI
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-lg font-mono text-sm"
                  style={{ border: '1px solid #3a3a3a', backgroundColor: '#2a2a2a', color: '#f5f5f5' }}
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{ backgroundColor: '#3a3a3a', color: '#d0d0d0' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#505050'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
                >
                  {showApiKey ? '🔒' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d0d0d0' }}>
                URL Base
              </label>
              <input
                type="text"
                value="https://api.hgi.com.co/v1"
                readOnly
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ border: '1px solid #3a3a3a', backgroundColor: '#2a2a2a', color: '#f5f5f5' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Módulos de Integración */}
      <div className="rounded-xl p-6" style={{ backgroundColor: '#252525' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#f5f5f5', letterSpacing: '-0.5px' }}>Módulos Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className="rounded-lg p-4"
              style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-lg" style={{ color: '#f5f5f5' }}>{module.name}</h4>
                  <p className="text-sm" style={{ color: '#a0a0a0' }}>{module.description}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={getStatusStyle(module.status)}>
                  {getStatusIcon(module.status)} {getStatusText(module.status)}
                </span>
              </div>

              {module.errorMessage && (
                <div className="mb-3 p-2 rounded text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                  ⚠️ {module.errorMessage}
                </div>
              )}

              <div className="text-xs mb-3 font-mono" style={{ color: '#a0a0a0' }}>
                {module.endpoint}
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <div style={{ color: '#d0d0d0' }}>
                  <span className="font-semibold">Última sincronización:</span>{' '}
                  {module.lastSync ? formatRelativeTime(module.lastSync) : 'Nunca'}
                </div>
                {module.syncCount !== undefined && (
                  <div style={{ color: '#a0a0a0' }}>
                    {module.syncCount.toLocaleString()} registros
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleModule(module.id)}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-colors"
                  style={{ backgroundColor: module.enabled ? '#ef4444' : '#10b981' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = module.enabled ? '#dc2626' : '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = module.enabled ? '#ef4444' : '#10b981'}
                >
                  {module.enabled ? 'Desconectar' : 'Conectar'}
                </button>
                <button
                  onClick={() => handleSyncModule(module.id)}
                  disabled={!module.enabled || module.status === 'syncing'}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                  style={
                    module.enabled && module.status !== 'syncing'
                      ? { backgroundColor: '#C46849', color: '#ffffff' }
                      : { backgroundColor: '#3a3a3a', color: '#707070', cursor: 'not-allowed' }
                  }
                  onMouseEnter={(e) => {
                    if (module.enabled && module.status !== 'syncing') {
                      e.currentTarget.style.backgroundColor = '#a54d32';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (module.enabled && module.status !== 'syncing') {
                      e.currentTarget.style.backgroundColor = '#C46849';
                    }
                  }}
                >
                  {module.status === 'syncing' ? '⟳ Sincronizando...' : '↻ Sincronizar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registro de Actividad */}
      <div className="rounded-xl p-6" style={{ backgroundColor: '#252525' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#f5f5f5', letterSpacing: '-0.5px' }}>Registro de Actividad</h3>
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg"
              style={{
                borderLeft: log.status === 'success' ? '4px solid #10b981' : '4px solid #ef4444',
                backgroundColor: log.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold" style={{ color: '#f5f5f5' }}>{log.module}</span>
                    <span className="text-xs" style={{ color: '#a0a0a0' }}>
                      {log.timestamp.toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: '#d0d0d0' }}>{log.message}</div>
                  {log.recordsProcessed && (
                    <div className="text-xs mt-1" style={{ color: '#a0a0a0' }}>
                      {log.recordsProcessed} registros procesados
                    </div>
                  )}
                </div>
                <div className="text-2xl" style={{ color: log.status === 'success' ? '#10b981' : '#ef4444' }}>
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

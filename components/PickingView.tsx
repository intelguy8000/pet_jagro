'use client';

import { useState } from 'react';
import { Order, orderStatusNames, zoneNames, zoneColors } from '@/types';
import OrderDetail from './OrderDetail';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PickingViewProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}

export default function PickingView({ orders, onUpdateOrder }: PickingViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPriorityIcon = (priority: string) => {
    // Prioridades sin color por ahora - no están definidas
    return '○';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#7CB9E8';
      case 'in_progress': return '#F59E0B';
      case 'completed': return '#22C55E';
      case 'cancelled': return '#EF4444';
      default: return '#64748B';
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const inProgressOrders = orders.filter(o => o.status === 'in_progress');

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        onUpdate={(updatedOrder) => {
          onUpdateOrder(updatedOrder);
          if (updatedOrder.status === 'ready_for_billing') {
            setSelectedOrder(null);
          } else {
            setSelectedOrder(updatedOrder);
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas - Horizontal Compacto */}
      <div className="flex items-center gap-6 px-6 py-4 rounded-xl shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div className="flex-1 text-center border-r" style={{ borderColor: '#E2E8F0' }}>
          <div className="text-3xl font-bold" style={{ color: '#7CB9E8' }}>{pendingOrders.length}</div>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#64748B' }}>Pendientes</div>
        </div>
        <div className="flex-1 text-center border-r" style={{ borderColor: '#E2E8F0' }}>
          <div className="text-3xl font-bold" style={{ color: '#F59E0B' }}>{inProgressOrders.length}</div>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#64748B' }}>En Curso</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold" style={{ color: '#22C55E' }}>
            {formatPrice(pendingOrders.reduce((sum, o) => sum + o.totalValue, 0))}
          </div>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#64748B' }}>Valor Total</div>
        </div>
      </div>

      {/* Lista de Pedidos - Formato Tabla Compacta */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-bold" style={{ color: '#1E293B', letterSpacing: '-0.5px' }}>
            Pedidos Activos
          </h2>
          <div className="text-sm" style={{ color: '#64748B' }}>
            {pendingOrders.length + inProgressOrders.length} total
          </div>
        </div>

        {pendingOrders.length === 0 && inProgressOrders.length === 0 ? (
          <div className="text-center py-16 rounded-xl shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div className="text-6xl mb-4">📦</div>
            <p className="text-lg" style={{ color: '#64748B' }}>No hay pedidos activos</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* En Proceso */}
            {inProgressOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid #F59E0B', border: '1px solid rgba(245, 158, 11, 0.2)' }}
                onClick={() => setSelectedOrder(order)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F59E0B' }}>
                  <span className="text-white font-bold text-sm">⏱</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg" style={{ color: '#1E293B' }}>{order.orderNumber}</span>
                    <span className="text-xs">{getPriorityIcon(order.priority)}</span>
                    <span className="text-sm" style={{ color: '#64748B' }}>• {order.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs" style={{ color: '#64748B' }} suppressHydrationWarning>
                      {order.items.length} items • {format(order.createdAt, "HH:mm", { locale: es })}
                    </div>
                    {order.customer.zone && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${zoneColors[order.customer.zone]}15`,
                          color: zoneColors[order.customer.zone],
                        }}
                      >
                        {zoneNames[order.customer.zone]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg" style={{ color: '#22C55E' }}>{formatPrice(order.totalValue)}</div>
                  <div className="text-xs" style={{ color: '#64748B' }}>En proceso</div>
                </div>
                <div>
                  <span className="text-2xl" style={{ color: '#F59E0B' }}>→</span>
                </div>
              </div>
            ))}

            {/* Pendientes */}
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
                onClick={() => setSelectedOrder(order)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#7CB9E8';
                  e.currentTarget.style.borderLeftWidth = '4px';
                  e.currentTarget.style.borderLeftColor = '#7CB9E8';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.borderLeftWidth = '1px';
                  e.currentTarget.style.borderLeftColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(124, 185, 232, 0.15)', border: '2px solid #7CB9E8' }}>
                  <span style={{ color: '#7CB9E8' }} className="font-bold text-sm">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg" style={{ color: '#7CB9E8' }}>{order.orderNumber}</span>
                    <span className="text-xs">{getPriorityIcon(order.priority)}</span>
                    <span className="text-sm" style={{ color: '#64748B' }}>• {order.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs" style={{ color: '#64748B' }} suppressHydrationWarning>
                      {order.items.length} items • {format(order.createdAt, "d MMM HH:mm", { locale: es })}
                    </div>
                    {order.customer.zone && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${zoneColors[order.customer.zone]}15`,
                          color: zoneColors[order.customer.zone],
                        }}
                      >
                        {zoneNames[order.customer.zone]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg" style={{ color: '#22C55E' }}>{formatPrice(order.totalValue)}</div>
                  <div className="text-xs" style={{ color: '#64748B' }}>Pendiente</div>
                </div>
                <div>
                  <span className="text-2xl" style={{ color: '#7CB9E8' }}>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Order, orderStatusNames } from '@/types';
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
      case 'pending': return '#C46849';
      case 'in_progress': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
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
      <div className="flex items-center gap-6 px-6 py-4 rounded-xl" style={{ backgroundColor: '#252525' }}>
        <div className="flex-1 text-center border-r" style={{ borderColor: '#3a3a3a' }}>
          <div className="text-3xl font-bold" style={{ color: '#C46849' }}>{pendingOrders.length}</div>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#a0a0a0' }}>Pendientes</div>
        </div>
        <div className="flex-1 text-center border-r" style={{ borderColor: '#3a3a3a' }}>
          <div className="text-3xl font-bold" style={{ color: '#f59e0b' }}>{inProgressOrders.length}</div>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#a0a0a0' }}>En Curso</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold" style={{ color: '#10b981' }}>
            {formatPrice(pendingOrders.reduce((sum, o) => sum + o.totalValue, 0))}
          </div>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#a0a0a0' }}>Valor Total</div>
        </div>
      </div>

      {/* Lista de Pedidos - Formato Tabla Compacta */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-bold" style={{ color: '#f5f5f5', letterSpacing: '-0.5px' }}>
            Pedidos Activos
          </h2>
          <div className="text-sm" style={{ color: '#a0a0a0' }}>
            {pendingOrders.length + inProgressOrders.length} total
          </div>
        </div>

        {pendingOrders.length === 0 && inProgressOrders.length === 0 ? (
          <div className="text-center py-16 rounded-xl" style={{ backgroundColor: '#252525' }}>
            <div className="text-6xl mb-4">📦</div>
            <p className="text-lg" style={{ color: '#a0a0a0' }}>No hay pedidos activos</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* En Proceso */}
            {inProgressOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all"
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', borderLeft: '4px solid #f59e0b' }}
                onClick={() => setSelectedOrder(order)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.15)'}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f59e0b' }}>
                  <span className="text-white font-bold text-sm">⏱</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg" style={{ color: '#f5f5f5' }}>{order.orderNumber}</span>
                    <span className="text-xs">{getPriorityIcon(order.priority)}</span>
                    <span className="text-sm" style={{ color: '#d0d0d0' }}>• {order.customer.name}</span>
                  </div>
                  <div className="text-xs" style={{ color: '#a0a0a0' }}>
                    {order.items.length} items • {format(order.createdAt, "HH:mm", { locale: es })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg" style={{ color: '#10b981' }}>{formatPrice(order.totalValue)}</div>
                  <div className="text-xs" style={{ color: '#a0a0a0' }}>En proceso</div>
                </div>
                <div>
                  <span className="text-2xl">→</span>
                </div>
              </div>
            ))}

            {/* Pendientes */}
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all"
                style={{ backgroundColor: '#252525', border: '1px solid #3a3a3a' }}
                onClick={() => setSelectedOrder(order)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2a2a2a';
                  e.currentTarget.style.borderColor = '#C46849';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#252525';
                  e.currentTarget.style.borderColor = '#3a3a3a';
                }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(196, 104, 73, 0.2)', border: '2px solid #C46849' }}>
                  <span style={{ color: '#C46849' }} className="font-bold text-sm">📦</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg" style={{ color: '#C46849' }}>{order.orderNumber}</span>
                    <span className="text-xs">{getPriorityIcon(order.priority)}</span>
                    <span className="text-sm" style={{ color: '#d0d0d0' }}>• {order.customer.name}</span>
                  </div>
                  <div className="text-xs" style={{ color: '#a0a0a0' }}>
                    {order.items.length} items • {format(order.createdAt, "d MMM HH:mm", { locale: es })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg" style={{ color: '#10b981' }}>{formatPrice(order.totalValue)}</div>
                  <div className="text-xs" style={{ color: '#a0a0a0' }}>Pendiente</div>
                </div>
                <div>
                  <span className="text-2xl" style={{ color: '#C46849' }}>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

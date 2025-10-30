'use client';

import { useState } from 'react';
import { Order, orderStatusNames } from '@/types';
import { mockOrders } from '@/lib/mockData';
import OrderDetail from './OrderDetail';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PickingView() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
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
          setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
          setSelectedOrder(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-1">Pedidos Pendientes</div>
          <div className="text-3xl font-bold text-blue-600">{pendingOrders.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600 mb-1">En Curso</div>
          <div className="text-3xl font-bold text-yellow-600">{inProgressOrders.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-1">Valor Total Pendiente</div>
          <div className="text-3xl font-bold text-green-600">
            {formatPrice(pendingOrders.reduce((sum, o) => sum + o.totalValue, 0))}
          </div>
        </div>
      </div>

      {/* Lista de pedidos pendientes */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Pedidos Disponibles</h2>

        {pendingOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">No hay pedidos pendientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-400"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xl font-bold text-blue-600">{order.orderNumber}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(order.priority)}`}>
                        {order.priority === 'high' ? '🔴 URGENTE' : order.priority === 'medium' ? '🟡 MEDIA' : '🟢 BAJA'}
                      </span>
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`} />
                    </div>

                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {order.customer.name}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span>📞 {order.customer.phone}</span>
                      <span>📍 {order.customer.address}</span>
                      <span>🕒 {format(order.createdAt, "d 'de' MMMM, HH:mm", { locale: es })}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                        {order.items.length} items
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(order.totalValue)}
                      </span>
                    </div>
                  </div>

                  <button
                    className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(order);
                    }}
                  >
                    Ver Detalles →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pedidos en curso */}
      {inProgressOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-yellow-600">Pedidos en Curso</h2>
          <div className="space-y-3">
            {inProgressOrders.map((order) => (
              <div
                key={order.id}
                className="border-2 border-yellow-300 bg-yellow-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg">{order.orderNumber}</span>
                    <span className="text-gray-600 ml-3">- {order.customer.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    Asignado hace {Math.round((Date.now() - (order.assignedAt?.getTime() || 0)) / 60000)} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

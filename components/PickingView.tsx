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
          onUpdateOrder(updatedOrder);
          if (updatedOrder.status === 'ready_for_billing') {
            setSelectedOrder(null); // Cerrar si se envió a facturación
          } else {
            setSelectedOrder(updatedOrder); // Actualizar vista si sigue en picking
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-500">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Pedidos Pendientes</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{pendingOrders.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 border-l-4 border-yellow-500">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">En Curso</div>
          <div className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400">{inProgressOrders.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 border-l-4 border-green-500">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Valor Total Pendiente</div>
          <div className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
            {formatPrice(pendingOrders.reduce((sum, o) => sum + o.totalValue, 0))}
          </div>
        </div>
      </div>

      {/* Lista de pedidos pendientes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Pedidos Disponibles</h2>

        {pendingOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">No hay pedidos pendientes</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 dark:bg-gray-700"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{order.orderNumber}</span>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(order.priority)}`}>
                        {order.priority === 'high' ? '🔴 URGENTE' : order.priority === 'medium' ? '🟡 MEDIA' : '🟢 BAJA'}
                      </span>
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`} />
                    </div>

                    <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {order.customer.name}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <span>📞 {order.customer.phone}</span>
                      {order.customer.address && (
                        <>
                          <span className="hidden sm:inline">📍 {order.customer.address}</span>
                          <span className="sm:hidden">📍 {order.customer.address.substring(0, 30)}...</span>
                        </>
                      )}
                      <span>🕒 {format(order.createdAt, "d MMM, HH:mm", { locale: es })}</span>
                    </div>

                    <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                      <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 sm:px-3 py-1 rounded-full">
                        {order.items.length} items
                      </span>
                      <span className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                        {formatPrice(order.totalValue)}
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full sm:w-auto sm:ml-4 px-4 sm:px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold text-sm sm:text-base"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-yellow-600 dark:text-yellow-400">Pedidos en Curso</h2>
          <div className="space-y-2 sm:space-y-3">
            {inProgressOrders.map((order) => (
              <div
                key={order.id}
                className="border-2 border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-30 rounded-lg p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-base sm:text-lg dark:text-gray-100">{order.orderNumber}</span>
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">- {order.customer.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
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

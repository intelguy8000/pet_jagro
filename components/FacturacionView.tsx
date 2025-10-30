'use client';

import { useState } from 'react';
import { Order, orderStatusNames } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FacturacionViewProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}

export default function FacturacionView({ orders, onUpdateOrder }: FacturacionViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const ordersReadyForBilling = orders.filter(o => o.status === 'ready_for_billing');
  const billedOrders = orders.filter(o => o.status === 'billed');

  const handleBillOrder = (order: Order) => {
    const billedOrder = {
      ...order,
      status: 'billed' as const,
    };
    onUpdateOrder(billedOrder);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Pendientes de Facturar</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{ordersReadyForBilling.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Facturados Hoy</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{billedOrders.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Valor Total Pendiente</div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {formatPrice(ordersReadyForBilling.reduce((sum, o) => sum + o.totalValue, 0))}
          </div>
        </div>
      </div>

      {/* Pedidos Pendientes de Facturar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          💰 Pedidos Listos para Facturar
        </h2>

        {ordersReadyForBilling.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No hay pedidos pendientes de facturar
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersReadyForBilling.map((order) => (
              <div
                key={order.id}
                className="border-2 border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {order.orderNumber}
                      </span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 dark:bg-opacity-30 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold">
                        ✓ COMPLETADO
                      </span>
                    </div>

                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {order.customer.name}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <span>📞 {order.customer.phone}</span>
                      <span>📍 {order.customer.address}</span>
                      {order.completedAt && (
                        <span>✓ Completado: {format(order.completedAt, "d 'de' MMMM, HH:mm", { locale: es })}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full">
                        {order.items.length} items
                      </span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatPrice(order.totalValue)}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => handleBillOrder(order)}
                      className="px-6 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-semibold"
                    >
                      ✓ Facturar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pedidos Facturados */}
      {billedOrders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
            ✓ Pedidos Facturados
          </h2>
          <div className="space-y-3">
            {billedOrders.map((order) => (
              <div
                key={order.id}
                className="border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg dark:text-gray-100">{order.orderNumber}</span>
                      <span className="text-gray-600 dark:text-gray-300">- {order.customer.name}</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {formatPrice(order.totalValue)}
                      </span>
                    </div>
                  </div>
                  {order.completedAt && (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {format(order.completedAt, "HH:mm", { locale: es })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de detalle de pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Detalles del Pedido
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-3xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {selectedOrder.orderNumber}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {selectedOrder.customer.name}
                </div>
                <div className="space-y-1 text-gray-600 dark:text-gray-300">
                  <div>📞 {selectedOrder.customer.phone}</div>
                  <div>📍 {selectedOrder.customer.address}</div>
                </div>
              </div>

              <div className="border-t dark:border-gray-600 pt-4">
                <h3 className="font-bold text-lg mb-3 dark:text-gray-100">Items del Pedido</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded"
                    >
                      <div>
                        <div className="font-medium dark:text-gray-100">{item.product.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Cantidad: {item.quantity} | Código: {item.product.barcode}
                        </div>
                      </div>
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t dark:border-gray-600 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="dark:text-gray-100">Total:</span>
                  <span className="text-green-600 dark:text-green-400">
                    {formatPrice(selectedOrder.totalValue)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleBillOrder(selectedOrder)}
                className="w-full py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-bold text-lg"
              >
                ✓ Confirmar y Facturar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

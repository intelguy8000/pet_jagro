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
      {/* Estadísticas - Horizontal Compacto */}
      <div className="flex items-center gap-6 px-6 py-4 rounded-xl" style={{ backgroundColor: '#252525' }}>
        <div className="flex-1 text-center border-r" style={{ borderColor: '#3a3a3a' }}>
          <div className="text-3xl font-bold" style={{ color: '#C46849' }}>{ordersReadyForBilling.length}</div>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#a0a0a0' }}>Pendientes</div>
        </div>
        <div className="flex-1 text-center border-r" style={{ borderColor: '#3a3a3a' }}>
          <div className="text-3xl font-bold" style={{ color: '#10b981' }}>{billedOrders.length}</div>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#a0a0a0' }}>Facturados Hoy</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold" style={{ color: '#10b981' }}>
            {formatPrice(ordersReadyForBilling.reduce((sum, o) => sum + o.totalValue, 0))}
          </div>
          <div className="text-xs uppercase tracking-wide" style={{ color: '#a0a0a0' }}>Valor Pendiente</div>
        </div>
      </div>

      {/* Pedidos Pendientes de Facturar */}
      <div className="rounded-xl p-6" style={{ backgroundColor: '#252525' }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#f5f5f5', letterSpacing: '-0.5px' }}>
          Pedidos Listos para Facturar
        </h2>

        {ordersReadyForBilling.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-lg" style={{ color: '#a0a0a0' }}>
              No hay pedidos pendientes de facturar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {ordersReadyForBilling.map((order) => (
              <div
                key={order.id}
                className="rounded-lg p-4"
                style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xl font-bold" style={{ color: '#C46849' }}>
                        {order.orderNumber}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                        ✓ COMPLETADO
                      </span>
                    </div>

                    <div className="text-lg font-semibold mb-1" style={{ color: '#f5f5f5' }}>
                      {order.customer.name}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm mb-3" style={{ color: '#d0d0d0' }}>
                      <span>📞 {order.customer.phone}</span>
                      <span>📍 {order.customer.address}</span>
                      {order.completedAt && (
                        <span>✓ Completado: {format(order.completedAt, "d 'de' MMMM, HH:mm", { locale: es })}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#3a3a3a', color: '#d0d0d0' }}>
                        {order.items.length} items
                      </span>
                      <span className="text-lg font-bold" style={{ color: '#10b981' }}>
                        {formatPrice(order.totalValue)}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-6 py-2 text-white rounded-lg transition-colors font-semibold"
                      style={{ backgroundColor: '#3a3a3a' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#505050'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => handleBillOrder(order)}
                      className="px-6 py-2 text-white rounded-lg transition-colors font-semibold"
                      style={{ backgroundColor: '#10b981' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
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
        <div className="rounded-xl p-6" style={{ backgroundColor: '#252525' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#10b981', letterSpacing: '-0.5px' }}>
            ✓ Pedidos Facturados
          </h2>
          <div className="space-y-3">
            {billedOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg p-4"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg" style={{ color: '#f5f5f5' }}>{order.orderNumber}</span>
                      <span style={{ color: '#d0d0d0' }}>- {order.customer.name}</span>
                      <span className="text-sm font-bold" style={{ color: '#10b981' }}>
                        {formatPrice(order.totalValue)}
                      </span>
                    </div>
                  </div>
                  {order.completedAt && (
                    <span className="text-sm" style={{ color: '#a0a0a0' }}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
          <div className="rounded-xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#252525' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#f5f5f5', letterSpacing: '-0.5px' }}>
                Detalles del Pedido
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-3xl font-bold transition-colors"
                style={{ color: '#a0a0a0' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0a0'}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold mb-2" style={{ color: '#C46849' }}>
                  {selectedOrder.orderNumber}
                </div>
                <div className="text-xl font-semibold mb-2" style={{ color: '#f5f5f5' }}>
                  {selectedOrder.customer.name}
                </div>
                <div className="space-y-1" style={{ color: '#d0d0d0' }}>
                  <div>📞 {selectedOrder.customer.phone}</div>
                  <div>📍 {selectedOrder.customer.address}</div>
                </div>
              </div>

              <div className="pt-4" style={{ borderTop: '1px solid #3a3a3a' }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#f5f5f5' }}>Items del Pedido</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 rounded"
                      style={{ backgroundColor: '#2a2a2a' }}
                    >
                      <div>
                        <div className="font-medium" style={{ color: '#f5f5f5' }}>{item.product.name}</div>
                        <div className="text-sm" style={{ color: '#a0a0a0' }}>
                          Cantidad: {item.quantity} | Código: {item.product.barcode}
                        </div>
                      </div>
                      <div className="font-bold" style={{ color: '#10b981' }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4" style={{ borderTop: '1px solid #3a3a3a' }}>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span style={{ color: '#f5f5f5' }}>Total:</span>
                  <span style={{ color: '#10b981' }}>
                    {formatPrice(selectedOrder.totalValue)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleBillOrder(selectedOrder)}
                className="w-full py-3 text-white rounded-lg transition-colors font-bold text-lg"
                style={{ backgroundColor: '#10b981' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
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

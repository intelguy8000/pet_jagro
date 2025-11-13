'use client';

import { useState } from 'react';
import { Order, OrderItem, categoryNames, zoneNames, zoneColors } from '@/types';
import BarcodeScanner from './BarcodeScanner';
import { mockProducts } from '@/lib/mockData';

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  onUpdate: (order: Order) => void;
}

export default function OrderDetail({ order: initialOrder, onBack, onUpdate }: OrderDetailProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [showScanner, setShowScanner] = useState(false);
  const [currentItem, setCurrentItem] = useState<OrderItem | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAcceptOrder = () => {
    const updatedOrder = {
      ...order,
      status: 'in_progress' as const,
      assignedTo: '2',
      assignedAt: new Date(),
    };
    setOrder(updatedOrder);
  };

  const handleSendToBilling = () => {
    const billingOrder = {
      ...order,
      status: 'ready_for_billing' as const,
    };
    setOrder(billingOrder);
    onUpdate(billingOrder);
    setTimeout(() => onBack(), 1000);
  };

  const handleStartScanning = (item: OrderItem) => {
    setCurrentItem(item);
    setShowScanner(true);
  };

  const handleScanSuccess = (barcode: string, quantity: number = 1) => {
    if (!currentItem) return;

    if (barcode === currentItem.product.barcode) {
      const updatedItems = order.items.map(item => {
        if (item.id === currentItem.id) {
          const newScannedQty = Math.min(item.scannedQuantity + quantity, item.quantity);
          return {
            ...item,
            scannedQuantity: newScannedQty,
            scanned: newScannedQty === item.quantity,
            scannedAt: new Date(),
          };
        }
        return item;
      });

      const updatedOrder = { ...order, items: updatedItems };
      setOrder(updatedOrder);
      setShowScanner(false);
      setCurrentItem(null);

      if (updatedItems.every(item => item.scanned)) {
        const completedOrder = {
          ...updatedOrder,
          status: 'completed' as const,
          completedAt: new Date(),
        };
        setOrder(completedOrder);
        onUpdate(completedOrder);
      }
    } else {
      alert('❌ Código incorrecto. Por favor escanea el producto correcto.');
    }
  };

  const allScanned = order.items.every(item => item.scanned);
  const progress = (order.items.reduce((sum, item) => sum + item.scannedQuantity, 0) /
                    order.items.reduce((sum, item) => sum + item.quantity, 0)) * 100;

  return (
    <div className="space-y-4">
      {/* Header Minimalista */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
          style={{ backgroundColor: '#252525', color: '#C46849' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#252525'}
        >
          <span className="text-xl">←</span>
          <span className="font-semibold">Volver</span>
        </button>

        {order.status === 'completed' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            <span>✅</span>
            <span className="font-semibold">Completado</span>
          </div>
        )}
      </div>

      {/* Grid Layout - Info Cliente + Detalles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Columna Izquierda - Info Cliente */}
        <div className="lg:col-span-1 space-y-4">
          {/* Card Cliente */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#252525' }}>
            <div className="text-xs uppercase tracking-wide mb-3" style={{ color: '#a0a0a0' }}>Pedido</div>
            <div className="text-3xl font-bold mb-4" style={{ color: '#C46849', letterSpacing: '-1px' }}>
              {order.orderNumber}
            </div>

            <div className="text-xs uppercase tracking-wide mb-2" style={{ color: '#a0a0a0' }}>Cliente</div>
            <div className="text-lg font-semibold mb-3" style={{ color: '#f5f5f5' }}>
              {order.customer.name}
            </div>

            <div className="space-y-2 text-sm" style={{ color: '#d0d0d0' }}>
              <div className="flex items-start gap-2">
                <span>📞</span>
                <span>{order.customer.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <span>📍</span>
                <div className="flex-1">
                  <div className="mb-2">{order.customer.address}</div>
                  {order.customer.zone && (
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${zoneColors[order.customer.zone]}20`,
                        color: zoneColors[order.customer.zone],
                        border: `1px solid ${zoneColors[order.customer.zone]}40`
                      }}
                    >
                      <span>🗺️</span>
                      <span>Zona {zoneNames[order.customer.zone]}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6" style={{ borderTop: '1px solid #3a3a3a' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase" style={{ color: '#a0a0a0' }}>Total</span>
                <span className="text-2xl font-bold" style={{ color: '#10b981' }}>
                  {formatPrice(order.totalValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Progreso */}
          {order.status !== 'pending' && (
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#252525' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wide" style={{ color: '#a0a0a0' }}>Progreso</span>
                <span className="text-2xl font-bold" style={{ color: '#C46849' }}>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: '#3a3a3a' }}>
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ backgroundColor: '#C46849', width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 text-xs" style={{ color: '#a0a0a0' }}>
                {order.items.filter(i => i.scanned).length} de {order.items.length} items escaneados
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          {order.status === 'pending' && (
            <button
              onClick={handleAcceptOrder}
              className="w-full py-4 rounded-xl font-bold text-white transition-all"
              style={{ backgroundColor: '#C46849' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a54d32'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C46849'}
            >
              ✓ Aceptar y Comenzar
            </button>
          )}

          {order.status === 'completed' && (
            <button
              onClick={handleSendToBilling}
              className="w-full py-4 rounded-xl font-bold text-white transition-all"
              style={{ backgroundColor: '#C46849' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a54d32'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C46849'}
            >
              💰 Pasar a Facturación
            </button>
          )}
        </div>

        {/* Columna Derecha - Tabla de Items */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#252525' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#f5f5f5', letterSpacing: '-0.5px' }}>
              Items del Pedido
            </h3>

            {/* Tabla Compacta */}
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg transition-all"
                  style={{
                    backgroundColor: item.scanned ? 'rgba(16, 185, 129, 0.1)' : '#2a2a2a',
                    border: item.scanned ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #3a3a3a'
                  }}
                >
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {item.scanned ? (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#10b981' }}>
                        <span className="text-white text-lg">✓</span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3a3a3a', border: '2px dashed #707070' }}>
                        <span style={{ color: '#707070' }}>□</span>
                      </div>
                    )}
                  </div>

                  {/* Info Producto */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold mb-1" style={{ color: '#f5f5f5' }}>
                      {item.product.name}
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#a0a0a0' }}>
                      <span>{categoryNames[item.product.category]}</span>
                      <span>•</span>
                      <span className="font-mono">{item.product.barcode}</span>
                      {item.product.batchNumber && (
                        <>
                          <span>•</span>
                          <span>Lote: {item.product.batchNumber}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Stock: {item.product.stock}</span>
                    </div>
                  </div>

                  {/* Cantidad */}
                  <div className="flex-shrink-0 text-center">
                    <div className="text-sm" style={{ color: '#a0a0a0' }}>Cantidad</div>
                    <div className="text-xl font-bold" style={{ color: item.scanned ? '#10b981' : '#C46849' }}>
                      {item.scannedQuantity}/{item.quantity}
                    </div>
                  </div>

                  {/* Botón Escanear */}
                  {order.status === 'in_progress' && !item.scanned && (
                    <button
                      onClick={() => handleStartScanning(item)}
                      className="flex-shrink-0 px-6 py-3 rounded-lg font-semibold text-white transition-all"
                      style={{ backgroundColor: '#C46849' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a54d32'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C46849'}
                    >
                      📷 Escanear
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de escáner */}
      {showScanner && currentItem && (
        <BarcodeScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => {
            setShowScanner(false);
            setCurrentItem(null);
          }}
          expectedBarcode={currentItem.product.barcode}
          productName={currentItem.product.name}
          allProducts={mockProducts}
        />
      )}
    </div>
  );
}

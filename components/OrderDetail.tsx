'use client';

import { useState } from 'react';
import { Order, OrderItem, categoryNames } from '@/types';
import BarcodeScanner from './BarcodeScanner';

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
      assignedTo: '2', // ID del picker actual
      assignedAt: new Date(),
    };
    setOrder(updatedOrder);
  };

  const handleStartScanning = (item: OrderItem) => {
    setCurrentItem(item);
    setShowScanner(true);
  };

  const handleScanSuccess = (barcode: string) => {
    if (!currentItem) return;

    if (barcode === currentItem.product.barcode) {
      const updatedItems = order.items.map(item => {
        if (item.id === currentItem.id) {
          const newScannedQty = Math.min(item.scannedQuantity + 1, item.quantity);
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

      // Si todos los items están escaneados, completar el pedido
      if (updatedItems.every(item => item.scanned)) {
        const completedOrder = {
          ...updatedOrder,
          status: 'completed' as const,
          completedAt: new Date(),
        };
        setOrder(completedOrder);
        setTimeout(() => onUpdate(completedOrder), 1500);
      }
    } else {
      alert('❌ Código incorrecto. Por favor escanea el producto correcto.');
    }
  };

  const allScanned = order.items.every(item => item.scanned);
  const progress = (order.items.reduce((sum, item) => sum + item.scannedQuantity, 0) /
                    order.items.reduce((sum, item) => sum + item.quantity, 0)) * 100;

  return (
    <div className="space-y-6">
      {/* Header con botón volver */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <span>←</span>
          <span>Volver a Pedidos</span>
        </button>

        {order.status === 'completed' && (
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
            <span>✅</span>
            <span>Pedido Completado</span>
          </div>
        )}
      </div>

      {/* Información del pedido */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">{order.orderNumber}</h1>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{order.customer.name}</h2>
            <div className="space-y-1 text-gray-600">
              <div>📞 {order.customer.phone}</div>
              <div>📍 {order.customer.address}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-green-600">{formatPrice(order.totalValue)}</div>
          </div>
        </div>

        {/* Barra de progreso */}
        {order.status !== 'pending' && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold">Progreso del Picking</span>
              <span className="text-blue-600 font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Botón aceptar pedido */}
        {order.status === 'pending' && (
          <button
            onClick={handleAcceptOrder}
            className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg"
          >
            ✓ Aceptar Pedido y Comenzar Picking
          </button>
        )}
      </div>

      {/* Lista de items */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4">Items del Pedido</h3>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className={`border-2 rounded-lg p-4 transition-all ${
                item.scanned
                  ? 'border-green-400 bg-green-50'
                  : order.status === 'in_progress'
                  ? 'border-blue-300'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {item.scanned && <span className="text-2xl">✅</span>}
                    <h4 className="text-lg font-semibold">{item.product.name}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Categoría: </span>
                      <span className="font-medium">{categoryNames[item.product.category]}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Código: </span>
                      <span className="font-mono font-medium">{item.product.barcode}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cantidad: </span>
                      <span className="font-bold text-blue-600">
                        {item.scannedQuantity} / {item.quantity}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Stock disponible: </span>
                      <span className={`font-bold ${item.product.stock > item.quantity ? 'text-green-600' : 'text-orange-600'}`}>
                        {item.product.stock} unidades
                      </span>
                    </div>
                  </div>

                  {item.product.stock < item.quantity && (
                    <div className="bg-orange-100 border border-orange-300 text-orange-800 px-3 py-2 rounded text-sm mb-2">
                      ⚠️ Stock insuficiente. Disponible: {item.product.stock}
                    </div>
                  )}
                </div>

                {order.status === 'in_progress' && !item.scanned && (
                  <button
                    onClick={() => handleStartScanning(item)}
                    className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    📷 Escanear
                  </button>
                )}
              </div>
            </div>
          ))}
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
        />
      )}
    </div>
  );
}

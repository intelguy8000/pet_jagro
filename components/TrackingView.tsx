'use client';

import { useState } from 'react';
import Image from 'next/image';
import { mockProducts, mockPurchaseSuggestions } from '@/lib/mockData';
import { Product, PurchaseSuggestion, categoryNames, Order } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TrackingViewProps {
  orders: Order[];
}

export default function TrackingView({ orders }: TrackingViewProps) {
  const [products] = useState<Product[]>(mockProducts);
  const [suggestions] = useState<PurchaseSuggestion[]>(mockPurchaseSuggestions);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getFilteredProducts = () => {
    switch (filter) {
      case 'low':
        return products.filter(p => p.stock > 0 && p.stock <= p.minStock);
      case 'out':
        return products.filter(p => p.stock === 0);
      default:
        return products;
    }
  };

  const filteredProducts = getFilteredProducts();
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);

  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-500">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Total Productos</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{products.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 border-l-4 border-yellow-500">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Stock Bajo</div>
          <div className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400">{lowStockCount}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 border-l-4 border-red-500">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Agotados</div>
          <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">{outOfStockCount}</div>
        </div>
        <div className="col-span-2 md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 border-l-4 border-green-500">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Valor Total</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{formatPrice(totalValue)}</div>
        </div>
      </div>

      {/* Sugerencias de Compra */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center dark:text-gray-100">
          <span className="mr-2">💡</span>
          Sugerencias de Compra
        </h2>

        <div className="space-y-4">
          {suggestions.map((suggestion) => {
            const urgencyColors = {
              high: 'bg-red-100 dark:bg-red-900 dark:bg-opacity-30 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300',
              medium: 'bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30 border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-300',
              low: 'bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 border-blue-400 dark:border-blue-600 text-blue-800 dark:text-blue-300',
            };

            return (
              <div
                key={suggestion.id}
                className={`border-2 rounded-lg p-4 ${urgencyColors[suggestion.urgency]}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold">{suggestion.product.name}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-700">
                        {suggestion.urgency === 'high' ? '🔴 URGENTE' :
                         suggestion.urgency === 'medium' ? '🟡 PRONTO' : '🟢 NORMAL'}
                      </span>
                    </div>

                    <div className="mb-2 text-sm">
                      <span className="font-semibold">Razón: </span>
                      {suggestion.reason}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Stock actual: </span>
                        <span className="font-bold">{suggestion.product.stock}</span>
                      </div>
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Cantidad sugerida: </span>
                        <span className="font-bold text-green-700 dark:text-green-400">{suggestion.suggestedQuantity}</span>
                      </div>
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">Costo estimado: </span>
                        <span className="font-bold">{formatPrice(suggestion.estimatedCost)}</span>
                      </div>
                    </div>
                  </div>

                  <button className="ml-4 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-opacity-80 transition-colors font-semibold text-sm">
                    Generar Orden
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t dark:border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold dark:text-gray-200">Inversión Total Sugerida:</span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatPrice(suggestions.reduce((sum, s) => sum + s.estimatedCost, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Pedidos Terminados */}
      {completedOrders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
            ✓ Pedidos Completados (Listos para Facturar)
          </h2>
          <div className="space-y-3">
            {completedOrders.map((order) => (
              <div
                key={order.id}
                className="border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-bold text-lg dark:text-gray-100">{order.orderNumber}</span>
                      <span className="text-gray-600 dark:text-gray-300">- {order.customer.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <span>{order.items.length} items</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {formatPrice(order.totalValue)}
                      </span>
                      {order.completedAt && (
                        <span>
                          Completado: {format(order.completedAt, "d 'de' MMMM, HH:mm", { locale: es })}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-semibold">
                    PENDIENTE FACTURACIÓN
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventario Completo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold dark:text-gray-100">Inventario Completo</h2>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                filter === 'all'
                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                filter === 'low'
                  ? 'bg-yellow-500 dark:bg-yellow-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Stock Bajo
            </button>
            <button
              onClick={() => setFilter('out')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                filter === 'out'
                  ? 'bg-red-500 dark:bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Agotados
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b-2 border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">Imagen</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">Producto</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">Categoría</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">Stock</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">Mín.</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">Precio</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    {product.imageUrl ? (
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 48px, 64px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <span className="text-xl sm:text-2xl">📦</span>
                      </div>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="font-medium text-xs sm:text-sm text-gray-900 dark:text-gray-100 break-words">{product.name}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-mono break-all">{product.barcode}</div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {categoryNames[product.category]}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                    <span className={`font-bold text-sm sm:text-base ${
                      product.stock === 0 ? 'text-red-600 dark:text-red-400' :
                      product.stock <= product.minStock ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {product.minStock}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-right font-medium text-xs sm:text-sm dark:text-gray-200">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                    {product.stock === 0 ? (
                      <span className="px-2 sm:px-3 py-1 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 text-red-800 dark:text-red-300 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                        AGOTADO
                      </span>
                    ) : product.stock <= product.minStock ? (
                      <span className="px-2 sm:px-3 py-1 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30 text-yellow-800 dark:text-yellow-300 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                        BAJO
                      </span>
                    ) : (
                      <span className="px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900 dark:bg-opacity-30 text-green-800 dark:text-green-300 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

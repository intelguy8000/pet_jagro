'use client';

import { useState } from 'react';
import { mockProducts, mockPurchaseSuggestions } from '@/lib/mockData';
import { Product, PurchaseSuggestion, categoryNames } from '@/types';

export default function TrackingView() {
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

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-1">Total Productos</div>
          <div className="text-3xl font-bold text-blue-600">{products.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600 mb-1">Stock Bajo</div>
          <div className="text-3xl font-bold text-yellow-600">{lowStockCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="text-sm text-gray-600 mb-1">Agotados</div>
          <div className="text-3xl font-bold text-red-600">{outOfStockCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-1">Valor Total</div>
          <div className="text-2xl font-bold text-green-600">{formatPrice(totalValue)}</div>
        </div>
      </div>

      {/* Sugerencias de Compra */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Sugerencias de Compra
        </h2>

        <div className="space-y-4">
          {suggestions.map((suggestion) => {
            const urgencyColors = {
              high: 'bg-red-100 border-red-400 text-red-800',
              medium: 'bg-yellow-100 border-yellow-400 text-yellow-800',
              low: 'bg-blue-100 border-blue-400 text-blue-800',
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
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white">
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
                        <span className="text-gray-700">Stock actual: </span>
                        <span className="font-bold">{suggestion.product.stock}</span>
                      </div>
                      <div>
                        <span className="text-gray-700">Cantidad sugerida: </span>
                        <span className="font-bold text-green-700">{suggestion.suggestedQuantity}</span>
                      </div>
                      <div>
                        <span className="text-gray-700">Costo estimado: </span>
                        <span className="font-bold">{formatPrice(suggestion.estimatedCost)}</span>
                      </div>
                    </div>
                  </div>

                  <button className="ml-4 px-4 py-2 bg-white rounded-lg hover:bg-opacity-80 transition-colors font-semibold text-sm">
                    Generar Orden
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Inversión Total Sugerida:</span>
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(suggestions.reduce((sum, s) => sum + s.estimatedCost, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Inventario Completo */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Inventario Completo</h2>

          {/* Filtros */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'low'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Stock Bajo
            </button>
            <button
              onClick={() => setFilter('out')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'out'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Agotados
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Producto</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoría</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Mín.</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Precio</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{product.barcode}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {categoryNames[product.category]}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock <= product.minStock ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {product.minStock}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.stock === 0 ? (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                        AGOTADO
                      </span>
                    ) : product.stock <= product.minStock ? (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        BAJO
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
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

'use client';

import { Product } from '@/types';
import { useState } from 'react';

interface InventoryPanelProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export default function InventoryPanel({ products, setProducts }: InventoryPanelProps) {
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'category'>('name');

  const getFilteredProducts = () => {
    let filtered = [...products];

    // Apply filter
    switch (filter) {
      case 'low':
        filtered = filtered.filter(p => p.stock > 0 && p.stock <= p.minStock);
        break;
      case 'out':
        filtered = filtered.filter(p => p.stock === 0);
        break;
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return a.stock - b.stock;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { label: 'OUT', color: 'bg-red-500', textColor: 'text-red-700' };
    } else if (product.stock <= product.minStock) {
      return { label: 'LOW', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    }
    return { label: 'OK', color: 'bg-green-500', textColor: 'text-green-700' };
  };

  const getTotalValue = () => {
    return products.reduce((total, p) => total + (p.stock * p.price), 0);
  };

  const getLowStockCount = () => {
    return products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  };

  const getOutOfStockCount = () => {
    return products.filter(p => p.stock === 0).length;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Panel Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4">
        <h2 className="text-xl font-semibold">Inventory Overview</h2>
        <p className="text-sm text-indigo-100 mt-1">{products.length} total products</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 border-b border-gray-200">
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <div className="text-xs text-gray-600 mb-1">Total Value</div>
          <div className="text-lg font-bold text-gray-900">${getTotalValue().toFixed(0)}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center shadow-sm">
          <div className="text-xs text-yellow-700 mb-1">Low Stock</div>
          <div className="text-lg font-bold text-yellow-900">{getLowStockCount()}</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center shadow-sm">
          <div className="text-xs text-red-700 mb-1">Out of Stock</div>
          <div className="text-lg font-bold text-red-900">{getOutOfStockCount()}</div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="p-4 border-b border-gray-200 bg-white space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Filter</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                filter === 'low'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low
            </button>
            <button
              onClick={() => setFilter('out')}
              className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                filter === 'out'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Out
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Name</option>
            <option value="stock">Stock Level</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {/* Products List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-2">No products match the filter</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const status = getStockStatus(product);
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 pr-2">
                    {product.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color} text-white`}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium text-gray-900 capitalize">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock:</span>
                    <span className={`font-medium ${status.textColor}`}>
                      {product.stock} / {product.minStock}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium text-gray-900">${product.price.toFixed(2)}</span>
                  </div>
                  {product.supplier && (
                    <div className="flex justify-between">
                      <span>Supplier:</span>
                      <span className="font-medium text-gray-900 text-right">{product.supplier}</span>
                    </div>
                  )}
                </div>

                {/* Stock Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        product.stock === 0
                          ? 'bg-red-500'
                          : product.stock <= product.minStock
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${Math.min((product.stock / (product.minStock * 2)) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

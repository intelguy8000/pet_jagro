'use client';

import { Product, categoryNames } from '@/types';
import { useState } from 'react';

interface ProductSelectionModalProps {
  barcode: string;
  products: Product[];
  onSelect: (product: Product) => void;
  onCancel: () => void;
}

export default function ProductSelectionModal({
  barcode,
  products,
  onSelect,
  onCancel,
}: ProductSelectionModalProps) {
  const [rememberChoice, setRememberChoice] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSelect = (product: Product) => {
    if (rememberChoice) {
      // Guardar en sessionStorage para recordar durante esta sesión
      sessionStorage.setItem(`barcode_default_${barcode}`, product.id);
    }
    onSelect(product);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="rounded-xl max-w-md w-full p-6 transition-all duration-200"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid #E2E8F0'
        }}
      >
        {/* Header con alerta */}
        <div
          className="mb-4 p-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚠️</span>
            <span className="font-semibold text-sm" style={{ color: '#D97706' }}>
              Código con múltiples productos
            </span>
          </div>
          <p className="text-xs" style={{ color: '#64748B' }}>
            El código{' '}
            <span className="font-mono font-bold" style={{ color: '#5B9BD5' }}>
              {barcode}
            </span>{' '}
            corresponde a {products.length} presentaciones diferentes
          </p>
        </div>

        {/* Título */}
        <h2 className="text-lg font-bold mb-3" style={{ color: '#1E293B' }}>
          Selecciona la presentación correcta:
        </h2>

        {/* Lista de productos para elegir */}
        <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
          {products.map((product, idx) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="w-full p-4 rounded-lg transition-all duration-200 text-left relative"
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.borderColor = '#7CB9E8';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 185, 232, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-base mb-1" style={{ color: '#1E293B' }}>
                    {product.name}
                  </div>
                  <div className="text-xs mb-1" style={{ color: '#64748B' }}>
                    {categoryNames[product.category]}
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-xs mb-1" style={{ color: '#64748B' }}>
                    Stock
                  </div>
                  <div
                    className="font-bold text-sm"
                    style={{
                      color: product.stock > 0 ? '#22C55E' : '#EF4444'
                    }}
                  >
                    {product.stock}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold" style={{ color: '#5B9BD5' }}>
                  {formatPrice(product.price)}
                </span>
                <span
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: '#7CB9E8',
                    color: 'white'
                  }}
                >
                  Seleccionar →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Opción de recordar selección */}
        <div
          className="p-3 rounded-lg mb-4"
          style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
        >
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberChoice}
              onChange={(e) => setRememberChoice(e.target.checked)}
              className="mt-0.5"
              style={{ accentColor: '#7CB9E8' }}
            />
            <span className="text-xs flex-1" style={{ color: '#64748B' }}>
              Recordar mi elección para este código durante esta sesión
            </span>
          </label>
        </div>

        {/* Botón cancelar */}
        <button
          onClick={onCancel}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #E2E8F0',
            color: '#64748B'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#EF4444';
            e.currentTarget.style.color = '#EF4444';
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.color = '#64748B';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

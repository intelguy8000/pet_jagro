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
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
    >
      <div
        className="rounded-xl shadow-2xl max-w-md w-full p-6"
        style={{ backgroundColor: '#252525' }}
      >
        {/* Header con alerta */}
        <div
          className="mb-4 p-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(251, 146, 60, 0.1)',
            border: '1px solid rgba(251, 146, 60, 0.3)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚠️</span>
            <span className="font-semibold text-sm" style={{ color: '#fb923c' }}>
              Código con múltiples productos
            </span>
          </div>
          <p className="text-xs" style={{ color: '#a0a0a0' }}>
            El código{' '}
            <span className="font-mono font-bold" style={{ color: '#C46849' }}>
              {barcode}
            </span>{' '}
            corresponde a {products.length} presentaciones diferentes
          </p>
        </div>

        {/* Título */}
        <h2 className="text-lg font-bold mb-3" style={{ color: '#f5f5f5' }}>
          Selecciona la presentación correcta:
        </h2>

        {/* Lista de productos para elegir */}
        <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
          {products.map((product, idx) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="w-full p-4 rounded-lg transition-all text-left relative"
              style={{
                backgroundColor: '#2a2a2a',
                border: '1px solid #3a3a3a'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3a3a3a';
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.borderColor = '#C46849';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = '#3a3a3a';
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-base mb-1" style={{ color: '#f5f5f5' }}>
                    {product.name}
                  </div>
                  <div className="text-xs mb-1" style={{ color: '#a0a0a0' }}>
                    {categoryNames[product.category]}
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-xs mb-1" style={{ color: '#a0a0a0' }}>
                    Stock
                  </div>
                  <div
                    className="font-bold text-sm"
                    style={{
                      color: product.stock > 0 ? '#10b981' : '#ef4444'
                    }}
                  >
                    {product.stock}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold" style={{ color: '#C46849' }}>
                  {formatPrice(product.price)}
                </span>
                <span
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: '#C46849',
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
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberChoice}
              onChange={(e) => setRememberChoice(e.target.checked)}
              className="mt-0.5"
              style={{ accentColor: '#C46849' }}
            />
            <span className="text-xs flex-1" style={{ color: '#a0a0a0' }}>
              Recordar mi elección para este código durante esta sesión
            </span>
          </label>
        </div>

        {/* Botón cancelar */}
        <button
          onClick={onCancel}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-colors"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #3a3a3a',
            color: '#a0a0a0'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ef4444';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#3a3a3a';
            e.currentTarget.style.color = '#a0a0a0';
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

interface QuantityModalProps {
  productName: string;
  barcode: string;
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

export default function QuantityModal({
  productName,
  barcode,
  onConfirm,
  onCancel,
}: QuantityModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  // Botones de cantidad rápida
  const quickButtons = [1, 6, 12, 24];

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }
    if (num > 1000) {
      setError('¿Estás seguro? Parece una cantidad muy alta');
    } else {
      setError('');
    }
    setQuantity(num);
  };

  const handleConfirm = () => {
    if (quantity < 1) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }
    onConfirm(quantity);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: '#1E293B' }}
          >
            ¿Cuántas unidades?
          </h2>
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
          >
            <div className="text-sm mb-1" style={{ color: '#64748B' }}>
              Producto
            </div>
            <div className="font-semibold mb-2 break-words" style={{ color: '#1E293B' }}>
              {productName}
            </div>
            <div className="text-xs" style={{ color: '#64748B' }}>
              Código: <span className="font-mono font-semibold" style={{ color: '#5B9BD5' }}>{barcode}</span>
            </div>
          </div>
        </div>

        {/* Input de cantidad */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block" style={{ color: '#64748B' }}>
            Cantidad a agregar
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            className="w-full px-4 py-3 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 transition-all duration-200"
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #E2E8F0',
              color: '#1E293B',
              '--tw-ring-color': '#7CB9E8',
            } as React.CSSProperties}
          />
        </div>

        {/* Botones rápidos */}
        <div className="mb-6">
          <div className="text-xs font-medium mb-2" style={{ color: '#64748B' }}>
            Cantidades comunes:
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quickButtons.map((num) => (
              <button
                key={num}
                onClick={() => setQuantity(num)}
                className="py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200"
                style={{
                  backgroundColor: quantity === num ? '#7CB9E8' : '#F8FAFC',
                  border: `2px solid ${quantity === num ? '#7CB9E8' : '#E2E8F0'}`,
                  color: quantity === num ? 'white' : '#1E293B',
                }}
                onMouseEnter={(e) => {
                  if (quantity !== num) {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.borderColor = '#B4D4E7';
                  }
                }}
                onMouseLeave={(e) => {
                  if (quantity !== num) {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-4 px-3 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#D97706'
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg font-semibold transition-all duration-200"
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
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-lg font-semibold transition-all duration-200"
            style={{
              backgroundColor: '#7CB9E8',
              color: 'white'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5B9BD5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7CB9E8'}
          >
            ✓ Confirmar
          </button>
        </div>

        {/* Hint */}
        <div className="mt-4 text-center text-xs" style={{ color: '#94A3B8' }}>
          Presiona Enter para confirmar
        </div>
      </div>
    </div>
  );
}

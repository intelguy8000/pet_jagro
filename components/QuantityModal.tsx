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
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
    >
      <div
        className="rounded-xl shadow-2xl max-w-md w-full p-6"
        style={{ backgroundColor: '#252525' }}
      >
        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: '#f5f5f5' }}
          >
            ¿Cuántas unidades?
          </h2>
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a' }}
          >
            <div className="text-sm mb-1" style={{ color: '#a0a0a0' }}>
              Producto
            </div>
            <div className="font-semibold mb-2 break-words" style={{ color: '#f5f5f5' }}>
              {productName}
            </div>
            <div className="text-xs" style={{ color: '#a0a0a0' }}>
              Código: <span className="font-mono" style={{ color: '#C46849' }}>{barcode}</span>
            </div>
          </div>
        </div>

        {/* Input de cantidad */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block" style={{ color: '#a0a0a0' }}>
            Cantidad a agregar
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
            className="w-full px-4 py-3 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2"
            style={{
              backgroundColor: '#2a2a2a',
              border: '2px solid #3a3a3a',
              color: '#f5f5f5',
              '--tw-ring-color': '#C46849',
            } as React.CSSProperties}
          />
        </div>

        {/* Botones rápidos */}
        <div className="mb-6">
          <div className="text-xs font-medium mb-2" style={{ color: '#a0a0a0' }}>
            Cantidades comunes:
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quickButtons.map((num) => (
              <button
                key={num}
                onClick={() => setQuantity(num)}
                className="py-2 px-3 rounded-lg font-semibold text-sm transition-all"
                style={{
                  backgroundColor: quantity === num ? '#C46849' : '#2a2a2a',
                  border: `2px solid ${quantity === num ? '#C46849' : '#3a3a3a'}`,
                  color: quantity === num ? 'white' : '#f5f5f5',
                }}
                onMouseEnter={(e) => {
                  if (quantity !== num) {
                    e.currentTarget.style.backgroundColor = '#3a3a3a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (quantity !== num) {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
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
              backgroundColor: 'rgba(251, 146, 60, 0.1)',
              border: '1px solid rgba(251, 146, 60, 0.3)',
              color: '#fb923c'
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg font-semibold transition-colors"
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
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: '#C46849',
              color: 'white'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a54d32'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C46849'}
          >
            ✓ Confirmar
          </button>
        </div>

        {/* Hint */}
        <div className="mt-4 text-center text-xs" style={{ color: '#666' }}>
          Presiona Enter para confirmar
        </div>
      </div>
    </div>
  );
}

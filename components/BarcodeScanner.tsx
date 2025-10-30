'use client';

import { useState, useEffect } from 'react';

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
  onClose: () => void;
  expectedBarcode: string;
  productName: string;
}

export default function BarcodeScanner({
  onScanSuccess,
  onClose,
  expectedBarcode,
  productName,
}: BarcodeScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode === expectedBarcode) {
      onScanSuccess(manualCode);
    } else {
      setError('Código incorrecto. Inténtalo de nuevo.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Simular escaneo automático con el código correcto para demo
  const handleQuickScan = () => {
    onScanSuccess(expectedBarcode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Escanear Código de Barras</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Producto</div>
          <div className="text-lg font-semibold text-gray-900 mb-2">{productName}</div>
          <div className="text-sm text-gray-600 mb-1">Código esperado</div>
          <div className="font-mono text-lg font-bold text-blue-600">{expectedBarcode}</div>
        </div>

        {/* Área de escaneo simulada */}
        <div className="mb-6 bg-gray-900 rounded-lg p-8 text-center">
          <div className="text-white mb-4">
            <div className="text-6xl mb-2">📷</div>
            <div className="text-sm">Coloca el código de barras frente a la cámara</div>
          </div>

          {/* Rectángulo de enfoque */}
          <div className="mx-auto w-64 h-40 border-4 border-green-400 border-dashed rounded-lg flex items-center justify-center">
            <div className="w-48 h-2 bg-green-400 opacity-50 animate-pulse"></div>
          </div>
        </div>

        {/* Botón de demostración */}
        <button
          onClick={handleQuickScan}
          className="w-full mb-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          ✓ Simular Escaneo Exitoso (Demo)
        </button>

        {/* Ingreso manual */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">¿No funciona la cámara? Ingresa el código manualmente:</p>

          <form onSubmit={handleManualSubmit} className="flex space-x-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Ingresa el código de barras"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Verificar
            </button>
          </form>

          {error && (
            <div className="mt-3 bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded">
              ❌ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

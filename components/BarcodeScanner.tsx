'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Quagga from '@ericblade/quagga2';

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
  onClose: () => void;
  expectedBarcode: string;
  productName: string;
}

// Función para calcular la mediana de los errores
function getMedian(arr: number[]): number {
  const newArr = [...arr];
  newArr.sort((a, b) => a - b);
  const half = Math.floor(newArr.length / 2);
  if (newArr.length % 2 === 1) {
    return newArr[half];
  }
  return (newArr[half - 1] + newArr[half]) / 2;
}

export default function BarcodeScanner({
  onScanSuccess,
  onClose,
  expectedBarcode,
  productName,
}: BarcodeScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);

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

  // Callback para cuando se detecta un código con Quagga2
  const onDetected = useCallback((result: any) => {
    // Calcular mediana de errores para validar la calidad del escaneo
    const errors = result.codeResult.decodedCodes.flatMap((x: any) => x.error || []);
    const medianError = getMedian(errors);

    // Solo aceptar si el escaneo tiene al menos 75% de certeza (error < 0.25)
    if (medianError < 0.25) {
      const code = result.codeResult.code;
      console.log('Código detectado:', code);

      // Detener escaneo
      stopScanning();

      // Verificar si es el código correcto
      if (code === expectedBarcode) {
        onScanSuccess(code);
      } else {
        setError(`❌ Código incorrecto. Esperado: ${expectedBarcode}, Detectado: ${code}`);
        setTimeout(() => setError(''), 3000);
      }
    }
  }, [expectedBarcode, onScanSuccess]);

  // Iniciar escaneo con Quagga2
  const startScanning = async () => {
    if (!scannerRef.current) return;

    setIsScanning(true);
    setError('');

    try {
      await Quagga.init({
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: 640,
            height: 480,
            facingMode: 'environment', // Cámara trasera
          },
          target: scannerRef.current,
        },
        decoder: {
          readers: [
            'ean_reader',      // EAN-13, EAN-8
            'ean_8_reader',
            'code_128_reader', // Code 128
            'code_39_reader',  // Code 39
            'upc_reader',      // UPC-A, UPC-E
            'upc_e_reader',
          ],
        },
        locate: true,
        locator: {
          patchSize: 'medium',
          halfSample: true,
        },
      }, (err) => {
        if (err) {
          console.error('Error al iniciar Quagga:', err);

          let errorMsg = '❌ No se pudo acceder a la cámara.';
          if (err.name === 'NotAllowedError') {
            errorMsg = '❌ Permiso de cámara denegado. Por favor permite el acceso.';
          } else if (err.name === 'NotFoundError') {
            errorMsg = '❌ No se encontró cámara en tu dispositivo.';
          }

          setError(errorMsg);
          setIsScanning(false);
          return;
        }

        // Iniciar escaneo
        Quagga.start();
        console.log('Quagga iniciado correctamente');
      });

      // Escuchar detecciones
      Quagga.onDetected(onDetected);

    } catch (err) {
      console.error('Error en startScanning:', err);
      setError('❌ Error al inicializar el escáner.');
      setIsScanning(false);
    }
  };

  // Detener escaneo
  const stopScanning = () => {
    Quagga.stop();
    Quagga.offDetected(onDetected);
    setIsScanning(false);
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (isScanning) {
        stopScanning();
      }
    };
  }, [isScanning]);

  const handleClose = () => {
    if (isScanning) {
      stopScanning();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full p-4 sm:p-6 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Escanear Código</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl sm:text-3xl font-bold min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="mb-4 sm:mb-6 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 border-2 border-blue-200 dark:border-blue-600 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Producto</div>
          <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 break-words">{productName}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Código esperado</div>
          <div className="font-mono text-sm sm:text-lg font-bold text-blue-600 dark:text-blue-400 break-all">{expectedBarcode}</div>
        </div>

        {/* Área de escaneo */}
        <div className="mb-4 sm:mb-6">
          {isScanning ? (
            // Escáner Quagga2 activo
            <div>
              <div
                ref={scannerRef}
                className="rounded-lg overflow-hidden bg-black"
                style={{ position: 'relative', minHeight: '300px' }}
              />
              <button
                onClick={stopScanning}
                className="w-full mt-3 sm:mt-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm sm:text-base"
              >
                ⏹ Detener Escaneo
              </button>
            </div>
          ) : (
            // Vista inicial
            <div className="bg-gray-900 rounded-lg p-6 sm:p-8 text-center">
              <div className="text-white mb-3 sm:mb-4">
                <div className="text-4xl sm:text-6xl mb-2">📷</div>
                <div className="text-xs sm:text-sm">Coloca el código de barras frente a la cámara</div>
              </div>

              {/* Rectángulo de enfoque */}
              <div className="mx-auto w-48 sm:w-64 h-32 sm:h-40 border-4 border-green-400 border-dashed rounded-lg flex items-center justify-center">
                <div className="w-32 sm:w-48 h-2 bg-green-400 opacity-50 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de escaneo */}
        {!isScanning && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <button
              onClick={handleQuickScan}
              className="py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-semibold text-sm sm:text-base"
            >
              ✓ Demo
            </button>

            <button
              onClick={startScanning}
              className="py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold text-sm sm:text-base"
            >
              📱 Escanear con Cámara
            </button>
          </div>
        )}

        {/* Ingreso manual */}
        {!isScanning && (
          <div className="border-t dark:border-gray-600 pt-3 sm:pt-4">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-3">¿No funciona la cámara? Ingresa el código manualmente:</p>

            <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ingresa el código de barras"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold text-sm sm:text-base whitespace-nowrap"
              >
                Verificar
              </button>
            </form>

            {error && (
              <div className="mt-2 sm:mt-3 bg-red-100 dark:bg-red-900 dark:bg-opacity-30 border border-red-300 dark:border-red-600 text-red-800 dark:text-red-300 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm">
                ❌ {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

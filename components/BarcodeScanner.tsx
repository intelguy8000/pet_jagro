'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

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
  const [isRealScanning, setIsRealScanning] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerIdRef = useRef('barcode-scanner-' + Date.now());

  // Detectar Chrome en iOS
  const isIOSChrome = typeof window !== 'undefined' &&
    /iPhone|iPad|iPod/.test(navigator.userAgent) &&
    /CriOS/.test(navigator.userAgent);

  // Detectar cualquier iOS
  const isIOS = typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);

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

  // Manejo de escaneo nativo para iOS usando input file
  const handleNativeCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError('');

      // Usar html5-qrcode para decodificar la imagen
      const { default: Html5QrcodeScanner } = await import('html5-qrcode');
      const html5QrCode = new Html5QrcodeScanner(scannerIdRef.current, { fps: 10, qrbox: 250 }, false);

      html5QrCode.scanFile(file, true)
        .then((decodedText) => {
          onScanSuccess(decodedText);
        })
        .catch(() => {
          setError('No se pudo leer el código de barras. Intenta con mejor iluminación o enfoque.');
        });
    } catch (err) {
      console.error('Error al procesar imagen:', err);
      setError('Error al procesar la imagen. Intenta de nuevo.');
    }
  };

  // Iniciar escaneo real con cámara
  const startRealScanning = async () => {
    try {
      setIsRealScanning(true);
      setError('');

      // Detectar si es iOS Chrome
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
      const isChrome = /CriOS/.test(navigator.userAgent);

      if (isIOS && isChrome) {
        setError('⚠️ Chrome en iOS tiene limitaciones con la cámara. Recomendamos usar Safari para mejor experiencia.');
        // Continuar de todas formas, por si acaso funciona
      }

      // Crear instancia del scanner si no existe
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerIdRef.current);
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.777778,
      };

      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          // Escaneo exitoso
          stopRealScanning();
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Errores de escaneo (normal, ocurre continuamente mientras escanea)
        }
      );

      setScannerReady(true);
      setError(''); // Limpiar el warning si funcionó
    } catch (err: any) {
      console.error('Error al iniciar escáner:', err);

      // Mensajes de error más específicos
      let errorMsg = 'No se pudo acceder a la cámara.';

      if (err.name === 'NotAllowedError' || err.message?.includes('Permission')) {
        errorMsg = '❌ Permiso de cámara denegado. Por favor permite el acceso a la cámara en la configuración de tu navegador.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = '❌ No se encontró ninguna cámara en tu dispositivo.';
      } else if (err.name === 'NotReadableError') {
        errorMsg = '❌ La cámara está en uso por otra aplicación. Cierra otras apps que usen la cámara.';
      } else if (err.name === 'OverconstrainedError') {
        errorMsg = '❌ No se pudo acceder a la cámara trasera. Intenta usar Safari.';
      } else if (/CriOS/.test(navigator.userAgent)) {
        errorMsg = '❌ Chrome en iOS no soporta el escaneo. Por favor usa Safari para escanear con cámara.';
      }

      setError(errorMsg);
      setIsRealScanning(false);
    }
  };

  // Detener escaneo real
  const stopRealScanning = async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
      setIsRealScanning(false);
      setScannerReady(false);
    } catch (err) {
      console.error('Error al detener escáner:', err);
    }
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopRealScanning();
      }
    };
  }, []);

  const handleClose = () => {
    stopRealScanning();
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

        {/* Información para iOS */}
        {isIOS && (
          <div className="mb-4 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div className="flex-1">
                <div className="font-bold text-blue-800 dark:text-blue-300 mb-1">Modo iOS Optimizado</div>
                <div className="text-sm text-blue-700 dark:text-blue-400">
                  Usaremos la cámara nativa de tu iPhone/iPad. Presiona <strong>"📷 Tomar Foto"</strong> y enfoca el código de barras del producto.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 sm:mb-6 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 border-2 border-blue-200 dark:border-blue-600 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Producto</div>
          <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 break-words">{productName}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">Código esperado</div>
          <div className="font-mono text-sm sm:text-lg font-bold text-blue-600 dark:text-blue-400 break-all">{expectedBarcode}</div>
        </div>

        {/* Área de escaneo */}
        <div className="mb-4 sm:mb-6">
          {isRealScanning ? (
            // Escáner real activo
            <div>
              <div id={scannerIdRef.current} className="rounded-lg overflow-hidden"></div>
              <button
                onClick={stopRealScanning}
                className="w-full mt-3 sm:mt-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm sm:text-base"
              >
                ⏹ Detener Escaneo Real
              </button>
            </div>
          ) : (
            // Vista simulada
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
        {!isRealScanning && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <button
              onClick={handleQuickScan}
              className="py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-semibold text-sm sm:text-base"
            >
              ✓ Demo
            </button>

            {/* Botón nativo para iOS */}
            {isIOS ? (
              <label className="py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold text-sm sm:text-base cursor-pointer flex items-center justify-center">
                📷 Tomar Foto
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleNativeCapture}
                />
              </label>
            ) : (
              <button
                onClick={startRealScanning}
                className="py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold text-sm sm:text-base"
              >
                📱 Escaneo Real
              </button>
            )}
          </div>
        )}

        {/* Ingreso manual */}
        {!isRealScanning && (
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

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

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

  // Iniciar escaneo con Quagga2
  const startScanning = async () => {
    if (!scannerRef.current) {
      console.log('scannerRef no está disponible');
      return;
    }

    console.log('Iniciando escaneo...');
    setIsScanning(true);
    setError('');

    try {
      // Importar Quagga2 dinámicamente
      const Quagga = (await import('@ericblade/quagga2')).default;

      // Callback para detección
      const handleDetected = (result: any) => {
        console.log('Detección recibida:', result);

        // Calcular mediana de errores para validar la calidad del escaneo
        const errors = result.codeResult.decodedCodes.flatMap((x: any) => x.error || []);
        const medianError = getMedian(errors);

        // Solo aceptar si el escaneo tiene al menos 75% de certeza (error < 0.25)
        if (medianError < 0.25) {
          const code = result.codeResult.code;
          console.log('Código detectado con buena calidad:', code);

          // Detener escaneo
          Quagga.stop();
          Quagga.offDetected(handleDetected);
          setIsScanning(false);

          // Verificar si es el código correcto
          if (code === expectedBarcode) {
            onScanSuccess(code);
          } else {
            setError(`❌ Código incorrecto. Esperado: ${expectedBarcode}, Detectado: ${code}`);
            setTimeout(() => setError(''), 3000);
          }
        }
      };

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
        console.log('Quagga init exitoso, iniciando...');
        Quagga.start();
        console.log('Quagga iniciado correctamente');
      });

      // Escuchar detecciones
      Quagga.onDetected(handleDetected);

    } catch (err) {
      console.error('Error en startScanning:', err);
      setError('❌ Error al inicializar el escáner.');
      setIsScanning(false);
    }
  };

  // Detener escaneo
  const stopScanning = async () => {
    try {
      const Quagga = (await import('@ericblade/quagga2')).default;
      Quagga.stop();
      setIsScanning(false);
      console.log('Quagga detenido');
    } catch (err) {
      console.error('Error al detener Quagga:', err);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
      <div className="rounded-xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 max-h-[95vh] overflow-y-auto" style={{ backgroundColor: '#252525' }}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold" style={{ color: '#f5f5f5', letterSpacing: '-0.5px' }}>Escanear Código</h2>
          <button
            onClick={handleClose}
            className="text-2xl sm:text-3xl font-bold min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors"
            style={{ color: '#a0a0a0' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0a0'}
          >
            ×
          </button>
        </div>

        <div className="mb-4 sm:mb-6 rounded-lg p-3 sm:p-4" style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a' }}>
          <div className="text-xs sm:text-sm mb-1" style={{ color: '#a0a0a0' }}>Producto</div>
          <div className="text-base sm:text-lg font-semibold mb-2 break-words" style={{ color: '#f5f5f5' }}>{productName}</div>
          <div className="text-xs sm:text-sm mb-1" style={{ color: '#a0a0a0' }}>Código esperado</div>
          <div className="font-mono text-sm sm:text-lg font-bold break-all" style={{ color: '#C46849' }}>{expectedBarcode}</div>
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
                className="w-full mt-3 sm:mt-4 py-3 text-white rounded-lg transition-colors font-semibold text-sm sm:text-base"
                style={{ backgroundColor: '#ef4444' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                ⏹ Detener Escaneo
              </button>
            </div>
          ) : (
            // Vista inicial
            <div className="rounded-lg p-6 sm:p-8 text-center" style={{ backgroundColor: '#1a1a1a' }}>
              <div className="mb-3 sm:mb-4" style={{ color: '#f5f5f5' }}>
                <div className="text-4xl sm:text-6xl mb-2">📷</div>
                <div className="text-xs sm:text-sm" style={{ color: '#d0d0d0' }}>Coloca el código de barras frente a la cámara</div>
              </div>

              {/* Rectángulo de enfoque */}
              <div className="mx-auto w-48 sm:w-64 h-32 sm:h-40 border-4 border-dashed rounded-lg flex items-center justify-center" style={{ borderColor: '#C46849' }}>
                <div className="w-32 sm:w-48 h-2 opacity-50 animate-pulse" style={{ backgroundColor: '#C46849' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de escaneo */}
        {!isScanning && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <button
              onClick={handleQuickScan}
              className="py-3 text-white rounded-lg transition-colors font-semibold text-sm sm:text-base"
              style={{ backgroundColor: '#10b981' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              ✓ Demo
            </button>

            <button
              onClick={startScanning}
              className="py-3 text-white rounded-lg transition-colors font-semibold text-sm sm:text-base"
              style={{ backgroundColor: '#C46849' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a54d32'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C46849'}
            >
              Escanear con Cámara
            </button>
          </div>
        )}

        {/* Ingreso manual */}
        {!isScanning && (
          <div className="pt-3 sm:pt-4" style={{ borderTop: '1px solid #3a3a3a' }}>
            <p className="text-xs sm:text-sm mb-2 sm:mb-3" style={{ color: '#a0a0a0' }}>¿No funciona la cámara? Ingresa el código manualmente:</p>

            <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ingresa el código de barras"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none text-sm sm:text-base"
                style={{
                  border: '1px solid #3a3a3a',
                  backgroundColor: '#2a2a2a',
                  color: '#f5f5f5'
                }}
              />
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg transition-colors font-semibold text-sm sm:text-base whitespace-nowrap"
                style={{ backgroundColor: '#C46849' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a54d32'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C46849'}
              >
                Verificar
              </button>
            </form>

            {error && (
              <div className="mt-2 sm:mt-3 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm" style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444'
              }}>
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

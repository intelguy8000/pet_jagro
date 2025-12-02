'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import QuantityModal from './QuantityModal';
import ProductSelectionModal from './ProductSelectionModal';
import { Product } from '@/types';

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string, quantity?: number) => void;
  onClose: () => void;
  expectedBarcode: string;
  productName: string;
  allProducts?: Product[]; // Lista completa de productos para búsqueda
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
  allProducts = [],
}: BarcodeScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);

  // Estado para el modal de cantidad
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');

  // Estado para modal de selección de productos (códigos duplicados)
  const [showProductSelection, setShowProductSelection] = useState(false);
  const [duplicateProducts, setDuplicateProducts] = useState<Product[]>([]);

  // Estado para búsqueda de productos
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Función para búsqueda inteligente
  const handleSearchChange = (value: string) => {
    setManualCode(value);

    // Si el campo está vacío, ocultar sugerencias
    if (value.length < 2) {
      setShowSuggestions(false);
      setSearchResults([]);
      return;
    }

    // Detectar si es búsqueda por código (solo números) o por nombre (contiene texto)
    const isNumericSearch = /^\d+$/.test(value);

    if (allProducts.length > 0) {
      let filtered: Product[] = [];

      if (isNumericSearch) {
        // Buscar por código de barras que coincida con el esperado
        filtered = allProducts.filter(p =>
          p.barcode === expectedBarcode && p.barcode.includes(value)
        );
      } else {
        // Buscar por nombre, pero solo productos con el mismo código que el esperado
        filtered = allProducts.filter(p =>
          p.barcode === expectedBarcode &&
          p.name.toLowerCase().includes(value.toLowerCase())
        );
      }

      setSearchResults(filtered.slice(0, 5)); // Máximo 5 resultados
      setShowSuggestions(filtered.length > 0);
    }
  };

  // Seleccionar un producto de las sugerencias
  const handleSelectProduct = (product: Product) => {
    setManualCode(product.barcode);
    setShowSuggestions(false);
    setSearchResults([]);
    // Como ya filtramos por código esperado, siempre es correcto
    // Ir directo a modal de cantidad (saltarse modal de duplicados)
    setScannedBarcode(product.barcode);
    setShowQuantityModal(true);
  };

  // Función para abrir el modal de cantidad después de un escaneo exitoso
  const handleSuccessfulScan = (barcode: string) => {
    setScannedBarcode(barcode);

    // Verificar si hay productos duplicados con este código
    if (allProducts.length > 0) {
      const matchingProducts = allProducts.filter(p => p.barcode === barcode);

      if (matchingProducts.length > 1) {
        // Revisar si hay un default guardado en sessionStorage
        const savedDefault = sessionStorage.getItem(`barcode_default_${barcode}`);

        if (savedDefault) {
          // Usar el producto guardado
          const defaultProduct = matchingProducts.find(p => p.id === savedDefault);
          if (defaultProduct) {
            // Proceder directamente con el modal de cantidad
            setShowQuantityModal(true);
            return;
          }
        }

        // Mostrar modal de selección de productos
        setDuplicateProducts(matchingProducts);
        setShowProductSelection(true);
        return;
      }
    }

    // No hay duplicados, proceder con modal de cantidad
    setShowQuantityModal(true);
  };

  // Función para manejar la selección de un producto cuando hay duplicados
  const handleProductSelection = (product: Product) => {
    setShowProductSelection(false);
    // Proceder con el modal de cantidad
    setShowQuantityModal(true);
  };

  // Función para confirmar la cantidad y cerrar
  const handleQuantityConfirm = (quantity: number) => {
    setShowQuantityModal(false);
    onScanSuccess(scannedBarcode, quantity);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode === expectedBarcode) {
      handleSuccessfulScan(manualCode);
    } else {
      setError('Código incorrecto. Inténtalo de nuevo.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Simular escaneo automático con el código correcto para demo
  const handleQuickScan = () => {
    handleSuccessfulScan(expectedBarcode);
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
            handleSuccessfulScan(code);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="rounded-xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 my-auto" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold" style={{ color: '#1E293B', letterSpacing: '-0.5px' }}>Escanear Código</h2>
          <button
            onClick={handleClose}
            className="text-2xl sm:text-3xl font-bold min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors"
            style={{ color: '#94A3B8' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1E293B'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            ×
          </button>
        </div>

        <div className="mb-4 sm:mb-6 rounded-lg p-3 sm:p-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div className="text-xs sm:text-sm mb-1" style={{ color: '#64748B' }}>Producto</div>
          <div className="text-base sm:text-lg font-semibold mb-2 break-words" style={{ color: '#1E293B' }}>{productName}</div>
          <div className="text-xs sm:text-sm mb-1" style={{ color: '#64748B' }}>Código esperado</div>
          <div className="font-mono text-sm sm:text-lg font-bold break-all" style={{ color: '#7CB9E8' }}>{expectedBarcode}</div>
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
                className="w-full mt-3 sm:mt-4 py-3 text-white rounded-lg transition-all duration-200 font-semibold text-sm sm:text-base"
                style={{ backgroundColor: '#EF4444' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
              >
                ⏹ Detener Escaneo
              </button>
            </div>
          ) : (
            // Vista inicial
            <div className="rounded-lg p-6 sm:p-8 text-center" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div className="mb-3 sm:mb-4" style={{ color: '#1E293B' }}>
                <div className="text-4xl sm:text-6xl mb-2">📷</div>
                <div className="text-xs sm:text-sm" style={{ color: '#64748B' }}>Coloca el código de barras frente a la cámara</div>
              </div>

              {/* Rectángulo de enfoque */}
              <div className="mx-auto w-48 sm:w-64 h-32 sm:h-40 border-4 border-dashed rounded-lg flex items-center justify-center" style={{ borderColor: '#7CB9E8' }}>
                <div className="w-32 sm:w-48 h-2 opacity-50 animate-pulse" style={{ backgroundColor: '#7CB9E8' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de escaneo */}
        {!isScanning && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <button
              onClick={handleQuickScan}
              className="py-3 text-white rounded-lg transition-all duration-200 font-semibold text-sm sm:text-base"
              style={{ backgroundColor: '#22C55E' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#16A34A'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#22C55E'}
            >
              ✓ Demo
            </button>

            <button
              onClick={startScanning}
              className="py-3 text-white rounded-lg transition-all duration-200 font-semibold text-sm sm:text-base"
              style={{ backgroundColor: '#7CB9E8' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5B9BD5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7CB9E8'}
            >
              Escanear con Cámara
            </button>
          </div>
        )}

        {/* Ingreso manual */}
        {!isScanning && (
          <div className="pt-3 sm:pt-4" style={{ borderTop: '1px solid #E2E8F0' }}>
            <p className="text-xs sm:text-sm mb-2 sm:mb-3" style={{ color: '#64748B' }}>
              {allProducts.length > 0
                ? 'Ingresa código o busca por nombre de producto:'
                : '¿No funciona la cámara? Ingresa el código manualmente:'}
            </p>

            <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Retrasar el cierre para permitir click en sugerencias
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  placeholder={allProducts.length > 0 ? "Código o nombre..." : "Ingresa el código de barras"}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none text-sm sm:text-base"
                  style={{
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    color: '#1E293B'
                  }}
                />

                {/* Dropdown de sugerencias */}
                {showSuggestions && searchResults.length > 0 && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden shadow-xl max-h-64 overflow-y-auto"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      zIndex: 100
                    }}
                  >
                    {searchResults.map((product, idx) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        className="w-full px-3 py-3 text-left transition-all duration-200 flex items-start gap-3"
                        style={{
                          backgroundColor: idx % 2 === 0 ? 'transparent' : '#F8FAFC',
                          borderBottom: idx < searchResults.length - 1 ? '1px solid #E2E8F0' : 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(124, 185, 232, 0.15)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'transparent' : '#F8FAFC'}
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1" style={{ color: '#1E293B' }}>
                            {product.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
                            <span className="font-mono" style={{ color: '#7CB9E8' }}>
                              {product.barcode}
                            </span>
                            <span>•</span>
                            <span>Stock: {product.stock}</span>
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded whitespace-nowrap" style={{ backgroundColor: '#F1F5F9', color: '#7CB9E8' }}>
                          Seleccionar
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg transition-all duration-200 font-semibold text-sm sm:text-base whitespace-nowrap"
                style={{ backgroundColor: '#7CB9E8' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5B9BD5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7CB9E8'}
              >
                Verificar
              </button>
            </form>

            {error && (
              <div className="mt-2 sm:mt-3 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm" style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#EF4444'
              }}>
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de selección de producto (códigos duplicados) */}
      {showProductSelection && (
        <ProductSelectionModal
          barcode={scannedBarcode}
          products={duplicateProducts}
          onSelect={handleProductSelection}
          onCancel={() => setShowProductSelection(false)}
        />
      )}

      {/* Modal de cantidad */}
      {showQuantityModal && (
        <QuantityModal
          productName={productName}
          barcode={scannedBarcode}
          onConfirm={handleQuantityConfirm}
          onCancel={() => setShowQuantityModal(false)}
        />
      )}
    </div>
  );
}

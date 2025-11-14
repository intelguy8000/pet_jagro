import { mockProducts, mockOrders, mockDeliveries, mockMessengers } from './mockData';
import { Product, Order, Delivery, Messenger } from '@/types';

// Funciones que el AI puede ejecutar

export interface AIFunctionResult {
  success: boolean;
  data?: any;
  message: string;
}

/**
 * Buscar productos por nombre, categoría o código
 */
export function searchProducts(query: string): AIFunctionResult {
  const lowerQuery = query.toLowerCase();

  const results = mockProducts.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.barcode.includes(query)
  );

  if (results.length === 0) {
    return {
      success: false,
      message: `No se encontraron productos con: "${query}"`
    };
  }

  return {
    success: true,
    data: results.map(p => ({
      nombre: p.name,
      stock: p.stock,
      stockMinimo: p.minStock,
      precio: p.price,
      categoria: p.category,
      lote: p.batchNumber,
      estado: p.stock === 0 ? 'AGOTADO' : p.stock <= p.minStock ? 'BAJO' : 'OK'
    })),
    message: `${results.length} producto(s) encontrado(s)`
  };
}

/**
 * Obtener stock de un producto específico
 */
export function getProductStock(productName: string): AIFunctionResult {
  const product = mockProducts.find(p =>
    p.name.toLowerCase().includes(productName.toLowerCase())
  );

  if (!product) {
    return {
      success: false,
      message: `Producto "${productName}" no encontrado`
    };
  }

  return {
    success: true,
    data: {
      nombre: product.name,
      stock: product.stock,
      stockMinimo: product.minStock,
      precio: product.price,
      lote: product.batchNumber
    },
    message: `${product.name}: ${product.stock} unidades`
  };
}

/**
 * Buscar pedidos por cliente o estado
 */
export function searchOrders(query: string): AIFunctionResult {
  const lowerQuery = query.toLowerCase();

  // Mapear términos comunes a estados del sistema
  const statusMap: Record<string, string> = {
    'en curso': 'in_progress',
    'en progreso': 'in_progress',
    'pendiente': 'pending',
    'completado': 'completed',
    'listo para facturar': 'ready_for_billing',
    'facturado': 'billed',
    'cancelado': 'cancelled'
  };

  // Buscar si el query corresponde a un estado conocido
  const mappedStatus = statusMap[lowerQuery];

  const results = mockOrders.filter(o =>
    o.customer.name.toLowerCase().includes(lowerQuery) ||
    o.status.toLowerCase().includes(lowerQuery) ||
    o.orderNumber.toLowerCase().includes(lowerQuery) ||
    (mappedStatus && o.status === mappedStatus)
  );

  if (results.length === 0) {
    return {
      success: false,
      message: `No se encontraron pedidos con: "${query}"`
    };
  }

  return {
    success: true,
    data: results.map(o => ({
      numero: o.orderNumber,
      cliente: o.customer.name,
      estado: o.status,
      cantidadItems: o.items.length,
      total: o.totalValue,
      zona: o.customer.zone
    })),
    message: `${results.length} pedido(s) encontrado(s)`
  };
}

/**
 * Obtener detalles completos de un pedido específico
 */
export function getOrderDetails(orderNumber: string): AIFunctionResult {
  const order = mockOrders.find(o =>
    o.orderNumber.toLowerCase() === orderNumber.toLowerCase()
  );

  if (!order) {
    return {
      success: false,
      message: `Pedido "${orderNumber}" no encontrado`
    };
  }

  return {
    success: true,
    data: {
      numero: order.orderNumber,
      cliente: {
        nombre: order.customer.name,
        telefono: order.customer.phone,
        direccion: order.customer.address,
        zona: order.customer.zone
      },
      estado: order.status,
      prioridad: order.priority,
      items: order.items.map(item => ({
        producto: item.product.name,
        cantidad: item.quantity,
        precioUnitario: item.product.price,
        subtotal: item.product.price * item.quantity,
        categoria: item.product.category,
        stockDisponible: item.product.stock,
        lote: item.product.batchNumber,
        codigoBarras: item.product.barcode
      })),
      valorTotal: order.totalValue,
      fechaCreacion: order.createdAt,
      asignadoA: order.assignedTo || 'No asignado'
    },
    message: `Detalles del pedido ${order.orderNumber}`
  };
}

/**
 * Obtener información de mensajeros
 */
export function getMessengerInfo(name?: string): AIFunctionResult {
  if (name) {
    const messenger = mockMessengers.find(m =>
      m.name.toLowerCase().includes(name.toLowerCase())
    );

    if (!messenger) {
      return {
        success: false,
        message: `Mensajero "${name}" no encontrado`
      };
    }

    const deliveries = mockDeliveries.filter(d => d.messenger.id === messenger.id);
    const delivered = deliveries.filter(d => d.status === 'delivered').length;
    const total = deliveries.reduce((sum, d) => sum + (d.collectedAmount || 0), 0);

    return {
      success: true,
      data: {
        nombre: messenger.name,
        zona: messenger.assignedZone,
        activo: messenger.active,
        entregas: deliveries.length,
        entregados: delivered,
        recaudoTotal: total
      },
      message: `${messenger.name}: ${delivered} entregas completadas`
    };
  }

  // Listar todos los mensajeros
  return {
    success: true,
    data: mockMessengers.map(m => ({
      nombre: m.name,
      zona: m.assignedZone,
      activo: m.active
    })),
    message: `${mockMessengers.length} mensajero(s) activos`
  };
}

/**
 * Obtener resumen de liquidaciones
 */
export function getLiquidationSummary(): AIFunctionResult {
  const delivered = mockDeliveries.filter(d => d.status === 'delivered');
  const totalCollected = mockDeliveries.reduce((sum, d) => sum + (d.collectedAmount || 0), 0);
  const pending = mockDeliveries.filter(d => d.status === 'pending_payment').length;
  const withCreditNote = mockDeliveries.filter(d => d.creditNote).length;

  return {
    success: true,
    data: {
      totalEntregas: mockDeliveries.length,
      entregados: delivered.length,
      recaudoTotal: totalCollected,
      pendientesPago: pending,
      notasCredito: withCreditNote
    },
    message: `$${totalCollected.toLocaleString()} recaudados`
  };
}

/**
 * Crear un nuevo pedido (función experimental)
 */
export function createOrder(
  customerName: string,
  products: Array<{ name: string; quantity: number }>
): AIFunctionResult {
  // Validar productos
  const orderItems = [];
  let totalValue = 0;

  for (const item of products) {
    const product = mockProducts.find(p =>
      p.name.toLowerCase().includes(item.name.toLowerCase())
    );

    if (!product) {
      return {
        success: false,
        message: `Producto "${item.name}" no encontrado`
      };
    }

    if (product.stock < item.quantity) {
      return {
        success: false,
        message: `Stock insuficiente: ${product.name} (disponible: ${product.stock})`
      };
    }

    orderItems.push({
      producto: product.name,
      cantidad: item.quantity,
      precio: product.price
    });

    totalValue += product.price * item.quantity;
  }

  // En producción, aquí se crearía el pedido en la base de datos
  const newOrderNumber = `PED-2025-${String(mockOrders.length + 1).padStart(3, '0')}`;

  return {
    success: true,
    data: {
      numero: newOrderNumber,
      cliente: customerName,
      items: orderItems,
      total: totalValue
    },
    message: `Pedido ${newOrderNumber} creado: $${totalValue.toLocaleString()}`
  };
}

/**
 * Obtener productos con stock bajo
 */
export function getLowStockProducts(): AIFunctionResult {
  const lowStock = mockProducts.filter(p => p.stock > 0 && p.stock <= p.minStock);
  const outOfStock = mockProducts.filter(p => p.stock === 0);

  return {
    success: true,
    data: {
      stockBajo: lowStock.map(p => ({
        nombre: p.name,
        stock: p.stock,
        minimo: p.minStock
      })),
      agotados: outOfStock.map(p => p.name)
    },
    message: `${lowStock.length} con stock bajo, ${outOfStock.length} agotados`
  };
}

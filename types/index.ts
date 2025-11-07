// Types for J Agro Picking System

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'picker' | 'supervisor';
  avatar?: string;
  online: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'food' | 'toys' | 'accessories' | 'healthcare' | 'grooming' | 'other';
  stock: number;
  minStock: number;
  price: number;
  supplier?: string;
  barcode: string; // Código de barras para escaneo
  imageUrl?: string; // URL de la imagen del producto
  lastUpdated: Date;
}

// Traducción de categorías
export const categoryNames: Record<Product['category'], string> = {
  food: 'Alimento',
  toys: 'Juguetes',
  accessories: 'Accesorios',
  healthcare: 'Salud',
  grooming: 'Aseo',
  other: 'Otros'
};

// Estados del pedido
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'ready_for_billing' | 'billed' | 'cancelled';

export const orderStatusNames: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En Curso',
  completed: 'Completado',
  ready_for_billing: 'Listo para Facturar',
  billed: 'Facturado',
  cancelled: 'Cancelado'
};

// Item dentro de un pedido
export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  scanned: boolean; // Si ya fue escaneado
  scannedQuantity: number; // Cantidad escaneada
  scannedAt?: Date;
}

// Pedido completo
export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone?: string;
    address?: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  assignedTo?: string; // ID del picker asignado
  assignedAt?: Date;
  completedAt?: Date;
  totalValue: number;
  priority: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'alert' | 'query';
  productQuery?: ProductQuery;
}

export interface ProductQuery {
  action: 'search' | 'check_stock' | 'low_stock_alert';
  productName?: string;
  category?: string;
  results?: Product[];
}

export interface StockAlert {
  id: string;
  product: Product;
  message: string;
  severity: 'low' | 'critical' | 'out';
  timestamp: Date;
  acknowledged: boolean;
}

// Sugerencia de compra
export interface PurchaseSuggestion {
  id: string;
  product: Product;
  suggestedQuantity: number;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  estimatedCost: number;
}

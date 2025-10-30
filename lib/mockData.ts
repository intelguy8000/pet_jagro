import { Product, User, Order, OrderItem, PurchaseSuggestion } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Productos de ejemplo para inventario de mascotas con códigos de barras
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Alimento Premium para Perros 15kg',
    category: 'food',
    stock: 45,
    minStock: 20,
    price: 189000,
    supplier: 'Nutripet Colombia',
    barcode: '7891234567801',
    lastUpdated: new Date(),
  },
  {
    id: '2',
    name: 'Caja de Arena para Gatos',
    category: 'accessories',
    stock: 12,
    minStock: 15,
    price: 85000,
    supplier: 'Felinos Esenciales',
    barcode: '7891234567802',
    lastUpdated: new Date(),
  },
  {
    id: '3',
    name: 'Set de Juguetes para Perros',
    category: 'toys',
    stock: 78,
    minStock: 30,
    price: 45000,
    supplier: 'Mascotas Felices SAS',
    barcode: '7891234567803',
    lastUpdated: new Date(),
  },
  {
    id: '4',
    name: 'Tratamiento Antipulgas y Garrapatas',
    category: 'healthcare',
    stock: 5,
    minStock: 10,
    price: 95000,
    supplier: 'Veterinaria Central',
    barcode: '7891234567804',
    lastUpdated: new Date(),
  },
  {
    id: '5',
    name: 'Alimento para Gatos Sabor Salmón 5kg',
    category: 'food',
    stock: 32,
    minStock: 25,
    price: 125000,
    supplier: 'Gourmet Felino',
    barcode: '7891234567805',
    lastUpdated: new Date(),
  },
  {
    id: '6',
    name: 'Cepillo para Mascotas',
    category: 'grooming',
    stock: 0,
    minStock: 20,
    price: 35000,
    supplier: 'Peluquería Canina',
    barcode: '7891234567806',
    lastUpdated: new Date(),
  },
  {
    id: '7',
    name: 'Correa Retráctil para Perros',
    category: 'accessories',
    stock: 56,
    minStock: 25,
    price: 68000,
    supplier: 'Paseos Seguros',
    barcode: '7891234567807',
    lastUpdated: new Date(),
  },
  {
    id: '8',
    name: 'Semillas para Aves 2kg',
    category: 'food',
    stock: 8,
    minStock: 15,
    price: 28000,
    supplier: 'Aviario Colombia',
    barcode: '7891234567808',
    lastUpdated: new Date(),
  },
  {
    id: '9',
    name: 'Acondicionador de Agua para Acuarios',
    category: 'healthcare',
    stock: 23,
    minStock: 10,
    price: 22000,
    supplier: 'Acuarios del Valle',
    barcode: '7891234567809',
    lastUpdated: new Date(),
  },
  {
    id: '10',
    name: 'Virutas para Jaula de Conejos',
    category: 'accessories',
    stock: 14,
    minStock: 20,
    price: 38000,
    supplier: 'Pequeñas Mascotas',
    barcode: '7891234567810',
    lastUpdated: new Date(),
  },
];

// Usuarios de ejemplo
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    role: 'admin',
    online: true,
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    role: 'picker',
    online: true,
  },
  {
    id: '3',
    name: 'María González',
    role: 'picker',
    online: true,
  },
];

// Crear items de pedido
const createOrderItem = (product: Product, quantity: number): OrderItem => ({
  id: uuidv4(),
  product,
  quantity,
  scanned: false,
  scannedQuantity: 0,
});

// Pedidos de ejemplo
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'PED-2025-001',
    customer: {
      name: 'Veterinaria San Francisco',
      phone: '+57 301 234 5678',
      address: 'Calle 50 #23-45, Bogotá',
    },
    items: [
      createOrderItem(mockProducts[0], 3), // Alimento perros
      createOrderItem(mockProducts[4], 2), // Alimento gatos
      createOrderItem(mockProducts[3], 1), // Antipulgas
    ],
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
    totalValue: 830000,
    priority: 'high',
  },
  {
    id: '2',
    orderNumber: 'PED-2025-002',
    customer: {
      name: 'Tienda Mascotas Felices',
      phone: '+57 310 987 6543',
      address: 'Carrera 15 #80-20, Medellín',
    },
    items: [
      createOrderItem(mockProducts[2], 5), // Juguetes
      createOrderItem(mockProducts[6], 3), // Correas
      createOrderItem(mockProducts[1], 2), // Arena gatos
    ],
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // Hace 1 hora
    totalValue: 599000,
    priority: 'medium',
  },
  {
    id: '3',
    orderNumber: 'PED-2025-003',
    customer: {
      name: 'Pet Shop El Oasis',
      phone: '+57 315 456 7890',
      address: 'Avenida 68 #45-12, Cali',
    },
    items: [
      createOrderItem(mockProducts[7], 4), // Semillas aves
      createOrderItem(mockProducts[8], 2), // Acondicionador agua
      createOrderItem(mockProducts[9], 3), // Virutas conejos
    ],
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // Hace 30 min
    totalValue: 270000,
    priority: 'low',
  },
  {
    id: '4',
    orderNumber: 'PED-2025-004',
    customer: {
      name: 'Clínica Veterinaria AnimaVet',
      phone: '+57 320 123 4567',
      address: 'Calle 72 #10-34, Barranquilla',
    },
    items: [
      createOrderItem(mockProducts[0], 5), // Alimento perros
      createOrderItem(mockProducts[3], 3), // Antipulgas
    ],
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // Hace 3 horas
    assignedTo: '2', // Carlos
    assignedAt: new Date(Date.now() - 20 * 60 * 1000), // Hace 20 min
    totalValue: 1230000,
    priority: 'high',
  },
];

// Sugerencias de compra
export const mockPurchaseSuggestions: PurchaseSuggestion[] = [
  {
    id: '1',
    product: mockProducts[5], // Cepillo (agotado)
    suggestedQuantity: 30,
    reason: 'Producto agotado - Reposición urgente',
    urgency: 'high',
    estimatedCost: 1050000,
  },
  {
    id: '2',
    product: mockProducts[3], // Antipulgas (stock bajo)
    suggestedQuantity: 20,
    reason: 'Stock crítico - Por debajo del mínimo',
    urgency: 'high',
    estimatedCost: 1900000,
  },
  {
    id: '3',
    product: mockProducts[7], // Semillas aves (stock bajo)
    suggestedQuantity: 25,
    reason: 'Stock bajo - Reabastecer pronto',
    urgency: 'medium',
    estimatedCost: 700000,
  },
  {
    id: '4',
    product: mockProducts[1], // Arena gatos (stock bajo)
    suggestedQuantity: 15,
    reason: 'Acercándose al mínimo',
    urgency: 'medium',
    estimatedCost: 1275000,
  },
];

import { Product, User, Order, OrderItem, PurchaseSuggestion, DeliveryZone, Messenger, Delivery } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Generador de números de lote simulados (hasta tener API de HGI)
const generateBatchNumber = (productId: string): string => {
  const year = new Date().getFullYear();
  const batch = String(parseInt(productId) + 1000).padStart(4, '0');
  return `LT-${year}-${batch}`;
};

// Detector de zona por dirección (detecta palabras clave)
const detectZone = (address?: string): DeliveryZone => {
  if (!address) return 'extramuros';

  const addr = address.toLowerCase();

  // Norte: Bello, Copacabana, Aranjuez, Manrique, Popular
  if (addr.includes('bello') || addr.includes('copacabana') ||
      addr.includes('aranjuez') || addr.includes('manrique') ||
      addr.includes('popular') || addr.includes('castilla')) {
    return 'norte';
  }

  // Sur: Envigado, Sabaneta, Itagüí
  if (addr.includes('envigado') || addr.includes('sabaneta') ||
      addr.includes('itagüí') || addr.includes('itagui')) {
    return 'sur';
  }

  // Centro: Laureles, Estadio, La América, Candelaria, Belén (centro)
  if (addr.includes('laureles') || addr.includes('estadio') ||
      addr.includes('américa') || addr.includes('america') ||
      addr.includes('candelaria')) {
    return 'centro';
  }

  // Oriente: El Poblado, Las Palmas, zona aeropuerto
  if (addr.includes('poblado') || addr.includes('palmas') ||
      addr.includes('aeropuerto') || addr.includes('llano')) {
    return 'oriente';
  }

  // Occidente: Robledo, San Javier, Belén
  if (addr.includes('robledo') || addr.includes('san javier') ||
      addr.includes('belén') || addr.includes('belen')) {
    return 'occidente';
  }

  // Por defecto: detectar por número de calle (heurística simple)
  // Calles 70+ suelen ser norte, 10-50 centro, etc.
  const calleMatch = addr.match(/calle\s+(\d+)/);
  if (calleMatch) {
    const calle = parseInt(calleMatch[1]);
    if (calle >= 70) return 'norte';
    if (calle >= 50) return 'centro';
    if (calle < 50) return 'sur';
  }

  const carreraMatch = addr.match(/carrera\s+(\d+)/);
  if (carreraMatch) {
    const carrera = parseInt(carreraMatch[1]);
    if (carrera >= 70) return 'occidente';
    if (carrera >= 40) return 'centro';
    if (carrera < 40) return 'oriente';
  }

  return 'extramuros';
};

// Productos REALES de J Agro con códigos de barras e imágenes reales
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'NUTRI-PEL Omega 3-6-9 con Biotina 120mL',
    category: 'healthcare',
    stock: 15,
    minStock: 10,
    price: 45000,
    supplier: 'Pharmavet - Green Pet',
    barcode: '7707275730177',
    batchNumber: 'LT-2025-1001',
    imageUrl: '/products/bc13ef43-e254-4bd7-bb2b-5d87f742dbe1.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '2',
    name: 'PELUNOS Desenredante para Peinar en Spray',
    category: 'grooming',
    stock: 22,
    minStock: 15,
    price: 28000,
    supplier: 'PELUNOS Groomer',
    barcode: '7709340268318',
    batchNumber: 'LT-2025-1002',
    imageUrl: '/products/190f463e-91eb-4a19-9505-2ecd8aab8157.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '3',
    name: 'Credelio Tabletas Antipulgas 22-45kg',
    category: 'healthcare',
    stock: 8,
    minStock: 12,
    price: 95000,
    supplier: 'Elanco',
    barcode: '7703712096899',
    batchNumber: 'LT-2025-1003',
    imageUrl: '/products/79056360-404d-4711-8aaf-7bd60c853805.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '4',
    name: 'neoIBP Antiulceroso Solución Oral 60mL',
    category: 'healthcare',
    stock: 12,
    minStock: 8,
    price: 38000,
    supplier: 'Neopet',
    barcode: '8713184714764',
    batchNumber: 'LT-2025-1004',
    imageUrl: '/products/047c3564-5b89-4a7b-8004-a0b735e122d1.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '5',
    name: 'Triseptil Suspensión Oral 60mL',
    category: 'healthcare',
    stock: 18,
    minStock: 15,
    price: 32000,
    supplier: 'INVET',
    barcode: '7707214570796',
    batchNumber: 'LT-2025-1005',
    imageUrl: '/products/70b44a56-4de7-4e9b-a4b1-c4118b63283f.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '6',
    name: 'Clorhex Shampoo con Clorhexidina',
    category: 'grooming',
    stock: 14,
    minStock: 10,
    price: 42000,
    supplier: 'Virbac Dermatology',
    barcode: '7702207718469',
    batchNumber: 'LT-2025-1006',
    imageUrl: '/products/83c94ebd-1957-45af-8c38-d2b379e37b00.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '7',
    name: 'PETMED Baño Seco 3 en 1',
    category: 'grooming',
    stock: 25,
    minStock: 12,
    price: 35000,
    supplier: 'Pet Med',
    barcode: '7707321675117',
    batchNumber: 'LT-2025-1007',
    imageUrl: '/products/4a875439-6152-46b5-b204-bad2ec5f024a.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '8',
    name: 'Dermo 60 Tabletas Pet Naturals',
    category: 'healthcare',
    stock: 20,
    minStock: 15,
    price: 85000,
    supplier: 'Pet Naturals - SumiMascotas',
    barcode: '7709101736780',
    batchNumber: 'LT-2025-1008',
    imageUrl: '/products/6b56201a-f12d-4609-bf77-cce1b17d6831.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '9',
    name: 'Hexocleen Spray Clorhexidina 120mL',
    category: 'healthcare',
    stock: 16,
    minStock: 10,
    price: 38000,
    supplier: 'INVET',
    barcode: '7707214572844',
    batchNumber: 'LT-2025-1009',
    imageUrl: '/products/1fadcc2b-c15e-41aa-bde7-85a254499349.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '10',
    name: 'Cat Balance 100 Tabletas Saborizadas',
    category: 'healthcare',
    stock: 12,
    minStock: 8,
    price: 65000,
    supplier: 'Pet Prime',
    barcode: '7709990174022',
    batchNumber: 'LT-2025-1010',
    imageUrl: '/products/3bd1a42f-d7b8-4d72-90e6-4b858350e5a6.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '11',
    name: 'ATREVIA ONE LARGE Fluralaner 400mg',
    category: 'healthcare',
    stock: 5,
    minStock: 8,
    price: 125000,
    supplier: 'MSD Animal Health',
    barcode: '7891234567801',
    batchNumber: 'LT-2025-1011',
    imageUrl: '/products/37af9dc5-d9b5-40ea-9da2-57ab76b573c2.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '12',
    name: 'Orejitas Clean Limpiador Ótico 60mL',
    category: 'healthcare',
    stock: 18,
    minStock: 12,
    price: 32000,
    supplier: 'VECOL Pet',
    barcode: '7707198379965',
    batchNumber: 'LT-2025-1012',
    imageUrl: '/products/4d0ca8af-ae35-41e5-a42b-1e84ac9fbec2.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '13',
    name: 'Artri-Tabs 45 Tabletas Saborizadas',
    category: 'healthcare',
    stock: 22,
    minStock: 15,
    price: 58000,
    supplier: 'Pet Prime',
    barcode: '7891234567804',
    batchNumber: 'LT-2025-1013',
    imageUrl: '/products/5bd6c275-6d58-4aac-9141-1acac124a1e6.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '14',
    name: 'PELUNOS Shampoo Voluminizador 260mL',
    category: 'grooming',
    stock: 16,
    minStock: 12,
    price: 28000,
    supplier: 'PELUNOS Groomer',
    barcode: '7709149822025',
    batchNumber: 'LT-2025-1014',
    imageUrl: '/products/5104542e-d01c-43ea-bb0e-3ce21a5be99a.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '15',
    name: 'BONNAT Grain Free Fresh Chicken',
    category: 'food',
    stock: 8,
    minStock: 10,
    price: 185000,
    supplier: 'United Petfood Spain',
    barcode: '7708694229549',
    batchNumber: 'LT-2025-1015',
    imageUrl: '/products/427362b8-aee2-40b2-a122-90f852126bd4.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '16',
    name: 'Restoderm Coaspharma 100mL',
    category: 'healthcare',
    stock: 10,
    minStock: 8,
    price: 45000,
    supplier: 'Coaspharma',
    barcode: '7891234567806',
    batchNumber: 'LT-2025-1016',
    imageUrl: '/products/7e57b60f-c8f7-4d58-bbb2-bec9333c2f64.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '17',
    name: 'neoLytic Mucolítico Expectorante 30mL',
    category: 'healthcare',
    stock: 14,
    minStock: 10,
    price: 35000,
    supplier: 'Neopet - SFC Laboratorios',
    barcode: 'SFR070100',
    batchNumber: 'LT-2025-1017',
    imageUrl: '/products/48ce06a2-265b-4989-af93-1c816f0d92b1.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '18',
    name: 'BRAVECTO 1000mg Fluralaner 20-40kg',
    category: 'healthcare',
    stock: 4,
    minStock: 8,
    price: 145000,
    supplier: 'MSD Animal Health',
    barcode: '8713184147646',
    batchNumber: 'LT-2025-1018',
    imageUrl: '/products/7e06d164-a4e6-42a7-a37f-7a8f979ab5d0.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '19',
    name: 'Q SEBOLYTIC Shampoo Virbac 250mL',
    category: 'grooming',
    stock: 12,
    minStock: 10,
    price: 68000,
    supplier: 'Virbac',
    barcode: '7502010429732',
    batchNumber: 'LT-2025-1019',
    imageUrl: '/products/9e7d4f1b-7a03-4348-81c0-4300599bde88.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '20',
    name: 'Dermo Balance 60 Tabletas',
    category: 'healthcare',
    stock: 18,
    minStock: 12,
    price: 72000,
    supplier: 'Pet Prime - SumiMascotas',
    barcode: '7709990174027',
    batchNumber: 'LT-2025-1020',
    imageUrl: '/products/9ddcf360-98ef-4eb9-89ad-4c71a13f064e.JPG',
    lastUpdated: new Date(),
  },
  {
    id: '21',
    name: 'Alimento Premium para Perros 15kg',
    category: 'food',
    stock: 45,
    minStock: 20,
    price: 189000,
    supplier: 'Nutripet Colombia',
    barcode: '7891234567802',
    batchNumber: 'LT-2025-1021',
    lastUpdated: new Date(),
  },
  {
    id: '22',
    name: 'Alimento para Gatos Sabor Salmón 5kg',
    category: 'food',
    stock: 32,
    minStock: 25,
    price: 125000,
    supplier: 'Gourmet Felino',
    barcode: '7891234567805',
    batchNumber: 'LT-2025-1022',
    lastUpdated: new Date(),
  },
  // PRODUCTOS CON CÓDIGO DUPLICADO (para probar Caso 4)
  {
    id: '23',
    name: 'Shampoo para Perros Hipoalergénico 250mL',
    category: 'grooming',
    stock: 18,
    minStock: 10,
    price: 35000,
    supplier: 'Pet Clean Colombia',
    barcode: '9999999999999', // CÓDIGO DUPLICADO
    batchNumber: 'LT-2025-1023',
    lastUpdated: new Date(),
  },
  {
    id: '24',
    name: 'Shampoo para Perros Hipoalergénico 500mL',
    category: 'grooming',
    stock: 12,
    minStock: 8,
    price: 55000,
    supplier: 'Pet Clean Colombia',
    barcode: '9999999999999', // MISMO CÓDIGO - Caso 4
    batchNumber: 'LT-2025-1024',
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
      zone: detectZone('Calle 50 #23-45, Bogotá'),
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
      zone: detectZone('Carrera 15 #80-20, Medellín'),
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
      zone: detectZone('Avenida 68 #45-12, Cali'),
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
      zone: detectZone('Calle 72 #10-34, Barranquilla'),
    },
    items: [
      createOrderItem(mockProducts[0], 5), // Alimento perros
      createOrderItem(mockProducts[3], 3), // Antipulgas
      createOrderItem(mockProducts[22], 2), // Shampoo 250mL - CÓDIGO DUPLICADO
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

// ========== MÓDULO DE LIQUIDACIONES ==========

// Mensajeros
export const mockMessengers: Messenger[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    phone: '+57 300 123 4567',
    assignedZone: 'norte',
    active: true,
  },
  {
    id: '2',
    name: 'María Rodríguez',
    phone: '+57 301 234 5678',
    assignedZone: 'sur',
    active: true,
  },
  {
    id: '3',
    name: 'Carlos Gómez',
    phone: '+57 302 345 6789',
    assignedZone: 'centro',
    active: true,
  },
  {
    id: '4',
    name: 'Ana Martínez',
    phone: '+57 303 456 7890',
    assignedZone: 'oriente',
    active: true,
  },
  {
    id: '5',
    name: 'Pedro López',
    phone: '+57 304 567 8901',
    assignedZone: 'occidente',
    active: true,
  },
];

// Entregas (deliveries) - Simulando entregas de pedidos completados
export const mockDeliveries: Delivery[] = [
  // Pedido 1 - Entregado con pago en efectivo
  {
    id: '1',
    order: mockOrders[0],
    messenger: mockMessengers[2], // Carlos - Centro
    status: 'delivered',
    paymentMethod: 'cash',
    dispatchedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // Hace 5 horas
    deliveredAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // Hace 3 horas
    collectedAmount: 830000,
  },
  // Pedido 2 - En ruta
  {
    id: '2',
    order: mockOrders[1],
    messenger: mockMessengers[3], // Ana - Oriente
    status: 'in_route',
    dispatchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
  },
  // Pedido 3 - Devuelto con nota de crédito
  {
    id: '3',
    order: mockOrders[2],
    messenger: mockMessengers[4], // Pedro - Extramuros
    status: 'returned',
    paymentMethod: 'cash',
    dispatchedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    creditNote: {
      id: 'NC-001',
      reason: 'Cliente no estaba en la dirección',
      amount: 270000,
      authorizedBy: 'Administrador',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      description: 'Dirección incorrecta, cliente solicitó reagendar'
    },
  },
  // Pedido 4 - Entregado pero pendiente de pago
  {
    id: '4',
    order: mockOrders[3],
    messenger: mockMessengers[0], // Juan - Norte
    status: 'pending_payment',
    paymentMethod: 'credit',
    dispatchedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    notes: 'Cliente solicitó crédito a 30 días'
  },
];

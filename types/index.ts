// Types for the Pet Supply Inventory Chat System

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
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
  lastUpdated: Date;
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

export interface ChatRoom {
  id: string;
  name: string;
  users: User[];
  messages: ChatMessage[];
  lastActivity: Date;
}

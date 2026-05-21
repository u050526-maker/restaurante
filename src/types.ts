export type StaffRole = 'Chef' | 'Mesero' | 'Administrador' | 'Cajero';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  status: 'Activo' | 'Inactivo' | 'Vacaciones';
  hourlyRate: number;
  username?: string;
  password?: string;
}

export interface Shift {
  id: string;
  staffId: string;
  dayOfWeek: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Ingredientes' | 'Bebidas' | 'Carnes' | 'Verduras' | 'Abarrotes' | 'Desechables';
  quantity: number;
  minLimit: number; // Alerts if quantity <= minLimit
  unit: string; // kg, litros, piezas, etc.
  costPrice: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Comidas' | 'Bebidas' | 'Postres' | 'Entradas';
  price: number;
  description: string;
  available: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  points: number;
  notes?: string;
  createdAt: string;
}

export type TableStatus = 'Libre' | 'Ocupada' | 'Buscando Cuenta';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
}

export type OrderStatus = 'Pendiente' | 'En Cocina' | 'Listo' | 'Entregado' | 'Pagado' | 'Cancelado';

export interface OrderDetail {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  meseroId?: string; // assigned waiter
  chefId?: string;  // assigned chef
  customerId?: string; // optional loyalty customer
  items: OrderDetail[];
  status: OrderStatus;
  subtotal: number;
  tax: number; // e.g. 10% or 13% etc
  discount: number;
  total: number;
  createdAt: string;
  paidAt?: string;
  paymentMethod?: 'Efectivo' | 'Tarjeta' | 'Transferencia';
}

export interface Sale {
  id: string;
  orderId: string;
  tableNumber: number;
  total: number;
  paymentMethod: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  date: string;
}

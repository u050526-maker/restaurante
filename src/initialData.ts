import { MenuItem, InventoryItem, StaffMember, Shift, Customer, Table, Order, Sale } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Lomo Fino con Papas', category: 'Comidas', price: 18.50, description: 'Carcaterisco lomo de res tierno, acompañado de papas rústicas y ensalada.', available: true },
  { id: 'm2', name: 'Pizza Margherita XL', category: 'Comidas', price: 14.00, description: 'Salsa de tomate natural, mozzarella fresco, albahaca y aceite de oliva.', available: true },
  { id: 'm3', name: 'Hamburguesa Sabor Real', category: 'Comidas', price: 12.50, description: 'Carne de res artesanal, queso cheddar, tocino ahumado, cebolla caramelizada.', available: true },
  { id: 'm4', name: 'Pasta Carbonara Classic', category: 'Comidas', price: 13.90, description: 'Salsa cremosa tradicional con panceta, queso pecorino y yema de huevo.', available: true },
  { id: 'm5', name: 'Ceviche Mixto Peruano', category: 'Comidas', price: 16.00, description: 'Pescado y mariscos frescos marinados en limón, acompañados de camote y choclo.', available: true },
  
  { id: 'm6', name: 'Limonada de Coco', category: 'Bebidas', price: 4.50, description: 'Refrescante limonada batida con crema de coco natural.', available: true },
  { id: 'm7', name: 'Cerveza Artesanal Porter', category: 'Bebidas', price: 5.50, description: 'Cerveza oscura con tonas de chocolate y café tostado.', available: true },
  { id: 'm8', name: 'Jugo Verde Orgánico', category: 'Bebidas', price: 4.00, description: 'Piña, pepino, manzana verde, espinaca y jengibre.', available: true },
  { id: 'm9', name: 'Vino Tinto Copa Cab', category: 'Bebidas', price: 6.50, description: 'Suave copa de Cabernet Sauvignon de la casa.', available: true },
  
  { id: 'm10', name: 'Volcán de Chocolate', category: 'Postres', price: 6.90, description: 'Bizcocho tibio relleno de chocolate fundido, con helado de vainilla.', available: true },
  { id: 'm11', name: 'Cheesecake de Frutos Rojos', category: 'Postres', price: 6.00, description: 'Cremosa tarta de queso horneada, cubierta de frutos silvestres.', available: true },
  
  { id: 'm12', name: 'Empanaditas Argentinas', category: 'Entradas', price: 5.00, description: 'Tres piezas rellenas de carne cortada a cuchillo, servidas con chimichurri.', available: true },
  { id: 'm13', name: 'Tequeños Crujientes (6 u)', category: 'Entradas', price: 5.50, description: 'Rellenos de queso fresco, servidos con salsa de ajo.', available: true },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Lomo de Res', category: 'Carnes', quantity: 24.5, minLimit: 5.0, unit: 'kg', costPrice: 9.50 },
  { id: 'i2', name: 'Papa Única Rústica', category: 'Verduras', quantity: 60.0, minLimit: 15.0, unit: 'kg', costPrice: 1.20 },
  { id: 'i3', name: 'Queso Mozzarella', category: 'Ingredientes', quantity: 18.0, minLimit: 4.0, unit: 'kg', costPrice: 5.80 },
  { id: 'i4', name: 'Tomate de Árbol / Pasta', category: 'Ingredientes', quantity: 30.0, minLimit: 10.0, unit: 'litros', costPrice: 2.00 },
  { id: 'i5', name: 'Cerveza (Botellas)', category: 'Bebidas', quantity: 120, minLimit: 30, unit: 'piezas', costPrice: 1.80 },
  { id: 'i6', name: 'Crema de Coco', category: 'Bebidas', quantity: 15.5, minLimit: 3.0, unit: 'litros', costPrice: 3.50 },
  { id: 'i7', name: 'Vino Tinto (Botellas)', category: 'Bebidas', quantity: 24, minLimit: 5, unit: 'piezas', costPrice: 8.00 },
  { id: 'i8', name: 'Pollo Pechuga', category: 'Carnes', quantity: 15.0, minLimit: 4.0, unit: 'kg', costPrice: 4.20 },
  { id: 'i9', name: 'Harina de Trigo', category: 'Abarrotes', quantity: 50.0, minLimit: 10.0, unit: 'kg', costPrice: 0.90 },
  { id: 'i10', name: 'Cebollas', category: 'Verduras', quantity: 8.5, minLimit: 5.0, unit: 'kg', costPrice: 1.10 },
  { id: 'i11', name: 'Envases para llevar XL', category: 'Desechables', quantity: 250, minLimit: 50, unit: 'piezas', costPrice: 0.15 },
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 's1', name: 'Carlos Mendoza', role: 'Chef', phone: '+52 55 1234 5678', email: 'carlos.m@restaurante.com', status: 'Activo', hourlyRate: 15.00, username: 'carlos.chef', password: '9421' },
  { id: 's2', name: 'Sofía Valenzuela', role: 'Chef', phone: '+52 55 8765 4321', email: 'sofia.v@restaurante.com', status: 'Activo', hourlyRate: 14.50, username: 'sofia.chef', password: '3827' },
  { id: 's3', name: 'Juan Carlos Gómez', role: 'Mesero', phone: '+52 55 1122 3344', email: 'juan.g@restaurante.com', status: 'Activo', hourlyRate: 8.50, username: 'juan.mesero', password: '7412' },
  { id: 's4', name: 'Mariana Peralta', role: 'Mesero', phone: '+52 55 5566 7788', email: 'mariana.p@restaurante.com', status: 'Activo', hourlyRate: 8.50, username: 'mariana.mesero', password: '8523' },
  { id: 's5', name: 'Luis Felipe Ruiz', role: 'Mesero', phone: '+52 55 9900 1122', email: 'luis.r@restaurante.com', status: 'Activo', hourlyRate: 8.50, username: 'luis.mesero', password: '9634' },
  { id: 's6', name: 'Elena Rostova', role: 'Cajero', phone: '+52 55 4433 2211', email: 'elena.r@restaurante.com', status: 'Activo', hourlyRate: 10.00, username: 'elena.caja', password: '1590' },
  { id: 's7', name: 'Jorge Henao', role: 'Administrador', phone: '+52 55 7788 9900', email: 'jorge.h@restaurante.com', status: 'Activo', hourlyRate: 20.00, username: 'jorge.admin', password: '8520' },
];

export const INITIAL_SHIFTS: Shift[] = [
  // Lunes
  { id: 'sh1', staffId: 's1', dayOfWeek: 'Lunes', startTime: '08:00', endTime: '16:00', notes: 'Cocina Turno Mañana' },
  { id: 'sh2', staffId: 's3', dayOfWeek: 'Lunes', startTime: '08:00', endTime: '16:00', notes: 'Servicio Comedor' },
  { id: 'sh3', staffId: 's4', dayOfWeek: 'Lunes', startTime: '12:00', endTime: '20:00', notes: 'Servicio Comedor Mediodía' },
  { id: 'sh4', staffId: 's6', dayOfWeek: 'Lunes', startTime: '08:00', endTime: '16:00', notes: 'Turno Cajero Principal' },

  // Martes
  { id: 'sh5', staffId: 's2', dayOfWeek: 'Martes', startTime: '14:00', endTime: '22:00', notes: 'Cocina Turno Tarde' },
  { id: 'sh6', staffId: 's3', dayOfWeek: 'Martes', startTime: '14:00', endTime: '22:00', notes: 'Servicio Terraza' },
  { id: 'sh7', staffId: 's5', dayOfWeek: 'Martes', startTime: '12:00', endTime: '20:00', notes: 'Servicio Comedor' },

  // Miércoles
  { id: 'sh8', staffId: 's1', dayOfWeek: 'Miércoles', startTime: '14:00', endTime: '22:00', notes: 'Cocina Especialidades' },
  { id: 'sh9', staffId: 's4', dayOfWeek: 'Miércoles', startTime: '08:00', endTime: '16:00', notes: 'Atención Clientes' },
  { id: 'sh10', staffId: 's6', dayOfWeek: 'Miércoles', startTime: '14:00', endTime: '22:00', notes: 'Caja Tarde' },

  // Jueves
  { id: 'sh11', staffId: 's2', dayOfWeek: 'Jueves', startTime: '08:00', endTime: '16:00', notes: 'Cocina Mañana' },
  { id: 'sh12', staffId: 's5', dayOfWeek: 'Jueves', startTime: '14:00', endTime: '22:00', notes: 'Servicio Comedor' },
  { id: 'sh13', staffId: 's3', dayOfWeek: 'Jueves', startTime: '16:00', endTime: '23:00', notes: 'Cierre de Caja y Mesas' },

  // Viernes
  { id: 'sh14', staffId: 's1', dayOfWeek: 'Viernes', startTime: '14:00', endTime: '23:00', notes: 'Turno Fin de Semana Fuerte' },
  { id: 'sh15', staffId: 's2', dayOfWeek: 'Viernes', startTime: '08:00', endTime: '17:00', notes: 'Apoyo Cocina' },
  { id: 'sh16', staffId: 's4', dayOfWeek: 'Viernes', startTime: '14:00', endTime: '23:00', notes: 'Servicio Premium' },
  { id: 'sh17', staffId: 's5', dayOfWeek: 'Viernes', startTime: '15:00', endTime: '23:00', notes: 'Servicio Premium' },

  // Sábado
  { id: 'sh18', staffId: 's1', dayOfWeek: 'Sábado', startTime: '12:00', endTime: '23:00', notes: 'Cocina Todo el Día' },
  { id: 'sh19', staffId: 's3', dayOfWeek: 'Sábado', startTime: '12:00', endTime: '21:00', notes: 'Comedor Principal' },
  { id: 'sh20', staffId: 's4', dayOfWeek: 'Sábado', startTime: '14:00', endTime: '23:00', notes: 'Mesas Vip' },
  { id: 'sh21', staffId: 's5', dayOfWeek: 'Sábado', startTime: '15:00', endTime: '23:00', notes: 'Atención e Ingresos' },

  // Domingo
  { id: 'sh22', staffId: 's2', dayOfWeek: 'Domingo', startTime: '10:00', endTime: '18:00', notes: 'Cocina Brunch/Almuerzo' },
  { id: 'sh23', staffId: 's3', dayOfWeek: 'Domingo', startTime: '10:00', endTime: '18:00', notes: 'Comedor Familiar' },
  { id: 'sh24', staffId: 's4', dayOfWeek: 'Domingo', startTime: '10:00', endTime: '18:00', notes: 'Comedor Familiar' }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Laura Restrepo', phone: '+52 55 9898 3322', email: 'laura.re@gmail.com', points: 150, notes: 'Cliente frecuente, prefiere mesas cerca a la ventana. Alérgica a camarones.', createdAt: '2026-02-15T18:30:00Z' },
  { id: 'c2', name: 'Andrés López', phone: '+52 55 4545 6161', email: 'andres.lopez@yahoo.com', points: 45, notes: 'Frecuenta con niños, requiere silla de bebé.', createdAt: '2026-03-10T14:15:00Z' },
  { id: 'c3', name: 'Beatriz Solano', phone: '+52 55 2332 7878', email: 'beatriz.s@gmail.com', points: 310, notes: 'Cliente VIP del programa de puntos. Prefiere vino tinto.', createdAt: '2026-01-20T20:45:00Z' },
  { id: 'c4', name: 'Ignacio Ortiz', phone: '+52 55 8899 3344', email: 'i_ortiz@hotmail.com', points: 0, notes: 'Nuevo cliente, recomendado por un familiar.', createdAt: '2026-05-18T13:10:00Z' }
];

export const INITIAL_TABLES: Table[] = [
  { id: 't1', number: 1, capacity: 2, status: 'Libre' },
  { id: 't2', number: 2, capacity: 2, status: 'Ocupada', currentOrderId: 'ord_active_1' },
  { id: 't3', number: 3, capacity: 4, status: 'Libre' },
  { id: 't4', number: 4, capacity: 4, status: 'Ocupada', currentOrderId: 'ord_active_2' },
  { id: 't5', number: 5, capacity: 6, status: 'Buscando Cuenta', currentOrderId: 'ord_active_3' },
  { id: 't6', number: 6, capacity: 8, status: 'Libre' },
  { id: 't7', number: 7, capacity: 2, status: 'Libre' },
  { id: 't8', number: 8, capacity: 4, status: 'Libre' }
];

export const INITIAL_ACTIVE_ORDERS: Order[] = [
  {
    id: 'ord_active_1',
    tableId: 't2',
    tableNumber: 2,
    meseroId: 's3',
    chefId: 's1',
    items: [
      { menuItemId: 'm3', name: 'Hamburguesa Sabor Real', price: 12.50, quantity: 2, notes: 'Término medio, sin cebolla redonda' },
      { menuItemId: 'm6', name: 'Limonada de Coco', price: 4.50, quantity: 2 }
    ],
    status: 'En Cocina',
    subtotal: 34.00,
    tax: 3.40,
    discount: 0.00,
    total: 37.40,
    createdAt: '2026-05-21T00:45:00Z'
  },
  {
    id: 'ord_active_2',
    tableId: 't4',
    tableNumber: 4,
    meseroId: 's4',
    chefId: 's2',
    items: [
      { menuItemId: 'm1', name: 'Lomo Fino con Papas', price: 18.50, quantity: 1, notes: 'Papas bien tostadas' },
      { menuItemId: 'm4', name: 'Pasta Carbonara Classic', price: 13.90, quantity: 1 },
      { menuItemId: 'm7', name: 'Cerveza Artesanal Porter', price: 5.50, quantity: 2 }
    ],
    status: 'Pendiente',
    subtotal: 43.40,
    tax: 4.34,
    discount: 0.00,
    total: 47.74,
    createdAt: '2026-05-21T01:10:00Z'
  },
  {
    id: 'ord_active_3',
    tableId: 't5',
    tableNumber: 5,
    meseroId: 's5',
    chefId: 's1',
    items: [
      { menuItemId: 'm2', name: 'Pizza Margherita XL', price: 14.00, quantity: 1 },
      { menuItemId: 'm5', name: 'Ceviche Mixto Peruano', price: 16.00, quantity: 1, notes: 'Picante medio' },
      { menuItemId: 'm9', name: 'Vino Tinto Copa Cab', price: 6.50, quantity: 3 },
      { menuItemId: 'm10', name: 'Volcán de Chocolate', price: 6.90, quantity: 1 }
    ],
    status: 'Listo',
    subtotal: 56.40,
    tax: 5.64,
    discount: 5.00,
    total: 57.04,
    createdAt: '2026-05-20T23:55:00Z'
  }
];

export const INITIAL_SALES: Sale[] = [
  // Ventas de días anteriores o más temprano hoy
  { id: 'sal1', orderId: 'ord_h1', tableNumber: 1, total: 42.90, paymentMethod: 'Tarjeta', date: '2026-05-18T13:20:00Z' },
  { id: 'sal2', orderId: 'ord_h2', tableNumber: 3, total: 85.50, paymentMethod: 'Efectivo', date: '2026-05-18T20:45:00Z' },
  { id: 'sal3', orderId: 'ord_h3', tableNumber: 5, total: 110.00, paymentMethod: 'Transferencia', date: '2026-05-19T14:10:00Z' },
  { id: 'sal4', orderId: 'ord_h4', tableNumber: 2, total: 28.50, paymentMethod: 'Tarjeta', date: '2026-05-19T19:30:00Z' },
  { id: 'sal5', orderId: 'ord_h5', tableNumber: 4, total: 63.20, paymentMethod: 'Tarjeta', date: '2026-05-20T12:15:00Z' },
  { id: 'sal6', orderId: 'ord_h6', tableNumber: 6, total: 148.90, paymentMethod: 'Efectivo', date: '2026-05-20T21:05:00Z' },
  { id: 'sal7', orderId: 'ord_h7', tableNumber: 1, total: 32.00, paymentMethod: 'Transferencia', date: '2026-05-20T22:30:00Z' },
  { id: 'sal8', orderId: 'ord_h8', tableNumber: 3, total: 55.40, paymentMethod: 'Tarjeta', date: '2026-05-21T00:15:00Z' }
];

export const HISTORIC_COMPLETED_ORDERS: Order[] = [
  {
    id: 'ord_h1',
    tableId: 't1',
    tableNumber: 1,
    meseroId: 's3',
    chefId: 's1',
    customerId: 'c1',
    items: [
      { menuItemId: 'm4', name: 'Pasta Carbonara Classic', price: 13.90, quantity: 2 },
      { menuItemId: 'm6', name: 'Limonada de Coco', price: 4.50, quantity: 2 }
    ],
    status: 'Pagado',
    subtotal: 36.80,
    tax: 3.68,
    discount: 0.00,
    total: 42.90,
    createdAt: '2026-05-18T12:00:00Z',
    paidAt: '2026-05-18T13:20:00Z',
    paymentMethod: 'Tarjeta'
  },
  {
    id: 'ord_h2',
    tableId: 't3',
    tableNumber: 3,
    meseroId: 's4',
    chefId: 's2',
    customerId: 'c3',
    items: [
      { menuItemId: 'm1', name: 'Lomo Fino con Papas', price: 18.50, quantity: 3 },
      { menuItemId: 'm9', name: 'Vino Tinto Copa Cab', price: 6.50, quantity: 4 }
    ],
    status: 'Pagado',
    subtotal: 77.50,
    tax: 7.75,
    discount: 5.00,
    total: 85.50,
    createdAt: '2026-05-18T19:30:00Z',
    paidAt: '2026-05-18T20:45:00Z',
    paymentMethod: 'Efectivo'
  }
];

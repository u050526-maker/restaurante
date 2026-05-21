import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Coffee,
  DollarSign,
  ClipboardList,
  Users,
  Calendar,
  UserCheck,
  TrendingUp,
  Store,
  Menu,
  X,
  LogOut
} from 'lucide-react';

import { Table, MenuItem, InventoryItem, StaffMember, Shift, Customer, Order, Sale, OrderDetail } from './types';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_INVENTORY,
  INITIAL_STAFF,
  INITIAL_SHIFTS,
  INITIAL_CUSTOMERS,
  INITIAL_TABLES,
  INITIAL_ACTIVE_ORDERS,
  INITIAL_SALES
} from './initialData';

// Modulos
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MesasComandas from './components/MesasComandas';
import Cobros from './components/Cobros';
import Inventario from './components/Inventario';
import Personal from './components/Personal';
import Horarios from './components/Horarios';
import Clientes from './components/Clientes';
import Ventas from './components/Ventas';

export default function App() {
  const [currentUser, setCurrentUser] = useState<StaffMember | null>(() => {
    const saved = localStorage.getItem('sv_rest_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTableForCobros, setSelectedTableForCobros] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync current user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sv_rest_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sv_rest_user');
    }
  }, [currentUser]);

  // Handle auto-tab routing on login role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Mesero') {
        setActiveTab('mesas');
      } else {
        if (!['dashboard', 'mesas', 'cobros', 'inventario', 'personal', 'horarios', 'clientes', 'ventas'].includes(activeTab)) {
          setActiveTab('dashboard');
        }
      }
    }
  }, [currentUser]);

  // States with localStorage persistence falling back to rich initial data
  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('sv_rest_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('sv_rest_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('sv_rest_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('sv_rest_staff');
    let loaded: StaffMember[] = saved ? JSON.parse(saved) : INITIAL_STAFF;
    
    // Auto-migrate to the new, secure, unique password defaults for each employee
    let hasUpdated = false;
    loaded = loaded.map(member => {
      if (member.id === 's1' && !member.username) {
        hasUpdated = true;
        return { ...member, username: 'carlos.chef', password: 'chef9421' };
      }
      if (member.id === 's2' && !member.username) {
        hasUpdated = true;
        return { ...member, username: 'sofia.chef', password: 'chef3827' };
      }
      if (member.id === 's3' && (member.username === 'mesero' || !member.username)) {
        hasUpdated = true;
        return { ...member, username: 'juan.mesero', password: 'serv7412' };
      }
      if (member.id === 's4' && (member.username === 'mesero2' || !member.username)) {
        hasUpdated = true;
        return { ...member, username: 'mariana.mesero', password: 'serv8523' };
      }
      if (member.id === 's5' && !member.username) {
        hasUpdated = true;
        return { ...member, username: 'luis.mesero', password: 'serv9634' };
      }
      if (member.id === 's6' && !member.username) {
        hasUpdated = true;
        return { ...member, username: 'elena.caja', password: 'caja1590' };
      }
      if (member.id === 's7' && (member.username === 'admin' || !member.username)) {
        hasUpdated = true;
        return { ...member, username: 'jorge.admin', password: 'admin8520' };
      }
      return member;
    });

    if (hasUpdated) {
      localStorage.setItem('sv_rest_staff', JSON.stringify(loaded));
    }
    return loaded;
  });

  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem('sv_rest_shifts');
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('sv_rest_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [activeOrders, setActiveOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sv_rest_orders');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_ORDERS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sv_rest_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sv_rest_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('sv_rest_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('sv_rest_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('sv_rest_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('sv_rest_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('sv_rest_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('sv_rest_orders', JSON.stringify(activeOrders));
  }, [activeOrders]);

  useEffect(() => {
    localStorage.setItem('sv_rest_sales', JSON.stringify(sales));
  }, [sales]);

  // Operations Handlers
  const handleOpenTable = (
    tableId: string,
    meseroId: string,
    chefId: string,
    customerId?: string,
    items: OrderDetail[] = []
  ) => {
    const nextOrderId = `ord_${Date.now()}`;
    const tableNumber = tables.find(t => t.id === tableId)?.number || 0;

    // Calcular costos
    const subtotal = items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const tax = subtotal * 0.10; // 10% IVA
    const total = subtotal + tax;

    const newOrder: Order = {
      id: nextOrderId,
      tableId,
      tableNumber,
      meseroId,
      chefId,
      customerId,
      items,
      status: 'Pendiente',
      subtotal,
      tax,
      discount: 0,
      total,
      createdAt: new Date().toISOString()
    };

    setActiveOrders(prev => [...prev, newOrder]);
    
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, status: 'Ocupada', currentOrderId: nextOrderId } : t
    ));
  };

  const handleUpdateOrder = (orderId: string, updates: Partial<Order>) => {
    setActiveOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, ...updates };
        // Recalcular total si cambian los items
        if (updates.items) {
          const subtotal = updates.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
          const tax = subtotal * 0.10;
          updated.subtotal = subtotal;
          updated.tax = tax;
          updated.total = subtotal + tax - (updated.discount || 0);
        }
        return updated;
      }
      return o;
    }));
  };

  const handleUpdateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, status } : t
    ));
  };

  const deductInventoryForOrder = (orderItems: OrderDetail[]) => {
    // Mapeo detallista y simulador inteligente de reducción de stock al cerrar venta
    setInventory(prev => {
      return prev.map(invItem => {
        let deduction = 0;
        orderItems.forEach(ordItem => {
          const itemName = ordItem.name.toLowerCase();
          const pCategory = ordItem.name; // MenuItem name
          
          // Lomo Fino con Papas -> Deducción carne y papas
          if (itemName.includes('lomo') && invItem.name.toLowerCase().includes('lomo')) {
            deduction += 0.250 * ordItem.quantity; // 250g de lomo por persona
          }
          if (itemName.includes('lomo') && invItem.name.toLowerCase().includes('papa')) {
            deduction += 0.300 * ordItem.quantity; // 300g de papas
          }
          if (itemName.includes('pasta') && invItem.name.toLowerCase().includes('harina')) {
            deduction += 0.150 * ordItem.quantity; // 150g harina
          }
          if (itemName.includes('pizza') && invItem.name.toLowerCase().includes('mozzarella')) {
            deduction += 0.180 * ordItem.quantity; // 180g mozzarella
          }
          if (itemName.includes('pizza') && invItem.name.toLowerCase().includes('harina')) {
            deduction += 0.200 * ordItem.quantity; // 200g harina
          }
          if (itemName.includes('cerveza') && invItem.name.toLowerCase().includes('cerveza')) {
            deduction += 1 * ordItem.quantity; // 1 botella
          }
          if (itemName.includes('vin') && invItem.name.toLowerCase().includes('vin')) {
            deduction += 0.15 * ordItem.quantity; // 15% de una botella por copa
          }
          if (itemName.includes('limonada') && invItem.name.toLowerCase().includes('coco')) {
            deduction += 0.20 * ordItem.quantity; // 200ml crema de coco
          }
        });

        if (deduction > 0) {
          return { ...invItem, quantity: Math.max(0, invItem.quantity - deduction) };
        }
        return invItem;
      });
    });
  };

  const handleProcessPayment = (
    orderId: string,
    paymentMethod: Sale['paymentMethod'],
    discount: number,
    earnedPoints: number
  ) => {
    const order = activeOrders.find(o => o.id === orderId);
    if (!order) return;

    const paymentTotal = Math.max(order.total - discount, 0);

    // 1. Agregar nueva Venta
    const newSale: Sale = {
      id: `sal_${Date.now()}`,
      orderId,
      tableNumber: order.tableNumber,
      total: paymentTotal,
      paymentMethod,
      date: new Date().toISOString()
    };

    setSales(prev => [...prev, newSale]);

    // 2. Actualizar estatus de mesa e invocar limpieza
    setTables(prev => prev.map(t => 
      t.id === order.tableId ? { ...t, status: 'Libre', currentOrderId: undefined } : t
    ));

    // 3. Remover de comandas activas
    setActiveOrders(prev => prev.filter(o => o.id !== orderId));

    // 4. Modificar puntos del cliente asociado
    if (order.customerId) {
      setCustomers(prev => prev.map(c => 
        c.id === order.customerId ? { ...c, points: c.points + earnedPoints - (discount > 0 ? 50 : 0) } : c
      ));
    }

    // 5. Autodeducir insumos de almacén
    deductInventoryForOrder(order.items);
  };

  // Inventory logic
  const handleAddInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
  };

  const handleUpdateInventoryItem = (itemId: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => i.id === itemId ? { ...i, ...updates } : i));
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    setInventory(prev => prev.filter(i => i.id !== itemId));
  };

  // Staff logic
  const handleAddStaffMember = (member: StaffMember) => {
    setStaff(prev => [...prev, member]);
  };

  const handleUpdateStaffMember = (memberId: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === memberId ? { ...s, ...updates } : s));
  };

  const handleDeleteStaffMember = (memberId: string) => {
    setStaff(prev => prev.filter(s => s.id !== memberId));
  };

  // Shifts logic
  const handleAddShift = (shift: Shift) => {
    setShifts(prev => [...prev, shift]);
  };

  const handleDeleteShift = (shiftId: string) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId));
  };

  // Customers logic
  const handleAddCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const handleUpdateCustomer = (customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, ...updates } : c));
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const menuOptions = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'mesas', label: 'Mesas & Comandas', icon: Coffee },
    { id: 'cobros', label: 'Caja & Cobros', icon: DollarSign },
    { id: 'inventario', label: 'Inventario', icon: ClipboardList },
    { id: 'personal', label: 'Personal', icon: Users },
    { id: 'horarios', label: 'Horarios', icon: Calendar },
    { id: 'clientes', label: 'Fidelización', icon: UserCheck },
    { id: 'ventas', label: 'Ventas', icon: TrendingUp },
  ];

  if (!currentUser) {
    return <Login staff={staff} onLogin={(user) => setCurrentUser(user)} />;
  }

  const isMesero = currentUser.role === 'Mesero';
  const filteredMenuOptions = isMesero
    ? menuOptions.filter((option) => option.id === 'mesas' || option.id === 'cobros')
    : menuOptions;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row font-sans text-[#E0E0E0]">
      
      {/* Boton de menu movil */}
      <div className="md:hidden bg-[#0D0D0D] px-4 py-3 flex items-center justify-between border-b border-[#2A2A2A] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-[#C5A059]" />
          <span className="font-display font-bold text-[#C5A059] tracking-tighter text-lg">ESTELAR</span>
          <span className="text-xs font-light tracking-widest text-[#666]">MANAGEMENT</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 hover:bg-[#1F1F1F] rounded text-gray-400 hover:text-[#C5A059]"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar de navegación */}
      <aside className={`w-[260px] bg-[#141414] border-r border-[#2A2A2A] flex flex-col justify-between shrink-0 sticky top-0 h-screen z-30 transition-transform md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0 fixed inset-y-0 left-0 bg-[#141414]' : '-translate-x-full hidden md:flex'
      }`}>
        <div className="py-6 flex-1 flex flex-col h-full overflow-y-auto">
          {/* Logo */}
          <div className="px-6 pb-6 border-b border-[#2A2A2A] flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1F1F1F] border border-[#2A2A2A] flex items-center justify-center text-[#C5A059]">
              <Store className="w-4 h-4 text-[#C5A059]" />
            </div>
            <div>
              <span className="font-display font-black text-[#C5A059] tracking-tighter text-lg block leading-none">ESTELAR</span>
              <span className="text-[9px] text-gray-550 font-light block tracking-widest mt-1">MANAGEMENT</span>
            </div>
          </div>

          {/* Menú List (Filtrado según rol) */}
          <nav className="px-3 pt-5 space-y-1.5 flex-1-deleted">
            {filteredMenuOptions.map((option) => {
              const IconComp = option.icon;
              const isActive = activeTab === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setActiveTab(option.id);
                    setIsSidebarOpen(false); // Close mobile menu
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1F1F1F] text-[#C5A059] border border-[#C5A059]/20 shadow-sm shadow-[#C5A059]/5'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1F1F1F]/40'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#C5A059]' : 'text-gray-500'}`} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info / Branding Footer con botón de Cerrar Sesión */}
        <div className="p-4 border-t border-[#2A2A2A] text-xs bg-[#0D0D0D] flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#C5A059] text-black rounded-full flex items-center justify-center font-extrabold text-xs">
              {currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'US'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-200 truncate leading-none">{currentUser.name}</p>
              <div className="flex items-center mt-1">
                <span className="text-[9px] text-[#C5A059] font-mono tracking-wider uppercase bg-[#C5A059]/10 px-1.5 py-0.5 rounded border border-[#C5A059]/20 font-bold block">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentUser(null)}
            className="w-full bg-[#1A1A1A] hover:bg-rose-955/20 hover:text-rose-450 border border-[#2A2A2A] text-gray-400 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-gray-500 hover:text-rose-400 shrink-0" />
            Cerrar Sesión (Salir)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'dashboard' && (
              <Dashboard
                sales={sales}
                orders={activeOrders}
                inventory={inventory}
                tables={tables}
                staff={staff}
                setActiveTab={setActiveTab}
                onRestock={(itemId, amt) => handleUpdateInventoryItem(itemId, { quantity: inventory.find(i => i.id === itemId)!.quantity + amt })}
              />
            )}

            {activeTab === 'mesas' && (
              <MesasComandas
                tables={tables}
                menuItems={menuItems}
                staff={staff}
                customers={customers}
                activeOrders={activeOrders}
                onOpenTable={handleOpenTable}
                onUpdateOrder={handleUpdateOrder}
                onUpdateTableStatus={handleUpdateTableStatus}
                setActiveTab={setActiveTab}
                setSelectedTableForCobros={setSelectedTableForCobros}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'cobros' && (
              <Cobros
                tables={tables}
                activeOrders={activeOrders}
                customers={customers}
                onProcessPayment={handleProcessPayment}
                selectedTableIdPreset={selectedTableForCobros}
                setSelectedTableIdPreset={setSelectedTableForCobros}
              />
            )}

            {activeTab === 'inventario' && (
              <Inventario
                inventory={inventory}
                onAddInventoryItem={handleAddInventoryItem}
                onUpdateInventoryItem={handleUpdateInventoryItem}
                onDeleteInventoryItem={handleDeleteInventoryItem}
              />
            )}

            {activeTab === 'personal' && (
              <Personal
                staff={staff}
                onAddStaffMember={handleAddStaffMember}
                onUpdateStaffMember={handleUpdateStaffMember}
                onDeleteStaffMember={handleDeleteStaffMember}
              />
            )}

            {activeTab === 'horarios' && (
              <Horarios
                shifts={shifts}
                staff={staff}
                onAddShift={handleAddShift}
                onDeleteShift={handleDeleteShift}
              />
            )}

            {activeTab === 'clientes' && (
              <Clientes
                customers={customers}
                onAddCustomer={handleAddCustomer}
                onUpdateCustomer={handleUpdateCustomer}
                onDeleteCustomer={handleDeleteCustomer}
              />
            )}

            {activeTab === 'ventas' && (
              <Ventas
                sales={sales}
                onClearHistory={() => setSales([])}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

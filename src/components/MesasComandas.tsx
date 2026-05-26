import React, { useState } from 'react';
import { Plus, Minus, X, Coffee, User, ShoppingBag, PlusCircle, Search } from 'lucide-react';
import { Table, MenuItem, StaffMember, Customer, Order, OrderDetail, OrderStatus } from '../types';

interface MesasComandasProps {
  tables: Table[];
  menuItems: MenuItem[];
  staff: StaffMember[];
  customers: Customer[];
  activeOrders: Order[];
  onOpenTable: (tableId: string, meseroId: string, chefId: string, customerId?: string, items?: OrderDetail[], reservationName?: string) => void;
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  onUpdateTableStatus: (tableId: string, status: Table['status'], reservationName?: string) => void;
  setActiveTab: (tab: string) => void;
  setSelectedTableForCobros: (tableId: string) => void;
  currentUser?: StaffMember | null;
}

export default function MesasComandas({
  tables,
  menuItems,
  staff,
  customers,
  activeOrders,
  onOpenTable,
  onUpdateOrder,
  onUpdateTableStatus,
  setActiveTab,
  setSelectedTableForCobros,
  currentUser
}: MesasComandasProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isOpeningModal, setIsOpeningModal] = useState(false);
  
  // State for opening new comanda
  const [selectedWaiterId, setSelectedWaiterId] = useState('');
  const [selectedChefId, setSelectedChefId] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [reservationName, setReservationName] = useState('');
  const [cartItems, setCartItems] = useState<OrderDetail[]>([]);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilter, setMenuFilter] = useState<'Todos' | 'Comidas' | 'Bebidas' | 'Postres' | 'Entradas'>('Todos');
  const [newReservationInput, setNewReservationInput] = useState('');

  // Filter staff by roles
  const waiters = staff.filter(s => s.role === 'Mesero' && s.status === 'Activo');
  const chefs = staff.filter(s => s.role === 'Chef' && s.status === 'Activo');

  // Find active order for selected table (if any)
  const currentActiveOrder = selectedTable && selectedTable.currentOrderId 
    ? activeOrders.find(o => o.id === selectedTable.currentOrderId) 
    : null;

  const handleSelectTable = (table: Table) => {
    setSelectedTable(table);
    setNewReservationInput('');
  };

  const handleOpenComandaWizard = (tableToOpen: Table) => {
    setIsOpeningModal(true);
    // Reset opening wizard state
    const defaultWaiterId = (currentUser && currentUser.role === 'Mesero') ? currentUser.id : (waiters[0]?.id || '');
    setSelectedWaiterId(defaultWaiterId);
    setSelectedChefId(chefs[0]?.id || '');
    setSelectedCustomerId('');
    setReservationName(tableToOpen.reservationName || '');
    setCartItems([]);
  };

  const addToCart = (item: MenuItem) => {
    const existing = cartItems.find(c => c.menuItemId === item.id);
    if (existing) {
      setCartItems(cartItems.map(c => 
        c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCartItems([...cartItems, {
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        notes: ''
      }]);
    }
  };

  const updateCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setCartItems(cartItems.filter(c => c.menuItemId !== itemId));
    } else {
      setCartItems(cartItems.map(c => 
        c.menuItemId === itemId ? { ...c, quantity: qty } : c
      ));
    }
  };

  const updateCartNotes = (itemId: string, notes: string) => {
    setCartItems(cartItems.map(c => 
      c.menuItemId === itemId ? { ...c, notes } : c
    ));
  };

  const handleOpenComanda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;
    if (cartItems.length === 0) {
      alert('Debes agregar al menos un platillo o bebida a la comanda.');
      return;
    }
    onOpenTable(
      selectedTable.id,
      selectedWaiterId,
      selectedChefId,
      selectedCustomerId || undefined,
      cartItems,
      reservationName.trim() || undefined
    );
    setIsOpeningModal(false);
    setSelectedTable(null);
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesFilter = menuFilter === 'Todos' || item.category === menuFilter;
    return matchesSearch && matchesFilter && item.available;
  });

  const handleGoToCheckout = (tableId: string) => {
    setSelectedTableForCobros(tableId);
    setActiveTab('cobros');
  };

  return (
    <div className="space-y-6" id="mesas-comandas-view">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200">
        <h1 className="text-2xl font-display font-semibold text-zinc-900 tracking-tight">Servicio de Mesas</h1>
        <p className="text-xs text-zinc-500 mt-1">Sabor & Gestión • Gestión activa del comedor en vivo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel izquierdo: Plano de las Mesas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-zinc-900">Mapa de Distribución</h3>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-zinc-650">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-zinc-200 shadow-2xs"></span>Libre
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9C7E46]"></span>Ocupada
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>Pidiendo Cuenta
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="tables-grid">
              {tables.map(table => {
                const isSelected = selectedTable?.id === table.id;
                let bgClass = "bg-white hover:bg-zinc-50/80 border-zinc-200 text-zinc-600 hover:border-zinc-300";
                let statusBadge = "bg-zinc-100 text-zinc-550 border-zinc-200";
                
                if (table.status === 'Ocupada') {
                  bgClass = "bg-[#FAF9F6]/80 border-[#9C7E46]/80 hover:border-[#9C7E46] text-zinc-900 hover:bg-[#FAF9F6]";
                  statusBadge = "bg-[#9C7E46]/10 text-[#9C7E46] border-[#9C7E46]/20 font-semibold";
                } else if (table.status === 'Buscando Cuenta') {
                  bgClass = "bg-sky-50/50 border-sky-400 hover:border-sky-500 text-zinc-900";
                  statusBadge = "bg-sky-500/10 text-sky-700 border-sky-200 font-semibold";
                } else if (table.status === 'Reservada') {
                  bgClass = "bg-amber-50/20 border-amber-350 hover:border-amber-400 text-zinc-900 hover:bg-amber-50/40";
                  statusBadge = "bg-amber-500/15 text-amber-800 border-amber-200 font-bold";
                }

                if (isSelected) {
                  bgClass += " ring-2 ring-zinc-900 ring-offset-2 ring-offset-white";
                }

                const tableOrder = activeOrders.find(o => o.tableId === table.id);

                return (
                  <button
                    key={table.id}
                    onClick={() => handleSelectTable(table)}
                    className={`p-5 rounded-xl border flex flex-col items-center justify-center text-center gap-2.5 transition-all cursor-pointer shadow-3xs ${bgClass}`}
                  >
                    <Coffee className={`w-8 h-8 ${
                      table.status === 'Ocupada' ? 'text-[#9C7E46]' :
                      table.status === 'Buscando Cuenta' ? 'text-sky-500' :
                      table.status === 'Reservada' ? 'text-amber-500' : 'text-zinc-300'
                    }`} />
                    <span className="text-base font-bold text-zinc-900">Mesa {table.number}</span>
                    {table.reservationName && (
                      <span className="text-xs font-bold text-[#9C7E46] bg-[#9C7E46]/10 border border-[#9C7E46]/20 px-2 py-0.5 rounded truncate max-w-full" title={table.reservationName}>
                        👤 {table.reservationName}
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 font-semibold block font-mono">CAPACIDAD: {table.capacity} PAX</span>
                    
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                      {table.status === 'Buscando Cuenta' ? 'Pidiendo Cuenta' : table.status}
                    </span>

                    {tableOrder && (
                      <span className="text-xs font-bold text-[#9C7E46] bg-white px-2 py-0.5 rounded-md shadow-2xs mt-1 border border-[#9C7E46]/25">
                        ${tableOrder.total.toFixed(2)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel derecho: Detalle de Mesa Seleccionada */}
        <div className="space-y-4">
          {selectedTable && !isOpeningModal && currentActiveOrder ? (
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-5" id="active-comanda-detail">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="font-bold text-zinc-900 text-base">Comanda Mesa {selectedTable.number}</h3>
                  {selectedTable.reservationName && (
                    <p className="text-xs font-bold text-[#9C7E46] flex items-center gap-1 mt-1 font-sans">
                      👤 {selectedTable.reservationName}
                    </p>
                  )}
                  <p className="text-[10px] text-zinc-400 mt-1 font-mono">ORDEN: #{currentActiveOrder.id.substring(4, 9).toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setSelectedTable(null)}
                  className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Personal asignado */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-50 p-3 rounded-lg border border-zinc-150">
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-mono font-medium">Mesero</span>
                  <p className="font-semibold text-zinc-800">
                    {staff.find(s => s.id === currentActiveOrder.meseroId)?.name || 'Sin Asignar'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block uppercase font-mono font-medium">Chef</span>
                  <p className="font-semibold text-zinc-800">
                    {staff.find(s => s.id === currentActiveOrder.chefId)?.name || 'Sin Asignar'}
                  </p>
                </div>
              </div>

              {/* Loyalty Customer */}
              {currentActiveOrder.customerId && (
                <div className="flex items-center gap-2 text-xs bg-sky-50 text-sky-800 p-2.5 rounded-lg border border-sky-100">
                  <User className="w-4 h-4 text-sky-600 shrink-0" />
                  <div className="truncate">
                    <span className="text-[9px] font-mono text-sky-600 uppercase block font-semibold">Cliente Frecuente</span>
                    <span className="font-semibold">{customers.find(c => c.id === currentActiveOrder.customerId)?.name}</span>
                  </div>
                </div>
              )}

              {/* Lista de platillos */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Artículos ({currentActiveOrder.items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                
                {currentActiveOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start gap-4 text-xs py-1.5 border-b border-zinc-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#9C7E46] bg-[#9C7E46]/10 px-1.5 py-0.5 rounded shrink-0 border border-[#9C7E46]/20">{item.quantity}x</span>
                        <p className="font-semibold text-zinc-800 truncate">{item.name}</p>
                      </div>
                      {item.notes && <p className="text-[11px] italic text-rose-600 pl-8 mt-0.5">"{item.notes}"</p>}
                    </div>
                    <span className="font-mono text-zinc-600 shrink-0 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Control de estatus de la cocina */}
              <div className="space-y-2.5 pt-2 border-t border-zinc-100">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Estado del Servicio</span>
                
                <div className="grid grid-cols-4 gap-1 text-[10px] font-mono font-medium text-center">
                  {(['Pendiente', 'En Cocina', 'Listo', 'Entregado'] as OrderStatus[]).map((st) => {
                    const isCurrent = currentActiveOrder.status === st;
                    const isPast = ['Pendiente', 'En Cocina', 'Listo', 'Entregado'].indexOf(currentActiveOrder.status) >= ['Pendiente', 'En Cocina', 'Listo', 'Entregado'].indexOf(st);
                    
                    return (
                      <button
                        key={st}
                        onClick={() => onUpdateOrder(currentActiveOrder.id, { status: st })}
                        className={`py-1.5 rounded-md border text-center transition-all cursor-pointer ${
                          isCurrent ? 'bg-zinc-900 text-white border-transparent shadow-xs font-bold' :
                          isPast ? 'bg-[#9C7E46]/10 text-[#9C7E46] border-[#9C7E46]/20 hover:bg-[#9C7E46]/20' :
                          'bg-white text-zinc-400 border-zinc-200 hover:bg-zinc-50'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Totales */}
              <div className="pt-3 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-550">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-zinc-805 font-medium">${currentActiveOrder.subtotal.toFixed(2)}</span>
                </div>
                {currentActiveOrder.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Descuento:</span>
                    <span className="font-mono">-${currentActiveOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Impuesto (10% IVA):</span>
                  <span className="font-mono text-zinc-805 font-medium">${currentActiveOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-900 font-bold pt-1.5 border-t border-zinc-100">
                  <span>Total:</span>
                  <span className="font-mono text-[#9C7E46]">${currentActiveOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {selectedTable.status === 'Ocupada' ? (
                  <button
                    onClick={() => {
                      onUpdateTableStatus(selectedTable.id, 'Buscando Cuenta');
                      setSelectedTable({ ...selectedTable, status: 'Buscando Cuenta' });
                    }}
                    className="w-full text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold py-2.5 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
                  >
                    Pedir Cuenta 🧾
                  </button>
                ) : (
                  <span className="text-xs bg-sky-50 border border-sky-100 text-sky-700 font-bold py-2.5 rounded-lg text-center select-none block col-span-1">
                    Pedida ✔
                  </span>
                )}
                
                <button
                  onClick={() => handleGoToCheckout(selectedTable.id)}
                  className="w-full text-center bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  Cobrar $
                </button>
              </div>
            </div>
          ) : selectedTable && !isOpeningModal && !currentActiveOrder ? (
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-6" id="empty-table-options">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="font-bold text-zinc-900 text-base">Mesa {selectedTable.number}</h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">CAPACIDAD: {selectedTable.capacity} PAX</p>
                </div>
                <button 
                  onClick={() => setSelectedTable(null)}
                  className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedTable.status === 'Reservada' ? (
                /* Vista de mesa Reservada */
                <div className="space-y-5">
                  <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-200 text-center space-y-2">
                    <User className="w-8 h-8 text-amber-600 mx-auto" />
                    <span className="text-xs uppercase tracking-wider font-bold text-amber-800 block">Mesa Reservada</span>
                    <p className="text-sm font-bold text-zinc-900">{selectedTable.reservationName}</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleOpenComandaWizard(selectedTable)}
                      className="w-full text-center bg-[#9C7E46] hover:bg-[#B4965C] text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Iniciar Servicio (Comer)
                    </button>
                    <button
                      onClick={() => {
                        onUpdateTableStatus(selectedTable.id, 'Libre');
                        setSelectedTable({ ...selectedTable, status: 'Libre', reservationName: undefined });
                      }}
                      className="w-full text-center bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Liberar Mesa (Cancelar Reserva)
                    </button>
                  </div>
                </div>
              ) : (
                /* Vista de mesa Libre */
                <div className="space-y-6">
                  {/* Iniciar servicio */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Servicio Inmediato</span>
                    <button
                      onClick={() => handleOpenComandaWizard(selectedTable)}
                      className="w-full text-center bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      Abrir Comanda Ahora
                    </button>
                  </div>

                  <div className="border-t border-zinc-150 pt-4 space-y-3">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Establecer una Reserva</span>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newReservationInput}
                        onChange={(e) => setNewReservationInput(e.target.value)}
                        placeholder="Nombre de la reserva (ej: Familia Pérez)..."
                        className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#9C7E46] focus:border-[#9C7E46] bg-white text-zinc-800 placeholder-zinc-400 font-medium"
                      />
                      <button
                        type="button"
                        disabled={!newReservationInput.trim()}
                        onClick={() => {
                          const name = newReservationInput.trim();
                          onUpdateTableStatus(selectedTable.id, 'Reservada', name);
                          setSelectedTable({ ...selectedTable, status: 'Reservada', reservationName: name });
                          setNewReservationInput('');
                        }}
                        className="w-full text-center bg-white hover:bg-amber-50 text-amber-800 hover:text-amber-900 border border-amber-250 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-zinc-400 py-2 rounded-lg text-xs font-bold transition-all disabled:cursor-not-allowed cursor-pointer"
                      >
                        Confirmar Reserva 👤
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-2xs text-center text-zinc-400 py-20 flex flex-col items-center justify-center gap-3">
              <ShoppingBag className="w-12 h-12 text-zinc-300" />
              <p className="text-sm font-semibold text-zinc-800">Comandos & Selección</p>
              <p className="text-xs text-zinc-500 max-w-[200px]">Haz clic en cualquier mesa en el mapa para ver su comanda, pedir la cuenta o procesar el cobro de la venta.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE APERTURA DE COMANDA */}
      {isOpeningModal && selectedTable && (
        <div className="fixed inset-0 bg-zinc-900/60 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 max-w-4xl w-full flex flex-col md:flex-row max-h-[90vh] overflow-hidden" id="billing-modal-wizard">
            {/* Sección de Selección de Artículos */}
            <div className="flex-1 p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-zinc-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
                <h3 className="font-bold text-zinc-900 text-lg">Catálogo • Mesa {selectedTable.number}</h3>
                <span className="text-xs text-zinc-450">Agregue elementos a la comanda actual</span>
              </div>

              {/* Buscador de Menú y Categorías */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Buscar platillo o bebida..."
                    className="w-full text-xs pl-9 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 bg-zinc-50/50 text-zinc-905"
                  />
                </div>
                <div className="flex border border-zinc-200 rounded-lg overflow-hidden shrink-0 text-xs bg-zinc-50">
                  {['Todos', 'Comidas', 'Bebidas', 'Postres', 'Entradas'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMenuFilter(cat as any)}
                      className={`px-3 py-1.5 font-medium border-r border-zinc-200 last:border-0 transition-colors cursor-pointer ${
                        menuFilter === cat ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Platillos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] md:max-h-[55vh] overflow-y-auto pr-1">
                {filteredMenuItems.length === 0 ? (
                  <p className="text-xs text-zinc-450 text-center py-10 col-span-2">No se encontraron artículos con estos criterios.</p>
                ) : (
                  filteredMenuItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => addToCart(item)}
                      className="p-3.5 bg-zinc-50/20 hover:bg-zinc-50 border border-zinc-200 rounded-xl text-left flex flex-col justify-between h-24 hover:border-zinc-350 hover:shadow-2xs transition-all cursor-pointer"
                    >
                      <div className="space-y-1 w-full">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-xs text-zinc-900 line-clamp-1">{item.name}</span>
                          <span className="font-mono text-xs font-bold text-[#9C7E46]">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                      <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-zinc-500 border border-zinc-200">
                        {item.category}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Formulario de Comanda y Configuración */}
            <form onSubmit={handleOpenComanda} className="w-full md:w-[360px] p-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto bg-zinc-50/40 border-l border-zinc-200">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-bold text-zinc-900 text-lg">Servicio</h3>
                  <button 
                    type="button" 
                    onClick={() => setIsOpeningModal(false)}
                    className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mesero */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-zinc-500 block">Mesero Asignado</label>
                    {currentUser?.role === 'Mesero' && (
                      <span className="text-[9px] text-[#9C7E46] font-mono font-bold uppercase bg-[#9C7E46]/10 px-1.5 py-0.5 rounded border border-[#9C7E46]/20">
                        Mesero Fijo
                      </span>
                    )}
                  </div>
                  <select
                    value={selectedWaiterId}
                    onChange={(e) => setSelectedWaiterId(e.target.value)}
                    required
                    disabled={currentUser?.role === 'Mesero'}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden bg-white text-zinc-800 disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    {waiters.map(w => (
                      <option key={w.id} value={w.id} className="bg-white text-zinc-800">{w.name}</option>
                    ))}
                    {waiters.length === 0 && (
                      <option value="" className="bg-white text-zinc-800">No hay meseros activos</option>
                    )}
                  </select>
                </div>

                {/* Chef */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 block">Chef Encargado</label>
                  <select
                    value={selectedChefId}
                    onChange={(e) => setSelectedChefId(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden bg-white text-zinc-800"
                  >
                    {chefs.map(c => (
                      <option key={c.id} value={c.id} className="bg-white text-zinc-800">{c.name}</option>
                    ))}
                    {chefs.length === 0 && (
                      <option value="" className="bg-white text-zinc-800">No hay chefs activos</option>
                    )}
                  </select>
                </div>

                {/* Cliente Opcional */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 block">Asociar Cliente (Opcional)</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden bg-white text-zinc-800"
                  >
                    <option value="" className="bg-white text-zinc-800">Consumidor General (Sin Registro)</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id} className="bg-white text-zinc-800">{c.name} ({c.points} pts)</option>
                    ))}
                  </select>
                </div>

                {/* Nombre de la Reserva / Mesa */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 block">Nombre de la Reserva / Cliente (Opcional)</label>
                  <input
                    type="text"
                    value={reservationName}
                    onChange={(e) => setReservationName(e.target.value)}
                    placeholder="Familia Pérez, Mesa VIP..."
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 bg-white text-zinc-805 placeholder-zinc-400"
                  />
                </div>

                {/* Resumen de Comanda a Abrir */}
                <div className="space-y-2 border-t border-zinc-200 pt-4 max-h-[180px] overflow-y-auto">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Pedido Actual</span>
                  
                  {cartItems.length === 0 ? (
                    <p className="text-[11px] text-zinc-450 italic">No has agregado platillos todavía. Haz clic en los platillos del catálogo.</p>
                  ) : (
                    cartItems.map((cItem, index) => (
                      <div key={index} className="space-y-1 bg-white p-2.5 rounded-lg border border-zinc-150 text-xs shadow-3xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-800 truncate max-w-[160px]">{cItem.name}</span>
                          <div className="flex items-center gap-1.5 text-zinc-800">
                            <button
                              type="button"
                              onClick={() => updateCartQty(cItem.menuItemId, cItem.quantity - 1)}
                              className="p-1 hover:bg-zinc-50 rounded text-zinc-500 hover:text-zinc-900 border border-zinc-200 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-[#9C7E46] px-1">{cItem.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(cItem.menuItemId, cItem.quantity + 1)}
                              className="p-1 hover:bg-zinc-50 rounded text-zinc-500 hover:text-zinc-900 border border-zinc-200 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={cItem.notes}
                          onChange={(e) => updateCartNotes(cItem.menuItemId, e.target.value)}
                          placeholder="Notas especiales (término, alérgenos...)"
                          className="w-full text-[10px] text-zinc-650 bg-zinc-50 placeholder-zinc-400 px-2 py-1 rounded border border-zinc-200"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Botón Guardar / Confirmar */}
              <div className="pt-4 border-t border-zinc-250 space-y-3 mt-4">
                <div className="flex justify-between font-bold text-xs text-zinc-700">
                  <span>Monto Estimado (+IVA):</span>
                  <span className="font-mono text-[#9C7E46]">${
                    (cartItems.reduce((acc, c) => acc + (c.price * c.quantity), 0) * 1.10).toFixed(2)
                  }</span>
                </div>
                <button
                  type="submit"
                  disabled={cartItems.length === 0}
                  className="w-full text-center bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                >
                  Abrir Comanda e Iniciar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

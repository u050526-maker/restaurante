import React, { useState } from 'react';
import { Plus, Minus, X, Coffee, User, ShoppingBag, PlusCircle, Search, Edit2 } from 'lucide-react';
import { Table, MenuItem, StaffMember, Customer, Order, OrderDetail, OrderStatus } from '../types';

interface MesasComandasProps {
  tables: Table[];
  menuItems: MenuItem[];
  staff: StaffMember[];
  customers: Customer[];
  activeOrders: Order[];
  onOpenTable: (tableId: string, meseroId: string, chefId: string, customerId?: string, items?: OrderDetail[]) => void;
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  onUpdateTableStatus: (tableId: string, status: Table['status']) => void;
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
  const [cartItems, setCartItems] = useState<OrderDetail[]>([]);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilter, setMenuFilter] = useState<'Todos' | 'Comidas' | 'Bebidas' | 'Postres' | 'Entradas'>('Todos');

  // Filter staff by roles
  const waiters = staff.filter(s => s.role === 'Mesero' && s.status === 'Activo');
  const chefs = staff.filter(s => s.role === 'Chef' && s.status === 'Activo');

  // Find active order for selected table (if any)
  const currentActiveOrder = selectedTable && selectedTable.currentOrderId 
    ? activeOrders.find(o => o.id === selectedTable.currentOrderId) 
    : null;

  const handleSelectTable = (table: Table) => {
    setSelectedTable(table);
    if (table.status === 'Libre') {
      setIsOpeningModal(true);
      // Reset opening wizard state
      const defaultWaiterId = (currentUser && currentUser.role === 'Mesero') ? currentUser.id : (waiters[0]?.id || '');
      setSelectedWaiterId(defaultWaiterId);
      setSelectedChefId(chefs[0]?.id || '');
      setSelectedCustomerId('');
      setCartItems([]);
    }
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
      cartItems
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
      <div className="pb-4 border-b border-[#2A2A2A]">
        <h1 className="text-2xl font-display font-semibold text-[#C5A059] tracking-tight">Servicio de Mesas & Comandas</h1>
        <p className="text-sm text-gray-400 mt-1">Monitorea el estado de las mesas, abre comandas y dale seguimiento a los pedidos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel izquierdo: Plano de las Mesas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#141414] p-6 rounded-xl border border-[#2A2A2A] shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white">Plano de Comedor</h3>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1F1F1F] border border-[#2A2A2A]"></span>Libre</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>Ocupada</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Buscando Cuenta</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="tables-grid">
              {tables.map(table => {
                const isSelected = selectedTable?.id === table.id;
                let bgClass = "bg-[#141414] hover:bg-[#1F1F1F]/40 border-[#2A2A2A] hover:border-gray-500 text-gray-300";
                let statusBadge = "bg-[#1F1F1F] text-gray-400 border-[#2A2A2A]";
                
                if (table.status === 'Ocupada') {
                  bgClass = "bg-[#1F1F1F] border-[#C5A059] hover:border-[#D5B069] text-white";
                  statusBadge = "bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/30";
                } else if (table.status === 'Buscando Cuenta') {
                  bgClass = "bg-[#1F1F1F] border-blue-505 border-blue-500 hover:border-blue-400 text-white";
                  statusBadge = "bg-blue-500/10 text-blue-300 border-blue-500/30";
                }

                if (isSelected) {
                  bgClass += " ring-2 ring-[#C5A059] ring-offset-2 ring-offset-[#0A0A0A]";
                }

                const tableOrder = activeOrders.find(o => o.tableId === table.id);

                return (
                  <button
                    key={table.id}
                    onClick={() => handleSelectTable(table)}
                    className={`p-5 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer ${bgClass}`}
                  >
                    <Coffee className={`w-8 h-8 ${
                      table.status === 'Ocupada' ? 'text-[#C5A059]' :
                      table.status === 'Buscando Cuenta' ? 'text-blue-400' : 'text-gray-600'
                    }`} />
                    <span className="text-base font-bold">Mesa {table.number}</span>
                    <span className="text-[11px] text-gray-500 font-medium">Capacidad: {table.capacity} paxs</span>
                    
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${statusBadge}`}>
                      {table.status}
                    </span>

                    {tableOrder && (
                      <span className="text-[11px] font-bold text-[#C5A059] bg-[#1F1F1F] px-2 py-0.5 rounded shadow-xs mt-1 border border-[#C5A059]/30">
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
            <div className="bg-[#141414] p-6 rounded-xl border border-[#2A2A2A] shadow-xs space-y-5" id="active-comanda-detail">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <div>
                  <h3 className="font-bold text-white text-base">Comanda Mesa {selectedTable.number}</h3>
                  <p className="text-[11px] text-gray-500">Orden ID: #{currentActiveOrder.id.substring(4, 9).toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setSelectedTable(null)}
                  className="p-1 hover:bg-[#1F1F1F] rounded text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Personal asignado */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#1F1F1F] p-3 rounded-lg border border-[#2A2A2A]">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-mono">Mesero</span>
                  <p className="font-semibold text-gray-200">
                    {staff.find(s => s.id === currentActiveOrder.meseroId)?.name || 'Sin Asignar'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase font-mono">Chef</span>
                  <p className="font-semibold text-gray-200">
                    {staff.find(s => s.id === currentActiveOrder.chefId)?.name || 'Sin Asignar'}
                  </p>
                </div>
              </div>

              {/* Loyalty Customer */}
              {currentActiveOrder.customerId && (
                <div className="flex items-center gap-2 text-xs bg-blue-955/20 text-blue-300 p-2.5 rounded-lg border border-blue-900/40">
                  <User className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] font-mono text-blue-400 uppercase block">Cliente Frecuente</span>
                    <span className="font-semibold">{customers.find(c => c.id === currentActiveOrder.customerId)?.name}</span>
                  </div>
                </div>
              )}

              {/* Lista de platillos */}
              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Artículos ({currentActiveOrder.items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                
                {currentActiveOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start gap-4 text-xs py-1.5 border-b border-[#2A2A2A]/40 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#C5A059] bg-[#C5A059]/15 px-1.5 py-0.5 rounded shrink-0 border border-[#C5A059]/20">{item.quantity}x</span>
                        <p className="font-semibold text-gray-200 truncate">{item.name}</p>
                      </div>
                      {item.notes && <p className="text-[11px] italic text-rose-450 pl-8 mt-0.5">"{item.notes}"</p>}
                    </div>
                    <span className="font-mono text-gray-300 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Control de estatus de la cocina */}
              <div className="space-y-2 pt-2 border-t border-[#2A2A2A]">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Estado del Servicio</span>
                
                <div className="grid grid-cols-4 gap-1 text-[10px] font-mono font-medium text-center">
                  {(['Pendiente', 'En Cocina', 'Listo', 'Entregado'] as OrderStatus[]).map((st) => {
                    const isCurrent = currentActiveOrder.status === st;
                    const isPast = ['Pendiente', 'En Cocina', 'Listo', 'Entregado'].indexOf(currentActiveOrder.status) >= ['Pendiente', 'En Cocina', 'Listo', 'Entregado'].indexOf(st);
                    
                    return (
                      <button
                        key={st}
                        onClick={() => onUpdateOrder(currentActiveOrder.id, { status: st })}
                        className={`py-1.5 rounded-md border text-center transition-all cursor-pointer ${
                          isCurrent ? 'bg-[#C5A059] text-black border-transparent shadow-xs font-bold' :
                          isPast ? 'bg-[#1F1F1F]/60 text-[#C5A059] border-[#C5A059]/20' :
                          'bg-[#141414] text-gray-600 border-[#2A2A2A]'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Totales */}
              <div className="pt-3 border-t border-[#2A2A2A] space-y-1.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-gray-200">${currentActiveOrder.subtotal.toFixed(2)}</span>
                </div>
                {currentActiveOrder.discount > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Descuento:</span>
                    <span className="font-mono">-${currentActiveOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Impuesto (10% IVA):</span>
                  <span className="font-mono text-gray-200">${currentActiveOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white font-bold pt-1.5 border-t border-[#2A2A2A]">
                  <span>Total:</span>
                  <span className="font-mono text-white text-[#C5A059]">${currentActiveOrder.total.toFixed(2)}</span>
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
                    className="w-full text-center bg-[#1F1F1F] hover:bg-[#2A2A2A]/80 text-white text-xs font-semibold py-2.5 rounded-lg border border-[#2A2A2A] transition-colors cursor-pointer"
                  >
                    Pedir Cuenta 🧾
                  </button>
                ) : (
                  <span className="text-xs bg-blue-955/20 border border-blue-900/40 text-blue-300 font-semibold py-2.5 rounded-lg text-center select-none block col-span-1">
                    Cuenta Solicitada
                  </span>
                )}
                
                <button
                  onClick={() => handleGoToCheckout(selectedTable.id)}
                  className="w-full text-center bg-[#C5A059] hover:bg-[#D5B069] text-black text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Ir a Cobrar $
                </button>
              </div>
            </div>
          ) : selectedTable && !isOpeningModal && !currentActiveOrder ? (
            <div className="bg-[#141414] p-6 rounded-xl border border-[#2A2A2A] shadow-xs text-center py-10 space-y-3">
              <p className="text-xs text-gray-400">Esta mesa no registra cuenta activa.</p>
              <button 
                onClick={() => setIsOpeningModal(true)}
                className="bg-[#C5A059] hover:bg-[#D5B069] text-black px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
              >
                Abrir Comanda Ahora
              </button>
            </div>
          ) : (
            <div className="bg-[#141414] p-8 rounded-xl border border-[#2A2A2A] shadow-xs text-center text-gray-550 py-20 flex flex-col items-center justify-center gap-3">
              <ShoppingBag className="w-12 h-12 text-[#C5A059]/40" />
              <p className="text-sm font-medium text-gray-300">Selecciona una mesa en el plano</p>
              <p className="text-xs text-gray-500 max-w-[200px]">Haz clic en cualquier mesa disponible en el mapa para ver su comanda, preparar un ticket de venta, cambiar el chef o registrar pagos.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE APERTURA DE COMANDA */}
      {isOpeningModal && selectedTable && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-[#0D0D0D] rounded-xl shadow-2xl border border-[#2A2A2A] max-w-4xl w-full flex flex-col md:flex-row max-h-[90vh] overflow-hidden" id="billing-modal-wizard">
            {/* Sección de Selección de Artículos */}
            <div className="flex-1 p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-[#2A2A2A] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
                <h3 className="font-bold text-white text-lg">Menú • Mesa {selectedTable.number}</h3>
                <span className="text-xs text-gray-500">Sección comida rápida, tragos y postres</span>
              </div>

              {/* Buscador de Menú y Categorías */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Buscar platillo o bebida..."
                    className="w-full text-xs pl-9 pr-4 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white"
                  />
                </div>
                <div className="flex border border-[#2A2A2A] rounded-lg overflow-hidden shrink-0 text-xs">
                  {['Todos', 'Comidas', 'Bebidas', 'Postres', 'Entradas'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMenuFilter(cat as any)}
                      className={`px-3 py-1.5 font-medium border-r border-[#2A2A2A] last:border-0 hover:bg-[#2A2A2A] transition-colors cursor-pointer ${
                        menuFilter === cat ? 'bg-[#C5A059] text-black hover:bg-[#C5A059]' : 'bg-[#1F1F1F] text-gray-400'
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
                  <p className="text-xs text-gray-500 text-center py-10 col-span-2">No se encontraron artículos con estos criterios.</p>
                ) : (
                  filteredMenuItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => addToCart(item)}
                      className="p-3 bg-[#1F1F1F]/30 border border-[#2A2A2A] hover:border-[#C5A059]/40 hover:bg-[#1F1F1F] rounded-xl text-left flex flex-col justify-between h-24 hover:shadow-xs transition-colors cursor-pointer"
                    >
                      <div className="space-y-1 w-full">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-xs text-white line-clamp-1">{item.name}</span>
                          <span className="font-mono text-xs font-bold text-[#C5A059]">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#141414] text-gray-400 border border-[#2A2A2A] font-medium">
                        {item.category}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Formulario de Comanda y Configuración */}
            <form onSubmit={handleOpenComanda} className="w-full md:w-[360px] p-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto bg-[#141414] border-l border-[#2A2A2A]">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-bold text-white text-base">Configurar Orden</h3>
                  <button 
                    type="button" 
                    onClick={() => setIsOpeningModal(false)}
                    className="p-1 hover:bg-[#1F1F1F] rounded text-gray-555 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mesero */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-400 block">Personal: Mesero de Servicio</label>
                    {currentUser?.role === 'Mesero' && (
                      <span className="text-[10px] text-[#C5A059] font-mono font-bold uppercase bg-[#C5A059]/15 px-1.5 py-0.5 rounded border border-[#C5A059]/20">
                        Identidad fija
                      </span>
                    )}
                  </div>
                  <select
                    value={selectedWaiterId}
                    onChange={(e) => setSelectedWaiterId(e.target.value)}
                    required
                    disabled={currentUser?.role === 'Mesero'}
                    className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden bg-[#1F1F1F] text-white disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    {waiters.map(w => (
                      <option key={w.id} value={w.id} className="bg-[#141414] text-white">{w.name}</option>
                    ))}
                    {waiters.length === 0 && (
                      <option value="" className="bg-[#141414] text-white">No hay meseros activos</option>
                    )}
                  </select>
                </div>

                {/* Chef */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 block">Personal: Chef Preparador</label>
                  <select
                    value={selectedChefId}
                    onChange={(e) => setSelectedChefId(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden bg-[#1F1F1F] text-white"
                  >
                    {chefs.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#141414] text-white">{c.name}</option>
                    ))}
                    {chefs.length === 0 && (
                      <option value="" className="bg-[#141414] text-white">No hay chefs activos</option>
                    )}
                  </select>
                </div>

                {/* Cliente Opcional */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 block">Asociar Cliente (Opcional)</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden bg-[#1F1F1F] text-white"
                  >
                    <option value="" className="bg-[#141414] text-white">Consumidor Final (Sin Afiliación)</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#141414] text-white">{c.name} ({c.points} pts)</option>
                    ))}
                  </select>
                </div>

                {/* Resumen de Comanda a Abrir */}
                <div className="space-y-2 border-t border-[#2A2A2A] pt-4 max-h-[180px] overflow-y-auto">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Pedido Actual</span>
                  
                  {cartItems.length === 0 ? (
                    <p className="text-[11px] text-gray-500 italic">No has agregado platillos todavía. Selecciona en la cuadrícula de menú izquierda.</p>
                  ) : (
                    cartItems.map((cItem, index) => (
                      <div key={index} className="space-y-1 bg-[#1F1F1F] p-2.5 rounded-lg border border-[#2A2A2A] text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-200 truncate max-w-[160px]">{cItem.name}</span>
                          <div className="flex items-center gap-2 text-white">
                            <button
                              type="button"
                              onClick={() => updateCartQty(cItem.menuItemId, cItem.quantity - 1)}
                              className="p-0.5 hover:bg-[#2A2A2A] rounded text-gray-400 hover:text-white cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-bold text-[#C5A059]">{cItem.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(cItem.menuItemId, cItem.quantity + 1)}
                              className="p-0.5 hover:bg-[#2A2A2A] rounded text-gray-400 hover:text-white cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={cItem.notes}
                          onChange={(e) => updateCartNotes(cItem.menuItemId, e.target.value)}
                          placeholder="Notas (p. ej. sin cebolla...)"
                          className="w-full text-[10px] text-rose-450 bg-[#0D0D0D] placeholder-gray-600 px-1.5 py-0.5 rounded border border-[#2A2A2A]/40"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Botón Guardar / Confirmar */}
              <div className="pt-4 border-t border-[#2A2A2A] space-y-3 mt-4">
                <div className="flex justify-between font-bold text-xs text-gray-300">
                  <span>Monto Total Estimado:</span>
                  <span className="font-mono text-[#C5A059]">${
                    (cartItems.reduce((acc, c) => acc + (c.price * c.quantity), 0) * 1.10).toFixed(2)
                  }</span>
                </div>
                <button
                  type="submit"
                  disabled={cartItems.length === 0}
                  className="w-full text-center bg-[#C5A059] hover:bg-[#D5B069] text-black text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

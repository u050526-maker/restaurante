import React from 'react';
import { TrendingUp, Users, Coffee, AlertTriangle, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Order, Sale, InventoryItem, Table, StaffMember } from '../types';

interface DashboardProps {
  sales: Sale[];
  orders: Order[];
  inventory: InventoryItem[];
  tables: Table[];
  staff: StaffMember[];
  setActiveTab: (tab: string) => void;
  onRestock: (itemId: string, amount: number) => void;
}

export default function Dashboard({
  sales,
  orders,
  inventory,
  tables,
  staff,
  setActiveTab,
  onRestock
}: DashboardProps) {
  // Calculando KPIs
  const todayUnixStr = new Date().toISOString().split('T')[0];
  const totalSalesToday = sales
    .filter(s => s.date.startsWith(todayUnixStr))
    .reduce((sum, s) => sum + s.total, 0);

  const activeTablesCount = tables.filter(t => t.status !== 'Libre').length;
  
  const lowStockItems = inventory.filter(i => i.quantity <= i.minLimit);
  
  const activeStaffCount = staff.filter(s => s.status === 'Activo').length;

  // Recent sales
  const recentSales = [...sales]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Active orders with Pending / In Kitchen states
  const activeOrders = orders
    .filter(o => o.status !== 'Pagado' && o.status !== 'Cancelado')
    .slice(0, 4);

  // Calcular ventas de los últimos 5 días para un gráfico SVG
  const getLastDaysSales = () => {
    const days = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const sum = sales
        .filter(s => s.date.split('T')[0] === dayStr)
        .reduce((total, s) => total + s.total, 0);
      
      const parts = dayStr.split('-');
      const label = `${parts[2]}/${parts[1]}`;
      days.push({ label, amount: sum });
    }
    return days;
  };

  const chartData = getLastDaysSales();
  const maxAmount = Math.max(...chartData.map(d => d.amount), 100);

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 tracking-tight">Panel Principal</h1>
          <p className="text-xs text-zinc-500 mt-1">Sabor & Gestión • Gestión integral y monitorización de operaciones.</p>
        </div>
        <div className="flex items-center text-xs font-mono text-zinc-600 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-2xs">
          <Clock className="w-3.5 h-3.5 mr-1.5 text-[#9C7E46]" />
          <span>Hora Local: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="metrics-grid">
        {/* Ventas Hoy */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex items-center justify-between hover:border-zinc-300 transition-colors" id="m-sales-today">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block font-sans">Ventas de Hoy</span>
            <span className="text-2xl font-semibold text-zinc-900 tracking-tight">${totalSalesToday.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-1">↗ {sales.filter(s => s.date.startsWith(todayUnixStr)).length} transacciones</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-650 rounded-lg border border-emerald-100">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Mesas Activas */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex items-center justify-between hover:border-zinc-300 transition-colors" id="m-active-tables">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block font-sans">Mesas Ocupadas</span>
            <span className="text-2xl font-semibold text-zinc-900 tracking-tight">{activeTablesCount} <span className="text-sm text-zinc-400 font-normal">/ {tables.length}</span></span>
            <button 
              onClick={() => setActiveTab('mesas')}
              className="text-[10px] text-[#9C7E46] hover:text-[#B4965C] font-semibold hover:underline block mt-1 cursor-pointer"
            >
              Comedor activo →
            </button>
          </div>
          <div className="p-3 bg-zinc-50 text-[#9C7E46] rounded-lg border border-zinc-200">
            <Coffee className="w-5 h-5" />
          </div>
        </div>

        {/* Stock Crítico */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex items-center justify-between hover:border-zinc-300 transition-colors" id="m-low-stock">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block font-sans">Alertas de Stock</span>
            <span className={`text-2xl font-semibold tracking-tight ${lowStockItems.length > 0 ? 'text-rose-600' : 'text-zinc-900'}`}>{lowStockItems.length}</span>
            <span className="text-[10px] text-zinc-400 block mt-1">Insumos en desabasto</span>
          </div>
          <div className={`p-3 rounded-lg border ${lowStockItems.length > 0 ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' : 'bg-zinc-50 text-zinc-400 border-zinc-200'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Personal */}
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex items-center justify-between hover:border-zinc-300 transition-colors" id="m-active-staff">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block font-sans">Personal Activo</span>
            <span className="text-2xl font-semibold text-zinc-900 tracking-tight">{activeStaffCount} <span className="text-sm text-zinc-400 font-normal">en turno</span></span>
            <button 
              onClick={() => setActiveTab('personal')}
              className="text-[10px] text-sky-600 hover:text-sky-500 font-semibold hover:underline block mt-1 cursor-pointer"
            >
              Ver plantilla →
            </button>
          </div>
          <div className="p-3 bg-sky-50 text-sky-650 rounded-lg border border-sky-100">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Gráfico y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Ventas Recientes */}
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Tendencia de Ingresos</h3>
              <p className="text-xs text-zinc-500 mt-0.5 font-sans">Últimos 5 días activos en administración.</p>
            </div>
            <span className="text-xs font-mono bg-zinc-100 text-zinc-700 border border-zinc-200 px-2.5 py-0.5 rounded">Diario</span>
          </div>

          <div className="h-60 flex items-end justify-between px-2 pt-4 relative">
            {/* Grid background lines */}
            <div className="absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-dashed border-zinc-100"></div>
              <div className="w-full border-t border-dashed border-zinc-100"></div>
              <div className="w-full border-t border-dashed border-zinc-100"></div>
            </div>

            {chartData.map((d, idx) => {
              const heightPct = Math.min((d.amount / maxAmount) * 100, 100);
              return (
                <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group relative z-10 px-2">
                  <div className="text-[10px] font-mono font-bold text-white mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-[-10px] bg-zinc-900 text-white px-2 py-0.5 rounded-lg shadow-sm">
                    ${d.amount.toFixed(2)}
                  </div>
                  <div 
                    style={{ height: `${heightPct || 4}%` }} 
                    className={`w-full max-w-[32px] rounded-t-md transition-all duration-300 ${heightPct > 0 ? 'bg-[#9C7E46] group-hover:bg-[#B4965C]' : 'bg-zinc-100'}`}
                  ></div>
                  <span className="text-xs font-mono text-zinc-550 mt-3">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alertas de Stock Bajo (Límite Crítico) */}
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-900 font-sans">Estatus del Inventario</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Insumos críticos que requieren reabastecimiento.</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[220px] space-y-2.5 pr-1">
            {lowStockItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-6">
                <CheckCircle className="w-10 h-10 text-[#9C7E46] mb-2 text-opacity-80" />
                <p className="text-xs font-semibold text-zinc-800">¡Insumos completos!</p>
                <p className="text-[11px] text-zinc-500 px-4 mt-0.5">No hay productos por debajo de la reserva mínima.</p>
              </div>
            ) : (
              lowStockItems.map(item => (
                <div key={item.id} className="p-3 bg-rose-50/50 rounded-lg border border-rose-100 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="font-semibold text-zinc-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-zinc-500 font-sans">
                      Actual: <span className="font-semibold text-rose-600">{item.quantity} {item.unit}</span> (Reserva: {item.minLimit} {item.unit})
                    </p>
                  </div>
                  <button
                    onClick={() => onRestock(item.id, 10)}
                    className="shrink-0 bg-white hover:bg-rose-100 text-rose-700 border border-rose-200 px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    +10 {item.unit}
                  </button>
                </div>
              ))
            )}
          </div>
          
          <button 
            onClick={() => setActiveTab('inventario')}
            className="w-full text-center mt-4 text-xs font-semibold text-[#9C7E46] hover:text-[#B4965C] py-2 border-t border-zinc-100 cursor-pointer"
          >
            Configurar Inventario →
          </button>
        </div>
      </div>

      {/* Mesas Compras y Comandas en Proceso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comandas Activas */}
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Comandas en Proceso</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Servicios y órdenes activas en comedor.</p>
            </div>
            <button 
              onClick={() => setActiveTab('mesas')}
              className="text-xs text-[#9C7E46] hover:text-[#B4965C] font-semibold hover:underline cursor-pointer"
            >
              Comandas Activas
            </button>
          </div>

          <div className="space-y-3">
            {activeOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400">
                No hay comandas activas en este momento. Todas las mesas están libres.
              </div>
            ) : (
              activeOrders.map(order => (
                <div key={order.id} className="p-3.5 bg-zinc-50/50 hover:bg-zinc-100/40 border border-zinc-200 rounded-lg flex items-center justify-between gap-4 transition-all">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900">Mesa {order.tableNumber}</span>
                      <span className={`text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded font-bold border ${
                        order.status === 'Pendiente' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        order.status === 'En Cocina' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate max-w-[240px]">
                      {order.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-zinc-900">${order.total.toFixed(2)}</p>
                    <p className="text-[10px] font-mono text-zinc-500">
                      {new Date(order.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimos Cobros / Ventas */}
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Historial Reciente de Caja</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Últimos cobros del personal en caja central.</p>
            </div>
            <button 
              onClick={() => setActiveTab('ventas')}
              className="text-xs text-[#9C7E46] hover:text-[#B4965C] font-semibold hover:underline cursor-pointer"
            >
              Ver Auditoría de Caja
            </button>
          </div>

          <div className="space-y-3">
            {recentSales.map(sale => (
              <div key={sale.id} className="p-3.5 border-b border-zinc-100 last:border-0 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-zinc-900">Mesa {sale.tableNumber} • Transacción liquidada</p>
                  <p className="text-[10px] font-mono text-zinc-500">
                    {new Date(sale.date).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-50 text-zinc-650 border border-zinc-200 font-medium">
                    {sale.paymentMethod}
                  </span>
                  <p className="font-bold text-emerald-700">${sale.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

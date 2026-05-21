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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#2A2A2A] gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[#C5A059] tracking-tight">Panel Principal</h1>
          <p className="text-sm text-gray-400 mt-1">Estelar Restaurant • Vista general del estado de tu restaurante.</p>
        </div>
        <div className="flex items-center text-xs font-mono text-gray-400 bg-[#141414] px-3 py-1.5 rounded-lg border border-[#2A2A2A] shadow-xs">
          <Clock className="w-3.5 h-3.5 mr-1.5 text-[#C5A059]" />
          <span>Hora Local: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="metrics-grid">
        {/* Ventas Hoy */}
        <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center justify-between hover:border-[#C5A059]/40 transition-colors" id="m-sales-today">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Ventas de Hoy</span>
            <span className="text-2xl font-semibold text-white tracking-tight">${totalSalesToday.toFixed(2)}</span>
            <span className="text-xs text-emerald-405 font-medium block mt-1">↗ {sales.filter(s => s.date.startsWith(todayUnixStr)).length} transacciones</span>
          </div>
          <div className="p-3 bg-emerald-950/30 text-emerald-400 rounded-lg border border-emerald-950">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Mesas Activas */}
        <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center justify-between hover:border-[#C5A059]/40 transition-colors" id="m-active-tables">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Mesas Ocupadas</span>
            <span className="text-2xl font-semibold text-white tracking-tight">{activeTablesCount} <span className="text-sm text-gray-400 font-normal">/ {tables.length}</span></span>
            <button 
              onClick={() => setActiveTab('mesas')}
              className="text-xs text-[#C5A059] hover:text-[#D5B069] font-semibold hover:underline block mt-1 cursor-pointer"
            >
              Ver servicio de comedor →
            </button>
          </div>
          <div className="p-3 bg-amber-950/30 text-[#C5A059] rounded-lg border border-amber-950">
            <Coffee className="w-6 h-6" />
          </div>
        </div>

        {/* Stock Crítico */}
        <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center justify-between hover:border-[#C5A059]/40 transition-colors" id="m-low-stock">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Alertas de Stock</span>
            <span className={`text-2xl font-semibold tracking-tight ${lowStockItems.length > 0 ? 'text-rose-455' : 'text-white'}`}>{lowStockItems.length}</span>
            <span className="text-xs text-gray-400 block mt-1">Con stock bajo o límite</span>
          </div>
          <div className={`p-3 rounded-lg border ${lowStockItems.length > 0 ? 'bg-rose-955/30 text-rose-400 border-rose-950 animate-pulse' : 'bg-[#1F1F1F] text-gray-500 border-transparent'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Personal */}
        <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center justify-between hover:border-[#C5A059]/40 transition-colors" id="m-active-staff">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Personal Activo</span>
            <span className="text-2xl font-semibold text-white tracking-tight">{activeStaffCount} <span className="text-sm text-gray-400 font-normal">en turno</span></span>
            <button 
              onClick={() => setActiveTab('personal')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold hover:underline block mt-1 cursor-pointer"
            >
              Configurar cuadrilla →
            </button>
          </div>
          <div className="p-3 bg-blue-955/30 text-blue-400 rounded-lg border border-blue-950">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Gráfico y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Ventas Recientes */}
        <div className="bg-[#141414] p-6 rounded-xl border border-[#2A2A2A] shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Tendencia de Ingresos</h3>
              <p className="text-xs text-gray-400 mt-0.5">Últimos 5 días activos en caja.</p>
            </div>
            <span className="text-xs font-mono bg-[#1F1F1F] text-[#C5A059] border border-[#C5A059]/20 px-2.5 py-0.5 rounded">Diario</span>
          </div>

          <div className="h-60 flex items-end justify-between px-2 pt-4 relative">
            {/* Grid background lines */}
            <div className="absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-dashed border-[#2A2A2A]"></div>
              <div className="w-full border-t border-dashed border-[#2A2A2A]"></div>
              <div className="w-full border-t border-dashed border-[#2A2A2A]"></div>
            </div>

            {chartData.map((d, idx) => {
              const heightPct = Math.min((d.amount / maxAmount) * 100, 100);
              return (
                <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group relative z-10 px-2">
                  <div className="text-[10px] font-mono font-medium text-[#C5A059] mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-[-10px] bg-[#1F1F1F] border border-[#C5A059]/30 text-white px-1.5 py-0.5 rounded shadow">
                    ${d.amount.toFixed(2)}
                  </div>
                  <div 
                    style={{ height: `${heightPct || 4}%` }} 
                    className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${heightPct > 0 ? 'bg-[#C5A059] group-hover:bg-[#D5B069]' : 'bg-[#1F1F1F]'}`}
                  ></div>
                  <span className="text-xs font-mono text-gray-500 mt-3">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alertas de Stock Bajo (Límite Crítico) */}
        <div className="bg-[#141414] p-6 rounded-xl border border-[#2A2A2A] shadow-xs flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Notificaciones de Inventario</h3>
            <p className="text-xs text-gray-450 mt-0.5">Insumos críticos que requieren reabastecimiento.</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[220px] space-y-3 pr-1">
            {lowStockItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-6">
                <CheckCircle className="w-10 h-10 text-[#C5A059] mb-2" />
                <p className="text-xs font-medium text-gray-200">¡Todo en Orden!</p>
                <p className="text-[11px] text-gray-500 px-4 mt-0.5">No hay productos por debajo del límite mínimo establecido.</p>
              </div>
            ) : (
              lowStockItems.map(item => (
                <div key={item.id} className="p-3 bg-rose-950/20 rounded-lg border border-rose-900/40 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="font-semibold text-gray-200 truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-400">
                      Actual: <span className="font-semibold text-rose-400">{item.quantity} {item.unit}</span> (Min: {item.minLimit} {item.unit})
                    </p>
                  </div>
                  <button
                    onClick={() => onRestock(item.id, 10)}
                    className="shrink-0 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-rose-400 border border-rose-900/50 px-2 py-1 rounded font-semibold transition-colors cursor-pointer"
                  >
                    +10 {item.unit}
                  </button>
                </div>
              ))
            )}
          </div>
          
          <button 
            onClick={() => setActiveTab('inventario')}
            className="w-full text-center mt-4 text-xs font-semibold text-[#C5A059] hover:text-[#D5B069] py-2 border-t border-[#2A2A2A] cursor-pointer"
          >
            Ir a Inventario Completo →
          </button>
        </div>
      </div>

      {/* Mesas Compras y Comandas en Proceso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comandas Activas */}
        <div className="bg-[#141414] p-6 rounded-xl border border-[#2A2A2A] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Comandas en Proceso</h3>
              <p className="text-xs text-gray-450 mt-0.5">Preparación o servicio activo en vivo.</p>
            </div>
            <button 
              onClick={() => setActiveTab('mesas')}
              className="text-xs text-[#C5A059] hover:text-[#D5B069] font-semibold hover:underline cursor-pointer"
            >
              Nueva Comanda
            </button>
          </div>

          <div className="space-y-3">
            {activeOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500">
                No hay comandas activas en este momento. Todas las mesas están libres.
              </div>
            ) : (
              activeOrders.map(order => (
                <div key={order.id} className="p-3.5 bg-[#1F1F1F]/40 hover:bg-[#1F1F1F] border border-[#2A2A2A]/80 rounded-lg flex items-center justify-between gap-4 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Mesa {order.tableNumber}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium border border-opacity-30 ${
                        order.status === 'Pendiente' ? 'bg-amber-955/30 text-amber-400 border-amber-900/30' :
                        order.status === 'En Cocina' ? 'bg-blue-955/30 text-blue-400 border-blue-900/30' :
                        'bg-emerald-955/30 text-emerald-400 border-emerald-900/30'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate max-w-[240px]">
                      {order.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-[#C5A059]">${order.total.toFixed(2)}</p>
                    <p className="text-[10px] font-mono text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimos Cobros / Ventas */}
        <div className="bg-[#141414] p-6 rounded-xl border border-[#2A2A2A] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Últimos Pagos Registrados</h3>
              <p className="text-xs text-gray-450 mt-0.5">Historial reciente de cobros procesados.</p>
            </div>
            <button 
              onClick={() => setActiveTab('ventas')}
              className="text-xs text-[#C5A059] hover:text-[#D5B069] font-semibold hover:underline cursor-pointer"
            >
              Ver todas las ventas
            </button>
          </div>

          <div className="space-y-3">
            {recentSales.map(sale => (
              <div key={sale.id} className="p-3.5 border-b border-[#2A2A2A]/60 last:border-0 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-gray-200">Mesa {sale.tableNumber} • Venta cerrada</p>
                  <p className="text-[10px] font-mono text-gray-500">
                    {new Date(sale.date).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1F1F1F] text-gray-300 border border-[#2A2A2A] font-medium border-opacity-30">
                    {sale.paymentMethod}
                  </span>
                  <p className="font-bold text-emerald-400">${sale.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

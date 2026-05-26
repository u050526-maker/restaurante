import React, { useState } from 'react';
import { Search, DollarSign, PieChart, TrendingUp } from 'lucide-react';
import { Sale } from '../types';

interface VentasProps {
  sales: Sale[];
  onClearHistory?: () => void;
}

export default function Ventas({
  sales,
  onClearHistory
}: VentasProps) {
  const [paymentFilter, setPaymentFilter] = useState<'Todos' | 'Efectivo' | 'Tarjeta' | 'Transferencia'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Sorter / Filter criteria
  const filteredSales = sales.filter(s => {
    const matchesFilter = paymentFilter === 'Todos' || s.paymentMethod === paymentFilter;
    const matchesSearch = s.tableNumber.toString().includes(searchQuery) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // KPI Calculations
  const totalIncome = filteredSales.reduce((acc, s) => acc + s.total, 0);
  const totalCount = filteredSales.length;
  const averageTicket = totalCount > 0 ? (totalIncome / totalCount) : 0;

  // Calculo de canales de pago
  const cashSales = sales.filter(s => s.paymentMethod === 'Efectivo').reduce((acc, s) => acc + s.total, 0);
  const cardSales = sales.filter(s => s.paymentMethod === 'Tarjeta').reduce((acc, s) => acc + s.total, 0);
  const transferSales = sales.filter(s => s.paymentMethod === 'Transferencia').reduce((acc, s) => acc + s.total, 0);
  const grandTotalAll = sales.reduce((acc, s) => acc + s.total, 0);

  // Percentages with fallback
  const cashPct = grandTotalAll > 0 ? (cashSales / grandTotalAll) * 100 : 0;
  const cardPct = grandTotalAll > 0 ? (cardSales / grandTotalAll) * 100 : 0;
  const transferPct = grandTotalAll > 0 ? (transferSales / grandTotalAll) * 100 : 0;

  return (
    <div className="space-y-6" id="ventas-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 tracking-tight font-sans">Registro de Ventas e Ingresos</h1>
          <p className="text-xs text-zinc-500 mt-1">Sabor & Gestión • Historial de transacciones de facturas cerradas y distribución de caja.</p>
        </div>
        {onClearHistory && sales.length > 0 && (
          <button
            onClick={() => {
              if (confirm('¿Seguro de que deseas limpiar todo el histórico de ventas? Esta acción es irreversible.')) {
                onClearHistory();
              }
            }}
            className="text-rose-600 hover:bg-rose-50 border border-rose-220 hover:border-rose-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Limpiar Historial de Caja
          </button>
        )}
      </div>

      {/* Grid de Metricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block tracking-wider">Monto Recaudado</span>
            <span className="text-2xl font-black text-zinc-900 font-mono">${totalIncome.toFixed(2)}</span>
            <p className="text-[10px] text-zinc-400">Total en base a filtros activos</p>
          </div>
          <div className="p-3 bg-zinc-50 text-zinc-700 rounded-lg border border-zinc-150">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block tracking-wider">Transacciones</span>
            <span className="text-2xl font-black text-zinc-900 font-mono">{totalCount} u</span>
            <p className="text-[10px] text-zinc-400">Tickets cerrados con factura de pago</p>
          </div>
          <div className="p-3 bg-zinc-50 text-zinc-700 rounded-lg border border-zinc-150">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block tracking-wider">Ticket Promedio</span>
            <span className="text-2xl font-black text-zinc-900 font-mono">${averageTicket.toFixed(2)}</span>
            <p className="text-[10px] text-zinc-400">Uso medio monetario por mesa comensal</p>
          </div>
          <div className="p-3 bg-zinc-50 text-zinc-700 rounded-lg border border-zinc-150">
            <PieChart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Distribucion de Métodos de Pago */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2 select-none">
          <h3 className="font-semibold text-sm text-zinc-905">Distribución de Canales</h3>
          <p className="text-xs text-zinc-400">Distribución porcentual por método de pago.</p>
          
          <div className="pt-3 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-bold text-zinc-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Efectivo</span>
              <span className="font-mono text-zinc-800 font-bold">${cashSales.toFixed(2)} ({cashPct.toFixed(0)}%)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-bold text-zinc-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Tarjeta</span>
              <span className="font-mono text-zinc-800 font-bold">${cardSales.toFixed(2)} ({cardPct.toFixed(0)}%)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-bold text-zinc-600"><span className="w-2.5 h-2.5 rounded-full bg-[#9C7E46]"></span>Transferencia</span>
              <span className="font-mono text-[#9C7E46] font-bold">${transferSales.toFixed(2)} ({transferPct.toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Canales Progreso visual bento boxes */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-4 select-none">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-zinc-500">
              <span>Efectivo</span>
              <span className="font-mono font-bold">{cashPct.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-100">
              <div style={{ width: `${cashPct || 0}%` }} className="bg-emerald-500 h-full rounded-full transition-all duration-500"></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-zinc-500">
              <span>Tarjeta</span>
              <span className="font-mono font-bold">{cardPct.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-100">
              <div style={{ width: `${cardPct || 0}%` }} className="bg-blue-500 h-full rounded-full transition-all duration-500"></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-zinc-500">
              <span>Transferencia</span>
              <span className="font-mono font-bold">{transferPct.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-100">
              <div style={{ width: `${transferPct || 0}%` }} className="bg-[#9C7E46] h-full rounded-full transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Filtros y Listado */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        {/* Barra de busqueda */}
        <div className="p-4 bg-zinc-50/60 border-b border-zinc-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por número de mesa o código de transacción..."
              className="w-full text-xs pl-9 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-400 bg-white text-zinc-909 placeholder-zinc-400"
            />
          </div>

          <div className="flex items-center gap-1 border border-zinc-200 rounded-lg overflow-hidden shrink-0 text-xs bg-zinc-100/60 p-0.5">
            {(['Todos', 'Efectivo', 'Tarjeta', 'Transferencia'] as any[]).map(met => (
              <button
                key={met}
                onClick={() => setPaymentFilter(met)}
                className={`px-3 py-1.5 font-bold rounded-md transition-all cursor-pointer ${
                  paymentFilter === met ? 'bg-zinc-900 text-white shadow-3xs' : 'text-zinc-500 hover:text-zinc-950'
                }`}
              >
                {met === 'Todos' ? 'Todos' : met}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Tabla */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full border-collapse text-left text-zinc-500">
            <thead className="bg-zinc-50 text-zinc-650 font-bold uppercase border-b border-zinc-200 select-none">
              <tr>
                <th className="p-4 font-mono">ID Transacción</th>
                <th className="p-4">Mesa</th>
                <th className="p-4">Fecha & Hora</th>
                <th className="p-4">Método de Pago</th>
                <th className="p-4 text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150">
              {filteredSales.length === 0 ? (
                <tr>
                   <td colSpan={5} className="p-8 text-center text-zinc-400">
                    No se registran ventas u operaciones bajo estas condiciones.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#9C7E46]">
                      #{sale.id.toUpperCase().replace('INV_', '')}
                    </td>
                    <td className="p-4 font-bold text-zinc-900">
                      Mesa {sale.tableNumber}
                    </td>
                    <td className="p-4 text-zinc-550">
                      {new Date(sale.date).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })} • {new Date(sale.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold border text-[10px] ${
                        sale.paymentMethod === 'Efectivo' ? 'bg-emerald-50 text-emerald-800 border-emerald-150' :
                        sale.paymentMethod === 'Tarjeta' ? 'bg-blue-50 text-blue-800 border-blue-150' :
                        'bg-[#9C7E46]/10 text-[#9C7E46] border-[#9C7E46]/15'
                      }`}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold font-mono text-[#9C7E46] text-sm">
                      ${sale.total.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

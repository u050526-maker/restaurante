import React, { useState } from 'react';
import { Search, DollarSign, PieChart, TrendingUp, Filter, Calendar, CreditCard, ChevronDown } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#2A2A2A] gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[#C5A059] tracking-tight">Registro de Ventas e Ingresos</h1>
          <p className="text-sm text-gray-400 mt-1">Consulta los registros contables de facturas cerradas, distribución de cobros y métricas financieras.</p>
        </div>
        {onClearHistory && sales.length > 0 && (
          <button
            onClick={() => {
              if (confirm('¿Seguro de que deseas limpiar todo el histórico de ventas? Esta acción es irreversible.')) {
                onClearHistory();
              }
            }}
            className="text-rose-400 hover:bg-[#1F1F1F] border border-rose-950/40 hover:border-rose-900/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer animate-pulse"
          >
            Limpiar Historial
          </button>
        )}
      </div>

      {/* Grid de Metricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase block tracking-wider">Monto Recaudado</span>
            <span className="text-2xl font-black text-white font-mono">${totalIncome.toFixed(2)}</span>
            <p className="text-[10px] text-gray-500">Basado en filtros aplicados</p>
          </div>
          <div className="p-3 bg-[#C5A059]/15 text-[#C5A059] rounded-lg border border-[#C5A059]/10">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase block tracking-wider">Transacciones</span>
            <span className="text-2xl font-black text-white font-mono">{totalCount} u</span>
            <p className="text-[10px] text-gray-500">Tickets cerrados con factura</p>
          </div>
          <div className="p-3 bg-purple-955/20 text-purple-400 rounded-lg border border-purple-900/10">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase block tracking-wider">Ticket Promedio</span>
            <span className="text-2xl font-black text-white font-mono">${averageTicket.toFixed(2)}</span>
            <p className="text-[10px] text-gray-500">Gasto medio por mesa cobrada</p>
          </div>
          <div className="p-3 bg-blue-955/20 text-blue-400 rounded-lg border border-blue-900/10">
            <PieChart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Distribucion de Métodos de Pago */}
      <div className="bg-[#141414] p-6 rounded-xl border border-[#2A2A2A] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <h3 className="font-semibold text-sm text-white">Distribución de Métodos de Pago</h3>
          <p className="text-xs text-gray-400">Mapeo de la preferencia de cobro histórico.</p>
          
          <div className="pt-3 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Efectivo</span>
              <span className="font-mono text-gray-300 font-bold">${cashSales.toFixed(2)} ({cashPct.toFixed(0)}%)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>Tarjeta</span>
              <span className="font-mono text-gray-300 font-bold">${cardSales.toFixed(2)} ({cardPct.toFixed(0)}%)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]"></span>Transferencia</span>
              <span className="font-mono text-gray-300 font-bold">${transferSales.toFixed(2)} ({transferPct.toFixed(0)}%)</span>
            </div>
          </div>
        </div>

        {/* Canales Progreso visual bento boxes */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              <span>Efectivo</span>
              <span>{cashPct.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-[#1F1F1F] rounded-full overflow-hidden">
              <div style={{ width: `${cashPct || 0}%` }} className="bg-emerald-500 h-full rounded-full transition-all duration-500"></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              <span>Tarjeta</span>
              <span>{cardPct.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-[#1F1F1F] rounded-full overflow-hidden">
              <div style={{ width: `${cardPct || 0}%` }} className="bg-blue-500 h-full rounded-full transition-all duration-500"></div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              <span>Transferencia</span>
              <span>{transferPct.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-[#1F1F1F] rounded-full overflow-hidden">
              <div style={{ width: `${transferPct || 0}%` }} className="bg-[#C5A059] h-full rounded-full transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Filtros y Listado */}
      <div className="bg-[#141414] rounded-xl border border-[#2A2A2A] shadow-xs overflow-hidden">
        {/* Barra de busqueda */}
        <div className="p-4 bg-[#1F1F1F]/40 border-b border-[#2A2A2A] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por número de mesa o ID de transacción..."
              className="w-full text-xs pl-9 pr-4 py-2 border border-[#2A2A2A]/80 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1 border border-[#2A2A2A] rounded-lg overflow-hidden shrink-0 text-xs shadow-xs bg-[#1F1F1F] p-0.5">
            {(['Todos', 'Efectivo', 'Tarjeta', 'Transferencia'] as any[]).map(met => (
              <button
                key={met}
                onClick={() => setPaymentFilter(met)}
                className={`px-3 py-1.5 font-semibold rounded-md transition-all cursor-pointer ${
                  paymentFilter === met ? 'bg-[#C5A059] text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {met === 'Todos' ? 'Todos' : met}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Tabla */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full border-collapse text-left text-gray-400">
            <thead className="bg-[#1F1F1F] text-gray-400 font-bold uppercase border-b border-[#2A2A2A]">
              <tr>
                <th className="p-4 font-mono select-none">ID Transacción</th>
                <th className="p-4 select-none">Mesa</th>
                <th className="p-4 select-none">Fecha & Hora</th>
                <th className="p-4 select-none">Método de Pago</th>
                <th className="p-4 text-right select-none">Monto Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/40">
              {filteredSales.length === 0 ? (
                <tr>
                   <td colSpan={5} className="p-8 text-center text-gray-550">
                    No se registran ventas para este filtro de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#1F1F1F]/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#C5A059]">
                      #{sale.id.toUpperCase().replace('INV_', '')}
                    </td>
                    <td className="p-4 font-bold text-white">
                      Mesa {sale.tableNumber}
                    </td>
                    <td className="p-4 text-gray-300">
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
                      <span className={`px-2 py-0.5 rounded-md font-semibold border text-[10px] ${
                        sale.paymentMethod === 'Efectivo' ? 'bg-emerald-955/20 text-emerald-400 border-emerald-900/40' :
                        sale.paymentMethod === 'Tarjeta' ? 'bg-blue-955/20 text-blue-300 border-blue-900/40' :
                        'bg-[#C5A059]/15 text-[#C5A564] border-[#C5A059]/35'
                      }`}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black font-mono text-white text-sm">
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

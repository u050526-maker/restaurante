import React, { useState } from 'react';
import { PlusCircle, Search, AlertTriangle, ClipboardList, RefreshCw, Trash2, ArrowUpRight } from 'lucide-react';
import { InventoryItem } from '../types';

interface InventarioProps {
  inventory: InventoryItem[];
  onAddInventoryItem: (item: InventoryItem) => void;
  onUpdateInventoryItem: (itemId: string, updates: Partial<InventoryItem>) => void;
  onDeleteInventoryItem: (itemId: string) => void;
}

export default function Inventario({
  inventory,
  onAddInventoryItem,
  onUpdateInventoryItem,
  onDeleteInventoryItem
}: InventarioProps) {
  const [activeCategory, setActiveCategory] = useState<'Todos' | InventoryItem['category']>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New item form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<InventoryItem['category']>('Ingredientes');
  const [newQuantity, setNewQuantity] = useState('');
  const [newMinLimit, setNewMinLimit] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newCostPrice, setNewCostPrice] = useState('');

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newQuantity || !newMinLimit || !newCostPrice) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const newItem: InventoryItem = {
      id: `inv_${Date.now()}`,
      name: newName,
      category: newCategory,
      quantity: Math.max(0, parseFloat(newQuantity)),
      minLimit: Math.max(0, parseFloat(newMinLimit)),
      unit: newUnit,
      costPrice: Math.max(0, parseFloat(newCostPrice))
    };

    onAddInventoryItem(newItem);
    setIsAddingNew(false);

    // Reset Form
    setNewName('');
    setNewCategory('Ingredientes');
    setNewQuantity('');
    setNewMinLimit('');
    setNewUnit('kg');
    setNewCostPrice('');
  };

  const handleQuickRestock = (id: string, currentQty: number, amount: number) => {
    onUpdateInventoryItem(id, { quantity: currentQty + amount });
  };

  // Filter logic
  const filteredInventory = inventory.filter(item => {
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesAlert = !showLowStockOnly || item.quantity <= item.minLimit;
    return matchesQuery && matchesCategory && matchesAlert;
  });

  // KPI math
  const totalAssetsValue = inventory.reduce((total, item) => total + (item.quantity * item.costPrice), 0);
  const criticalItemsCount = inventory.filter(i => i.quantity <= i.minLimit).length;

  return (
    <div className="space-y-6" id="inventario-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-905 tracking-tight">Inventario de Almacén</h1>
          <p className="text-xs text-zinc-500 mt-1">Sabor & Gestión • Gestión física de stock, coste unitario y compras de almacén y cocina.</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Nuevo Insumo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-zinc-50 text-zinc-700 rounded-lg border border-zinc-150">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Insumos Registrados</span>
            <span className="text-xl font-extrabold text-zinc-900 font-mono">{inventory.length} artículos</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-[#9C7E46]/10 text-[#9C7E46] rounded-lg border border-[#9C7E46]/15">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Valor Estimado Activo</span>
            <span className="text-xl font-extrabold text-[#9C7E46] font-mono">${totalAssetsValue.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex items-center gap-4">
          <div className={`p-3 rounded-lg border ${criticalItemsCount > 0 ? 'bg-rose-50 text-rose-600 border-rose-150 animate-pulse' : 'bg-zinc-50 text-zinc-400 border-zinc-150'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Existencias Críticas</span>
            <span className={`text-xl font-extrabold font-mono ${criticalItemsCount > 0 ? 'text-rose-650' : 'text-zinc-500'}`}>{criticalItemsCount} alertas</span>
          </div>
        </div>
      </div>

      {/* Area Filtros */}
      <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Categorias Tabs scrolling panel */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['Todos', 'Ingredientes', 'Bebidas', 'Carnes', 'Verduras', 'Abarrotes', 'Desechables'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-3 py-1.5 font-bold rounded-lg border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-zinc-900 text-white border-transparent shadow-xs'
                    : 'bg-white text-zinc-650 border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Low stock check */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-700 select-none">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-850 w-4 h-4"
            />
            <span className="text-rose-700 bg-rose-50 border border-rose-150 px-2 py-1.5 rounded transition-colors uppercase tracking-wider font-bold text-[10px]">Ver Solamente Stock Bajo ⚠️</span>
          </label>
        </div>

        {/* Buscador */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar insumo por nombre o categoría de almacén..."
            className="w-full text-xs pl-9 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-400 bg-zinc-50/40 text-zinc-900"
          />
        </div>
      </div>

      {/* Tabla del inventario */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-left text-zinc-500">
            <thead className="bg-zinc-50 text-zinc-600 font-bold uppercase border-b border-zinc-200 select-none">
              <tr>
                <th className="p-4">Insumo</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Stock Actual</th>
                <th className="p-4 text-center">Mínimo Alerta</th>
                <th className="p-4">Costo Compra</th>
                <th className="p-4">Monto Estimado</th>
                <th className="p-4 text-center">Acciones de Reabastecimiento</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-400">
                    No hay existencias de mercancías listadas bajo tales términos.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.quantity <= item.minLimit;
                  return (
                    <tr key={item.id} className={`transition-colors duration-150 ${isLow ? 'bg-rose-50/20 hover:bg-rose-50/40' : 'hover:bg-zinc-50/50'}`}>
                      <td className="p-4 font-bold text-zinc-900">
                        <div className="flex items-center gap-2">
                          <span>{item.name}</span>
                          {isLow && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-[9px] font-black text-rose-700 uppercase border border-rose-150 animate-pulse">Crítico</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-zinc-50 text-[10px] text-zinc-500 border border-zinc-200 font-mono">
                          {item.category}
                        </span>
                      </td>
                      <td className={`p-4 font-mono font-bold ${isLow ? 'text-rose-650' : 'text-zinc-800'}`}>
                        {item.quantity.toFixed(1)} <span className="text-[10px] text-zinc-400 font-normal">{item.unit}</span>
                      </td>
                      <td className="p-4 text-center font-bold text-zinc-500 font-mono">
                        {item.minLimit} {item.unit}
                      </td>
                      <td className="p-4 font-mono font-medium text-zinc-600">
                        ${item.costPrice.toFixed(2)}
                      </td>
                      <td className="p-4 font-mono font-bold text-zinc-905">
                        ${(item.quantity * item.costPrice).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleQuickRestock(item.id, item.quantity, 5)}
                            className="bg-white hover:bg-zinc-50 hover:text-[#9C7E46] text-zinc-700 border border-zinc-200 font-bold px-2.5 py-1 rounded-md transition-colors text-[10px] cursor-pointer shadow-3xs"
                          >
                            +5 {item.unit}
                          </button>
                          <button
                            onClick={() => handleQuickRestock(item.id, item.quantity, 25)}
                            className="bg-[#9C7E46]/10 hover:bg-[#9C7E46]/15 hover:text-[#9C7E46] text-[#9C7E46] font-bold px-2.5 py-1 rounded-md transition-colors text-[10px] cursor-pointer shadow-3xs border border-[#9C7E46]/20"
                          >
                            +25 {item.unit}
                          </button>
                          <button
                            onClick={() => {
                              const extra = parseFloat(prompt(`¿Cuánto vas a sumar para ${item.name}?`, '10') ?? '');
                              if (!isNaN(extra) && extra > 0) {
                                handleQuickRestock(item.id, item.quantity, extra);
                              }
                            }}
                            className="bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold px-2.5 py-1 rounded-md border border-zinc-205 transition-colors text-[10px] cursor-pointer shadow-3xs"
                          >
                            Añadir
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`¿Seguro que deseas eliminar ${item.name} del inventario?`)) {
                              onDeleteInventoryItem(item.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 rounded text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMULARIO VENTANA MODAL PARA AGREGAR NUEVO INSUMO */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-zinc-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
              <h3 className="font-bold text-zinc-900 text-base">Registrar Nuevo Item</h3>
              <button 
                type="button" 
                onClick={() => setIsAddingNew(false)}
                className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-800 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Nombre del Artículo *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Lomo de cerdo, Coca-Cola Lata, etc."
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-400 bg-white text-zinc-900 placeholder-zinc-400"
                />
              </div>

              {/* Categoría */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Categoría *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden bg-white text-zinc-800"
                >
                  <option value="Ingredientes" className="bg-white">Ingredientes</option>
                  <option value="Bebidas" className="bg-white">Bebidas</option>
                  <option value="Carnes" className="bg-white">Carnes</option>
                  <option value="Verduras" className="bg-white">Verduras</option>
                  <option value="Abarrotes" className="bg-white">Abarrotes</option>
                  <option value="Desechables" className="bg-white">Desechables</option>
                </select>
              </div>

              {/* Fila Cantidad, Limit, Unit */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500 block">Cant. Inicial *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="10"
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-400 bg-white text-zinc-900 placeholder-zinc-400 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500 block">Reserva Alerta *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newMinLimit}
                    onChange={(e) => setNewMinLimit(e.target.value)}
                    placeholder="3"
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-400 bg-white text-zinc-900 placeholder-zinc-400 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500 block">Unidad *</label>
                  <input
                    type="text"
                    required
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="kg, l, pz"
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-400 bg-white text-zinc-900 placeholder-zinc-400"
                  />
                </div>
              </div>

              {/* Costo Unitario */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Costo de Compra de Unidad ($) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newCostPrice}
                  onChange={(e) => setNewCostPrice(e.target.value)}
                  placeholder="Ej: 4.50"
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-400 bg-white text-zinc-900 placeholder-zinc-400 font-mono"
                />
              </div>

              {/* Botón Guardar */}
              <div className="pt-3 border-t border-zinc-150 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-lg hover:bg-zinc-200 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-bold uppercase tracking-wider cursor-pointer"
                >
                  Registrar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

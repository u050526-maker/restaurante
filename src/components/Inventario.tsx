import React, { useState } from 'react';
import { PlusCircle, Search, AlertTriangle, Filter, ClipboardList, RefreshCw, Trash2, ArrowUpRight } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#2A2A2A] gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[#C5A059] tracking-tight">Inventario de Almacén</h1>
          <p className="text-sm text-gray-400 mt-1">Controla las existencias, costos unitarios, materias primas y alertas de abastecimiento de cocina.</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-[#C5A059] hover:bg-[#D5B069] text-black px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Nuevo Insumo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-955/20 text-blue-400 rounded-lg border border-blue-900/10">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Insumos Registrados</span>
            <span className="text-xl font-bold text-white font-mono">{inventory.length} artículos</span>
          </div>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#C5A059]/15 text-[#C5A059] rounded-lg border border-[#C5A059]/10">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Valor Total de Activo</span>
            <span className="text-xl font-bold text-white font-mono">${totalAssetsValue.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs flex items-center gap-4">
          <div className={`p-3 rounded-lg ${criticalItemsCount > 0 ? 'bg-rose-955/20 text-rose-400 animate-pulse border border-rose-900/40' : 'bg-[#141414] text-gray-600 border border-[#2A2A2A]'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Existencia Crítica</span>
            <span className={`text-xl font-bold font-mono ${criticalItemsCount > 0 ? 'text-rose-450' : 'text-gray-400'}`}>{criticalItemsCount} alertas</span>
          </div>
        </div>
      </div>

      {/* Area Filtros */}
      <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Categorias Tabs scrolling panel */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['Todos', 'Ingredientes', 'Bebidas', 'Carnes', 'Verduras', 'Abarrotes', 'Desechables'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-3 py-1.5 font-semibold rounded-lg border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#C5A059] text-black border-transparent shadow-xs font-bold'
                    : 'bg-[#1F1F1F] text-gray-400 border-[#2A2A2A] hover:bg-[#2A2A2A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Low stock check */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-300 select-none">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="rounded border-[#2A2A2A] text-[#C5A059] focus:ring-[#C5A059] bg-[#1F1F1F] w-4 h-4"
            />
            <span className="text-rose-400 bg-rose-955/25 hover:bg-rose-955/35 border border-rose-900/40 px-2 py-1 rounded transition-colors">Stock Bajo Crítico ⚠️</span>
          </label>
        </div>

        {/* Buscador */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-550">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar insumo por nombre o categoría..."
            className="w-full text-xs pl-9 pr-4 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Tabla del inventario */}
      <div className="bg-[#141414] rounded-xl border border-[#2A2A2A] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-left text-gray-400">
            <thead className="bg-[#1F1F1F] text-gray-400 font-bold uppercase border-b border-[#2A2A2A]">
              <tr>
                <th className="p-4 select-none">Insumo</th>
                <th className="p-4 select-none">Categoría</th>
                <th className="p-4 select-none">Cantidad Actual</th>
                <th className="p-4 text-center select-none">Nivel Mínimo</th>
                <th className="p-4 select-none">Costo Unitario</th>
                <th className="p-4 select-none">Monto Estimado</th>
                <th className="p-4 text-center select-none">Acciones Rápidas de Abastecimiento</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/40">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-550">
                    No hay insumos registrados que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.quantity <= item.minLimit;
                  return (
                    <tr key={item.id} className={`transition-colors duration-150 ${isLow ? 'bg-rose-955/15 hover:bg-rose-955/25' : 'hover:bg-[#1F1F1F]/40'}`}>
                      <td className="p-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span>{item.name}</span>
                          {isLow && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-955 text-[9px] font-black text-rose-300 uppercase border border-rose-900/30 animate-pulse">Bajo</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-[#1F1F1F] text-[10px] text-gray-400 border border-[#2A2A2A]/40 font-mono">
                          {item.category}
                        </span>
                      </td>
                      <td className={`p-4 font-mono font-bold ${isLow ? 'text-rose-450' : 'text-gray-200'}`}>
                        {item.quantity.toFixed(1)} <span className="text-[10px] text-gray-500 font-normal">{item.unit}</span>
                      </td>
                      <td className="p-4 text-center font-semibold text-gray-300 font-mono">
                        {item.minLimit} {item.unit}
                      </td>
                      <td className="p-4 font-mono font-medium text-gray-300">
                        ${item.costPrice.toFixed(2)}
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        ${(item.quantity * item.costPrice).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleQuickRestock(item.id, item.quantity, 5)}
                            className="bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white hover:text-[#C5A059] border border-[#2A2A2A] hover:border-[#C5A059]/40 font-bold px-2.5 py-1 rounded transition-colors text-[10px] cursor-pointer"
                          >
                            +5 {item.unit}
                          </button>
                          <button
                            onClick={() => handleQuickRestock(item.id, item.quantity, 25)}
                            className="bg-[#C5A059]/15 hover:bg-[#C5A059]/30 text-[#C5A059] hover:text-white border border-[#C5A059]/20 font-bold px-2.5 py-1 rounded transition-colors text-[10px] cursor-pointer"
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
                            className="bg-[#141414] hover:bg-[#1F1F1F] text-gray-300 hover:text-white border border-[#2A2A2A] font-bold px-2.5 py-1 rounded transition-colors text-[10px] cursor-pointer"
                          >
                            Personalizado
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
                          className="p-1.5 hover:bg-rose-955/20 rounded text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-[#0D0D0D] rounded-xl shadow-2xl border border-[#2A2A2A] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <h3 className="font-bold text-white text-base">Crear Nuevo Insumo / Bebida</h3>
              <button 
                type="button" 
                onClick={() => setIsAddingNew(false)}
                className="p-1 hover:bg-[#1F1F1F] rounded text-gray-505 hover:text-white cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 block">Nombre del Artículo *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Lomo de cerdo, Coca-Cola Lata, etc."
                  className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500"
                />
              </div>

              {/* Categoría */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 block">Categoría *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden bg-[#1F1F1F] text-white"
                >
                  <option value="Ingredientes" className="bg-[#141414]">Ingredientes</option>
                  <option value="Bebidas" className="bg-[#141414]">Bebidas</option>
                  <option value="Carnes" className="bg-[#141414]">Carnes</option>
                  <option value="Verduras" className="bg-[#141414]">Verduras</option>
                  <option value="Abarrotes" className="bg-[#141414]">Abarrotes</option>
                  <option value="Desechables" className="bg-[#141414]">Desechables</option>
                </select>
              </div>

              {/* Fila Cantidad, Limit, Unit */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-400 block">Cant. Inicial *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="10"
                    className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-400 block">Mín. Alerta *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newMinLimit}
                    onChange={(e) => setNewMinLimit(e.target.value)}
                    placeholder="3"
                    className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-400 block">Unidad *</label>
                  <input
                    type="text"
                    required
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="kg, l, pz"
                    className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Costo Unitario */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 block">Costo de Compra de Unit ($) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newCostPrice}
                  onChange={(e) => setNewCostPrice(e.target.value)}
                  placeholder="Ej: 4.50"
                  className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500 font-mono"
                />
              </div>

              {/* Botón Guardar */}
              <div className="pt-3 border-t border-[#2A2A2A] flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 bg-[#1F1F1F] text-gray-400 border border-[#2A2A2A] rounded-lg hover:bg-[#2A2A2A] font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C5A059] hover:bg-[#D5B069] text-black rounded-lg font-bold uppercase tracking-wider cursor-pointer"
                >
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { UserPlus, Phone, Mail, Search, Trash, RefreshCw } from 'lucide-react';
import { Customer } from '../types';

interface ClientesProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export default function Clientes({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer
}: ClientesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const newCustomer: Customer = {
      id: `customer_${Date.now()}`,
      name,
      phone,
      email,
      points: 0,
      notes: notes || undefined,
      createdAt: new Date().toISOString()
    };

    onAddCustomer(newCustomer);
    setIsAddingNew(false);

    // Reset Form
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  const filteredCustomers = customers.filter(customer => {
    return customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           customer.phone.includes(searchQuery) ||
           customer.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6" id="clientes-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 tracking-tight font-sans">Fidelización de Clientes</h1>
          <p className="text-xs text-zinc-500 mt-1">Sabor & Gestión • Registro de socios, programa de acumulación de puntos y preferencias de mesa.</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-zinc-900 hover:bg-zinc-805 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Registrar Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, teléfono o correo electrónico registrado..."
            className="w-full text-xs pl-9 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-450 bg-zinc-50/40 text-zinc-905"
          />
        </div>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="customers-list-grid">
        {filteredCustomers.length === 0 ? (
          <p className="text-xs text-zinc-400 py-10 text-center col-span-3">No hay clientes registrados que coincidan con la búsqueda.</p>
        ) : (
          filteredCustomers.map((customer) => {
            const isVip = customer.points >= 200;
            return (
              <div
                key={customer.id}
                className="bg-white rounded-xl border border-zinc-200 shadow-3xs p-5 hover:border-zinc-350 transition-all space-y-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-zinc-905">{customer.name}</h4>
                    <span className="text-[10px] text-zinc-400 block font-mono font-medium">
                      Alta: {new Date(customer.createdAt).toLocaleDateString('es-ES', { dateStyle: 'short' })}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isVip ? 'bg-[#9C7E46]/10 text-[#9C7E46] border-[#9C7E46]/20 font-black shadow-3xs' : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                    }`}>
                      {customer.points} PTS {isVip ? '🌟 VIP' : ''}
                    </span>
                  </div>
                </div>

                {/* Contact Detail */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                </div>

                {/* Preferencias o Comentarios Especiales */}
                <div className="space-y-1 bg-zinc-50 p-3 rounded-lg border border-zinc-150 text-xs">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Notas & Alergias Especiales</span>
                  {customer.notes ? (
                    <p className="italic text-zinc-700 leading-normal">"{customer.notes}"</p>
                  ) : (
                    <p className="text-zinc-400 italic">Sin observaciones o alergias.</p>
                  )}
                </div>

                {/* Acciones de Edicion/Puntos */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                  <span className="text-[10px] font-mono text-zinc-400 font-medium">SOCIO_ID: {customer.id.substring(9).toUpperCase()}</span>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        const pts = parseInt(prompt(`Modificar saldo de puntos para ${customer.name}:`, customer.points.toString()) ?? '');
                        if (!isNaN(pts)) {
                          onUpdateCustomer(customer.id, { points: pts });
                        }
                      }}
                      className="text-xs text-[#9C7E46] font-bold hover:text-[#B4965C] hover:underline cursor-pointer"
                    >
                      Sumar Puntos
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newNotes = prompt(`Modifica notas para ${customer.name}:`, customer.notes || '');
                        if (newNotes !== null) {
                          onUpdateCustomer(customer.id, { notes: newNotes });
                        }
                      }}
                      className="text-xs text-zinc-500 hover:text-zinc-800 font-bold hover:underline cursor-pointer"
                    >
                      Notas
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Seguro que deseas eliminar la ficha de cliente para ${customer.name}?`)) {
                          onDeleteCustomer(customer.id);
                        }
                      }}
                      className="p-1 hover:bg-rose-50 rounded text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL REGISTRAR CLIENTE */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-zinc-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 max-w-sm w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
              <h3 className="font-bold text-zinc-900 text-base font-sans">Afiliar Socio al Club de Puntos</h3>
              <button 
                type="button" 
                onClick={() => setIsAddingNew(false)}
                className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-800 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Laura Castro"
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-450 bg-white text-zinc-900 placeholder-zinc-400"
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Teléfono Móvil *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+52 55 ..."
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-450 bg-white text-zinc-900 placeholder-zinc-400"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="laura.castro@gmail.com"
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-450 bg-white text-zinc-900 placeholder-zinc-400"
                />
              </div>

              {/* Notas de alergias o selección de mesa */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Preferencias, Restricciones o Alergias</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Prefiere terraza alta, intolerancia a lactosa..."
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-450 bg-white text-zinc-900 placeholder-zinc-400 resize-none"
                />
              </div>

              {/* Botones */}
              <div className="pt-3 border-t border-zinc-150 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-lg hover:bg-zinc-200 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-805 text-white rounded-lg font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  Registrar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

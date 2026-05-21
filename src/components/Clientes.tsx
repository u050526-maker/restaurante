import React, { useState } from 'react';
import { UserPlus, Award, Phone, Mail, FileText, Search, User, Clipboard, Edit, Trash, RefreshCw } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#2A2A2A] gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[#C5A059] tracking-tight">Fidelización de Clientes</h1>
          <p className="text-sm text-gray-400 mt-1">Monitorea el club de fidelidad, acumulación de puntos, preferencias de mesas y notas de alergias alimentarias.</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-[#C5A059] hover:bg-[#D5B069] text-black px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Registrar Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-[#141414] p-5 rounded-xl border border-[#2A2A2A] shadow-xs">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-550">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, teléfono o correo electrónico registrado..."
            className="w-full text-xs pl-9 pr-4 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="customers-list-grid">
        {filteredCustomers.length === 0 ? (
          <p className="text-xs text-gray-550 py-10 text-center col-span-3">No hay clientes registrados que coincidan con la búsqueda.</p>
        ) : (
          filteredCustomers.map((customer) => {
            const isVip = customer.points >= 200;
            return (
              <div
                key={customer.id}
                className="bg-[#141414] rounded-xl border border-[#2A2A2A] shadow-xs p-5 hover:border-[#C5A059]/40 transition-all space-y-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-white">{customer.name}</h4>
                    <span className="text-[10px] text-gray-550 block font-mono">
                      Ingreso: {new Date(customer.createdAt).toLocaleDateString('es-ES', { dateStyle: 'short' })}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isVip ? 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30 shadow-xs font-black' : 'bg-[#1F1F1F] text-gray-400 border-[#2A2A2A]/80'
                    }`}>
                      {customer.points} PTS {isVip ? '🌟 VIP' : ''}
                    </span>
                  </div>
                </div>

                {/* Contact Detail */}
                <div className="space-y-1.5 pt-2 border-t border-[#2A2A2A]/60 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                </div>

                {/* Preferencias o Comentarios Especiales */}
                <div className="space-y-1 bg-[#1F1F1F] p-3 rounded-lg border border-[#2A2A2A]/40 text-xs text-gray-300">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Ficha & Notas de Preferencia</span>
                  {customer.notes ? (
                    <p className="italic text-gray-255 leading-normal">"{customer.notes}"</p>
                  ) : (
                    <p className="text-gray-500 italic">Preferencia estándar (Sin notas especiales cargadas).</p>
                  )}
                </div>

                {/* Acciones de Edicion/Puntos */}
                <div className="flex items-center justify-between pt-1 border-t border-[#2A2A2A]/40">
                  <span className="text-[10px] font-mono text-gray-550">CLT_ID: {customer.id.substring(9)}</span>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        const pts = parseInt(prompt(`Modificar saldo de puntos para ${customer.name}:`, customer.points.toString()) ?? '');
                        if (!isNaN(pts)) {
                          onUpdateCustomer(customer.id, { points: pts });
                        }
                      }}
                      className="text-xs text-[#C5A059] font-medium hover:text-[#D5B069] hover:underline cursor-pointer"
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
                      className="text-xs text-gray-400 hover:text-white font-medium hover:underline cursor-pointer"
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
                      className="p-1 hover:bg-[#1F1F1F] rounded text-gray-550 hover:text-rose-400 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-[#0D0D0D] rounded-xl shadow-2xl border border-[#2A2A2A] max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <h3 className="font-bold text-white text-base font-sans">Afiliar Club de Puntos</h3>
              <button 
                type="button" 
                onClick={() => setIsAddingNew(false)}
                className="p-1 hover:bg-[#1F1F1F] rounded text-gray-500 hover:text-white cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 block">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Laura Castro"
                  className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500"
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 block">Teléfono Móvil *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+52 55 ..."
                  className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 block">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="laura.castro@gmail.com"
                  className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500"
                />
              </div>

              {/* Notas de alergias o selección de mesa */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 block">Preferencias, Restricciones o Alergias</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Prefiere terraza alta, intolerancia a lactosa..."
                  className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500 resize-contain"
                />
              </div>

              {/* Botones */}
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

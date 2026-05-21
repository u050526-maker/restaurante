import React, { useState } from 'react';
import { UserPlus, Shield, Sparkles, Trash2, Mail, Phone, Clock, FileBadge, RefreshCw } from 'lucide-react';
import { StaffMember, StaffRole } from '../types';

interface PersonalProps {
  staff: StaffMember[];
  onAddStaffMember: (member: StaffMember) => void;
  onUpdateStaffMember: (memberId: string, updates: Partial<StaffMember>) => void;
  onDeleteStaffMember: (memberId: string) => void;
}

export default function Personal({
  staff,
  onAddStaffMember,
  onUpdateStaffMember,
  onDeleteStaffMember
}: PersonalProps) {
  const [activeTab, setActiveTab] = useState<'Todos' | StaffRole>('Todos');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New staff state
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('Mesero');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !hourlyRate) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const newMember: StaffMember = {
      id: `staff_${Date.now()}`,
      name,
      role,
      phone,
      email,
      status: 'Activo',
      hourlyRate: Math.max(0, parseFloat(hourlyRate)),
      username: username || undefined,
      password: password || undefined
    };

    onAddStaffMember(newMember);
    setIsAddingNew(false);

    // Reset Form
    setName('');
    setRole('Mesero');
    setPhone('');
    setEmail('');
    setHourlyRate('');
    setUsername('');
    setPassword('');
  };

  const filteredStaff = staff.filter(member => {
    return activeTab === 'Todos' || member.role === activeTab;
  });

  return (
    <div className="space-y-6" id="personal-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#2A2A2A] gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-[#C5A059] tracking-tight">Gestión de Personal</h1>
          <p className="text-sm text-gray-400 mt-1">Administra el listado de chefs, meseros y administradores. Cambia el estatus de su disponibilidad.</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-[#C5A059] hover:bg-[#D5B069] text-black px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Registrar Colaborador
        </button>
      </div>

      {/* Tabs por Cargo */}
      <div className="inline-flex flex-wrap gap-1 border border-[#2A2A2A] rounded-xl p-0.5 bg-[#1F1F1F]">
        {['Todos', 'Chef', 'Mesero', 'Cajero', 'Administrador'].map((roleFilter) => (
          <button
            key={roleFilter}
            onClick={() => setActiveTab(roleFilter as any)}
            className={`px-3 py-1.5 font-semibold rounded-lg text-xs transition-all cursor-pointer ${
              activeTab === roleFilter
                ? 'bg-[#C5A059] text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {roleFilter === 'Todos' ? 'Todos los Roles' : `${roleFilter}s`}
          </button>
        ))}
      </div>

      {/* Grid de Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="staff-hierarchy-grid">
        {filteredStaff.length === 0 ? (
          <p className="text-xs text-gray-550 py-10 text-center col-span-3">No hay colaboradores registrados en este cargo.</p>
        ) : (
          filteredStaff.map((member) => (
            <div
              key={member.id}
              className={`bg-[#141414] rounded-xl shadow-xs p-5 space-y-4 hover:border-[#C5A059]/40 border transition-all relative overflow-hidden ${
                member.status === 'Inactivo' ? 'border-[#2A2A2A]/80 bg-[#1F1F1F]/40 text-gray-500' : 'border-[#2A2A2A] text-gray-300'
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <h4 className={`font-bold text-sm ${member.status === 'Inactivo' ? 'text-gray-500 line-through' : 'text-white'}`}>{member.name}</h4>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="text-[10px] font-mono text-[#C5A564] font-bold tracking-wider uppercase bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">
                      {member.role}
                    </span>
                  </div>
                </div>

                <select
                  value={member.status}
                  onChange={(e) => onUpdateStaffMember(member.id, { status: e.target.value as any })}
                  className={`text-[10px] py-1 border rounded font-bold px-2 cursor-pointer bg-[#141414] focus:outline-hidden ${
                    member.status === 'Activo' ? 'bg-emerald-955/20 text-emerald-400 border-emerald-900/40' :
                    member.status === 'Vacaciones' ? 'bg-amber-955/20 text-amber-400 border-amber-900/40' :
                    'bg-[#1F1F1F] text-gray-550 border-[#2A2A2A]'
                  }`}
                >
                  <option value="Activo" className="bg-[#141414]">● Activo</option>
                  <option value="Vacaciones" className="bg-[#141414]">✈ Vacaciones</option>
                  <option value="Inactivo" className="bg-[#141414]">○ Inactivo</option>
                </select>
              </div>

              {/* Informacion de contacto */}
              <div className="space-y-1.5 pt-2 border-t border-[#2A2A2A]/60 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span className="truncate">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span>
                    Salario/Hora: <span className="font-mono font-bold text-white">${member.hourlyRate.toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Cuenta de Acceso del Sistema */}
              <div className="space-y-1 bg-[#1F1F1F]/50 p-2.5 rounded-lg border border-[#2A2A2A]/40 text-xs">
                <span className="text-[9px] font-bold text-[#C5A059] uppercase tracking-wider block">Credenciales del Sistema</span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Usuario:</span>
                  <span className="font-bold font-mono text-gray-300">{member.username || '(Sin usuario)'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Contraseña:</span>
                  <span className="font-mono text-gray-400">{member.password ? '••••••••' : '(Sin clave)'}</span>
                </div>
              </div>

              {/* Acciones de Edicion/Borrado */}
              <div className="flex items-center justify-between pt-1 border-t border-[#2A2A2A]/40">
                <span className="text-[10px] text-gray-550 font-mono">ID: {member.id.substring(6)}</span>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      const userStr = prompt(`Configurar nombre de usuario para ${member.name}:`, member.username || '');
                      if (userStr !== null) {
                        const passStr = prompt(`Configurar contraseña para ${member.name}:`, member.password || '');
                        if (passStr !== null) {
                          onUpdateStaffMember(member.id, { username: userStr, password: passStr });
                        }
                      }
                    }}
                    className="text-xs text-[#C5A059] font-medium hover:text-[#D5B069] hover:underline cursor-pointer"
                  >
                    Usuario/Clave
                  </button>
                  <button
                    onClick={() => {
                      const rate = parseFloat(prompt(`Configura nueva tarifa por hora para ${member.name}:`, member.hourlyRate.toString()) ?? '');
                      if (!isNaN(rate) && rate > 0) {
                        onUpdateStaffMember(member.id, { hourlyRate: rate });
                      }
                    }}
                    className="text-xs text-gray-400 hover:text-white font-medium hover:underline cursor-pointer"
                  >
                    Tarifa
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Seguro que deseas de baja del sistema a ${member.name}?`)) {
                        onDeleteStaffMember(member.id);
                      }
                    }}
                    className="p-1 hover:bg-rose-955/20 rounded text-gray-500 hover:text-rose-450 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL REGISTRAR NUEVO COLABORADOR */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-[#0D0D0D] rounded-xl shadow-2xl border border-[#2A2A2A] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <h3 className="font-bold text-white text-base">Registrar Nuevo Colaborador</h3>
              <button 
                type="button" 
                onClick={() => setIsAddingNew(false)}
                className="p-1 hover:bg-[#1F1F1F] rounded text-gray-550 hover:text-white cursor-pointer"
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
                  placeholder="Ej: Daniel Santos"
                  className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500"
                />
              </div>

              {/* Cargo */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 block">Cargo Laboral *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden bg-[#1F1F1F] text-white"
                >
                  <option value="Chef" className="bg-[#141414]">Chef (Cocina)</option>
                  <option value="Mesero" className="bg-[#141414]">Mesero (Salonero/Comedor)</option>
                  <option value="Cajero" className="bg-[#141414]">Cajero</option>
                  <option value="Administrador" className="bg-[#141414]">Administrador</option>
                </select>
              </div>

              {/* Fila Telefono y Email */}
              <div className="grid grid-cols-2 gap-3">
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
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 block">Email Corporativo *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="daniel.s@restaurante.com"
                    className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Tarifa de Salario por Hora */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 block">Tarifa por Hora de Trabajo Laboral ($) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="Ej: 12.50"
                  className="w-full text-xs px-3 py-2 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-500 font-mono"
                />
              </div>

              {/* Credenciales de Acceso */}
              <div className="bg-[#141414] p-3 rounded-lg border border-[#2A2A2A] space-y-3">
                <p className="font-bold text-[#C5A059] text-[11px] uppercase tracking-wider">Crear Cuenta de Acceso (Opcional)</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-400 block">Usuario login</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ej: daniel.s"
                      className="w-full text-xs px-2.5 py-1.5 border border-[#2A2A2A]/80 rounded focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-600 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-400 block">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Clave123"
                      className="w-full text-xs px-2.5 py-1.5 border border-[#2A2A2A]/80 rounded focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1F1F1F] text-white placeholder-gray-600 font-mono"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-gray-450 leading-tight">Configura un usuario y clave para que este colaborador pueda iniciar sesión. Si es "Mesero", solo podrá tomar pedidos y cobrar.</p>
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
                  Dar de Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

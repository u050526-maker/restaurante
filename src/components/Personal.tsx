import React, { useState } from 'react';
import { UserPlus, Shield, Trash2, Mail, Phone, Clock, RefreshCw } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 tracking-tight font-sans">Gestión de Personal</h1>
          <p className="text-xs text-zinc-500 mt-1">Sabor & Gestión • Registro de cocineros, chef, meseros y credenciales de acceso.</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Registrar Colaborador
        </button>
      </div>

      {/* Tabs por Cargo */}
      <div className="inline-flex flex-wrap gap-1 border border-zinc-200 rounded-xl p-0.5 bg-zinc-50 shadow-3xs">
        {['Todos', 'Chef', 'Mesero', 'Cajero', 'Administrador'].map((roleFilter) => (
          <button
            key={roleFilter}
            onClick={() => setActiveTab(roleFilter as any)}
            className={`px-3 py-1.5 font-bold rounded-lg text-xs transition-all cursor-pointer ${
              activeTab === roleFilter
                ? 'bg-zinc-900 text-white font-bold shadow-3xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {roleFilter === 'Todos' ? 'Todos' : `${roleFilter}s`}
          </button>
        ))}
      </div>

      {/* Grid de Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="staff-hierarchy-grid">
        {filteredStaff.length === 0 ? (
          <p className="text-xs text-zinc-400 py-10 text-center col-span-3">No hay colaboradores registrados en este cargo.</p>
        ) : (
          filteredStaff.map((member) => (
            <div
              key={member.id}
              className={`bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] p-5 space-y-4 hover:border-zinc-350 border transition-all relative overflow-hidden ${
                member.status === 'Inactivo' ? 'border-zinc-200 bg-zinc-50/50 opacity-70 text-zinc-400' : 'border-zinc-200 text-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 select-none">
                  <h4 className={`font-bold text-sm ${member.status === 'Inactivo' ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>{member.name}</h4>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#9C7E46]" />
                    <span className="text-[9px] font-mono text-[#9C7E46] font-bold tracking-wider uppercase bg-[#9C7E46]/10 px-2 py-0.5 rounded border border-[#9C7E46]/15">
                      {member.role}
                    </span>
                  </div>
                </div>

                <select
                  value={member.status}
                  onChange={(e) => onUpdateStaffMember(member.id, { status: e.target.value as any })}
                  className={`text-[10px] py-1 border rounded-md font-bold px-2 cursor-pointer bg-white focus:outline-hidden ${
                    member.status === 'Activo' ? 'bg-emerald-55/20 text-emerald-800 border-emerald-200' :
                    member.status === 'Vacaciones' ? 'bg-amber-55/20 text-amber-800 border-amber-200' :
                    'bg-zinc-100 text-zinc-500 border-zinc-200'
                  }`}
                >
                  <option value="Activo" className="bg-white text-zinc-800">● Activo</option>
                  <option value="Vacaciones" className="bg-white text-zinc-400">✈ Vacaciones</option>
                  <option value="Inactivo" className="bg-white text-zinc-400">○ Inactivo</option>
                </select>
              </div>

              {/* Informacion de contacto */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100 text-xs text-zinc-600 font-sans select-none">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>
                    Salario/Hora: <span className="font-mono font-bold text-zinc-900">${member.hourlyRate.toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Cuenta de Acceso del Sistema */}
              <div className="space-y-1 bg-zinc-50 p-2.5 rounded-lg border border-zinc-150 text-xs">
                <span className="text-[9px] font-bold text-[#9C7E46] uppercase tracking-wider block">Credenciales del Sistema</span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Usuario:</span>
                  <span className="font-bold font-mono text-zinc-800">{member.username || '(Sin usuario)'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Contraseña:</span>
                  <span className="font-mono text-zinc-500">{member.password ? '••••••••' : '(Sin clave)'}</span>
                </div>
              </div>

              {/* Acciones de Edicion/Borrado */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                <span className="text-[10px] text-zinc-400 font-mono font-medium">ID: {member.id.substring(6)}</span>
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
                    className="text-xs text-[#9C7E46] font-bold hover:text-[#B4965C] hover:underline cursor-pointer"
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
                    className="text-xs text-zinc-500 hover:text-zinc-900 font-bold hover:underline cursor-pointer"
                  >
                    Tarifa
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Seguro que deseas de baja del sistema a ${member.name}?`)) {
                        onDeleteStaffMember(member.id);
                      }
                    }}
                    className="p-1 hover:bg-rose-50 rounded text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 bg-zinc-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
              <h3 className="font-bold text-zinc-900 text-base">Registrar Nuevo Colaborador</h3>
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
                  placeholder="Ej: Daniel Santos"
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-450 bg-white text-zinc-900 placeholder-zinc-400"
                />
              </div>

              {/* Cargo */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Cargo Laboral *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden bg-white text-zinc-800"
                >
                  <option value="Chef" className="bg-white text-zinc-805">Chef (Cocina)</option>
                  <option value="Mesero" className="bg-white text-zinc-805">Mesero (Salonero/Comedor)</option>
                  <option value="Cajero" className="bg-white text-zinc-805">Cajero</option>
                  <option value="Administrador" className="bg-white text-zinc-805">Administrador</option>
                </select>
              </div>

              {/* Fila Telefono y Email */}
              <div className="grid grid-cols-2 gap-3">
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
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 block">Email Corporativo *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="daniel.s@restaurante.com"
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-450 bg-white text-zinc-900 placeholder-zinc-400"
                  />
                </div>
              </div>

              {/* Tarifa de Salario por Hora */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Tarifa por Hora de Trabajo Laboral ($) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="Ej: 12.50"
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-450 bg-white text-zinc-900 placeholder-zinc-400 font-mono"
                />
              </div>

              {/* Credenciales de Acceso */}
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 space-y-3">
                <p className="font-bold text-[#9C7E46] text-[10px] uppercase tracking-wider">Crear Cuenta de Acceso (Opcional)</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-zinc-500 block">Usuario login</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ej: daniel.s"
                      className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 rounded focus:outline-hidden focus:ring-1 focus:ring-zinc-450 bg-white text-zinc-900 placeholder-zinc-400 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-zinc-500 block">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Clave123"
                      className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 rounded focus:outline-hidden focus:ring-1 focus:ring-zinc-450 bg-white text-zinc-900 placeholder-zinc-400 font-mono"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-zinc-400 leading-tight">Configura un usuario y clave para que este colaborador pueda iniciar sesión.</p>
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
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-bold uppercase tracking-wider cursor-pointer shadow-xs"
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

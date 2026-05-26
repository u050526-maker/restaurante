import React, { useState } from 'react';
import { Trash2, Clock, RefreshCw } from 'lucide-react';
import { Shift, StaffMember } from '../types';

interface HorariosProps {
  shifts: Shift[];
  staff: StaffMember[];
  onAddShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

export default function Horarios({
  shifts,
  staff,
  onAddShift,
  onDeleteShift
}: HorariosProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [staffId, setStaffId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'>('Lunes');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [notes, setNotes] = useState('');

  const activeStaff = staff.filter(s => s.status !== 'Inactivo');

  const days: ('Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo')[] = 
    ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId) {
      alert('Por favor selecciona un colaborador.');
      return;
    }

    const newShift: Shift = {
      id: `shift_${Date.now()}`,
      staffId,
      dayOfWeek,
      startTime,
      endTime,
      notes: notes || undefined
    };

    onAddShift(newShift);
    setIsAddingNew(false);

    // Reset
    setStaffId('');
    setNotes('');
  };

  return (
    <div className="space-y-6" id="horarios-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-200 gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 tracking-tight font-sans">Plantilla de Horarios</h1>
          <p className="text-xs text-zinc-500 mt-1">Sabor & Gestión • Planificación y asignación de turnos del personal en comedor y cocina.</p>
        </div>
        <button
          onClick={() => {
            setIsAddingNew(true);
            setStaffId(activeStaff[0]?.id || '');
          }}
          className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer shrink-0 animate-fade-in"
        >
          Programar Turno
        </button>
      </div>

      {/* Grid de días de la semana */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4" id="weekly-calendar-grid">
        {days.map((day) => {
          const dayShifts = shifts.filter(s => s.dayOfWeek === day);
          
          return (
            <div key={day} className="bg-white rounded-xl border border-zinc-200 shadow-3xs flex flex-col min-h-[400px]">
              {/* Encabezado del día */}
              <div className="p-3 border-b border-zinc-150 bg-zinc-50 text-center rounded-t-xl select-none">
                <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest">{day}</span>
                <span className="text-[10px] text-[#9C7E46] font-bold block mt-0.5">{dayShifts.length} activos</span>
              </div>

              {/* Lista de Turnos */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {dayShifts.length === 0 ? (
                  <p className="text-[10px] text-center text-zinc-400 py-10 italic">Sin turnos asignados</p>
                ) : (
                  dayShifts.map((shift) => {
                    const employee = staff.find(s => s.id === shift.staffId);
                    if (!employee) return null;

                    return (
                      <div
                        key={shift.id}
                        className="p-3 bg-zinc-50/50 border border-zinc-200 rounded-lg space-y-2 hover:border-zinc-350 transition-colors text-xs text-zinc-650 relative group"
                      >
                        {/* Botón de Borrar Shift en Hover */}
                        <button
                          onClick={() => onDeleteShift(shift.id)}
                          className="absolute top-1.5 right-1.5 p-1 bg-white hover:bg-rose-50 rounded text-zinc-400 hover:text-rose-600 shadow-2xs border border-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Eliminar turno"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-0.5">
                          <p className="font-bold text-zinc-900 leading-tight pr-4">{employee.name}</p>
                          <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#9C7E46]">
                            {employee.role}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
                          <Clock className="w-3 h-3 text-[#9C7E46] shrink-0" />
                          <span className="font-mono text-zinc-800">{shift.startTime} - {shift.endTime}</span>
                        </div>

                        {shift.notes && (
                          <p className="text-[9px] italic text-zinc-455 leading-normal border-t border-dashed border-zinc-200 pt-1">
                            "{shift.notes}"
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL PLANIFICAR TURNOS */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-zinc-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
              <h3 className="font-bold text-zinc-900 text-base">Asignar Turno Semanal</h3>
              <button 
                type="button" 
                onClick={() => setIsAddingNew(false)}
                className="p-1 hover:bg-zinc-100 rounded text-zinc-450 hover:text-zinc-805"
              >
                <RefreshCw className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Colaborador */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Colaborador en Turno *</label>
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden bg-white text-zinc-805"
                >
                  <option value="">-- Selecciona un Colaborador --</option>
                  {activeStaff.map(s => (
                    <option key={s.id} value={s.id} className="bg-white text-zinc-800">{s.name} ({s.role})</option>
                  ))}
                </select>
                {activeStaff.length === 0 && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">No hay colaboradores activos.</p>
                )}
              </div>

              {/* Día de la Semana */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Día de Trabajo *</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden bg-white text-zinc-805"
                >
                  {days.map(d => (
                    <option key={d} value={d} className="bg-white text-zinc-800">{d}</option>
                  ))}
                </select>
              </div>

              {/* Horas Inicio y Fin */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 block">Hora de Entrada *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden bg-white text-zinc-909 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 block">Hora de Salida *</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden bg-white text-zinc-909 font-mono"
                  />
                </div>
              </div>

              {/* Notas de Actividad */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-500 block">Notas / Notas de Área asignada (Opcional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Encargado de cocina caliente, Terraza VIP, ..."
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden bg-white text-zinc-900 placeholder-zinc-400"
                />
              </div>

              {/* Botones */}
              <div className="pt-3 border-t border-zinc-150 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!staffId}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-bold disabled:opacity-40 shadow-xs uppercase tracking-wider transition-all"
                >
                  Guardar Horario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

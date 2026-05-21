import React, { useState } from 'react';
import { Calendar, Plus, Trash2, ShieldAlert, Sparkles, Clock, RefreshCw } from 'lucide-react';
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
  const [selectedDay, setSelectedDay] = useState<'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo'>('Lunes');

  // New shift states
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-sans font-semibold text-gray-900 tracking-tight">Plantilla de Horarios</h1>
          <p className="text-sm text-gray-500 mt-1">Planifica los turnos semanales de tus meseros, chefs y cajeros para garantizar un servicio óptimo.</p>
        </div>
        <button
          onClick={() => {
            setIsAddingNew(true);
            setStaffId(activeStaff[0]?.id || '');
          }}
          className="bg-indigo-650 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Programar Turno
        </button>
      </div>

      {/* Grid de días de la semana */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4" id="weekly-calendar-grid">
        {days.map((day) => {
          const dayShifts = shifts.filter(s => s.dayOfWeek === day);
          
          return (
            <div key={day} className="bg-white rounded-xl border border-gray-200/80 shadow-xs flex flex-col min-h-[400px]">
              {/* Encabezado del día */}
              <div className="p-3 border-b border-gray-100 bg-gray-50/60 text-center rounded-t-xl">
                <span className="text-xs font-extrabold text-gray-800 uppercase tracking-widest">{day}</span>
                <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">{dayShifts.length} turnos</span>
              </div>

              {/* Lista de Turnos */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {dayShifts.length === 0 ? (
                  <p className="text-[10px] text-center text-gray-400 py-10 italic">Sin turnos asignados</p>
                ) : (
                  dayShifts.map((shift) => {
                    const employee = staff.find(s => s.id === shift.staffId);
                    if (!employee) return null;

                    return (
                      <div
                        key={shift.id}
                        className="p-3.5 bg-slate-50 border border-gray-200 rounded-lg space-y-2 hover:border-gray-300 transition-colors text-xs text-gray-700 relative group"
                      >
                        {/* Botón de Borrar Shift en Hover */}
                        <button
                          onClick={() => onDeleteShift(shift.id)}
                          className="absolute top-1.5 right-1.5 p-1 bg-white hover:bg-rose-50 rounded text-gray-400 hover:text-rose-600 shadow-xs border border-gray-250 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Eliminar turno"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-1">
                          <p className="font-extrabold text-gray-900 leading-tight pr-4">{employee.name}</p>
                          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600">
                            {employee.role}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-150">
                          <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="font-mono text-gray-800">{shift.startTime} - {shift.endTime}</span>
                        </div>

                        {shift.notes && (
                          <p className="text-[10px] italic text-gray-500 leading-normal border-t border-dashed border-gray-200 pt-1">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Asignar Turno Semanal</h3>
              <button 
                type="button" 
                onClick={() => setIsAddingNew(false)}
                className="p-1 hover:bg-gray-100 rounded text-gray-500"
              >
                <RefreshCw className="w-4 h-4 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Colaborador */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Colaborador en Turno *</label>
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-hidden bg-white"
                >
                  <option value="">-- Selecciona un Colaborador --</option>
                  {activeStaff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
                {activeStaff.length === 0 && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">No hay colaboradores activos.</p>
                )}
              </div>

              {/* Día de la Semana */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Día de Trabajo *</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-hidden bg-white"
                >
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Horas Inicio y Fin */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Hora de Entrada *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-hidden bg-gray-50/50 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Hora de Salida *</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-hidden bg-gray-50/50 font-mono"
                  />
                </div>
              </div>

              {/* Notas de Actividad */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 block">Notas de Actividad / Área de Trabajo</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Encargado de cocina caliente, Terraza VIP, ..."
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-hidden bg-gray-50/50"
                />
              </div>

              {/* Botones */}
              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-250 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!staffId}
                  className="px-4 py-2 bg-indigo-650 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-50"
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

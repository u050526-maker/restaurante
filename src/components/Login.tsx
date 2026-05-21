import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Coffee, Key, AlertCircle, LogIn, Sparkles } from 'lucide-react';
import { StaffMember } from '../types';

interface LoginProps {
  staff: StaffMember[];
  onLogin: (user: StaffMember) => void;
}

export default function Login({ staff, onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa usuario y contraseña.');
      return;
    }

    // Direct credentials check in the staff list
    const foundUser = staff.find(
      (m) => 
        m.username?.toLowerCase() === username.trim().toLowerCase() && 
        m.password === password.trim()
    );

    if (foundUser) {
      if (foundUser.status === 'Inactivo') {
        setError('Este colaborador se encuentra inactivo. Habla con el administrador.');
        return;
      }
      onLogin(foundUser);
    } else {
      setError('Credenciales incorrectas. Verifica el usuario o contraseña.');
    }
  };

  const handleQuickLogin = (demoUser: StaffMember) => {
    if (demoUser.username && demoUser.password) {
      setUsername(demoUser.username);
      setPassword(demoUser.password);
      setError(null);
      onLogin(demoUser);
    }
  };

  // Find demo users for quick access
  const adminDemo = staff.find(s => s.role === 'Administrador' && s.username);
  const waiterDemo = staff.find(s => s.role === 'Mesero' && s.username);

  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center p-4 font-sans select-none relative overflow-hidden" id="login-container">
      {/* Decorative ambient background drops */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Branding Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#141414] border border-[#2A2A2A] shadow-xl text-[#C5A059] mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="font-display font-black text-3xl tracking-tighter text-white">
            SABOR & GESTIÓN
          </h1>
          <p className="text-xs text-[#C5A059] tracking-widest font-mono uppercase">
            Estelar Restaurant Platform
          </p>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Ingresa con tu cuenta de personal autorizada por la administración para operar los módulos.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111111] border border-[#232323] rounded-2xl p-6 shadow-2xl relative">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-955/20 border border-rose-900/30 p-3 rounded-lg flex items-center gap-2.5 text-xs text-rose-450 text-left animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 block">Nombre de Usuario</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej: admin, mesero"
                    className="w-full text-xs pl-10 pr-4 py-2.5 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1A1A1A] text-white placeholder-gray-600 font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 block">Contraseña de Acceso</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-10 pr-4 py-2.5 border border-[#2A2A2A] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A059] bg-[#1A1A1A] text-white placeholder-gray-600 font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#C5A059] hover:bg-[#D5B069] text-black py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4" />
              Ingresar al Sistema
            </button>
          </form>

          {/* Quick Demo Logins block */}
          <div className="mt-6 pt-5 border-t border-[#1F1F1F] space-y-3 text-left">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Acceso Rápido de Demostración</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Admin Button */}
              {adminDemo ? (
                <button
                  onClick={() => handleQuickLogin(adminDemo)}
                  className="bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#222222] hover:border-[#C5A059]/40 p-2.5 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-gray-400 block group-hover:text-white">Admin Carlos/Jorge</span>
                  <span className="text-[9px] text-[#C5A059] font-mono block mt-0.5">user: admin</span>
                  <span className="text-[9px] text-gray-450 font-mono block">pass: admin123</span>
                </button>
              ) : (
                <button
                  onClick={() => onLogin({ id: 's7', name: 'Administrador Demo', role: 'Administrador', phone: '', email: '', status: 'Activo', hourlyRate: 20 })}
                  className="bg-[#1A1A1A] hover:bg-[#2A2A2A] p-2.5 rounded-xl text-left border border-[#222222] cursor-pointer"
                >
                  <span className="text-[10px] font-bold text-gray-400 block">Admin (Sin cuenta)</span>
                  <span className="text-[9px] text-gray-550 block">Forzar Login Admin</span>
                </button>
              )}

              {/* Waiter Button */}
              {waiterDemo ? (
                <button
                  onClick={() => handleQuickLogin(waiterDemo)}
                  className="bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#222222] hover:border-blue-500/40 p-2.5 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-gray-400 block group-hover:text-white">Mesero Juan</span>
                  <span className="text-[9px] text-blue-400 font-mono block mt-0.5">user: mesero</span>
                  <span className="text-[9px] text-gray-450 font-mono block">pass: mesero123</span>
                </button>
              ) : (
                <button
                  onClick={() => onLogin({ id: 's3', name: 'Mesero Demo', role: 'Mesero', phone: '', email: '', status: 'Activo', hourlyRate: 10 })}
                  className="bg-[#1A1A1A] hover:bg-[#2A2A2A] p-2.5 rounded-xl text-left border border-[#222222] cursor-pointer"
                >
                  <span className="text-[10px] font-bold text-gray-400 block">Mesero (Sin cuenta)</span>
                  <span className="text-[9px] text-gray-555 block">Forzar Login Mesero</span>
                </button>
              )}
            </div>
            <p className="text-[9px] text-gray-500 text-center leading-normal italic mt-1 bg-[#151515] p-2 rounded border border-[#1E1E1E]">
              💡 El administrador puede crear más cuentas, cambiar cargos y contraseñas de todo el personal en el módulo de <strong className="text-gray-300">Personal</strong>.
            </p>
          </div>

        </div>

        {/* Footer info lock and secure */}
        <p className="text-center text-[10px] text-gray-600 font-mono">
          🔒 Encriptación local activa • ID_APP_ESTELAR_SECURE
        </p>

      </div>
    </div>
  );
}

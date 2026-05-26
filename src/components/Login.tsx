import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Coffee, Key, AlertCircle, LogIn } from 'lucide-react';
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
  };  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 font-sans select-none relative overflow-hidden" id="login-container">
      {/* Decorative ambient background drops (subtle minimalist soft blurs) */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-zinc-200/30 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#9C7E46]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Branding Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-sm text-[#9C7E46] mb-1">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-zinc-900">
            SABOR & GESTIÓN
          </h1>
          <p className="text-[10px] text-[#9C7E46] tracking-widest font-semibold uppercase">
            Estelar Restaurant Platform
          </p>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            Ingreso autorizado para el personal. Acceda para operar y supervisar la sincronización local.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-zinc-150 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg flex items-center gap-2.5 text-xs text-rose-700 text-left animate-shake animate-duration-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 block">Nombre de Usuario</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej: jorge.admin, juan.mesero"
                    className="w-full text-xs pl-10 pr-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-hidden focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 block">Contraseña de Acceso</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-10 pr-4 py-2.5 border border-zinc-200 rounded-lg focus:outline-hidden focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer mt-3 shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              Ingresar al Sistema
            </button>
          </form>

          {/* Production System Info bar */}
          <div className="mt-5 pt-4 border-t border-zinc-100 text-center">
            <p className="text-[10px] text-zinc-500 leading-normal">
              Para registrar nuevos colaboradores o recuperar contraseñas, por favor consulte con un <strong className="text-zinc-700">Administrador</strong> en el panel de <span className="text-[#9C7E46] font-medium">Gestión de Personal</span>.
            </p>
          </div>

        </div>

        {/* Footer info lock and secure */}
        <p className="text-center text-[10px] text-zinc-400 font-mono">
          🔒 Encriptación local activa • ID_APP_ESTELAR_SECURE
        </p>

      </div>
    </div>
  );
}

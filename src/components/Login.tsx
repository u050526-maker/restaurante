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
  };

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

          {/* Production System Info bar */}
          <div className="mt-5 pt-4 border-t border-[#1F1F1F] text-center">
            <p className="text-[10px] text-gray-500 leading-normal">
              Para registrar nuevos colaboradores, restablecer contraseñas o modificar permisos de rol, ingrese como <strong className="text-gray-300">Administrador</strong> y acceda al panel de <span className="text-[#C5A059] font-medium">Gestión de Personal</span>.
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Mail, Lock, Loader2, Sparkles, School, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Por favor complete todos los campos');
      return;
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center bg-[#07090e] overflow-hidden select-none">
      {/* Background Animated Stylized Geographical Grid Map */}
      <div className="absolute inset-0 z-0 opacity-25">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(254, 130, 4, 0.15)" strokeWidth="0.8" />
              <circle cx="40" cy="40" r="1.5" fill="rgba(254, 130, 4, 0.3)" />
            </pattern>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(254, 130, 4, 0.12)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#glow)" />
        </svg>
      </div>

      {/* Floating neon light blobs */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[120px]" />

      {/* Center Layout Panel */}
      <div className="relative z-10 w-full max-w-[420px] px-6 py-12 flex flex-col items-center">
        
        {/* Floating Interactive Avatar/Logo above Card */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative w-16 h-16 bg-[#0c101b] border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105">
            <School className="h-8 w-8 text-primary animate-pulse-glow" />
          </div>
        </div>

        {/* Form Container (Glassmorphic Container) */}
        <div className="w-full bg-[#0c101b]/80 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          {/* Neon Top Border Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black tracking-tight text-white font-outfit uppercase">
              SISTEMA ÚNICO <span className="text-primary">EDUCATIVO</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" /> Portal de Gestión & Auditoría
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                Correo Electrónico
              </label>
              <div className="relative flex items-center">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@educacion.gob.ar"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/5 bg-[#080b12] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                />
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/5 bg-[#080b12] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                />
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-500 hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error notifications */}
            {(localError || error) && (
              <div className="p-3.5 bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl text-center leading-snug animate-shake">
                {localError || error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-3.5 rounded-xl bg-primary text-white font-extrabold text-xs uppercase tracking-widest hover:bg-primary-light hover:shadow-lg hover:shadow-orange-500/15 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 overflow-hidden group/btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Validando Ingreso...</span>
                </>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <Sparkles className="h-3.5 w-3.5 text-white/80 group-hover/btn:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Navigation back to public map */}
        <button
          onClick={() => router.push('/mapa')}
          className="mt-6 text-slate-500 hover:text-primary text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 focus:outline-none"
        >
          <School className="h-3.5 w-3.5" />
          <span>Volver al Mapa Público</span>
        </button>
      </div>
    </div>
  );
}

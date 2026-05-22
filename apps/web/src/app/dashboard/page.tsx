'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  Building, 
  School, 
  Map, 
  UserCheck, 
  Sparkles, 
  Activity, 
  FileCheck2, 
  TrendingUp, 
  User, 
  Clock, 
  LogOut,
  MapPin,
  ClipboardCheck,
  LayoutDashboard
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('Semana');

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  // Mock analytics statistics matching Supabase records
  const stats = {
    totalEdificios: 1240,
    totalEstablecimientos: 1845,
    totalModalidades: 2650,
    validados: 1890,
    pendientes: 760,
  };

  // Mock activity logs matching Prisma ActivityLog and HistorialEstadoModalidad schema
  const recentLogs = [
    {
      id: 1,
      user: "Administrador Sistema",
      action: "Validó Edificio",
      details: "CUI 7001234 - Validado como CORRECTO",
      time: "Hace 5 minutos",
      ip: "192.168.1.42"
    },
    {
      id: 2,
      user: "Auditor de Modalidades",
      action: "Modificó Categoría",
      details: "CUE 700098765 - Categoría a '1ra'",
      time: "Hace 12 minutos",
      ip: "192.168.1.105"
    },
    {
      id: 3,
      user: "Auditor de Modalidades",
      action: "Cambió Estado",
      details: "CUE 700055555 - Estado a 'REVISAR'",
      time: "Hace 1 hora",
      ip: "192.168.1.105"
    }
  ];

  // Calculate percentages for SVG graphics
  const totalModalidades = stats.totalModalidades;
  const validationRate = Math.round((stats.validados / totalModalidades) * 100);
  const pendingRate = 100 - validationRate;

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar Panel */}
      <aside className="w-64 bg-[#0d1321] text-white flex flex-col justify-between p-6 border-r border-orange-500/15">
        <div className="space-y-8">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-primary">
              <School className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-black font-outfit uppercase tracking-wider leading-none text-white">
                SUE <span className="text-primary">AUDITORÍA</span>
              </h2>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest mt-1 block">San Juan</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <div className="text-[8px] text-slate-500 font-black uppercase tracking-widest px-3 mb-3">Navegación</div>
            
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-wider transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Resumen</span>
            </button>

            <button 
              onClick={() => router.push('/dashboard/validacion')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs font-extrabold uppercase tracking-wider transition-all"
            >
              <ClipboardCheck className="h-4 w-4 text-slate-500" />
              <span>Validaciones</span>
            </button>

            <button 
              onClick={() => router.push('/mapa')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs font-extrabold uppercase tracking-wider transition-all"
            >
              <Map className="h-4 w-4 text-slate-500" />
              <span>Mapa Público</span>
            </button>
          </nav>
        </div>

        {/* User Session Info Card */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center font-bold text-sm text-primary uppercase shadow-inner">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate leading-none uppercase">{user?.name || 'Invitado'}</p>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">
                {user?.role === 'admin' ? 'Administrador' : 'Operador'}
              </span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 text-slate-400 hover:text-red-400 text-[10px] font-black uppercase tracking-wider transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header navbar */}
        <header className="bg-white border-b border-slate-100 py-5 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <h1 className="text-base font-black text-slate-800 uppercase tracking-tight font-outfit">
              Tablero de Control de <span className="text-primary">Cotejo</span>
            </h1>
          </div>

          <div className="flex gap-2">
            {['Mes', 'Semana', 'Hoy'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                  selectedPeriod === p
                    ? 'bg-orange-50 border-primary/20 text-primary'
                    : 'bg-white border-slate-200/60 text-slate-400 hover:text-slate-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </header>

        {/* Stats KPIs & Cards */}
        <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* KPI grid row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Card Edificios */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />
              <div>
                <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Edificios</span>
                <span className="text-2xl font-black text-slate-800 font-outfit">{stats.totalEdificios}</span>
              </div>
              <div className="p-3 bg-orange-50 rounded-2xl text-primary transition-transform group-hover:scale-105">
                <Building className="h-6 w-6" />
              </div>
            </div>

            {/* Card Establecimientos */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500" />
              <div>
                <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Establecimientos</span>
                <span className="text-2xl font-black text-slate-800 font-outfit">{stats.totalEstablecimientos}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-500 transition-transform group-hover:scale-105">
                <School className="h-6 w-6" />
              </div>
            </div>

            {/* Card Modalidades */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500" />
              <div>
                <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Modalidades</span>
                <span className="text-2xl font-black text-slate-800 font-outfit">{stats.totalModalidades}</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500 transition-transform group-hover:scale-105">
                <FileCheck2 className="h-6 w-6" />
              </div>
            </div>

            {/* Card Validaciones */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-500" />
              <div>
                <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Validados</span>
                <span className="text-2xl font-black text-emerald-600 font-outfit">{stats.validados}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500 transition-transform group-hover:scale-105">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>

          </div>

          {/* Graphics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Validation progress widget */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2.5">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-primary" /> Progreso de Auditorías
                  </h3>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase">
                    {validationRate}% Auditado
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mb-6">
                  Cotejo de modalidades validadas contra inconsistencias registradas en EDUGE.
                </p>
              </div>

              {/* Pure SVG Donut Chart */}
              <div className="relative flex items-center justify-center h-40">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="54" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                  <circle cx="72" cy="72" r="54" stroke="#FE8204" strokeWidth="12" fill="transparent"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - validationRate / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-800 font-outfit">{validationRate}%</span>
                  <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wide">Cotejado</span>
                </div>
              </div>
            </div>

            {/* Geographical departments school distribution widget */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between col-span-2">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2.5">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" /> Distribución por Departamentos
                  </h3>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Escuelas / Escenarios</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mb-6">
                  Distribución relativa de escuelas estatales y privadas por departamento con coordenadas geográficas habilitadas.
                </p>
              </div>

              {/* Custom SVG Bar Graphic Chart */}
              <div className="space-y-3.5">
                {[
                  { name: 'CAPITAL', count: 480, pct: 95 },
                  { name: 'RAWSON', count: 320, pct: 75 },
                  { name: 'CHIMBAS', count: 280, pct: 60 },
                  { name: 'SANTA LUCIA', count: 210, pct: 45 }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-700 uppercase">
                      <span>{item.name}</span>
                      <span className="text-slate-400 font-bold">{item.count} Escuelas</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Audits / Activity Log table */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-primary animate-pulse" /> Actividades Recientes de Cotejo
              </h3>
              <span className="text-[8px] font-black text-slate-400 border border-slate-200 px-2 py-0.5 rounded uppercase">
                Auditoría Activa
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-slate-50/50 transition-colors gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 leading-tight uppercase">{log.user}</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">{log.action}: <span className="text-slate-400 font-medium normal-case">{log.details}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase self-end md:self-auto">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-300" />
                      <span>{log.time}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/50 font-mono text-[9px]">
                      IP: {log.ip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

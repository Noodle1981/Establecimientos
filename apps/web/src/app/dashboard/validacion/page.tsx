'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  ChevronRight, 
  Search, 
  Filter, 
  Calendar,
  UserCheck,
  Building,
  Sparkles,
  ClipboardList,
  MessageSquare,
  School,
  ArrowLeft,
  X,
  LayoutDashboard,
  ClipboardCheck,
  FileCheck2,
  Map,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

// Sample mock audited modalities matching introspected Prisma schema
const MOCK_VALIDACIONES = [
  {
    id: 1,
    direccionArea: "SECUNDARIA",
    nivelEducativo: "SECUNDARIO",
    sector: 1, // Estatal
    ambito: "PUBLICO",
    categoria: "1ra",
    radio: "1.00",
    zona: "A",
    estadoValidacion: "PENDIENTE",
    observaciones: null,
    establecimiento: {
      cue: "700012345",
      nombre: "COLEGIO NACIONAL MONSEÑOR PABLO CABRERA",
      edificio: {
        cui: "7001234",
        calle: "Av. Libertador General San Martín 150 Oeste",
        localidad: "CAPITAL",
        zonaDepartamento: "CAPITAL"
      }
    }
  },
  {
    id: 2,
    direccionArea: "INICIAL",
    nivelEducativo: "INICIAL",
    sector: 2, // Privado
    ambito: "PRIVADO",
    categoria: "Super",
    radio: "Urbano",
    zona: "A",
    estadoValidacion: "REVISAR",
    observaciones: "Revisar coordenadas latitud longitud con catastro municipal.",
    establecimiento: {
      cue: "700098765",
      nombre: "COLEGIO NUESTRA SEÑORA DE LA CONSOLACIÓN",
      edificio: {
        cui: "7009876",
        calle: "Calle Sarmiento 450",
        localidad: "SANTA LUCIA",
        zonaDepartamento: "SANTA LUCIA"
      }
    }
  },
  {
    id: 3,
    direccionArea: "PRIMARIA",
    nivelEducativo: "PRIMARIO",
    sector: 1,
    ambito: "PUBLICO",
    categoria: "1ra",
    radio: "2.00",
    zona: "B",
    estadoValidacion: "CORRECTO",
    observaciones: "Validación rápida: Correcto según EDUGE",
    establecimiento: {
      cue: "700055555",
      nombre: "ESCUELA PROVINCIA DE TUCUMÁN",
      edificio: {
        cui: "7005555",
        calle: "Mendoza Sur 2200",
        localidad: "RAWSON",
        zonaDepartamento: "RAWSON"
      }
    }
  }
];

const ESTADOS_METADATA: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  PENDIENTE: { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertCircle },
  CORRECTO: { label: 'Correcto', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle },
  CORREGIDO: { label: 'Corregido', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: CheckCircle },
  REVISAR: { label: 'Revisar', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: HelpCircle },
  FALTANTE_EDUGE: { label: 'Faltante Eduge', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: XCircle },
  BAJA: { label: 'Baja', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: XCircle },
};

export default function ValidationPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const [data, setData] = useState(MOCK_VALIDACIONES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEstadoFilter, setSelectedEstadoFilter] = useState('');

  // Selected item for validation change
  const [editingItem, setEditingItem] = useState<typeof MOCK_VALIDACIONES[0] | null>(null);
  const [newStatus, setNewStatus] = useState('CORRECTO');
  const [observations, setObservations] = useState('');
  const [commentError, setCommentError] = useState('');

  const filteredItems = data.filter(item => {
    if (selectedEstadoFilter && item.estadoValidacion !== selectedEstadoFilter) return false;
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      item.establecimiento.nombre.toLowerCase().includes(query) ||
      item.establecimiento.cue.includes(query) ||
      item.establecimiento.edificio.cui.includes(query) ||
      item.nivelEducativo.toLowerCase().includes(query) ||
      item.direccionArea.toLowerCase().includes(query)
    );
  });

  const openStatusModal = (item: typeof MOCK_VALIDACIONES[0]) => {
    setEditingItem(item);
    setNewStatus(item.estadoValidacion);
    setObservations(item.observaciones || '');
    setCommentError('');
  };

  const handleSaveStatus = () => {
    setCommentError('');

    // Business Constraint Rule matching backend: Observation is strictly required (min 10 chars) for corrected/revisar/baja
    const requiresComments = ['CORREGIDO', 'REVISAR', 'BAJA'].includes(newStatus);
    if (requiresComments && (!observations || observations.trim().length < 10)) {
      setCommentError('Las observaciones son estrictamente obligatorias y deben tener al menos 10 caracteres.');
      return;
    }

    // Apply mutation locally
    setData(prev => prev.map(item => {
      if (item.id === editingItem?.id) {
        return {
          ...item,
          estadoValidacion: newStatus,
          observaciones: observations || null
        };
      }
      return item;
    }));

    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar Panel */}
      <aside className="w-64 bg-[#0d1321] text-white flex flex-col justify-between p-6 border-r border-orange-500/15 flex-shrink-0">
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs font-extrabold uppercase tracking-wider transition-all"
            >
              <LayoutDashboard className="h-4 w-4 text-slate-500" />
              <span>Resumen</span>
            </button>

            <button 
              onClick={() => router.push('/dashboard/validacion')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-wider transition-all"
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Validaciones</span>
            </button>

            <button 
              onClick={() => router.push('/dashboard/modalidades')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs font-extrabold uppercase tracking-wider transition-all"
            >
              <FileCheck2 className="h-4 w-4 text-slate-500" />
              <span>Establecimientos</span>
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
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header navbar */}
        <header className="bg-white border-b border-slate-100 py-5 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <div>
              <nav className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary leading-none mb-1">
                <span>Portal de Auditorías</span>
                <span>•</span>
                <span>Cotejo de Inconsistencias</span>
              </nav>
              <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight font-outfit">
                Control de <span className="text-primary">Validaciones</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-3 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-primary animate-pulse" />
              <div className="text-right">
                <span className="text-[8px] text-slate-400 font-extrabold uppercase leading-none block">Pendientes de Cotejo</span>
                <span className="text-sm font-black text-slate-700 leading-tight">
                  {data.filter(x => x.estadoValidacion === 'PENDIENTE').length} escuelas
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Container */}
        <div className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Search & Filter bar */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 flex items-center">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por Nombre, CUE, CUI..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
            />
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <select
                value={selectedEstadoFilter}
                onChange={(e) => setSelectedEstadoFilter(e.target.value)}
                className="w-full md:w-48 pl-3 pr-8 py-2.5 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 bg-white"
              >
                <option value="">Todos los Estados</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="CORRECTO">Correctos</option>
                <option value="REVISAR">A Revisar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit comparative grid */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Detalles de la Modalidad</th>
                  <th className="py-4 px-6">Identificación Escolar</th>
                  <th className="py-4 px-6">Dirección / Geografía</th>
                  <th className="py-4 px-6">Estado de Validación</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredItems.map((item) => {
                  const meta = ESTADOS_METADATA[item.estadoValidacion] || ESTADOS_METADATA.PENDIENTE;
                  const StateIcon = meta.icon;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 px-6">
                        <div className="space-y-1.5">
                          <span className="px-2 py-0.5 rounded bg-orange-50 border border-orange-100 text-[9px] font-black text-primary uppercase inline-block">
                            {item.nivelEducativo}
                          </span>
                          <p className="font-extrabold text-slate-800 text-[12px] uppercase leading-none">
                            {item.direccionArea}
                          </p>
                          <div className="flex gap-2 text-[9px] text-slate-400 font-bold uppercase">
                            <span>Sector: {item.sector === 1 ? 'Estatal' : 'Privado'}</span>
                            <span>Radio: {item.radio}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="space-y-1">
                          <p className="font-black text-slate-800 uppercase leading-snug max-w-[280px]">
                            {item.establecimiento.nombre}
                          </p>
                          <div className="flex gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded">
                              CUE: {item.establecimiento.cue}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded">
                              CUI: {item.establecimiento.edificio.cui}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="space-y-1 text-slate-500 text-xs font-medium leading-normal">
                          <p className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5 text-slate-300" />
                            <span>{item.establecimiento.edificio.calle}</span>
                          </p>
                          <p className="text-[10px] font-black uppercase text-slate-400">
                            {item.establecimiento.edificio.localidad} / {item.establecimiento.edificio.zonaDepartamento}
                          </p>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="space-y-1.5">
                          <span className={`px-2.5 py-1 rounded-xl border ${meta.bg} ${meta.border} ${meta.color} text-xs font-black uppercase tracking-wide inline-flex items-center gap-1.5 shadow-sm`}>
                            <StateIcon className="h-3.5 w-3.5" />
                            <span>{meta.label}</span>
                          </span>
                          {item.observaciones && (
                            <p className="text-[10px] text-slate-400 font-medium italic max-w-[200px] line-clamp-1 flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{item.observaciones}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-5 px-6 text-right">
                        <button
                          onClick={() => openStatusModal(item)}
                          className="px-4 py-2 bg-slate-100 hover:bg-orange-50 border border-slate-200/60 hover:border-primary/20 hover:text-primary rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all"
                        >
                          Auditar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      </main>

      {/* Audit Observation Prompt Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090e]/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-[460px] bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-50 text-primary rounded-xl">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase leading-tight">
                    Auditar Modalidad
                  </h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">CUE: {editingItem.establecimiento.cue}</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* School context */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl mb-5">
              <span className="text-[8px] text-slate-400 font-extrabold uppercase leading-none block mb-1">Establecimiento</span>
              <p className="text-[11px] font-black text-slate-800 uppercase leading-snug mb-1">
                {editingItem.establecimiento.nombre}
              </p>
              <p className="text-[9px] text-slate-400 font-bold uppercase">
                {editingItem.nivelEducativo} / {editingItem.direccionArea}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Nuevo Estado de Validación
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 bg-white"
                >
                  <option value="PENDIENTE">PENDIENTE (Aún sin cotejar)</option>
                  <option value="CORRECTO">CORRECTO (Validado y coincidente)</option>
                  <option value="CORREGIDO">CORREGIDO (Modificación ingresada)</option>
                  <option value="REVISAR">REVISAR (Presenta discrepancias)</option>
                  <option value="FALTANTE_EDUGE">FALTANTE EDUGE (Inconsistencia física)</option>
                  <option value="BAJA">BAJA (Cese del establecimiento)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Observaciones / Notas del Auditor
                  </label>
                  {['CORREGIDO', 'REVISAR', 'BAJA'].includes(newStatus) && (
                    <span className="text-[8px] font-black text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                      Obligatorio
                    </span>
                  )}
                </div>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Detallar los motivos de la auditoría. Ejem: Se corrigió la categoría según decreto 124/20..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 placeholder-slate-400 resize-none font-medium"
                />
              </div>

              {commentError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold rounded-xl leading-snug">
                  {commentError}
                </div>
              )}

              <div className="flex gap-3 pt-3 border-t border-slate-50">
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-500 font-extrabold text-xs uppercase tracking-wider transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveStatus}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-extrabold text-xs uppercase tracking-widest hover:bg-primary-light hover:shadow-lg hover:shadow-orange-500/10 transition-all"
                >
                  Registrar Cotejo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

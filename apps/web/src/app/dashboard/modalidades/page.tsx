'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  Building, 
  School, 
  Map, 
  Sparkles, 
  LayoutDashboard,
  ClipboardCheck,
  LogOut,
  Search,
  Filter,
  Plus,
  Download,
  Trash2,
  Undo,
  Eye,
  Edit3,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  MessageSquare,
  MapPin,
  Clock,
  Loader2,
  FileCheck2
} from 'lucide-react';

const DEPARTAMENTOS = [
  'CAPITAL', 'RAWSON', 'CHIMBAS', 'SANTA LUCIA', 'RIVADAVIA', 
  'POCITO', 'CAUCETE', 'ALBARDON', 'SARMIENTO', '25 DE MAYO', 
  'SAN MARTIN', '9 DE JULIO', 'ANGLACO', 'JACHAL', 'VALLE FERTIL', 
  'IGLESIA', 'CALINGASTA', 'ULLUM', 'ZONDA'
];

const NIVELES = [
  'INICIAL', 'PRIMARIO', 'SECUNDARIO', 'ADULTOS', 'ED. ESPECIAL', 'SUPERIOR', 'TÉCNICA', 'PRIVADA'
];

const CATEGORIAS = ['1ra', '2da', '3ra', '4ta', 'Super', 'Urbano', 'Alejado', 'N/A'];

export default function ModalidadesPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Modalidades State
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [take] = useState(15);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [nivelFilter, setNivelFilter] = useState('');
  const [direccionAreaFilter, setDireccionAreaFilter] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [zonaFilter, setZonaFilter] = useState('');
  const [zonaLetraFilter, setZonaLetraFilter] = useState('');
  const [radioFilter, setRadioFilter] = useState('');
  const [ambitoFilter, setAmbitoFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [conObservacionesFilter, setConObservacionesFilter] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  // Modals
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form State
  const [form, setForm] = useState({
    nombre_establecimiento: '',
    cue: '',
    cui: '',
    establecimiento_cabecera: '',
    nivel_educativo: '',
    direccion_area: '',
    sector: '1',
    radio: '',
    zona: '',
    categoria: '',
    ambito: 'PUBLICO',
    zona_departamento: '',
    localidad: '',
    calle: '',
    numero_puerta: 'S/N',
    validado: false,
    latitud: '',
    longitud: '',
    observaciones: ''
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [buildingStatus, setBuildingStatus] = useState<'NONE' | 'FOUND' | 'NEW'>('NONE');

  // Fetch Data
  async function fetchData() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        skip: String(skip),
        take: String(take),
        showDeleted: String(showDeleted),
        conObservacionesFilter: String(conObservacionesFilter)
      });

      if (search) params.append('search', search);
      if (nivelFilter) params.append('nivelFilter', nivelFilter);
      if (direccionAreaFilter) params.append('direccionAreaFilter', direccionAreaFilter);
      if (categoriaFilter) params.append('categoriaFilter', categoriaFilter);
      if (zonaFilter) params.append('zonaFilter', zonaFilter);
      if (zonaLetraFilter) params.append('zonaLetraFilter', zonaLetraFilter);
      if (radioFilter) params.append('radioFilter', radioFilter);
      if (ambitoFilter) params.append('ambitoFilter', ambitoFilter);
      if (estadoFilter) params.append('estadoFilter', estadoFilter);
      if (sectorFilter) params.append('sectorFilter', sectorFilter);

      const response = await fetch(`/api/modalidades?${params.toString()}`);
      if (!response.ok) throw new Error('Error al cargar establecimientos.');
      const result = await response.json();
      
      setData(result.data || []);
      setTotal(result.total || 0);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [
    skip, showDeleted, conObservacionesFilter, search, 
    nivelFilter, direccionAreaFilter, categoriaFilter, 
    zonaFilter, zonaLetraFilter, radioFilter, ambitoFilter, 
    estadoFilter, sectorFilter
  ]);

  // Lookup Building by CUI
  useEffect(() => {
    async function lookupCui() {
      if (!form.cui || form.cui.length < 5) {
        setBuildingStatus('NONE');
        return;
      }

      try {
        setLookupLoading(true);
        const response = await fetch(`/api/modalidades/lookup/edificio/${form.cui}`);
        if (response.ok) {
          const data = await response.json();
          if (data.edificio) {
            setBuildingStatus('FOUND');
            setForm(prev => ({
              ...prev,
              calle: data.edificio.calle || '',
              numero_puerta: data.edificio.numeroPuerta || 'S/N',
              localidad: data.edificio.localidad || '',
              zona_departamento: data.edificio.zonaDepartamento || '',
              latitud: data.edificio.latitud ? String(data.edificio.latitud) : '',
              longitud: data.edificio.longitud ? String(data.edificio.longitud) : '',
              establecimiento_cabecera: data.cabeceraNombre || prev.establecimiento_cabecera
            }));
          }
        } else {
          setBuildingStatus('NEW');
        }
      } catch (err) {
        setBuildingStatus('NEW');
      } finally {
        setLookupLoading(false);
      }
    }

    const timer = setTimeout(() => {
      lookupCui();
    }, 500);

    return () => clearTimeout(timer);
  }, [form.cui]);

  // Handle Level to Direction Area mapping automatically matching legacy
  useEffect(() => {
    if (!form.nivel_educativo) return;
    
    // Auto populate Direccion de Area based on Level
    let area = form.direccion_area;
    if (form.nivel_educativo === 'INICIAL') area = 'INICIAL';
    else if (form.nivel_educativo === 'PRIMARIO') area = 'PRIMARIA';
    else if (form.nivel_educativo === 'SECUNDARIO') area = 'SECUNDARIA';
    else if (form.nivel_educativo === 'ADULTOS') area = 'ADULTOS';
    else if (form.nivel_educativo === 'ED. ESPECIAL') area = 'ESPECIAL';
    else if (form.nivel_educativo === 'SUPERIOR') area = 'SUPERIOR';
    else if (form.nivel_educativo === 'TÉCNICA') area = 'TÉCNICA';
    else if (form.nivel_educativo === 'PRIVADA') area = 'PRIVADA';

    setForm(prev => ({ ...prev, direccion_area: area }));
  }, [form.nivel_educativo]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleExcelExport = () => {
    const params = new URLSearchParams({
      conObservacionesFilter: String(conObservacionesFilter),
      showDeleted: String(showDeleted)
    });
    if (search) params.append('search', search);
    if (nivelFilter) params.append('nivelFilter', nivelFilter);
    if (direccionAreaFilter) params.append('direccionAreaFilter', direccionAreaFilter);
    if (categoriaFilter) params.append('categoriaFilter', categoriaFilter);
    if (zonaFilter) params.append('zonaFilter', zonaFilter);
    if (zonaLetraFilter) params.append('zonaLetraFilter', zonaLetraFilter);
    if (radioFilter) params.append('radioFilter', radioFilter);
    if (ambitoFilter) params.append('ambitoFilter', ambitoFilter);
    if (estadoFilter) params.append('estadoFilter', estadoFilter);
    if (sectorFilter) params.append('sectorFilter', sectorFilter);

    window.open(`/api/modalidades/export?${params.toString()}`, '_blank');
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({
      nombre_establecimiento: '',
      cue: '',
      cui: '',
      establecimiento_cabecera: '',
      nivel_educativo: '',
      direccion_area: '',
      sector: '1',
      radio: '',
      zona: '',
      categoria: '',
      ambito: 'PUBLICO',
      zona_departamento: '',
      localidad: '',
      calle: '',
      numero_puerta: 'S/N',
      validado: false,
      latitud: '',
      longitud: '',
      observaciones: ''
    });
    setFormError('');
    setFormSuccess('');
    setBuildingStatus('NONE');
    setIsFormOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditing(true);
    setEditId(Number(item.id));
    setForm({
      nombre_establecimiento: item.establecimiento?.nombre || '',
      cue: item.establecimiento?.cue?.toString() || '',
      cui: item.establecimiento?.edificio?.cui || '',
      establecimiento_cabecera: item.establecimiento?.establecimientoCabecera || '',
      nivel_educativo: item.nivelEducativo || '',
      direccion_area: item.direccionArea || '',
      sector: item.sector ? String(item.sector) : '1',
      radio: item.radio ? String(item.radio) : '',
      zona: item.zona || '',
      categoria: item.categoria || '',
      ambito: item.ambito || 'PUBLICO',
      zona_departamento: item.establecimiento?.edificio?.zonaDepartamento || '',
      localidad: item.establecimiento?.edificio?.localidad || '',
      calle: item.establecimiento?.edificio?.calle || '',
      numero_puerta: item.establecimiento?.edificio?.numeroPuerta || 'S/N',
      validado: !!item.validado,
      latitud: item.establecimiento?.edificio?.latitud ? String(item.establecimiento.edificio.latitud) : '',
      longitud: item.establecimiento?.edificio?.longitud ? String(item.establecimiento.edificio.longitud) : '',
      observaciones: item.observaciones || ''
    });
    setFormError('');
    setFormSuccess('');
    setBuildingStatus('FOUND');
    setIsFormOpen(true);
  };

  const openDetailModal = async (id: number) => {
    try {
      const response = await fetch(`/api/modalidades/${id}`);
      if (!response.ok) throw new Error('No se pudo encontrar el detalle.');
      const data = await response.json();
      setSelectedItem(data);
      setIsDetailOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!form.nombre_establecimiento || !form.cue || !form.cui || !form.nivel_educativo) {
      setFormError('Nombre, CUE, CUI y Nivel Educativo son estrictamente obligatorios.');
      return;
    }

    try {
      const url = isEditing ? `/api/modalidades/${editId}` : '/api/modalidades';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Error al guardar el establecimiento.');
      }

      setFormSuccess(isEditing ? 'Establecimiento actualizado con éxito.' : 'Establecimiento creado con éxito.');
      setTimeout(() => {
        setIsFormOpen(false);
        fetchData();
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Error de conexión.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea enviar este establecimiento a la papelera?')) return;
    try {
      const response = await fetch(`/api/modalidades/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar.');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      const response = await fetch(`/api/modalidades/${id}/restore`, { method: 'PUT' });
      if (!response.ok) throw new Error('Error al restaurar.');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setNivelFilter('');
    setDireccionAreaFilter('');
    setCategoriaFilter('');
    setZonaFilter('');
    setZonaLetraFilter('');
    setRadioFilter('');
    setAmbitoFilter('');
    setEstadoFilter('');
    setSectorFilter('');
    setConObservacionesFilter(false);
  };

  const activeFiltersCount = [
    search, nivelFilter, direccionAreaFilter, categoriaFilter, 
    zonaFilter, zonaLetraFilter, radioFilter, ambitoFilter, 
    estadoFilter, sectorFilter
  ].filter(Boolean).length + (conObservacionesFilter ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar Panel */}
      <aside className="w-64 bg-[#0d1321] text-white flex flex-col justify-between p-6 border-r border-orange-500/15 flex-shrink-0">
        <div className="space-y-8">
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs font-extrabold uppercase tracking-wider transition-all"
            >
              <ClipboardCheck className="h-4 w-4 text-slate-500" />
              <span>Validaciones</span>
            </button>

            <button 
              onClick={() => router.push('/dashboard/modalidades')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-wider transition-all"
            >
              <FileCheck2 className="h-4 w-4" />
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

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-100 py-5 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <nav className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary leading-none mb-1">
                <span>Ministerio de Educación</span>
                <span>•</span>
                <span>Auditoría de Infraestructura</span>
              </nav>
              <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight font-outfit">
                Gestión de <span className="text-primary">Establecimientos</span>
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={openCreateModal}
              className="px-4 py-2 bg-primary text-white font-extrabold text-xs uppercase tracking-widest hover:bg-primary-light hover:shadow-lg rounded-xl flex items-center gap-2 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Nuevo</span>
            </button>

            <button 
              onClick={handleExcelExport}
              className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200/50 hover:bg-emerald-100/50 font-extrabold text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Excel</span>
            </button>

            <button 
              onClick={() => setConObservacionesFilter(!conObservacionesFilter)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest border transition-all shadow-sm flex items-center gap-2 ${
                conObservacionesFilter 
                  ? 'bg-amber-50 text-amber-600 border-amber-200' 
                  : 'bg-white text-slate-400 border-slate-200/60 hover:text-slate-600'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Con Observaciones</span>
            </button>

            <button 
              onClick={() => setShowDeleted(!showDeleted)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest border transition-all shadow-sm flex items-center gap-2 ${
                showDeleted 
                  ? 'bg-rose-50 text-rose-600 border-rose-200' 
                  : 'bg-white text-slate-400 border-slate-200/60 hover:text-slate-600'
              }`}
            >
              <Trash2 className="h-4 w-4" />
              <span>{showDeleted ? 'Activos' : 'Papelera'}</span>
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="p-8 pb-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <div className="flex items-center gap-2 text-slate-800">
                <Filter className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-wider">Filtros de Búsqueda</h3>
              </div>
              {activeFiltersCount > 0 && (
                <button 
                  onClick={clearFilters}
                  className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest transition-colors flex items-center gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Limpiar Filtros</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">
                  Búsqueda General
                </label>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={search} 
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Nombre, CUE o CUI..." 
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-100 text-xs focus:outline-none focus:border-primary/50 text-slate-700"
                  />
                  <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">
                  Nivel Educativo
                </label>
                <select 
                  value={nivelFilter} 
                  onChange={e => setNivelFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-100 text-xs text-slate-600 bg-white focus:outline-none"
                >
                  <option value="">TODOS</option>
                  {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">
                  Dirección de Área
                </label>
                <select 
                  value={direccionAreaFilter} 
                  onChange={e => setDireccionAreaFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-100 text-xs text-slate-600 bg-white focus:outline-none"
                >
                  <option value="">TODAS</option>
                  <option value="INICIAL">INICIAL</option>
                  <option value="PRIMARIA">PRIMARIA</option>
                  <option value="SECUNDARIA">SECUNDARIA</option>
                  <option value="ADULTOS">ADULTOS</option>
                  <option value="ESPECIAL">ESPECIAL</option>
                  <option value="SUPERIOR">SUPERIOR</option>
                  <option value="TÉCNICA">TÉCNICA</option>
                  <option value="PRIVADA">PRIVADA</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">
                  Departamento
                </label>
                <select 
                  value={zonaFilter} 
                  onChange={e => setZonaFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-100 text-xs text-slate-600 bg-white focus:outline-none"
                >
                  <option value="">TODOS</option>
                  {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">
                  Ámbito
                </label>
                <select 
                  value={ambitoFilter} 
                  onChange={e => setAmbitoFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-100 text-xs text-slate-600 bg-white focus:outline-none"
                >
                  <option value="">TODOS</option>
                  <option value="PUBLICO">PUBLICO</option>
                  <option value="PRIVADO">PRIVADO</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">
                  Categoría
                </label>
                <select 
                  value={categoriaFilter} 
                  onChange={e => setCategoriaFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-100 text-xs text-slate-600 bg-white focus:outline-none"
                >
                  <option value="">TODAS</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">
                  Estado Validación
                </label>
                <select 
                  value={estadoFilter} 
                  onChange={e => setEstadoFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-100 text-xs text-slate-600 bg-white focus:outline-none"
                >
                  <option value="">TODOS</option>
                  <option value="VALIDADO">VALIDADO</option>
                  <option value="PENDIENTE">PENDIENTE</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">
                  Sector (Código)
                </label>
                <input 
                  type="text" 
                  value={sectorFilter} 
                  onChange={e => setSectorFilter(e.target.value)}
                  placeholder="Ej: 22..." 
                  className="w-full px-3 py-2 rounded-xl border border-slate-100 text-xs text-slate-700 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table & Data */}
        <div className="p-8 pt-0 flex-1">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Establecimiento</th>
                    <th className="py-4 px-6">Detalles Académicos</th>
                    <th className="py-4 px-6">Ámbito / Estado</th>
                    <th className="py-4 px-6">Ubicación</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                          Cargando Establecimientos...
                        </span>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-400">
                        <School className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                        <p className="font-extrabold uppercase text-slate-500">No se encontraron registros</p>
                        <p className="text-[10px] text-slate-400 mt-1">Intente cambiar la configuración de filtros</p>
                      </td>
                    </tr>
                  ) : (
                    data.map((item: any) => {
                      const isPublic = item.ambito === 'PUBLICO';
                      const isDeleted = !!item.deletedAt;

                      return (
                        <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${isDeleted ? 'opacity-50 bg-slate-50' : ''}`}>
                          <td className="py-5 px-6">
                            <div className="flex gap-3.5 items-center">
                              <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${item.validado ? 'bg-emerald-500 shadow-sm shadow-emerald-500/35' : 'bg-amber-500 shadow-sm shadow-amber-500/35'}`} />
                              <div>
                                <p className="font-black text-slate-800 text-[11px] leading-snug uppercase max-w-[320px]">
                                  {item.establecimiento?.nombre}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <span className="text-[9px] font-mono font-bold bg-slate-900 text-primary px-2 py-0.5 rounded border border-slate-850 shadow-sm">
                                    CUE: {item.establecimiento?.cue}
                                  </span>
                                  <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                    CUI: {item.establecimiento?.edificio?.cui}
                                  </span>
                                </div>
                                {item.observaciones && (
                                  <p className="text-[10px] italic text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded w-fit mt-2 font-medium flex items-center gap-1.5">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>OBS: {item.observaciones}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-5 px-6">
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-black bg-orange-50 border border-orange-100 text-primary px-2 py-0.5 rounded uppercase block w-fit">
                                {item.nivelEducativo}
                              </span>
                              <p className="font-bold text-slate-500 uppercase tracking-tight text-[10px]">
                                Área: {item.direccionArea}
                              </p>
                              <div className="flex gap-2 text-[9px] text-slate-400 font-bold uppercase">
                                {item.radio && <span>Radio: {item.radio}</span>}
                                {item.categoria && <span>Cat: {item.categoria}</span>}
                              </div>
                            </div>
                          </td>

                          <td className="py-5 px-6">
                            <div className="space-y-2">
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase inline-block ${
                                isPublic 
                                  ? 'bg-orange-50 text-primary border-orange-100' 
                                  : 'bg-blue-50 text-blue-600 border-blue-100'
                              }`}>
                                {item.ambito}
                              </span>
                              
                              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500">
                                {item.validado ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    <span className="text-emerald-600 text-[9px]">Validado</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-4 w-4 text-amber-500 animate-pulse" />
                                    <span className="text-amber-600 text-[9px]">Pendiente</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-5 px-6">
                            <div className="space-y-1 text-slate-500 leading-normal">
                              <p className="flex items-center gap-1">
                                <Building className="h-3.5 w-3.5 text-slate-350" />
                                <span className="font-semibold uppercase text-slate-700">{item.establecimiento?.edificio?.calle} {item.establecimiento?.edificio?.numeroPuerta}</span>
                              </p>
                              <p className="text-[10px] font-black text-slate-400 uppercase">
                                {item.establecimiento?.edificio?.localidad} / {item.establecimiento?.edificio?.zonaDepartamento}
                              </p>
                            </div>
                          </td>

                          <td className="py-5 px-6 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button 
                                onClick={() => openDetailModal(Number(item.id))}
                                className="p-2 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
                                title="Ver Detalle"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              {!isDeleted ? (
                                <>
                                  <button 
                                    onClick={() => openEditModal(item)}
                                    className="p-2 rounded-xl border border-blue-100 hover:border-blue-200 hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-all"
                                    title="Editar"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(Number(item.id))}
                                    className="p-2 rounded-xl border border-rose-100 hover:border-rose-200 hover:bg-rose-50 text-rose-450 hover:text-rose-600 transition-all"
                                    title="Papelera"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => handleRestore(Number(item.id))}
                                  className="p-2 rounded-xl border border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50 text-emerald-500 hover:text-emerald-700 transition-all"
                                  title="Restaurar"
                                >
                                  <Undo className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                Registros: {skip + 1} - {Math.min(skip + take, total)} de {total}
              </span>

              <div className="flex gap-2">
                <button 
                  disabled={skip === 0}
                  onClick={() => setSkip(prev => Math.max(0, prev - take))}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white disabled:opacity-50 transition-all"
                >
                  Anterior
                </button>
                <button 
                  disabled={skip + take >= total}
                  onClick={() => setSkip(prev => prev + take)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white disabled:opacity-50 transition-all"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CREATE & EDIT FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090e]/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden my-8 relative flex flex-col animate-scale-up max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 bg-primary text-white flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-primary shadow-sm">
                  <School className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase leading-tight tracking-tight">
                    {isEditing ? 'Editar Establecimiento' : 'Nuevo Establecimiento'}
                  </h3>
                  <p className="text-[10px] text-orange-100 font-bold uppercase tracking-widest mt-0.5">Formulario de cotejo de datos</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white hover:text-yellow-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6 flex-1 custom-scrollbar">
              
              {/* Institutional Details */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-slate-200/60 pb-1.5 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Identificación Institucional
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-6">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Nombre Establecimiento</label>
                    <input 
                      type="text" 
                      value={form.nombre_establecimiento}
                      onChange={e => setForm({ ...form, nombre_establecimiento: e.target.value })}
                      placeholder="Ej: ESCUELA DE EDUCACION ESPECIAL"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 uppercase focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">CUE (9 dígitos)</label>
                    <input 
                      type="text" 
                      value={form.cue}
                      onChange={e => setForm({ ...form, cue: e.target.value })}
                      placeholder="700012345"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">CUI (7 dígitos)</label>
                    <div className="relative flex items-center">
                      <input 
                        type="text" 
                        value={form.cui}
                        onChange={e => setForm({ ...form, cui: e.target.value })}
                        placeholder="7001234"
                        className="w-full px-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-primary/50"
                      />
                      {lookupLoading && <Loader2 className="absolute right-3.5 h-3.5 w-3.5 animate-spin text-primary" />}
                    </div>
                    {buildingStatus === 'FOUND' && (
                      <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                        Edificio Existente
                      </span>
                    )}
                    {buildingStatus === 'NEW' && (
                      <span className="text-[8px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                        Crear Edificio Nuevo
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-8">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Establecimiento Cabecera</label>
                    <input 
                      type="text" 
                      value={form.establecimiento_cabecera}
                      onChange={e => setForm({ ...form, establecimiento_cabecera: e.target.value })}
                      placeholder="NOMBRE DE LA CABECERA"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 uppercase focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Validado</label>
                    <div className="flex items-center mt-2.5 ml-1">
                      <input 
                        type="checkbox" 
                        checked={form.validado}
                        onChange={e => setForm({ ...form, validado: e.target.checked })}
                        className="rounded text-primary focus:ring-primary h-4 w-4 border-slate-350 cursor-pointer"
                      />
                      <span className="ml-2 text-xs font-bold text-slate-600 uppercase tracking-tight">Validado / Cotejado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Location Details */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-slate-200/60 pb-1.5 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Detalles de Ubicación & Catastro
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Calle</label>
                    <input 
                      type="text" 
                      value={form.calle}
                      onChange={e => setForm({ ...form, calle: e.target.value })}
                      placeholder="AV. LIBERTADOR GRAL SAN MARTIN"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 uppercase focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Número Puerta</label>
                    <input 
                      type="text" 
                      value={form.numero_puerta}
                      onChange={e => setForm({ ...form, numero_puerta: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 uppercase focus:outline-none focus:border-primary/50 text-center"
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Localidad</label>
                    <input 
                      type="text" 
                      value={form.localidad}
                      onChange={e => setForm({ ...form, localidad: e.target.value })}
                      placeholder="CAPITAL"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 uppercase focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Departamento / Zona</label>
                    <select 
                      value={form.zona_departamento}
                      onChange={e => setForm({ ...form, zona_departamento: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none"
                    >
                      <option value="">Seleccione Departamento...</option>
                      {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-6">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Latitud</label>
                    <input 
                      type="text" 
                      value={form.latitud}
                      onChange={e => setForm({ ...form, latitud: e.target.value })}
                      placeholder="-31.5375"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Longitud</label>
                    <input 
                      type="text" 
                      value={form.longitud}
                      onChange={e => setForm({ ...form, longitud: e.target.value })}
                      placeholder="-68.5364"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Academic & Educational Details */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-slate-200/60 pb-1.5 flex items-center gap-1.5">
                  <FileCheck2 className="h-3.5 w-3.5" /> Datos Académicos & Modalidad
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Nivel Educativo</label>
                    <select 
                      value={form.nivel_educativo}
                      onChange={e => setForm({ ...form, nivel_educativo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none"
                    >
                      <option value="">Seleccione Nivel...</option>
                      {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Dirección de Área</label>
                    <input 
                      type="text" 
                      value={form.direccion_area}
                      readOnly
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100/50 text-xs text-slate-500 uppercase focus:outline-none font-bold"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Ámbito</label>
                    <select 
                      value={form.ambito}
                      onChange={e => setForm({ ...form, ambito: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none"
                    >
                      <option value="PUBLICO">PUBLICO</option>
                      <option value="PRIVADO">PRIVADO</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Sector (Código)</label>
                    <input 
                      type="text" 
                      value={form.sector}
                      onChange={e => setForm({ ...form, sector: e.target.value })}
                      placeholder="1"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Radio</label>
                    <input 
                      type="text" 
                      value={form.radio}
                      onChange={e => setForm({ ...form, radio: e.target.value })}
                      placeholder="1.00"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Zona</label>
                    <input 
                      type="text" 
                      value={form.zona}
                      onChange={e => setForm({ ...form, zona: e.target.value })}
                      maxLength={1}
                      placeholder="A"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 uppercase focus:outline-none text-center"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 ml-1">Categoría</label>
                    <select 
                      value={form.categoria}
                      onChange={e => setForm({ ...form, categoria: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none"
                    >
                      <option value="">Seleccione Categoría...</option>
                      {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Observaciones (Notes) */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Observaciones / Notas de Auditoría</label>
                <textarea 
                  value={form.observaciones}
                  onChange={e => setForm({ ...form, observaciones: e.target.value })}
                  placeholder="Detalles sobre catastro, inconsistencias o cambios realizados..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 uppercase resize-none focus:outline-none"
                />
              </div>

              {formError && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl text-center leading-snug animate-shake">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-2xl text-center leading-snug">
                  {formSuccess}
                </div>
              )}
            </form>

            {/* Footer buttons */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
              <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 py-3 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-500 font-extrabold text-xs uppercase tracking-wider transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-extrabold text-xs uppercase tracking-widest hover:bg-primary-light hover:shadow-lg hover:shadow-orange-500/10 transition-all flex items-center justify-center"
              >
                <span>Guardar Establecimiento</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL VIEW MODAL (TIMELINE & CATS) */}
      {isDetailOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090e]/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden my-8 relative flex flex-col animate-scale-up max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 bg-primary text-white flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl text-primary shadow-sm">
                  <School className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase leading-tight tracking-tight">
                    {selectedItem.establecimiento?.nombre}
                  </h3>
                  <p className="text-[10px] text-orange-100 font-bold uppercase tracking-widest mt-0.5">CUE: {selectedItem.establecimiento?.cue}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white hover:text-yellow-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="overflow-y-auto p-6 space-y-6 flex-1 custom-scrollbar">
              
              {/* Detailed Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">CUE</span>
                  <span className="font-bold text-slate-800 font-mono text-[11px]">{selectedItem.establecimiento?.cue}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">CUI</span>
                  <span className="font-bold text-slate-800 font-mono text-[11px]">{selectedItem.establecimiento?.edificio?.cui}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Ámbito</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase inline-block ${
                    selectedItem.ambito === 'PUBLICO' 
                      ? 'bg-orange-50 text-primary border border-orange-100' 
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    {selectedItem.ambito}
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Estado</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase inline-block ${
                    selectedItem.validado 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {selectedItem.validado ? 'VALIDADO' : 'PENDIENTE'}
                  </span>
                </div>

                {selectedItem.establecimiento?.establecimientoCabecera && (
                  <div className="col-span-2 md:col-span-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Establecimiento Cabecera</span>
                    <span className="font-black text-slate-800 uppercase">{selectedItem.establecimiento.establecimientoCabecera}</span>
                  </div>
                )}

                <div className="col-span-2 md:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 pb-1">Ubicación & Catastro</span>
                  <div className="grid grid-cols-2 gap-3 leading-normal">
                    <div>
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase">Calle / Dirección</span>
                      <p className="font-bold text-slate-700 uppercase">{selectedItem.establecimiento?.edificio?.calle} {selectedItem.establecimiento?.edificio?.numeroPuerta}</p>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase">Localidad / Depto</span>
                      <p className="font-bold text-slate-700 uppercase">{selectedItem.establecimiento?.edificio?.localidad} / {selectedItem.establecimiento?.edificio?.zonaDepartamento}</p>
                    </div>
                    {selectedItem.establecimiento?.edificio?.latitud && (
                      <div className="col-span-2 flex gap-4 pt-1.5 border-t border-slate-100 text-[9px] font-semibold text-slate-400 italic">
                        <span>Latitud: {selectedItem.establecimiento.edificio.latitud}</span>
                        <span>Longitud: {selectedItem.establecimiento.edificio.longitud}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 pb-1">Datos Académicos</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase">Nivel</span>
                      <p className="font-bold text-slate-700 uppercase">{selectedItem.nivelEducativo}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase">Dirección de Área</span>
                      <p className="font-bold text-slate-700 uppercase">{selectedItem.direccionArea}</p>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase">Sector Code</span>
                      <p className="font-bold text-slate-700">{selectedItem.sector}</p>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase">Radio</span>
                      <p className="font-bold text-slate-700">{selectedItem.radio || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase">Zona</span>
                      <p className="font-bold text-slate-700 uppercase">{selectedItem.zona || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase">Categoría</span>
                      <p className="font-bold text-slate-700 uppercase">{selectedItem.categoria || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline (Historial de Estados) */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-200/60 pb-1.5 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary animate-pulse" /> Historial de Auditorías
                </h4>

                {(!selectedItem.historialEstados || selectedItem.historialEstados.length === 0) ? (
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center py-4 italic">
                    Sin historial de cotejo registrado aún.
                  </p>
                ) : (
                  <div className="relative border-l-2 border-slate-200/80 ml-3.5 pl-6 space-y-5">
                    {selectedItem.historialEstados.map((log: any) => (
                      <div key={log.id} className="relative">
                        {/* Dot */}
                        <div className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-inner" />

                        <div className="text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-slate-700 uppercase">
                              {log.user?.name || 'Sistema'}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <p className="font-semibold text-slate-500">
                            Cambió de: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px] font-bold text-slate-600">{log.estadoAnterior}</span> a: <span className="font-mono bg-orange-50 px-1 py-0.5 rounded text-[10px] font-bold text-primary">{log.estadoNuevo}</span>
                          </p>

                          {log.observaciones && (
                            <p className="text-[10px] italic text-slate-400 bg-white p-2 rounded-lg border border-slate-100/60 mt-1.5 font-medium leading-relaxed">
                              {log.observaciones}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer button */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-shrink-0">
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-200 hover:bg-slate-300/80 text-slate-600 font-extrabold text-xs uppercase tracking-wider transition-all"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

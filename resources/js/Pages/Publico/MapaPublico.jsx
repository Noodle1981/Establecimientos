import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import debounce from 'lodash/debounce';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';

export default function MapaPublico({ edificios = [] }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({ publico: true, privado: true });
    const [filterNivel, setFilterNivel] = useState('TODOS');
    const [filterDepto, setFilterDepto] = useState('TODOS');
    const [selectedEdificio, setSelectedEdificio] = useState(null);
    const [hoveredEdificioId, setHoveredEdificioId] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        edificio_id: '',
        tipo: 'ERROR_DATOS',
        descripcion: '',
        nombre_remitente: '',
        email_remitente: '',
    });

    // Get unique levels and departments for filtering
    const nivelesDisponibles = useMemo(() => {
        const set = new Set();
        edificios.forEach(e => e.establecimientos.forEach(est => est.modalidades.forEach(m => set.add(m.nivel))));
        return Array.from(set).filter(n => n).sort();
    }, [edificios]);

    const deptosDisponibles = useMemo(() => {
        const set = new Set();
        edificios.forEach(e => { if (e.zona_departamento) set.add(e.zona_departamento); });
        return Array.from(set).sort();
    }, [edificios]);

    // Filter Logic
    const filteredEdificios = useMemo(() => {
        return edificios.filter(edificio => {
            const matchesSearch = !searchQuery || 
                edificio.localidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
                edificio.calle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                edificio.cui.toLowerCase().includes(searchQuery.toLowerCase()) ||
                edificio.establecimientos.some(est => 
                    est.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    est.cue.toString().toLowerCase().includes(searchQuery.toLowerCase())
                );
            
            const matchesType = (edificio.ambito === 'PUBLICO' && activeFilters.publico) ||
                                (edificio.ambito === 'PRIVADO' && activeFilters.privado);
            
            const matchesNivel = filterNivel === 'TODOS' || 
                                edificio.establecimientos.some(est => 
                                    est.modalidades.some(m => m.nivel === filterNivel)
                                );

            const matchesDepto = filterDepto === 'TODOS' || edificio.zona_departamento === filterDepto;

            return matchesSearch && matchesType && matchesNivel && matchesDepto;
        });
    }, [edificios, searchQuery, activeFilters, filterNivel, filterDepto]);

    // Statistics for the sidebar
    const stats = useMemo(() => {
        const totalEdificios = filteredEdificios.length;
        const totalEstablecimientos = filteredEdificios.reduce((acc, curr) => acc + curr.establecimientos.length, 0);
        const publicos = filteredEdificios.filter(e => e.ambito === 'PUBLICO').length;
        const privados = filteredEdificios.filter(e => e.ambito === 'PRIVADO').length;
        return { totalEdificios, totalEstablecimientos, publicos, privados };
    }, [filteredEdificios]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setIsSearching(query.length > 0);
    };

    const handleSelectSchool = (edificio) => {
        setSelectedEdificio(edificio);
        setIsSearching(false);
        setSearchQuery('');
    };

    const searchResults = useMemo(() => {
        if (!searchQuery || searchQuery.length < 2) return [];
        return edificios.filter(edificio => 
            edificio.cui.toLowerCase().includes(searchQuery.toLowerCase()) ||
            edificio.establecimientos.some(est => 
                est.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                est.cue.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
        ).slice(0, 5); // Limit to top 5 results
    }, [edificios, searchQuery]);

    const toggleFilter = (type) => {
        setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setActiveFilters({ publico: true, privado: true });
        setFilterNivel('TODOS');
        setFilterDepto('TODOS');
        setSelectedEdificio(null);
    };

    const openReportModal = () => {
        setData(prev => ({
            ...prev,
            edificio_id: selectedEdificio?.id || '',
            descripcion: selectedEdificio 
                ? `Reporte sobre: ${selectedEdificio.establecimientos[0]?.nombre || 'Escuela sin nombre'}\n\n` 
                : ''
        }));
        setIsReportModalOpen(true);
    };

    const submitReport = (e) => {
        e.preventDefault();
        post(route('publico.reportes.store'), {
            onSuccess: () => {
                setIsReportModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={false}
            fullWidth={true}
            showSidebar={false}
            padding={false}
        >
            <Head title="Mapa de Escuelas" />

            <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden flex bg-white">
                
                {/* Sidebar */}
                <aside 
                    className={`absolute lg:relative z-20 h-full bg-white transition-all duration-500 flex flex-col overflow-hidden ${
                        sidebarOpen 
                            ? 'w-80 translate-x-0 border-r border-orange-100 shadow-2xl' 
                            : 'w-0 -translate-x-full border-transparent'
                    }`}
                >
                    <div className="w-80 flex flex-col h-full bg-white text-black">
                        {/* Header */}
                        <div className="p-6 border-b border-orange-50 bg-orange-50/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-xl bg-white border border-orange-100 text-brand-orange shadow-sm">
                                    <i className="fas fa-map-marked-alt text-xl"></i>
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 leading-tight">Mapa <span className="text-brand-orange">Escolar</span></h2>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">San Juan, Argentina</p>
                                </div>
                            </div>
                            
                            {/* Search */}
                            <div className="relative mb-4">
                                <input 
                                    type="text"
                                    placeholder="Buscar CUE, CUI o Nombre..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-orange-100 focus:border-brand-orange transition-all text-sm font-medium"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onFocus={() => setIsSearching(searchQuery.length > 0)}
                                />
                                <i className="fas fa-search absolute left-3.5 top-3.5 text-gray-300"></i>

                                {/* Autocomplete Dropdown */}
                                {isSearching && searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-orange-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {searchResults.map(edificio => (
                                            <div 
                                                key={edificio.id}
                                                onClick={() => handleSelectSchool(edificio)}
                                                className="p-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 group"
                                            >
                                                <p className="text-[10px] font-black text-gray-900 uppercase truncate group-hover:text-brand-orange transition-colors">
                                                    {edificio.establecimientos[0]?.nombre}
                                                </p>
                                                <p className="text-[8px] font-bold text-gray-400">CUE: {edificio.establecimientos[0]?.cue}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Stats Summary */}
                            <div className="flex gap-2 mb-4">
                                <div className="flex-1 bg-white/50 backdrop-blur-sm p-2 rounded-lg border border-orange-100/50">
                                    <p className="text-[8px] uppercase font-black text-gray-400">Edificios</p>
                                    <p className="text-sm font-black text-gray-800">{stats.totalEdificios}</p>
                                </div>
                                <div className="flex-1 bg-white/50 backdrop-blur-sm p-2 rounded-lg border border-orange-100/50">
                                    <p className="text-[8px] uppercase font-black text-gray-400">Establ.</p>
                                    <p className="text-sm font-black text-gray-800">{stats.totalEstablecimientos}</p>
                                </div>
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            
                            {/* Ambito Section */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                                    <i className="fas fa-layer-group text-brand-orange"></i> Ámbito
                                </h3>
                                <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                                    <FilterBtn active={activeFilters.publico} onClick={() => toggleFilter('publico')} label="Público" color="orange" />
                                    <FilterBtn active={activeFilters.privado} onClick={() => toggleFilter('privado')} label="Privado" color="blue" />
                                </div>
                            </section>

                            {/* Departamento Section */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                                    <i className="fas fa-map-marked-alt text-brand-orange"></i> Departamento
                                </h3>
                                <div className="relative">
                                    <select 
                                        value={filterDepto}
                                        onChange={(e) => setFilterDepto(e.target.value)}
                                        className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border-gray-100 focus:border-brand-orange focus:ring-brand-orange transition-all text-xs font-black uppercase text-gray-700 appearance-none shadow-sm"
                                    >
                                        <option value="TODOS">Todos los Departamentos</option>
                                        {deptosDisponibles.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"></i>
                                </div>
                            </section>

                            {/* Nivel Section */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                                    <i className="fas fa-graduation-cap text-brand-orange"></i> Nivel Educativo
                                </h3>
                                <div className="relative">
                                    <select 
                                        value={filterNivel}
                                        onChange={(e) => setFilterNivel(e.target.value)}
                                        className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border-gray-100 focus:border-brand-orange focus:ring-brand-orange transition-all text-xs font-black uppercase text-gray-700 appearance-none shadow-sm"
                                    >
                                        <option value="TODOS">Todos los Niveles</option>
                                        {nivelesDisponibles.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"></i>
                                </div>
                            </section>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-orange-100 bg-orange-50/10">
                            <button 
                                onClick={clearFilters}
                                className="w-full py-4 rounded-2xl border-2 border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-all flex items-center justify-center gap-3 bg-white"
                            >
                                <i className="fas fa-sync-alt"></i> Limpiar Filtros
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Map Toggle Button */}
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`absolute top-6 z-[1002] transition-all duration-300 bg-white border shadow-xl rounded-r-xl p-3 flex items-center justify-center text-brand-orange hover:bg-orange-50 ${
                        sidebarOpen ? 'left-80' : 'left-0'
                    }`}
                >
                    <i className={`fas fa-chevron-left transition-transform ${sidebarOpen ? '' : 'rotate-180'}`}></i>
                </button>

                {/* Map Area */}
                <div className="flex-1 relative z-0">
                    <MapContainer 
                        center={[-31.5375, -68.5364]} 
                        zoom={11} 
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer 
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            subdomains='abcd'
                        />
                        <MapController selected={selectedEdificio} onReset={() => setSelectedEdificio(null)} sidebarOpen={sidebarOpen} />
                        
                        {filteredEdificios.map(edificio => (
                            <CircleMarker 
                                key={edificio.id}
                                center={[edificio.latitud, edificio.longitud]}
                                radius={hoveredEdificioId === edificio.id || selectedEdificio?.id === edificio.id ? 14 : 9}
                                pathOptions={{
                                    fillColor: edificio.ambito === 'PUBLICO' ? '#FE8204' : '#3B82F6',
                                    color: 'white',
                                    weight: hoveredEdificioId === edificio.id || selectedEdificio?.id === edificio.id ? 4 : 2,
                                    fillOpacity: hoveredEdificioId === edificio.id || selectedEdificio?.id === edificio.id ? 1 : 0.8
                                }}
                                eventHandlers={{
                                    click: () => setSelectedEdificio(edificio),
                                    mouseover: () => setHoveredEdificioId(edificio.id),
                                    mouseout: () => setHoveredEdificioId(null),
                                }}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-2 min-w-[250px] text-black">
                                        <div className="flex items-center gap-2 mb-3 border-b pb-2">
                                            <div className={`p-2 rounded-lg ${edificio.ambito === 'PUBLICO' ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-blue-600'}`}>
                                                <i className="fas fa-school"></i>
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-black uppercase text-gray-900 leading-tight">{edificio.localidad}</h5>
                                                <p className="text-[10px] text-gray-400 font-bold">{edificio.calle} {edificio.numero_puerta}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                            {edificio.establecimientos.map((est, i) => (
                                                <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                    <p className="text-[11px] font-black text-gray-800 uppercase mb-2">{est.nombre}</p>
                                                    <div className="space-y-1.5">
                                                        {est.modalidades.map((mod, j) => (
                                                            <div key={j} className="p-2 bg-white rounded-lg border border-gray-100">
                                                                <div className="flex gap-1.5 flex-wrap">
                                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-brand-orange border border-orange-100 uppercase">
                                                                        {mod.nivel}
                                                                    </span>
                                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 uppercase truncate max-w-[150px]">
                                                                        {mod.area}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>

                    {/* Map Buttons */}
                    <div className="absolute top-6 right-6 z-[1001] flex flex-col gap-3">
                        <button 
                            onClick={() => setSelectedEdificio({ latitud: -31.5375, longitud: -68.5364, zoom: 11 })}
                            className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-500 hover:text-brand-orange transition-all border border-orange-50 group"
                            title="Recentrar Mapa"
                        >
                            <i className="fas fa-expand-arrows-alt group-hover:scale-110 transition-transform"></i>
                        </button>
                    </div>

                    {/* Report Bug Btn */}
                    <button 
                        onClick={openReportModal}
                        className="absolute bottom-6 right-6 z-[1001] bg-white/90 backdrop-blur-md border border-red-100 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 hover:scale-105 transition-all text-black group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <i className="fas fa-bug"></i>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-red-400 leading-none mb-1">¿Problemas?</p>
                            <span className="text-sm font-black text-gray-800">Reportar Error</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Report Modal */}
            <Modal show={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} maxWidth="lg">
                <div className="p-8 bg-white">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-2xl shadow-inner">
                            <i className="fas fa-bullhorn"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">Reportar un <span className="text-red-500">Inconveniente</span></h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ayúdanos a mejorar el mapa escolar</p>
                        </div>
                    </div>

                    <form onSubmit={submitReport} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tipo de Reporte */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
                                    <i className="fas fa-tag text-red-400"></i> Motivo del Reporte
                                </label>
                                <select 
                                    className="w-full p-3 rounded-xl bg-gray-50 border-gray-100 focus:border-red-500 focus:ring-red-500 text-sm font-bold text-gray-700"
                                    value={data.tipo}
                                    onChange={e => setData('tipo', e.target.value)}
                                    required
                                >
                                    <option value="ERROR_DATOS">Error en los datos (Nombre, CUE, etc)</option>
                                    <option value="UBICACION_INCORRECTA">Ubicación incorrecta en el mapa</option>
                                    <option value="INFO_FALTANTE">Falta información (Nivel, modalidad)</option>
                                    <option value="OTRO">Otro motivo</option>
                                </select>
                            </div>

                            {/* Email Remitente */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
                                    <i className="fas fa-envelope text-red-400"></i> Tu Correo (Opcional)
                                </label>
                                <input 
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    className="w-full p-3 rounded-xl bg-gray-50 border-gray-100 focus:border-red-500 focus:ring-red-500 text-sm font-bold"
                                    value={data.email_remitente}
                                    onChange={e => setData('email_remitente', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
                                <i className="fas fa-comment-alt text-red-400"></i> Descripción detallada
                            </label>
                            <textarea 
                                rows="4"
                                placeholder="Describe el error lo más detallado posible..."
                                className="w-full p-4 rounded-2xl bg-gray-50 border-gray-100 focus:border-red-500 focus:ring-red-500 text-sm font-bold"
                                value={data.descripcion}
                                onChange={e => setData('descripcion', e.target.value)}
                                required
                            ></textarea>
                            {errors.descripcion && <p className="text-red-500 text-[10px] font-bold italic">{errors.descripcion}</p>}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                type="button"
                                onClick={() => setIsReportModalOpen(false)}
                                className="flex-1 py-4 rounded-2xl border-2 border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit"
                                disabled={processing}
                                className="flex-[2] py-4 rounded-2xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {processing ? (
                                    <i className="fas fa-circle-notch fa-spin"></i>
                                ) : (
                                    <i className="fas fa-paper-plane"></i>
                                )}
                                Enviar Reporte
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            <style>{`
                .custom-popup .leaflet-popup-content-wrapper {
                    background: rgba(255, 255, 255, 0.98);
                    border-radius: 20px;
                    border: 1px solid rgba(254, 130, 4, 0.1);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    padding: 4px;
                }
                .custom-popup .leaflet-popup-tip { background: white; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #FE820430; border-radius: 10px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                /* Pulse animation for selected/hovered markers */
                @keyframes marker-pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}

function MapController({ selected, onReset, sidebarOpen }) {
    const map = useMap();
    
    // Fix map size when sidebar toggles
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize({ animate: true });
        }, 500); // Match sidebar transition duration
    }, [sidebarOpen, map]);

    useEffect(() => {
        if (selected) {
            const zoom = selected.zoom || 16;
            map.flyTo([selected.latitud, selected.longitud], zoom, { 
                animate: true, 
                duration: 2 
            });
        }
    }, [selected, map]);
    return null;
}

function FilterBtn({ active, onClick, label, color }) {
    const activeClass = color === 'orange' ? 'bg-orange-50 text-brand-orange border-brand-orange/30 shadow-sm' : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm';
    return (
        <button 
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all border ${
                active ? activeClass : 'bg-gray-50 text-gray-400 border-gray-100 grayscale'
            }`}
        >
            <div className={`w-2 h-2 rounded-full ${color === 'orange' ? 'bg-brand-orange shadow-orange-500/50' : 'bg-blue-500 shadow-blue-500/50'} shadow-sm`}></div>
            <span>{label}</span>
        </button>
    );
}

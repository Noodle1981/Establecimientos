import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import debounce from 'lodash/debounce';

export default function MapaPublico({ edificios = [] }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({ publico: true, privado: true });
    const [selectedEdificio, setSelectedEdificio] = useState(null);

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
            
            return matchesSearch && matchesType;
        });
    }, [edificios, searchQuery, activeFilters]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const toggleFilter = (type) => {
        setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    return (
        <AuthenticatedLayout
            header={false} // Full screen map
        >
            <Head title="Mapa de Escuelas" />

            <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden flex">
                
                {/* Sidebar */}
                <aside 
                    className={`absolute lg:relative z-20 h-full bg-white transition-all duration-500 shadow-2xl border-r border-orange-100 flex flex-col ${
                        sidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'
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
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder="Buscar CUE, CUI o Nombre..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-orange-100 focus:border-brand-orange transition-all text-sm font-medium"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <i className="fas fa-search absolute left-3.5 top-3.5 text-gray-300"></i>
                            </div>
                        </div>

                        {/* Results List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {filteredEdificios.map(edificio => (
                                <div 
                                    key={edificio.id}
                                    onClick={() => setSelectedEdificio(edificio)}
                                    className="p-4 rounded-xl border border-gray-100 hover:border-brand-orange hover:shadow-lg transition-all cursor-pointer group bg-gray-50/30"
                                >
                                    <div className="flex gap-3">
                                        <div className={`w-1 h-10 rounded-full shrink-0 ${edificio.ambito === 'PUBLICO' ? 'bg-brand-orange' : 'bg-blue-500'}`}></div>
                                        <div className="min-w-0">
                                            <h4 className="text-[11px] font-black uppercase text-gray-900 group-hover:text-brand-orange transition-colors truncate">
                                                {edificio.establecimientos[0]?.nombre || 'Sin nombre'}
                                            </h4>
                                            <div className="flex gap-2 mt-1 mb-2">
                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">CUE: {edificio.establecimientos[0]?.cue}</span>
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${
                                                    edificio.ambito === 'PUBLICO' ? 'bg-orange-50 text-brand-orange border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                    {edificio.ambito}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <i className="fas fa-map-marker-alt text-gray-300"></i>
                                                <span className="truncate">{edificio.calle} {edificio.numero_puerta}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredEdificios.length === 0 && (
                                <div className="py-12 text-center text-gray-400">
                                    <i className="fas fa-search-minus fa-3x mb-3 opacity-20"></i>
                                    <p className="text-sm font-bold">Sin resultados</p>
                                </div>
                            )}
                        </div>

                        {/* Filters Footer */}
                        <div className="p-4 border-t border-orange-100 bg-orange-50/20">
                            <div className="flex gap-2">
                                <FilterBtn active={activeFilters.publico} onClick={() => toggleFilter('publico')} label="Público" color="orange" />
                                <FilterBtn active={activeFilters.privado} onClick={() => toggleFilter('privado')} label="Privado" color="blue" />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Map Toggle Button */}
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`absolute top-6 z-20 transition-all duration-300 bg-white border shadow-xl rounded-r-xl p-3 flex items-center justify-center text-brand-orange hover:bg-orange-50 ${
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
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                        <MapController selected={selectedEdificio} />
                        
                        {filteredEdificios.map(edificio => (
                            <CircleMarker 
                                key={edificio.id}
                                center={[edificio.latitud, edificio.longitud]}
                                radius={10}
                                pathOptions={{
                                    fillColor: edificio.ambito === 'PUBLICO' ? '#FE8204' : '#3B82F6',
                                    color: 'white',
                                    weight: 3,
                                    fillOpacity: 0.9
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

                    {/* Report Bug Btn */}
                    <a 
                        href="mailto:soporte@educacion.gob.ar" 
                        className="absolute bottom-6 right-6 z-20 bg-white border border-red-100 rounded-full px-5 py-2.5 shadow-xl flex items-center gap-3 hover:scale-105 transition-all text-black group"
                    >
                        <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <i className="fas fa-bug"></i>
                        </div>
                        <span className="text-sm font-black text-gray-800">Reportar Error</span>
                    </a>
                </div>
            </div>

            <style>{`
                .custom-popup .leaflet-popup-content-wrapper {
                    background: rgba(255, 255, 255, 0.98);
                    border-radius: 20px;
                    border: 1px solid rgba(254, 130, 4, 0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    padding: 4px;
                }
                .custom-popup .leaflet-popup-tip { background: white; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #FE820430; border-radius: 10px; }
            `}</style>
        </AuthenticatedLayout>
    );
}

function MapController({ selected }) {
    const map = useMap();
    useEffect(() => {
        if (selected) {
            map.flyTo([selected.latitud, selected.longitud], 16, { animate: true, duration: 2 });
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

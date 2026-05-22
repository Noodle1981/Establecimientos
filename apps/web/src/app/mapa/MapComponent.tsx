'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { 
  Search, 
  MapPin, 
  School, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  Bug, 
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import L from 'leaflet';

// Sample mock geodata structure matching our API model
// In production, this is loaded from `/api/edificios/mapa`
const MOCK_EDIFICIOS = [
  {
    id: 1,
    cui: "7001234",
    latitud: -31.5375,
    longitud: -68.5364,
    localidad: "San Juan Capital",
    calle: "Av. Libertador General San Martín",
    numeroPuerta: "150 Oeste",
    zonaDepartamento: "CAPITAL",
    ambito: "PUBLICO",
    establecimientos: [
      {
        nombre: "COLEGIO NACIONAL MONSEÑOR PABLO CABRERA",
        cue: "700012345",
        modalidades: [
          { nivel: "SECUNDARIO", area: "SECUNDARIA", radio: "1", categoria: "1ra" },
          { nivel: "ADULTOS", area: "ADULTOS", radio: "1", categoria: "2da" }
        ]
      }
    ]
  },
  {
    id: 2,
    cui: "7009876",
    latitud: -31.5420,
    longitud: -68.5250,
    localidad: "Santa Lucía",
    calle: "Calle Sarmiento",
    numeroPuerta: "450",
    zonaDepartamento: "SANTA LUCIA",
    ambito: "PRIVADO",
    establecimientos: [
      {
        nombre: "COLEGIO NUESTRA SEÑORA DE LA CONSOLACIÓN",
        cue: "700098765",
        modalidades: [
          { nivel: "INICIAL", area: "INICIAL", radio: "Urbano", categoria: "Super" },
          { nivel: "PRIMARIO", area: "PRIMARIA", radio: "Urbano", categoria: "1ra" }
        ]
      }
    ]
  },
  {
    id: 3,
    cui: "7005555",
    latitud: -31.5800,
    longitud: -68.5900,
    localidad: "Villa Krause",
    calle: "Mendoza Sur",
    numeroPuerta: "2200",
    zonaDepartamento: "RAWSON",
    ambito: "PUBLICO",
    establecimientos: [
      {
        nombre: "ESCUELA PROVINCIA DE TUCUMÁN",
        cue: "700055555",
        modalidades: [
          { nivel: "PRIMARIO", area: "PRIMARIA", radio: "2", categoria: "1ra" }
        ]
      }
    ]
  }
];

// Helper component to control zoom level from custom UI buttons
function MapController({ triggerZoom, setTriggerZoom, centerTarget }: { 
  triggerZoom: 'in' | 'out' | null; 
  setTriggerZoom: (z: 'in' | 'out' | null) => void;
  centerTarget: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (triggerZoom === 'in') {
      map.zoomIn();
      setTriggerZoom(null);
    } else if (triggerZoom === 'out') {
      map.zoomOut();
      setTriggerZoom(null);
    }
  }, [triggerZoom, map, setTriggerZoom]);

  useEffect(() => {
    if (centerTarget) {
      map.setView(centerTarget, 15, { animate: true });
    }
  }, [centerTarget, map]);

  return null;
}

export default function MapComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPublic, setShowPublic] = useState(true);
  const [showPrivate, setShowPrivate] = useState(true);
  
  const [triggerZoom, setTriggerZoom] = useState<'in' | 'out' | null>(null);
  const [centerTarget, setCenterTarget] = useState<[number, number] | null>(null);
  const [selectedEdificioId, setSelectedEdificioId] = useState<number | null>(null);

  // Filter buildings & nested establishments
  const filteredEdificios = useMemo(() => {
    return MOCK_EDIFICIOS.filter((edificio) => {
      // Type matching
      if (edificio.ambito === 'PUBLICO' && !showPublic) return false;
      if (edificio.ambito === 'PRIVADO' && !showPrivate) return false;

      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();

      return (
        edificio.localidad.toLowerCase().includes(query) ||
        edificio.calle.toLowerCase().includes(query) ||
        edificio.cui.includes(query) ||
        edificio.establecimientos.some(
          (est) =>
            est.nombre.toLowerCase().includes(query) ||
            est.cue.includes(query)
        )
      );
    });
  }, [searchQuery, showPublic, showPrivate]);

  // Flattened list of establishments for easy listing in sidebar
  const establishmentsList = useMemo(() => {
    const list: any[] = [];
    filteredEdificios.forEach((edificio) => {
      edificio.establecimientos.forEach((est) => {
        list.push({
          ...est,
          edificio,
        });
      });
    });
    return list;
  }, [filteredEdificios]);

  const handleCardClick = (edificio: typeof MOCK_EDIFICIOS[0]) => {
    setSelectedEdificioId(edificio.id);
    setCenterTarget([edificio.latitud, edificio.longitud]);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-100 flex">
      {/* Map (Fills the entire background) */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[-31.5375, -68.5364]} 
          zoom={12} 
          zoomControl={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController 
            triggerZoom={triggerZoom} 
            setTriggerZoom={setTriggerZoom} 
            centerTarget={centerTarget}
          />

          {/* Place markers */}
          {filteredEdificios.map((edificio) => {
            const isPublic = edificio.ambito === 'PUBLICO';
            const color = isPublic ? '#FE8204' : '#3B82F6';

            return (
              <CircleMarker
                key={edificio.id}
                center={[edificio.latitud, edificio.longitud]}
                radius={12}
                pathOptions={{
                  fillColor: color,
                  color: '#ffffff',
                  weight: 3,
                  opacity: 1,
                  fillOpacity: 0.95,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedEdificioId(edificio.id);
                    setCenterTarget([edificio.latitud, edificio.longitud]);
                  }
                }}
              >
                <Popup className="custom-popup" maxWidth={350} minWidth={300}>
                  <div className="p-1">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                      <div className={`p-2 rounded-lg ${isPublic ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                        <School className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800 uppercase text-xs tracking-tight">
                          {edificio.localidad || 'Edificio Educativo'}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          {edificio.calle} {edificio.numeroPuerta}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Establecimientos vinculados:
                      </p>

                      {edificio.establecimientos.map((est, i) => (
                        <div key={i} className="p-3 bg-slate-50/70 rounded-xl border border-slate-100/80 hover:border-orange-200 transition-colors">
                          <p className="text-[11px] font-black text-slate-800 leading-snug uppercase mb-2">
                            {est.nombre}
                          </p>
                          <div className="flex flex-col mb-2 bg-white px-2 py-1 rounded-md border border-slate-100 w-fit">
                            <span className="text-[7px] text-slate-400 font-extrabold uppercase leading-none">CUE</span>
                            <span className="text-[10px] font-mono font-bold text-slate-700">{est.cue}</span>
                          </div>
                          
                          <div className="space-y-2">
                            {est.modalidades.map((mod, j) => (
                              <div key={j} className="p-2 bg-white border border-slate-100 rounded-lg">
                                <span className="text-[8px] text-slate-400 font-bold uppercase block mb-0.5">Nivel / Área</span>
                                <div className="flex flex-wrap gap-1">
                                  <span className="px-1.5 py-0.5 rounded bg-orange-50 border border-orange-100 text-[9px] font-bold text-primary uppercase">
                                    {mod.nivel}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-[9px] font-semibold text-slate-500 uppercase truncate max-w-[150px]">
                                    {mod.area}
                                  </span>
                                </div>
                                <div className="flex gap-2.5 mt-1 border-t border-slate-50 pt-1 text-[8px] text-slate-400 font-medium italic">
                                  <span>Radio: {mod.radio}</span>
                                  <span>Cat: {mod.categoria}</span>
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
            );
          })}
        </MapContainer>
      </div>

      {/* Sidebar Panel */}
      <div 
        className={`absolute top-0 left-0 h-full z-10 transition-transform duration-500 ease-in-out w-80 bg-white/95 backdrop-blur-md shadow-2xl border-r border-orange-100/20 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-orange-50/20">
          <nav className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest mb-3 text-primary">
            <School className="h-3.5 w-3.5" />
            <span>Ministerio de Educación</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white border border-orange-100 shadow-sm text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                Mapa de <span className="text-primary font-black">Escuelas</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">San Juan, Argentina</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 bg-white/50 border-b border-slate-100">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por Nombre, CUE o CUI..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-100 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 placeholder-slate-400"
            />
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Establishments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {establishmentsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-xs font-bold text-slate-500">Sin resultados</p>
              <p className="text-[10px] text-slate-400 text-center px-4 mt-1">
                Prueba ajustando los filtros o el criterio de búsqueda
              </p>
            </div>
          ) : (
            establishmentsList.map((est, i) => {
              const isPublic = est.edificio.ambito === 'PUBLICO';
              return (
                <div 
                  key={i}
                  onClick={() => handleCardClick(est.edificio)}
                  className="group relative p-4 rounded-2xl bg-white border border-slate-100/80 hover:border-primary hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-0.5 transition-all cursor-pointer flex gap-3.5 text-slate-800"
                >
                  <div className={`w-1 h-12 rounded-full flex-shrink-0 ${isPublic ? 'bg-primary' : 'bg-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-slate-800 text-[11px] leading-tight uppercase group-hover:text-primary transition-colors mb-1.5 truncate">
                      {est.nombre}
                    </h4>
                    <div className="flex gap-2 mb-2">
                      <span className="bg-slate-100 text-slate-500 font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-200">
                        CUE: {est.cue}
                      </span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${
                        isPublic 
                          ? 'bg-orange-50 text-primary border-orange-100' 
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {est.edificio.ambito}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-300" />
                      <span>{est.edificio.calle} {est.edificio.numeroPuerta}</span>
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })
          )}
        </div>

        {/* Legend / Filter Buttons */}
        <div className="p-4 border-t border-slate-100 bg-orange-50/10">
          <div className="flex gap-2">
            <button 
              onClick={() => setShowPublic(!showPublic)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                showPublic 
                  ? 'bg-orange-50 text-primary border-primary/30 shadow-sm shadow-orange-500/5' 
                  : 'bg-slate-50 text-slate-400 border-slate-100 grayscale'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-orange-500/50" />
              <span>Público</span>
            </button>
            <button 
              onClick={() => setShowPrivate(!showPrivate)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                showPrivate 
                  ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm shadow-blue-500/5' 
                  : 'bg-slate-50 text-slate-400 border-slate-100 grayscale'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
              <span>Privado</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute top-6 z-20 bg-white/95 backdrop-blur-md rounded-r-2xl border border-l-0 border-slate-100 p-3 shadow-xl hover:bg-orange-50/50 transition-all ${
          sidebarOpen ? 'left-80' : 'left-0'
        }`}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-4 w-4 text-primary" />
        ) : (
          <ChevronRight className="h-4 w-4 text-primary" />
        )}
      </button>

      {/* Floating Action Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-3">
        <button 
          onClick={() => setTriggerZoom('in')}
          className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl hover:bg-orange-50/50 hover:scale-105 transition-all text-primary border border-slate-100"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button 
          onClick={() => setTriggerZoom('out')}
          className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl hover:bg-orange-50/50 hover:scale-105 transition-all text-primary border border-slate-100"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* Error Report Trigger */}
      <button 
        onClick={() => window.open('mailto:soporte@educacion.gob.ar?subject=Reporte%20de%20Error%20SUE%20Mapa', '_blank')}
        className="absolute bottom-6 right-24 z-20 bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-xl hover:scale-105 transition-all flex items-center gap-2.5 border border-slate-100 group"
      >
        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
          <Bug className="h-4 w-4" />
        </div>
        <span className="text-xs font-extrabold text-slate-700 uppercase tracking-tight">Reportar Error</span>
      </button>
    </div>
  );
}

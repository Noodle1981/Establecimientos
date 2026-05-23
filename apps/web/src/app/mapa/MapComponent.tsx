'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, 
  MapPin, 
  School, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  Bug, 
  User,
  LogOut,
  LayoutDashboard,
  Loader2,
  Filter,
  RotateCcw,
  BookOpen,
  Layers
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

// Import Leaflet core styles directly on the client side
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Pre-defined pastel colors mapping for San Juan's 19 official departments to match a political/government map
const DEPARTMENT_COLORS: { [key: string]: string } = {
  "IGLESIA": "#e0e7ff",
  "JACHAL": "#fef3c7",
  "VALLE FERTIL": "#dbeafe",
  "CALINGASTA": "#ffe4e6",
  "ULLUM": "#dcfce7",
  "ZONDA": "#f3e8ff",
  "SARMIENTO": "#fae8ff",
  "25 DE MAYO": "#ffe4e6",
  "CAUCETE": "#fce7f3",
  "ALBARDON": "#e2e8f0",
  "ANGACO": "#fef9c3",
  "SAN MARTIN": "#d1fae5",
  "POCITO": "#ffe4d6",
  "RAWSON": "#eceff1",
  "RIVADAVIA": "#cfd8dc",
  "CHIMBAS": "#ffebd8",
  "CAPITAL": "#fecdd3",
  "SANTA LUCIA": "#e0f2fe",
  "9 DE JULIO": "#e0f7fa"
};

// Robust helper function to normalize department names for seamless comparisons (handles accents and casing)
const getNormalizedDeptKey = (name: string): string => {
  if (!name) return '';
  return name
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents (e.g. Á -> A, Í -> I)
    .replace(/\s+/g, ' ')
    .trim();
};

// Custom interactive MapController to handle smooth dynamic pans, constraints, and custom vector panes
function MapController({ 
  triggerZoom, 
  setTriggerZoom, 
  centerTarget,
  maxBounds
}: { 
  triggerZoom: 'in' | 'out' | null; 
  setTriggerZoom: (z: 'in' | 'out' | null) => void;
  centerTarget: [number, number] | null;
  maxBounds: L.LatLngBounds;
}) {
  const map = useMap();

  // Create custom panes on mount to guarantee perfect layering and click precedence
  useEffect(() => {
    if (!map) return;

    // Create background department pane with a zIndex of 300
    if (!map.getPane('departments')) {
      const deptPane = map.createPane('departments');
      deptPane.style.zIndex = '300';
    }

    // Create a special middle overlay labels pane for street names
    if (!map.getPane('streetlabels')) {
      const labelsPane = map.createPane('streetlabels');
      labelsPane.style.zIndex = '450';
      labelsPane.style.pointerEvents = 'none'; // Labels do not block clicks
    }

    // Creación de Pane personalizado 'schools' con z-index 900 para prioridad absoluta de clics
    if (!map.getPane('schools')) {
      const schoolsPane = map.createPane('schools');
      schoolsPane.style.zIndex = '900';
    }

    // Create a special tooltip pane with zIndex 1000 to keep tooltips on top
    if (!map.getPane('tooltips')) {
      const tooltipsPane = map.createPane('tooltips');
      tooltipsPane.style.zIndex = '1000';
    }

    // Visual debugging to inspect all active map panes and z-indexes
    console.log("Map panes:", map.getPanes());

    // Fit map bounds initially to perfectly show San Juan without cutting off the North
    map.fitBounds(maxBounds, {
      paddingTopLeft: [320, 40],
      paddingBottomRight: [40, 40],
      animate: false
    });
  }, [map, maxBounds]);

  // Listen to zoom level to programmatically disable department interaction when zoomed in (Requerimiento 4)
  useEffect(() => {
    if (!map) return;

    const handleZoomEnd = () => {
      const zoom = map.getZoom();
      console.log("zoom:", zoom);
      
      // Query the marker cluster group layer on the map to find active layers
      let markerCount = 0;
      map.eachLayer((layer: any) => {
        if (layer.getLayers && typeof layer.getLayers === 'function') {
          if (layer.options && layer.options.clusterPane === 'schools') {
            markerCount = layer.getLayers().length;
          }
        }
      });
      console.log("markers:", markerCount);

      const deptPane = map.getPane('departments');
      if (deptPane) {
        if (zoom > 13) {
          deptPane.style.pointerEvents = 'none';
        } else {
          deptPane.style.pointerEvents = 'auto';
        }
      }
    };

    map.on('zoomend', handleZoomEnd);
    handleZoomEnd(); // Check initial state

    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    map.setMaxBounds(maxBounds);
    map.setMinZoom(7.5);
  }, [map, maxBounds]);

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
    if (centerTarget && map) {
      map.setView(centerTarget, 16, { animate: true });
    }
  }, [centerTarget, map]);

  return null;
}

// School Markers component utilizing high-quality Leaflet Marker Clustering and custom school icons (Requerimiento 1, 2, 6, 7)
function SchoolMarkers({ 
  clusterData, 
  onMarkerClick,
  selectedEdificioId
}: { 
  clusterData: any[]; 
  onMarkerClick: (edificio: any) => void;
  selectedEdificioId: number | null;
}) {
  const map = useMap();
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});

  useEffect(() => {
    if (!map) return;

    // Create marker cluster group with sleek transition options and custom color dominant logic
    const mcg = L.markerClusterGroup({
      animate: true,
      animateAddingMarkers: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      disableClusteringAtZoom: 16, // Separates into individual markers when zooming close (>= 16)
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: false, // Essential to prevent markers from disappearing on high zoom/pan
      chunkedLoading: true,
      iconCreateFunction: (cluster) => {
        const childMarkers = cluster.getAllChildMarkers();
        let publicCount = 0;
        let privateCount = 0;

        childMarkers.forEach((marker: any) => {
          if (marker.options.ambito === 'PUBLICO') {
            publicCount++;
          } else if (marker.options.ambito === 'PRIVADO') {
            privateCount++;
          }
        });

        const count = childMarkers.length;
        const isPublicDominant = publicCount >= privateCount;
        const dominantColorClass = isPublicDominant ? 'bg-[#FE8204]' : 'bg-[#3B82F6]';
        const glowColor = isPublicDominant ? 'rgba(254, 130, 4, 0.35)' : 'rgba(59, 130, 246, 0.35)';

        return L.divIcon({
          html: `
            <div class="flex items-center justify-center w-9 h-9 rounded-full ${dominantColorClass} text-white font-extrabold text-xs border-[3px] border-white shadow-md transition-transform duration-200 hover:scale-110" 
                 style="box-shadow: 0 0 0 4px ${glowColor}, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);">
              <span>${count}</span>
            </div>
          `,
          className: 'custom-cluster-icon',
          iconSize: L.point(36, 36),
          iconAnchor: [18, 18]
        });
      }
    });

    map.addLayer(mcg);
    markerClusterGroupRef.current = mcg;

    return () => {
      map.removeLayer(mcg);
    };
  }, [map]);

  useEffect(() => {
    const mcg = markerClusterGroupRef.current;
    if (!mcg || !map) return;

    // Clear existing markers from group on data change
    mcg.clearLayers();
    markersRef.current = {};

    if (!clusterData.length) return;

    // Load custom pins style SVG icons
    const publicSchoolIcon = L.icon({
      iconUrl: '/icons/public-school.svg',
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -26]
    });

    const privateSchoolIcon = L.icon({
      iconUrl: '/icons/private-school.svg',
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -26]
    });

    // Render individual school markers cleanly (filtered before render by parent filteredEdificios)
    clusterData.forEach((edificio) => {
      const isPublic = edificio.ambito === 'PUBLICO';
      const icon = isPublic ? publicSchoolIcon : privateSchoolIcon;
      
      const marker = L.marker([edificio.latitud, edificio.longitud], {
        icon: icon,
        riseOnHover: true,
        zIndexOffset: 9999, // Elevate z-index to maximum to keep them above everything
        // Save metadata on options for cluster creation color dominance
        ambito: edificio.ambito,
        edificioId: edificio.id
      } as any);

      // HTML template matching SUE visual specs
      const establishmentsHTML = edificio.establecimientos.map((est: any) => `
        <div class="p-3 bg-slate-50/70 rounded-2xl border border-slate-100/80 hover:border-orange-200 transition-colors mb-2">
          <p class="text-[11px] font-black text-slate-800 leading-snug uppercase mb-1">
            ${est.nombre}
          </p>
          <div class="flex flex-wrap gap-1.5 mb-1.5">
            <span class="bg-white text-slate-500 font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-200 leading-none">
              CUE: ${est.cue}
            </span>
          </div>
          <div class="space-y-1.5">
            ${est.modalidades.map((mod: any) => `
              <div class="p-2 bg-white border border-slate-100 rounded-xl">
                <div class="flex flex-wrap gap-1 mb-1">
                  <span class="px-1.5 py-0.5 rounded bg-orange-50 border border-orange-100 text-[8px] font-black text-primary uppercase">
                    ${mod.nivel}
                  </span>
                  <span class="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-[8px] font-extrabold text-slate-500 uppercase truncate max-w-[150px]">
                    ${mod.area}
                  </span>
                </div>
                <div class="flex gap-2.5 mt-1 text-[8px] text-slate-400 font-medium italic border-t border-slate-50 pt-1">
                  <span>Radio: ${mod.radio}</span>
                  <span>Cat: ${mod.categoria}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');

      const popupContent = `
        <div class="p-1 font-outfit">
          <div class="flex items-center gap-2.5 mb-3 pb-2 border-b border-slate-100">
            <div class="p-2 rounded-xl ${isPublic ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'} border ${isPublic ? 'border-orange-100' : 'border-blue-100'}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-school"><path d="m4 6 8-4 8 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"/><path d="M9 22V12h6v10"/><path d="M8 6h8"/><path d="M8 10h8"/><path d="M8 14h8"/><path d="M8 18h8"/></svg>
            </div>
            <div>
              <h3 class="font-extrabold text-slate-800 uppercase text-xs tracking-tight">
                ${edificio.localidad || 'Edificio Educativo'}
              </h3>
              <p class="text-[9px] text-slate-400 font-extrabold uppercase tracking-tight">
                CUI: ${edificio.cui} • ${edificio.calle || 'Sin Calle'} ${edificio.numeroPuerta || ''}
              </p>
            </div>
          </div>
          <div class="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            ${establishmentsHTML}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 340,
        minWidth: 290,
        className: 'custom-popup'
      });

      // Bind premium, clear hover tooltip containing school information (Requerimiento 7)
      const tooltipContent = `
        <div class="p-2 font-outfit max-w-[280px]">
          ${edificio.establecimientos.map((est: any) => `
            <div class="mb-2 last:mb-0">
              <h4 class="font-black text-slate-800 text-[11px] leading-snug uppercase mb-0.5">${est.nombre}</h4>
              <div class="flex gap-1.5 flex-wrap items-center mt-1">
                ${est.modalidades.map((mod: any) => `
                  <span class="px-1.5 py-0.5 rounded bg-orange-50 border border-orange-100 text-[8px] font-black text-primary uppercase leading-none">
                    ${mod.nivel}
                  </span>
                `).join('')}
                <span class="text-[8px] font-black px-1.5 py-0.5 rounded border uppercase leading-none ${
                  isPublic 
                    ? 'bg-orange-50 text-primary border-orange-100' 
                    : 'bg-blue-50 text-blue-600 border-blue-100'
                }">
                  ${isPublic ? 'Pública' : 'Privada'}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        permanent: false,
        sticky: true,
        direction: 'top',
        className: 'school-tooltip',
        pane: 'tooltips' // Render school tooltip inside the tooltips pane at zIndex 1000
      });

      marker.on('popupopen', () => {
        onMarkerClick(edificio);
      });

      mcg.addLayer(marker);
      markersRef.current[edificio.id] = marker;
    });

  }, [map, clusterData, onMarkerClick]);

  // Automatically trigger openPopup when selectedEdificioId changes, unclustering dynamically if needed
  useEffect(() => {
    if (selectedEdificioId && markersRef.current[selectedEdificioId]) {
      const marker = markersRef.current[selectedEdificioId];
      const mcg = markerClusterGroupRef.current;
      
      if (mcg && !mcg.hasLayer(marker)) {
        mcg.zoomToShowLayer(marker, () => {
          marker.openPopup();
        });
      } else {
        marker.openPopup();
      }
    }
  }, [selectedEdificioId]);

  return null;
}

export default function MapComponent() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced Filter States
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedNivel, setSelectedNivel] = useState('');
  const [selectedRadio, setSelectedRadio] = useState('');
  
  // Multiple Selection State array for Estatal & Privado (combinables)
  const [selectedGestiones, setSelectedGestiones] = useState<string[]>(['PUBLICO', 'PRIVADO']);
  
  const [modalidadQuery, setModalidadQuery] = useState('');

  const [triggerZoom, setTriggerZoom] = useState<'in' | 'out' | null>(null);
  const [centerTarget, setCenterTarget] = useState<[number, number] | null>(null);
  const [selectedEdificioId, setSelectedEdificioId] = useState<number | null>(null);

  // Premium Layer visibility toggles (Requerimiento Extra)
  const [showDepartments, setShowDepartments] = useState(true);
  const [showSchools, setShowSchools] = useState(true);
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);

  // GeoJSON component ref to toggle pointer-events on high zoom levels
  const geojsonRef = useRef<any>(null);

  // API State
  const [edificios, setEdificios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Official GeoJSON Division state
  const [geojsonFeatures, setGeojsonFeatures] = useState<any | null>(null);

  // Geographic boundary constraint: slightly expanded limits to fully encompass Jáchal and Iglesia without clipping
  const maxBounds = useMemo(() => {
    return L.latLngBounds(
      L.latLng(-32.8, -71.2), // South-West limit
      L.latLng(-28.2, -66.2)  // North-East limit
    );
  }, []);

  // Fetch buildings and official GeoJSON boundaries from the newly added IGN/IDERA san_juan.json
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // 1. Fetch buildings
        const response = await fetch('/api/edificios');
        if (!response.ok) {
          throw new Error('Incapaz de cargar los datos de infraestructura escolar.');
        }
        const data = await response.json();
        
        const parsedData = data
          .filter((ed: any) => ed.latitud !== null && ed.longitud !== null)
          .map((ed: any) => {
            const esPrivado = ed.establecimientos?.some((est: any) => 
              est.modalidades?.some((mod: any) => 
                mod.sector === 2 || 
                (mod.ambito && String(mod.ambito).toUpperCase().includes('PRIVADO'))
              )
            );
            const computedAmbito = esPrivado ? 'PRIVADO' : 'PUBLICO';

            return {
              ...ed,
              id: Number(ed.id),
              latitud: parseFloat(ed.latitud),
              longitud: parseFloat(ed.longitud),
              ambito: computedAmbito,
              establecimientos: (ed.establecimientos || []).map((est: any) => ({
                ...est,
                id: Number(est.id),
                cue: est.cue.toString(),
                modalidades: (est.modalidades || []).map((mod: any) => ({
                  ...mod,
                  id: Number(mod.id),
                  nivel: mod.nivelEducativo,
                  area: mod.direccionArea,
                  radio: mod.radio ? parseFloat(mod.radio).toString() : 'N/A',
                  categoria: mod.categoria || 'N/A'
                }))
              }))
            };
          });

        setEdificios(parsedData);

        // 2. Fetch the official polygon-based departments GeoJSON from IGN/IDERA san_juan.json
        const geojsonRes = await fetch('/geojson/san_juan.json');
        if (!geojsonRes.ok) {
          throw new Error('No se pudo cargar la cartografía oficial de departamentos.');
        }
        const geojsonData = await geojsonRes.json();
        setGeojsonFeatures(geojsonData);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error al conectar con los servicios de cartografía.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Department names derived from official GeoJSON properties
  const departmentNames = useMemo(() => {
    if (!geojsonFeatures) return [];
    return geojsonFeatures.features
      .map((f: any) => f.properties.NAM || f.properties.departamento || '')
      .filter(Boolean)
      .map((name: string) => name.toUpperCase())
      .sort();
  }, [geojsonFeatures]);

  // Extract unique educational levels dynamically for the filter dropdown
  const uniqueNiveles = useMemo(() => {
    const niveles = new Set<string>();
    edificios.forEach(ed => {
      ed.establecimientos.forEach((est: any) => {
        est.modalidades.forEach((mod: any) => {
          if (mod.nivel) niveles.add(mod.nivel);
        });
      });
    });
    return Array.from(niveles).sort();
  }, [edificios]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('');
    setSelectedNivel('');
    setSelectedRadio('');
    setSelectedGestiones(['PUBLICO', 'PRIVADO']); // Reset to show all
    setModalidadQuery('');
  };

  // Filter buildings & nested establishments dynamically based on multi-select state before mapping
  const filteredEdificios = useMemo(() => {
    return edificios.filter((edificio) => {
      // 1. Department Filter
      if (selectedDept) {
        const normSelected = getNormalizedDeptKey(selectedDept);
        const matchesDept = 
          (edificio.zonaDepartamento && getNormalizedDeptKey(edificio.zonaDepartamento) === normSelected) ||
          (edificio.localidad && getNormalizedDeptKey(edificio.localidad).includes(normSelected));
        if (!matchesDept) return false;
      }

      // 2. Multi-Select Gestión Filter (Estatal y Privado combinables / combinados en base a selectedGestiones)
      if (selectedGestiones.length > 0) {
        if (!selectedGestiones.includes(edificio.ambito)) return false;
      } else {
        return false;
      }

      // 3. Nested Level / Radio / Modality Filtering
      let matchesEstablishments = edificio.establecimientos.some((est: any) => {
        const matchesNivel = !selectedNivel || est.modalidades.some((m: any) => m.nivel === selectedNivel);
        const matchesRadio = !selectedRadio || est.modalidades.some((m: any) => m.radio === selectedRadio);
        const matchesModQuery = !modalidadQuery || est.modalidades.some((m: any) => 
          m.area.toLowerCase().includes(modalidadQuery.toLowerCase())
        );

        return matchesNivel && matchesRadio && matchesModQuery;
      });

      if (edificio.establecimientos.length > 0 && !matchesEstablishments) return false;

      // 4. Main Search Query (CUI, CUE, Name, Street)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesBase = 
          String(edificio.cui).includes(query) || 
          (edificio.calle || '').toLowerCase().includes(query) ||
          (edificio.localidad || '').toLowerCase().includes(query);
        
        const matchesEsts = edificio.establecimientos.some((est: any) => 
          (est.nombre || '').toLowerCase().includes(query) ||
          String(est.cue).includes(query)
        );

        if (!matchesBase && !matchesEsts) return false;
      }

      return true;
    });
  }, [edificios, selectedDept, selectedNivel, selectedRadio, selectedGestiones, modalidadQuery, searchQuery]);

  // Flattened list of establishments for easy listing in sidebar
  const establishmentsList = useMemo(() => {
    const list: any[] = [];
    filteredEdificios.forEach((edificio) => {
      edificio.establecimientos.forEach((est: any) => {
        list.push({
          ...est,
          edificio,
        });
      });
    });
    return list;
  }, [filteredEdificios]);

  const handleCardClick = (edificio: any) => {
    setSelectedEdificioId(edificio.id);
    setCenterTarget([edificio.latitud, edificio.longitud]);
  };

  const handleMarkerClick = useCallback((edificio: any) => {
    setSelectedEdificioId(edificio.id);
  }, []);

  // Toggle multi-select management filter
  const handleToggleGestion = (type: string) => {
    setSelectedGestiones((prev) => {
      if (prev.includes(type)) {
        return prev.filter((item) => item !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Estilo oficial IDERA/IGN: fondo totalmente transparente y contorno gris con puntos discontinuos
  const departmentStyle = (feature: any) => {
    return {
      fillColor: 'transparent',
      fillOpacity: 0,
      weight: 1.5,
      opacity: 1,
      color: '#4A4A4A', // Gris oscuro / grafito
      dashArray: '6, 4' // Línea discontinua
    };
  };

  // Interactividad y Resaltado Hover del contorno (Requerimiento 5, 8)
  const onEachDepartmentFeature = (feature: any, layer: any) => {
    const deptName = (
      feature.properties.NAM || 
      feature.properties.departamento || 
      ''
    ).toUpperCase();

    // Bind clean UX standard tooltip displayed ONLY on hover
    layer.bindTooltip(deptName, {
      permanent: false,
      sticky: true,
      direction: "center",
      className: "dept-tooltip",
      pane: 'tooltips' // Render tooltip inside the tooltips pane at zIndex 1000
    });

    layer.on({
      mouseover: (e: any) => {
        const target = e.target;
        target.setStyle({
          weight: 2.5,
          color: '#F27405', // Naranja institucional al hacer hover
          dashArray: '', // Quitar temporalmente el dashArray
          fillOpacity: 0.15, // Subtle light background hover
          fillColor: '#F27405'
        });
        // Removed bringToFront() to prevent hover from sticking due to mouseout event drops
      },
      mouseout: (e: any) => {
        const target = e.target;
        target.setStyle(departmentStyle(feature));
      },
      click: (e: any) => {
        const map = e.target._map;
        // Intelligent flyToBounds with maximum zoom restraint to prevent excessive zooming (Requerimiento 8)
        map.flyToBounds(e.target.getBounds(), { 
          padding: [80, 80],
          maxZoom: 12
        });
      },
      dblclick: (e: any) => {
        setSelectedDept(deptName);
        setSidebarOpen(true);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#07090e] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Sincronizando Cartografía Oficial IGN/IDERA...
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-50 flex select-none font-outfit">
      
      {/* Self-contained CSS overrides to fix browser outlines and configure pointer-events */}
      <style jsx global>{`
        /* Problem 1 Resolution: Disable browser default outline rings on SVG vectors completely */
        .leaflet-interactive {
          outline: none !important;
        }
        path.leaflet-interactive:focus {
          outline: none !important;
        }

        /* Configuración de click-through absoluto en custom pane layers (Requerimiento 3) */
        .leaflet-pane.leaflet-schools-pane {
          z-index: 900 !important;
          pointer-events: none !important;
        }
        .leaflet-pane.leaflet-schools-pane .leaflet-interactive,
        .leaflet-pane.leaflet-schools-pane .leaflet-marker-icon,
        .leaflet-pane.leaflet-schools-pane path {
          pointer-events: auto !important; /* Habilita capturar clics en marcadores HTML e individuales */
        }
        
        .leaflet-pane.leaflet-departments-pane {
          z-index: 300 !important;
          pointer-events: none !important;
        }
        .leaflet-pane.leaflet-departments-pane path {
          pointer-events: stroke !important; /* Capture hover/click ONLY on boundaries stroke, NOT transparent fill */
        }

        .dept-tooltip {
          background: white !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          color: #1e293b !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        }

        /* School premium tooltips (Requerimiento 7) */
        .school-tooltip {
          background: white !important;
          border: 1px solid #f1f5f9 !important;
          border-radius: 16px !important;
          padding: 10px 14px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05) !important;
        }
        .school-tooltip::before {
          border-top-color: white !important;
        }
      `}</style>

      {/* Map Element */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[-31.5375, -68.5364]} 
          zoom={9} 
          zoomControl={false}
          className="h-full w-full"
          maxBounds={maxBounds}
          maxBoundsViscosity={0.6} // Smooth non-aggressive bounds bouncing
          zoomSnap={0.25} // Support non-integer zooms to fit all viewport sizes
          zoomAnimation={true}
          markerZoomAnimation={true}
          fadeAnimation={true}
        >
          {/* SANDWICH TILE LAYERING STRUCTURE */}
          
          {/* 1. Base Layer (Bottom): CartoDB Positron No Labels */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          />

          {/* Map Controllers */}
          <MapController 
            triggerZoom={triggerZoom} 
            setTriggerZoom={setTriggerZoom} 
            centerTarget={centerTarget}
            maxBounds={maxBounds}
          />

          {/* 2. Middle Layer: Official Department Vector Polygons (Requerimiento 3, 4) */}
          {showDepartments && geojsonFeatures && (
            <GeoJSON 
              ref={geojsonRef}
              data={geojsonFeatures} 
              style={departmentStyle}
              onEachFeature={onEachDepartmentFeature}
              pane="departments"
              interactive={true}
            />
          )}

          {/* 3. Upper-Middle Layer: CartoDB Positron ONLY Labels (renders streets on top of transparent departments) */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
            pane="streetlabels"
          />

          {/* 4. Top Layer: School Markers utilizing Cluster Grouping (Requerimiento 1, 2, 6) */}
          {showSchools && (
            <SchoolMarkers 
              clusterData={filteredEdificios}
              onMarkerClick={handleMarkerClick}
              selectedEdificioId={selectedEdificioId}
            />
          )}
        </MapContainer>
      </div>

      {/* Sidebar Panel */}
      <div 
        className={`absolute top-0 left-0 h-full z-10 transition-transform duration-500 ease-in-out w-80 bg-white/95 backdrop-blur-md shadow-2xl border-r border-slate-100 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-100 bg-orange-50/10">
          <nav className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest mb-3 text-primary">
            <School className="h-3.5 w-3.5" />
            <span>Ministerio de Educación</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white border border-orange-100 shadow-sm text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider uppercase text-slate-900 leading-none">
                Mapa <span className="text-primary font-black">Institucional</span>
              </h2>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest mt-1 block">San Juan, Argentina</span>
            </div>
          </div>
        </div>

        {/* Collapsible Filter Console */}
        <div className="border-b border-slate-100">
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full px-6 py-3 flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 bg-slate-50/50 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-primary" />
              <span>Consola de Filtros</span>
            </div>
            <div className="flex items-center gap-2">
              {(selectedDept || selectedNivel || selectedRadio || selectedGestiones.length < 2 || searchQuery) && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
              <ChevronLeft className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${filtersOpen ? '-rotate-90' : 'rotate-90'}`} />
            </div>
          </button>

          {filtersOpen && (
            <div className="p-5 space-y-3.5 bg-white max-h-[300px] overflow-y-auto custom-scrollbar">
              
              {/* General Text Search */}
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nombre, CUE, CUI, Calle..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-100 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-slate-800 placeholder-slate-400 font-medium"
                />
                <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
              </div>

              {/* Department Dropdown */}
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Departamento</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-100 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-slate-700 font-bold"
                >
                  <option value="">Todos los Departamentos</option>
                  {departmentNames.map((name: string, i: number) => (
                    <option key={i} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Level Dropdown */}
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Nivel Educativo</label>
                <select
                  value={selectedNivel}
                  onChange={(e) => setSelectedNivel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-100 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-slate-700 font-bold"
                >
                  <option value="">Todos los Niveles</option>
                  {uniqueNiveles.map((nivel, i) => (
                    <option key={i} value={nivel}>{nivel}</option>
                  ))}
                </select>
              </div>

              {/* Modality Search */}
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Modalidad / Área</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={modalidadQuery}
                    onChange={(e) => setModalidadQuery(e.target.value)}
                    placeholder="Ejem: Secundaria, Inicial..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-100 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-slate-800 placeholder-slate-400 font-medium"
                  />
                  <BookOpen className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              {/* Reset Filters Trigger */}
              <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-wider transition-all"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Restablecer Filtros</span>
              </button>
            </div>
          )}
        </div>

        {/* Establishments Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50 custom-scrollbar">
          <div className="text-[8px] text-slate-400 font-black uppercase tracking-widest px-1.5 mb-1 flex justify-between">
            <span>Resultados de Búsqueda</span>
            <span>{establishmentsList.length} Escuelas</span>
          </div>

          {establishmentsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-xs font-black text-slate-500 uppercase">Sin resultados</p>
              <p className="text-[9px] text-slate-400 text-center px-4 mt-1 leading-snug">
                Modifique los filtros o el criterio de búsqueda en la consola superior.
              </p>
            </div>
          ) : (
            establishmentsList.map((est, i) => {
              const isPublic = est.edificio.ambito === 'PUBLICO';
              return (
                <div 
                  key={i}
                  onClick={() => handleCardClick(est.edificio)}
                  className="group relative p-3 rounded-2xl bg-white border border-slate-100 hover:border-primary hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-0.5 transition-all cursor-pointer flex gap-3 text-slate-800 animate-fade-in"
                >
                  <div className={`w-1 h-12 rounded-full flex-shrink-0 ${isPublic ? 'bg-primary' : 'bg-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-slate-800 text-[10px] leading-tight uppercase group-hover:text-primary transition-colors mb-1.5 truncate">
                      {est.nombre}
                    </h4>
                    <div className="flex gap-1.5 mb-1.5 flex-wrap">
                      <span className="bg-slate-50 text-slate-500 font-mono text-[8px] px-1 py-0.5 rounded border border-slate-200 leading-none">
                        CUE: {est.cue}
                      </span>
                      <span className={`text-[8px] font-black px-1 py-0.5 rounded border uppercase leading-none ${
                        isPublic 
                          ? 'bg-orange-50 text-primary border-orange-100' 
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {est.edificio.ambito}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 truncate flex items-center gap-1 font-bold">
                      <MapPin className="h-2.5 w-2.5 text-slate-300" />
                      <span>{(est.edificio.zonaDepartamento || 'San Juan').toUpperCase()} • {est.edificio.calle || 'Sin Calle'}</span>
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })
          )}
        </div>

        {/* Legend / Checkbox Multiple Selection Filters */}
        <div className="p-4 border-t border-slate-100 bg-white shadow-inner">
          <div className="flex gap-2">
            <button 
              onClick={() => handleToggleGestion('PUBLICO')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                selectedGestiones.includes('PUBLICO') 
                  ? 'bg-orange-50 text-primary border-primary/30 shadow-sm shadow-orange-500/5 font-black' 
                  : 'bg-slate-50 text-slate-400 border-slate-100 font-medium'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded flex items-center justify-center ${
                selectedGestiones.includes('PUBLICO') ? 'bg-primary' : 'bg-slate-300'
              }`} />
              <span>Estatal</span>
            </button>
            <button 
              onClick={() => handleToggleGestion('PRIVADO')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                selectedGestiones.includes('PRIVADO') 
                  ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm shadow-blue-500/5 font-black' 
                  : 'bg-slate-50 text-slate-400 border-slate-100 font-medium'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded flex items-center justify-center ${
                selectedGestiones.includes('PRIVADO') ? 'bg-blue-500' : 'bg-slate-300'
              }`} />
              <span>Privado</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Sidebar Trigger */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute top-6 z-20 bg-white/95 backdrop-blur-md rounded-r-2xl border border-l-0 border-slate-200 p-3 shadow-xl hover:bg-orange-50/20 transition-all ${
          sidebarOpen ? 'left-80' : 'left-0'
        }`}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-4 w-4 text-primary" />
        ) : (
          <ChevronRight className="h-4 w-4 text-primary" />
        )}
      </button>

      {/* Access Control Panels (Top Right) */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        {isAuthenticated ? (
          <div className="flex gap-2">
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-white/95 backdrop-blur-md rounded-xl px-5 py-3 shadow-xl hover:bg-orange-50 hover:scale-105 transition-all text-primary border border-slate-100 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Panel de Control</span>
            </button>
            <button 
              onClick={() => {
                logout();
                router.refresh();
              }}
              className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl hover:bg-red-50 hover:scale-105 transition-all text-red-500 border border-slate-100 font-black text-[10px] uppercase tracking-widest flex items-center justify-center"
              title="Cerrar Sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => router.push('/sue-admin')}
            className="bg-white/95 backdrop-blur-md rounded-xl px-5 py-3 shadow-xl hover:bg-orange-50 hover:scale-105 transition-all text-primary border border-slate-100 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group"
          >
            <User className="h-4 w-4 transition-transform group-hover:rotate-12" />
            <span>Acceso Administrativo</span>
          </button>
        )}
      </div>

      {/* Premium Layers Selector (Top Right, Below Access Control) (Requerimiento Extra) */}
      <div className="absolute top-24 right-6 z-20 flex flex-col items-end gap-2 font-outfit">
        <button
          onClick={() => setLayersPanelOpen(!layersPanelOpen)}
          className={`flex items-center justify-center p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-100 hover:bg-orange-50/20 hover:scale-105 transition-all text-primary ${
            layersPanelOpen ? 'ring-2 ring-primary/20' : ''
          }`}
          title="Capas del Mapa"
        >
          <Layers className="h-4.5 w-4.5" />
        </button>

        {layersPanelOpen && (
          <div className="w-64 bg-white/95 backdrop-blur-md border border-slate-100 rounded-3xl p-5 shadow-2xl animate-fade-in flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">
                Capas del Mapa
              </h3>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-tight mt-1.5">
                Configura la visualización
              </p>
            </div>

            <div className="space-y-3">
              {/* Departamentos Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${showDepartments ? 'bg-orange-50 text-primary' : 'bg-slate-50 text-slate-400'} border ${showDepartments ? 'border-orange-100' : 'border-slate-100'} transition-colors`}>
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700">Departamentos</span>
                </div>
                <input
                  type="checkbox"
                  checked={showDepartments}
                  onChange={(e) => setShowDepartments(e.target.checked)}
                  className="w-4 h-4 rounded text-primary border-slate-200 focus:ring-primary/20 cursor-pointer accent-primary"
                />
              </label>

              {/* Escuelas Toggle */}
              <label className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${showSchools ? 'bg-orange-50 text-primary' : 'bg-slate-50 text-slate-400'} border ${showSchools ? 'border-orange-100' : 'border-slate-100'} transition-colors`}>
                    <School className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700">Escuelas</span>
                </div>
                <input
                  type="checkbox"
                  checked={showSchools}
                  onChange={(e) => setShowSchools(e.target.checked)}
                  className="w-4 h-4 rounded text-primary border-slate-200 focus:ring-primary/20 cursor-pointer accent-primary"
                />
              </label>

              {/* Transporte (Soon) */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl opacity-60 border border-dashed border-slate-200 select-none">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bus"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2 11.3 2 11.6 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M2 12h20"/><path d="M8 12v-3.5c0-.8.7-1.5 1.5-1.5h1.5"/></svg>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-500 truncate w-32 inline-block">Transporte</span>
                    <span className="block text-[7px] font-black tracking-widest text-primary uppercase mt-0.5">Próximamente</span>
                  </div>
                </div>
              </div>

              {/* Densidad de Escuelas (Soon) */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl opacity-60 border border-dashed border-slate-200 select-none">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-500 truncate w-32 inline-block">Densidad (Calor)</span>
                    <span className="block text-[7px] font-black tracking-widest text-primary uppercase mt-0.5">Próximamente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Zoom controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-3">
        <button 
          onClick={() => setTriggerZoom('in')}
          className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl hover:bg-orange-50/20 hover:scale-105 transition-all text-primary border border-slate-200"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button 
          onClick={() => setTriggerZoom('out')}
          className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl hover:bg-orange-50/20 hover:scale-105 transition-all text-primary border border-slate-200"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* Support / Error Report Trigger */}
      <button 
        onClick={() => window.open('mailto:soporte@educacion.gob.ar?subject=Reporte%20de%20Error%20SUE%20Mapa', '_blank')}
        className="absolute bottom-6 right-24 z-20 bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-xl hover:scale-105 transition-all flex items-center gap-2.5 border border-slate-100 group"
      >
        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
          <Bug className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Reportar Error</span>
      </button>
    </div>
  );
}

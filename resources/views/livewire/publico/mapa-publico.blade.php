<div class="relative h-[calc(100vh-64px)] w-screen overflow-hidden" 
     x-data="{ sidebarOpen: true, searchQuery: '', selectedEstablishment: null, showPublic: true, showPrivate: true }"
     x-init="$watch('searchQuery', value => filterContent(value, showPublic, showPrivate));
             $watch('showPublic', value => filterContent(searchQuery, value, showPrivate));
             $watch('showPrivate', value => filterContent(searchQuery, showPublic, value));">
    <!-- Mapa (pantalla completa) -->
    <div id="map" class="absolute inset-0 z-0"></div>

    <!-- Panel Lateral (Sidebar) -->
    <div class="absolute top-0 left-0 h-full z-10 transition-all duration-500 ease-in-out"
         :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
        <div class="h-full w-80 glass-strong shadow-2xl flex flex-col border-r border-orange-100/30 animate-fade-in text-black">
            <!-- Header del Panel -->
            <div class="p-6 border-b border-orange-100 bg-orange-50/30">
                <nav class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3 text-primary-orange">
                    <i class="fas fa-university"></i>
                    <span>Ministerio de Educación</span>
                </nav>
                <div class="flex items-center gap-3">
                    <div class="p-2.5 rounded-xl bg-white border border-orange-100 shadow-sm text-primary-orange">
                        <i class="fas fa-map-marked-alt fa-lg"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-black tracking-tight text-gray-900 leading-tight">
                            Mapa de <span class="text-primary-orange">Escuelas</span>
                        </h2>
                        <p class="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">San Juan, Argentina</p>
                    </div>
                </div>
            </div>

            <!-- Buscador -->
            <div class="p-4 bg-white/50 border-b border-orange-50">
                <div class="relative group">
                    <input type="text" 
                           x-model="searchQuery"
                           placeholder="Buscar por Nombre, CUE o CUI..."
                           class="input-glass w-full pl-10 pr-4 py-2.5 rounded-xl transition-all border-orange-100/50 focus:border-primary-orange">
                    <i class="fas fa-search absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-primary-orange transition-colors"></i>
                </div>
            </div>

            <!-- Lista de Establecimientos -->
            <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" id="establishments-list">
                <!-- Los establecimientos se cargarán dinámicamente aquí -->
                <div class="flex items-center justify-center h-full">
                    <i class="fas fa-circle-notch fa-spin text-primary-orange fa-2x"></i>
                </div>
            </div>

            <!-- Legend / Filter Pilles -->
            <div class="p-4 border-t border-orange-100 bg-orange-50/20 backdrop-blur-sm">
                <div class="flex items-center gap-2">
                    <button @click="showPublic = !showPublic" 
                            class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all border"
                            :class="showPublic 
                                ? 'bg-orange-50 text-primary-orange border-primary-orange/30 shadow-sm' 
                                : 'bg-gray-50 text-gray-400 border-gray-100 grayscale'">
                        <div class="w-2 h-2 rounded-full bg-primary-orange shadow-sm shadow-orange-500/50"></div>
                        <span>Público</span>
                    </button>
                    <button @click="showPrivate = !showPrivate"
                            class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all border"
                            :class="showPrivate 
                                ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm' 
                                : 'bg-gray-50 text-gray-400 border-gray-100 grayscale'">
                        <div class="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
                        <span>Privado</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Botón Toggle Sidebar -->
    <button @click="sidebarOpen = !sidebarOpen"
            class="absolute top-6 z-20 transition-all duration-300 glass-strong rounded-r-xl border border-l-0 border-orange-100/50 p-3 shadow-xl hover:bg-orange-50 group"
            :class="sidebarOpen ? 'left-80' : 'left-0'">
        <i class="fas fa-chevron-left text-primary-orange transition-transform duration-500"
           :class="sidebarOpen ? 'rotate-0' : 'rotate-180'"></i>
    </button>

    <!-- Botón Reportar Error -->
    <button onclick="window.open('mailto:soporte@educacion.gob.ar?subject=Reporte de Error en Mapa', '_blank')"
            class="absolute bottom-6 right-20 z-20 glass-strong rounded-full px-5 py-2.5 shadow-xl hover:scale-105 transition-all flex items-center gap-2.5 group border border-orange-100/50">
        <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <i class="fas fa-bug text-sm"></i>
        </div>
        <span class="text-sm font-black text-gray-800 tracking-tight">Reportar Error</span>
    </button>

    <!-- Zoom Controls -->
    <div class="absolute bottom-6 right-6 z-20 flex flex-col gap-3">
        <button onclick="map.zoomIn()"
                class="glass-strong rounded-xl p-3 shadow-xl hover:bg-orange-50 hover:scale-110 transition-all text-primary-orange border border-orange-100/50">
            <i class="fas fa-plus"></i>
        </button>
        <button onclick="map.zoomOut()"
                class="glass-strong rounded-xl p-3 shadow-xl hover:bg-orange-50 hover:scale-110 transition-all text-primary-orange border border-orange-100/50">
            <i class="fas fa-minus"></i>
        </button>
    </div>
</div>

@push('scripts')
<script>
    let map;
    let markers = [];
    let establishments = @json($edificios);

    document.addEventListener('DOMContentLoaded', function() {
        // Inicializar mapa centrado en San Juan
        map = L.map('map', {
            zoomControl: false // Desactivar controles por defecto
        }).setView([-31.5375, -68.5364], 11);
        
        // Tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Cargar edificios directamente desde Livewire
        if (establishments && establishments.length > 0) {
            renderEstablishments(establishments);
            addMarkersToMap(establishments);
        } else {
            document.getElementById('establishments-list').innerHTML = 
                '<p class="text-center text-gray-400 py-8">No hay establecimientos con coordenadas disponibles</p>';
        }
    });

    function addMarkersToMap(edificios) {
        edificios.forEach(edificio => {
            const isPublic = edificio.ambito === 'PUBLICO';
            const color = isPublic ? '#FE8204' : '#3B82F6';
            
            const marker = L.circleMarker([edificio.latitud, edificio.longitud], {
                radius: 12,
                fillColor: color,
                color: '#fff',
                weight: 4,
                opacity: 1,
                fillOpacity: 0.9,
                className: 'marker-pulse'
            }).addTo(map);
            
            // Popup con diseño Premium (Similar a ModalidadesTable row)
            let popupContent = `
                <div class="p-1 min-w-[300px]">
                    <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                        <div class="p-2 rounded-lg ${isPublic ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}">
                            <i class="fas fa-school"></i>
                        </div>
                        <div>
                            <h3 class="font-black text-gray-900 leading-tight uppercase text-sm">${edificio.localidad || 'Edificio Educativo'}</h3>
                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tight">${edificio.calle} ${edificio.numero_puerta || 'S/N'}</p>
                        </div>
                    </div>
                    
                    <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Establecimientos en este edificio:</p>
            `;
            
            edificio.establecimientos.forEach(est => {
                popupContent += `
                    <div class="p-3 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors group">
                        <p class="text-[11px] font-black text-gray-800 mb-2 leading-snug uppercase">${est.nombre}</p>
                        <div class="grid grid-cols-2 gap-2 mb-2">
                             <div class="flex flex-col">
                                <span class="text-[8px] text-gray-400 font-bold uppercase">CUE</span>
                                <span class="text-[10px] font-mono font-bold text-gray-700">${est.cue}</span>
                            </div>
                        </div>
                        <div class="space-y-2">
                            ${(est.modalidades || []).map(mod => `
                                <div class="p-2 bg-white border border-gray-100 rounded-lg">
                                    <span class="text-[8px] text-gray-400 font-bold uppercase block mb-0.5">Nivel / Area</span>
                                    <div class="flex flex-wrap gap-1">
                                        <span class="px-1.5 py-0.5 rounded bg-orange-50 border border-orange-100 text-[9px] font-bold text-primary-orange uppercase">${mod.nivel}</span>
                                        <span class="px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100 text-[9px] font-bold text-gray-500 uppercase truncate max-w-[150px]">${mod.area}</span>
                                    </div>
                                    <div class="flex gap-2 mt-1">
                                        <span class="text-[8px] text-gray-400 font-medium italic">Radio: ${mod.radio}</span>
                                        <span class="text-[8px] text-gray-400 font-medium italic">Cat: ${mod.categoria}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
            
            popupContent += `</div></div>`;
            
            marker.bindPopup(popupContent, {
                maxWidth: 350,
                minWidth: 300,
                className: 'custom-popup'
            });

            marker.edificioData = edificio;
            markers.push(marker);
        });
    }

    function renderEstablishments(edificios) {
        const container = document.getElementById('establishments-list');
        container.innerHTML = '';

        if (edificios.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-12 text-gray-400 animate-fade-in">
                    <div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                        <i class="fas fa-search fa-2xl"></i>
                    </div>
                    <p class="font-bold text-gray-500">Sin resultados</p>
                    <p class="text-[10px] font-medium text-center px-4">Prueba ajustando los filtros o el nombre</p>
                </div>
            `;
            return;
        }

        edificios.forEach(edificio => {
            const isPublic = edificio.ambito === 'PUBLICO';
            const color = isPublic ? '#FE8204' : '#3B82F6';
            
            // Crear una card por cada establecimiento
            edificio.establecimientos.forEach(est => {
                const card = document.createElement('div');
                card.className = 'group relative glass p-4 rounded-xl border border-orange-100/30 hover:border-primary-orange hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-0.5 transition-all cursor-pointer animate-fade-in';
                
                card.innerHTML = `
                    <div class="flex items-start gap-3">
                        <div class="w-1 h-10 rounded-full ${isPublic ? 'bg-primary-orange' : 'bg-blue-500'} flex-shrink-0"></div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-black text-gray-900 text-[11px] leading-tight uppercase group-hover:text-primary-orange transition-colors mb-1 truncate">${est.nombre}</h4>
                            <div class="flex gap-2 mb-2">
                                <span class="bg-gray-100 text-gray-500 font-mono text-[9px] px-1.5 py-0.5 rounded border border-gray-200">CUE: ${est.cue}</span>
                                <span class="bg-${isPublic ? 'orange' : 'blue'}-50 text-${isPublic ? 'orange' : 'blue'}-600 text-[9px] font-black px-1.5 py-0.5 rounded border border-${isPublic ? 'orange' : 'blue'}-100 uppercase">${edificio.ambito}</span>
                            </div>
                            <div class="space-y-1">
                                <p class="text-[10px] text-gray-600 flex items-center gap-1.5">
                                    <i class="fas fa-map-marker-alt text-gray-300 w-3 text-center"></i>
                                    <span class="truncate">${edificio.calle} ${edificio.numero_puerta || 'S/N'}</span>
                                </p>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    ${(est.modalidades || []).map(mod => `
                                        <span class="px-1 py-0.5 rounded bg-gray-50 border border-gray-100 text-[8px] font-bold text-gray-500 uppercase shrink-0">${mod.nivel}</span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        <div class="self-center transform translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary-orange">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                `;
            
                card.onclick = () => {
                    map.setView([edificio.latitud, edificio.longitud], 16);
                    const marker = markers.find(m => m.edificioData.id === edificio.id);
                    if (marker) {
                        marker.openPopup();
                    }
                };
                
                container.appendChild(card);
            });
        });
    }

    function centerMap() {
        map.setView([-31.5375, -68.5364], 11);
    }

    // Búsqueda en tiempo real
    function filterContent(query, showPublic, showPrivate) {
        query = query.toLowerCase();
        
        // Filtrar lista y marcadores
        const filtered = establishments.filter(edificio => {
            // Filtro por tipo (Publico/Privado)
            if (edificio.ambito === 'PUBLICO' && !showPublic) return false;
            if (edificio.ambito === 'PRIVADO' && !showPrivate) return false;

            // Filtro por texto
            if (!query) return true;
            
            return (edificio.localidad || '').toLowerCase().includes(query) ||
                   (edificio.calle || '').toLowerCase().includes(query) ||
                   edificio.establecimientos.some(est => 
                       (est.nombre || '').toLowerCase().includes(query) || 
                       String(est.cue).toLowerCase().includes(query)
                   );
        });

        renderEstablishments(filtered);
        filterMarkers(filtered);
    }

    function filterMarkers(filteredEdificios) {
        // Obtenemos los IDs de los edificios visibles
        const visibleIds = new Set(filteredEdificios.map(e => e.id));

        markers.forEach(marker => {
            if (visibleIds.has(marker.edificioData.id)) {
                if (!map.hasLayer(marker)) {
                    map.addLayer(marker);
                }
            } else {
                if (map.hasLayer(marker)) {
                    map.removeLayer(marker);
                }
            }
        });
    }

    // Eliminamos el listener manual ya que usamos watchers de Alpine
    // document.addEventListener('input', ...);
</script>

<style>
    /* Custom Scrollbar for Sidebar */
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #FE820430;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #FE820460;
    }

    /* Popup Styling */
    .custom-popup .leaflet-popup-content-wrapper {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(254, 130, 4, 0.05);
        border: 1px solid rgba(254, 130, 4, 0.1);
        padding: 5px;
    }
    
    .custom-popup .leaflet-popup-tip {
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }

    .custom-popup .leaflet-popup-content {
        margin: 12px;
    }

    /* Marker Animation */
    .marker-pulse {
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform-origin: center;
        transform-box: fill-box;
    }
    .marker-pulse:hover {
        transform: scale(1.3);
        filter: drop-shadow(0 0 10px rgba(254, 130, 4, 0.6));
        cursor: pointer;
    }

    /* Leaflet Controls Adjustments */
    .leaflet-container {
        font-family: 'Inter', sans-serif !important;
    }
</style>
@endpush

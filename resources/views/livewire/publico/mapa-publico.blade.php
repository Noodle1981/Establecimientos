<div class="relative h-[calc(100vh-64px)] w-screen overflow-hidden" x-data="{ sidebarOpen: true, searchQuery: '', selectedEstablishment: null }">
    <!-- Mapa (pantalla completa) -->
    <div id="map" class="absolute inset-0 z-0"></div>

    <!-- Panel Lateral (Sidebar) -->
    <div class="absolute top-0 left-0 h-full z-10 transition-transform duration-300"
         :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
        <div class="h-full w-72 glass-strong shadow-2xl flex flex-col">
            <!-- Header del Panel -->
            <div class="p-4 border-b border-gray-200">
                <h2 class="text-2xl font-bold text-black mb-2">🏫 Establecimientos</h2>
                <p class="text-sm text-gray-600">San Juan, Argentina</p>
            </div>

            <!-- Buscador -->
            <div class="p-4 border-b border-gray-200">
                <div class="relative">
                    <input type="text" 
                           x-model="searchQuery"
                           placeholder="Buscar establecimiento..."
                           class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition">
                    <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>

            <!-- Lista de Establecimientos -->
            <div class="flex-1 overflow-y-auto p-4 space-y-3" id="establishments-list">
                <!-- Los establecimientos se cargarán dinámicamente aquí -->
            </div>

            <!-- Leyenda -->
            <div class="p-4 border-t border-gray-200 bg-white bg-opacity-50">
                <div class="flex items-center justify-around text-xs">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full" style="background-color: #FF8200;"></div>
                        <span class="font-medium">Público</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="font-medium">Privado</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Botón Toggle Sidebar -->
    <button @click="sidebarOpen = !sidebarOpen"
            class="absolute top-4 z-20 transition-all duration-300 glass-strong rounded-full p-3 shadow-lg hover:scale-110"
            :class="sidebarOpen ? 'left-72' : 'left-4'">
        <svg class="w-6 h-6 transition-transform duration-300" 
             :class="sidebarOpen ? 'rotate-0' : 'rotate-180'"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
    </button>

    <!-- Botón Reportar Error -->
    <button onclick="window.open('mailto:soporte@educacion.gob.ar?subject=Reporte de Error en Mapa', '_blank')"
            class="absolute bottom-4 right-16 z-20 glass-strong rounded-full px-4 py-2 shadow-lg hover:scale-105 transition-transform flex items-center gap-2 group">
        <i class="fas fa-bug text-red-500 group-hover:animate-pulse"></i>
        <span class="text-sm font-bold text-gray-800">Reportar Error</span>
    </button>

    <!-- Zoom Controls -->
    <div class="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button onclick="map.zoomIn()"
                class="glass-strong rounded-lg p-2 shadow-lg hover:scale-110 transition-transform text-gray-700 hover:text-orange-500">
            <i class="fas fa-plus fa-lg"></i>
        </button>
        <button onclick="map.zoomOut()"
                class="glass-strong rounded-lg p-2 shadow-lg hover:scale-110 transition-transform text-gray-700 hover:text-orange-500">
            <i class="fas fa-minus fa-lg"></i>
        </button>
    </div>
</div>

@push('scripts')
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

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
            const color = edificio.ambito === 'PUBLICO' ? '#FF8200' : '#3B82F6';
            
            const marker = L.circleMarker([edificio.latitud, edificio.longitud], {
                radius: 10,
                fillColor: color,
                color: '#fff',
                weight: 3,
                opacity: 1,
                fillOpacity: 0.9
            }).addTo(map);
            
            // Popup con información expandida
            let popupContent = `
                <div class="p-3 min-w-[320px] max-w-[400px]">
                    <h3 class="font-bold text-black mb-1.5 text-base">${edificio.localidad}</h3>
                    <p class="text-xs text-gray-600 mb-2">
                        <strong>📍</strong> ${edificio.calle} ${edificio.numero_puerta || 'S/N'}
                    </p>
                    <div class="border-t pt-2">
                        <p class="text-[10px] font-semibold mb-2" style="color: #FF8200;">Establecimientos (${edificio.establecimientos.length}):</p>
                        <div class="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            `;
            
            edificio.establecimientos.forEach(est => {
                popupContent += `
                    <div class="p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <p class="text-xs font-bold text-black mb-1.5">${est.nombre}</p>
                        <div class="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
                            <div class="flex gap-1">
                                <p class="text-gray-500">CUE:</p>
                                <p class="font-medium text-gray-700">${est.cue}</p>
                            </div>
                            <div class="flex gap-1">
                                <p class="text-gray-500">Radio:</p>
                                <p class="font-medium text-gray-700">${est.radio}</p>
                            </div>
                            <div class="flex gap-1">
                                <p class="text-gray-500">Nivel:</p>
                                <p class="font-medium text-gray-700">${est.nivel_educativo}</p>
                            </div>
                            <div class="flex gap-1">
                                <p class="text-gray-500">Categoría:</p>
                                <p class="font-medium text-gray-700">${est.categoria}</p>
                            </div>
                            <div class="col-span-2 flex gap-1">
                                <p class="text-gray-500">Dirección de Área:</p>
                                <p class="font-medium text-gray-700">${est.direccion_area}</p>
                            </div>
                            <div class="col-span-2 flex gap-1">
                                <p class="text-gray-500">Departamento/Zona:</p>
                                <p class="font-medium text-gray-700">${edificio.zona_departamento || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            popupContent += `</div></div></div>`;
            
            marker.bindPopup(popupContent, {
                maxWidth: 450,
                minWidth: 320,
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
            container.innerHTML = '<p class="text-center text-gray-400 py-8">No se encontraron establecimientos</p>';
            return;
        }

        edificios.forEach(edificio => {
            const color = edificio.ambito === 'PUBLICO' ? '#FF8200' : '#3B82F6';
            
            // Crear una card por cada establecimiento
            edificio.establecimientos.forEach(est => {
                const card = document.createElement('div');
                card.className = 'bg-white rounded-lg p-3 shadow hover:shadow-lg transition cursor-pointer border-l-4 mb-2';
                card.style.borderColor = color;
                
                card.innerHTML = `
                    <h4 class="font-bold text-black mb-1 text-sm leading-tight">${est.nombre}</h4>
                    <p class="text-xs text-gray-500 mb-2">CUE: ${est.cue}</p>
                    <p class="text-xs text-gray-600 mb-1">
                        <span class="font-medium">📍</span> ${edificio.calle} ${edificio.numero_puerta || 'S/N'}
                    </p>
                    <p class="text-xs text-gray-600 mb-2">
                        <span class="font-medium">📌</span> ${edificio.zona_departamento || edificio.localidad}
                    </p>
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-xs px-2 py-1 rounded-full font-medium" style="background-color: ${color}20; color: ${color};">
                            ${edificio.ambito}
                        </span>
                    </div>
                `;
            
                card.onclick = () => {
                    map.setView([edificio.latitud, edificio.longitud], 16);
                    const marker = markers.find(m => m.edificioData.cui === edificio.cui);
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
    document.addEventListener('input', (e) => {
        if (e.target.matches('input[x-model="searchQuery"]')) {
            const query = e.target.value.toLowerCase();
            const filtered = establishments.filter(edificio => 
                edificio.localidad.toLowerCase().includes(query) ||
                edificio.calle.toLowerCase().includes(query) ||
                edificio.establecimientos.some(est => est.nombre.toLowerCase().includes(query))
            );
            renderEstablishments(filtered);
        }
    });
</script>

<style>
    .custom-popup .leaflet-popup-content-wrapper {
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    
    .custom-popup .leaflet-popup-tip {
        box-shadow: 0 3px 14px rgba(0,0,0,0.1);
    }
</style>
@endpush

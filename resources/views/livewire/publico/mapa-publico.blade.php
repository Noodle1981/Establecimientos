<div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="glass rounded-2xl p-8">
            <h1 class="text-3xl font-bold text-black mb-6">Mapa de Establecimientos Educativos</h1>
            
            <!-- Mapa -->
            <div id="map" class="w-full h-[600px] rounded-xl" style="border: 2px solid var(--primary-orange);"></div>
            
            <!-- Leyenda -->
            <div class="mt-6 glass rounded-xl p-4">
                <h3 class="font-semibold text-black mb-3">Leyenda</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 rounded-full" style="background-color: var(--primary-orange);"></div>
                        <span class="text-sm">Público</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 rounded-full bg-blue-500"></div>
                        <span class="text-sm">Privado</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Inicializar mapa centrado en San Juan
        const map = L.map('map').setView([-31.5375, -68.5364], 10);
        
        // Tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Cargar edificios con modalidades
        fetch('/api/edificios-mapa')
            .then(response => response.json())
            .then(edificios => {
                edificios.forEach(edificio => {
                    const color = edificio.ambito === 'PUBLICO' ? '#FF8200' : '#3B82F6';
                    
                    const marker = L.circleMarker([edificio.latitud, edificio.longitud], {
                        radius: 8,
                        fillColor: color,
                        color: '#fff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(map);
                    
                    // Popup con información
                    let popupContent = `
                        <div class="p-2">
                            <h3 class="font-bold text-black mb-2">${edificio.localidad}</h3>
                            <p class="text-sm text-gray-600 mb-2">${edificio.calle} ${edificio.numero_puerta || ''}</p>
                            <div class="border-t pt-2">
                                <p class="text-xs font-semibold mb-1">Establecimientos:</p>
                    `;
                    
                    edificio.establecimientos.forEach(est => {
                        popupContent += `<p class="text-xs">• ${est.nombre}</p>`;
                    });
                    
                    popupContent += `</div></div>`;
                    
                    marker.bindPopup(popupContent);
                });
            });
    });
</script>
@endpush

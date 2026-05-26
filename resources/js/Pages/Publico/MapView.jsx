/**
 * MapView.jsx
 * Heavy map component — loaded lazily via React.lazy to keep the main bundle lean.
 * All react-leaflet and leaflet imports live here so they are split into a separate chunk.
 */
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, GeoJSON } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// --- Internal sub-components ---

function MapController({ selected, sidebarOpen, filterDepto, geojsonData }) {
    const map = useMap();

    // Fix map size when sidebar toggles
    useEffect(() => {
        const id = setTimeout(() => {
            map.invalidateSize({ animate: true });
        }, 500);
        return () => clearTimeout(id);
    }, [sidebarOpen, map]);

    useEffect(() => {
        if (selected) {
            const zoom = selected.zoom || 16;
            map.flyTo([selected.latitud, selected.longitud], zoom, {
                animate: true,
                duration: 1.5,
            });
        }
    }, [selected, map]);

    // Fit bounds of selected department
    useEffect(() => {
        if (filterDepto && filterDepto !== 'TODOS' && geojsonData) {
            const feature = geojsonData.features.find(f => 
                f.properties && 
                f.properties.departamento && 
                f.properties.departamento.toUpperCase() === filterDepto.toUpperCase()
            );

            if (feature) {
                try {
                    const tempLayer = L.geoJSON(feature);
                    const bounds = tempLayer.getBounds();
                    if (bounds.isValid()) {
                        map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });
                    }
                } catch (err) {
                    console.error("Error zooming to department bounds:", err);
                }
            }
        }
    }, [filterDepto, geojsonData, map]);

    return null;
}

// --- Main Export ---

// --- Custom High Priority TileLayer ---
// This ensures every <img> tag for the map tiles has fetchpriority="high"
import L from 'leaflet';
import { createTileLayerComponent, updateGridLayer, withPane } from '@react-leaflet/core';

const HighPriorityTileLayer = createTileLayerComponent(
    (props, context) => {
        const layer = new L.TileLayer(props.url, withPane(props, context));
        // Manual override of tile creation to inject performance attributes
        const originalCreateTile = layer.createTile;
        layer.createTile = function(coords, done) {
            const tile = originalCreateTile.call(layer, coords, done);
            tile.setAttribute('fetchpriority', 'high');
            tile.setAttribute('loading', 'eager'); // Ensure they don't lazy load
            return tile;
        };
        return { instance: layer, context };
    },
    updateGridLayer
);

export default function MapView({
    filteredEdificios,
    selectedEdificio,
    setSelectedEdificio,
    hoveredEdificioId,
    setHoveredEdificioId,
    sidebarOpen,
    showDeptoBorders = true,
    filterDepto = 'TODOS',
}) {
    const [geojsonData, setGeojsonData] = useState(null);

    useEffect(() => {
        fetch('/geojson/departamentos-san_juan.json')
            .then(res => res.json())
            .then(data => setGeojsonData(data))
            .catch(err => console.error("Error loading GeoJSON:", err));
    }, []);

    const onEachFeature = (feature, layer) => {
        if (feature.properties && feature.properties.departamento) {
            // Bind tooltips beautifully
            layer.bindTooltip(feature.properties.departamento.toUpperCase(), {
                sticky: true,
                className: 'custom-depto-tooltip font-bold text-xs bg-white text-gray-800 px-2.5 py-1 rounded-xl shadow-md border border-orange-100',
            });

            layer.on({
                mouseover: (e) => {
                    const l = e.target;
                    l.setStyle({
                        fillOpacity: 0.12,
                        weight: 2.5,
                        color: '#FE8204',
                    });
                },
                mouseout: (e) => {
                    const l = e.target;
                    l.setStyle({
                        fillOpacity: 0.03,
                        weight: 1.5,
                        color: '#FE8204',
                    });
                },
                click: (e) => {
                    const map = e.target._map;
                    if (map && typeof e.target.getBounds === 'function') {
                        try {
                            map.fitBounds(e.target.getBounds(), { padding: [50, 50] });
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            });
        }
    };

    return (
        <MapContainer
            center={[-31.5375, -68.5364]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <HighPriorityTileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                subdomains="abcd"
                keepBuffer={2}
                updateWhenIdle={true}
                updateWhenZooming={false}
            />

            <MapController 
                selected={selectedEdificio} 
                sidebarOpen={sidebarOpen} 
                filterDepto={filterDepto}
                geojsonData={geojsonData}
            />

            {showDeptoBorders && geojsonData && (
                <GeoJSON
                    data={geojsonData}
                    style={{
                        color: '#FE8204',
                        weight: 1.5,
                        fillColor: '#FE8204',
                        fillOpacity: 0.03,
                        dashArray: '3',
                    }}
                    onEachFeature={onEachFeature}
                />
            )}

            {/* Standalone Popup for selected building — opens automatically */}
            {selectedEdificio && selectedEdificio.establecimientos && (
                <Popup
                    position={[selectedEdificio.latitud, selectedEdificio.longitud]}
                    onClose={() => setSelectedEdificio(null)}
                    className="custom-popup"
                    maxWidth={300}
                    minWidth={280}
                >
                    <div className="p-2 text-black">
                        <div className="flex items-center gap-2 mb-3 border-b pb-2">
                            <div
                                className={`p-2 rounded-lg ${
                                    selectedEdificio.ambito === 'PUBLICO'
                                        ? 'bg-orange-50 text-brand-orange'
                                        : 'bg-blue-50 text-blue-600'
                                }`}
                            >
                                <i className="fas fa-school"></i>
                            </div>
                            <div>
                                <h5 className="text-xs font-black text-gray-900 leading-tight uppercase">
                                    {selectedEdificio.localidad}
                                </h5>
                                <p className="text-[10px] text-gray-400 font-bold">
                                    {selectedEdificio.calle} {selectedEdificio.numero_puerta}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                            {selectedEdificio.establecimientos?.map((est, i) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[11px] font-black text-gray-800 mb-2">{est.nombre}</p>
                                    <div className="space-y-1.5">
                                        {est.modalidades?.map((mod, j) => (
                                            <div key={j} className="p-2 bg-white rounded-lg border border-gray-100">
                                                <div className="flex gap-1.5 flex-wrap">
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-brand-orange border border-orange-100">
                                                        {mod.nivel}
                                                    </span>
                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100 truncate max-w-[150px]">
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
            )}

            {/* Markers */}
            {filteredEdificios.map((edificio) => (
                <CircleMarker
                    key={edificio.id}
                    center={[edificio.latitud, edificio.longitud]}
                    radius={
                        hoveredEdificioId === edificio.id || selectedEdificio?.id === edificio.id ? 14 : 9
                    }
                    pathOptions={{
                        fillColor: edificio.ambito === 'PUBLICO' ? '#FE8204' : '#3B82F6',
                        color: 'white',
                        weight:
                            hoveredEdificioId === edificio.id || selectedEdificio?.id === edificio.id ? 4 : 2,
                        fillOpacity:
                            hoveredEdificioId === edificio.id || selectedEdificio?.id === edificio.id ? 1 : 0.8,
                    }}
                    eventHandlers={{
                        click: () => setSelectedEdificio(edificio),
                        mouseover: () => setHoveredEdificioId(edificio.id),
                        mouseout: () => setHoveredEdificioId(null),
                    }}
                />
            ))}
        </MapContainer>
    );
}

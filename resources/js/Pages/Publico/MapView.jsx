/**
 * MapView.jsx
 * Heavy map component — loaded lazily via React.lazy to keep the main bundle lean.
 * All react-leaflet and leaflet imports live here so they are split into a separate chunk.
 */
import {
    createTileLayerComponent,
    updateGridLayer,
    withPane,
} from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { memo, useCallback, useEffect, useState } from 'react';
import {
    CircleMarker,
    GeoJSON,
    MapContainer,
    useMap,
    useMapEvents,
} from 'react-leaflet';

// --- Internal sub-components ---

/**
 * Clears selectedEdificio when user clicks on the bare map background
 * (not on a marker or polygon).
 */
const ClearSelection = ({ onClear }) => {
    useMapEvents({
        click: (e) => {
            const target = e.originalEvent?.target;
            if (target && target.classList?.contains('leaflet-interactive'))
                return;
            onClear();
        },
    });
    return null;
};

function MapController({ selected, sidebarOpen, filterDepto, geojsonData }) {
    const map = useMap();

    // Fix map size when sidebar toggles
    useEffect(() => {
        const id = setTimeout(() => map.invalidateSize({ animate: true }), 500);
        return () => clearTimeout(id);
    }, [sidebarOpen, map]);

    // Fly to selected marker
    useEffect(() => {
        if (selected && selected.latitud) {
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
            const feature = geojsonData.features.find(
                (f) =>
                    f.properties?.departamento?.toUpperCase() ===
                    filterDepto.toUpperCase(),
            );
            if (feature) {
                try {
                    const bounds = L.geoJSON(feature).getBounds();
                    if (bounds.isValid()) {
                        map.fitBounds(bounds, {
                            padding: [50, 50],
                            animate: true,
                            duration: 1.5,
                        });
                    }
                } catch (err) {
                    console.error('Error zooming to department bounds:', err);
                }
            }
        }
    }, [filterDepto, geojsonData, map]);

    return null;
}

// --- Custom High Priority TileLayer ---
const HighPriorityTileLayer = createTileLayerComponent((props, context) => {
    const layer = new L.TileLayer(props.url, withPane(props, context));
    const originalCreateTile = layer.createTile;
    layer.createTile = function (coords, done) {
        const tile = originalCreateTile.call(layer, coords, done);
        tile.setAttribute('fetchpriority', 'high');
        tile.setAttribute('loading', 'eager');
        return tile;
    };
    return { instance: layer, context };
}, updateGridLayer);

// --- School Info Card (pure HTML, no Leaflet Popup) ---
const SchoolCard = memo(
    function SchoolCard({ edificio, onClose }) {
        if (!edificio || !edificio.establecimientos) return null;

        return (
            <div
                className="school-card"
                role="dialog"
                aria-modal="true"
                aria-label="Información del establecimiento"
            >
                {/* Header */}
                <div className="school-card__header">
                    <div className="school-card__header-left">
                        <div
                            className={`school-card__icon ${edificio.ambito === 'PUBLICO' ? 'school-card__icon--orange' : 'school-card__icon--blue'}`}
                        >
                            <i className="fas fa-school"></i>
                        </div>
                        <div>
                            <h5 className="school-card__depto">
                                {edificio.zona_departamento ||
                                    'Sin Departamento'}
                            </h5>
                            <p className="school-card__localidad">
                                {edificio.localidad}
                            </p>
                            <p className="school-card__address">
                                {edificio.calle} {edificio.numero_puerta}
                            </p>
                        </div>
                    </div>
                    <div className="school-card__actions">
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${edificio.latitud},${edificio.longitud}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="school-card__maps-btn"
                            title="Cómo llegar con Google Maps"
                        >
                            {/* Google Maps pin SVG */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="15"
                                height="15"
                                aria-hidden="true"
                            >
                                <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                                    fill="#EA4335"
                                />
                                <circle cx="12" cy="9" r="2.8" fill="white" />
                            </svg>
                            <span>Ruta</span>
                        </a>
                        <button
                            onClick={onClose}
                            className="school-card__close-btn"
                            aria-label="Cerrar tarjeta"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="school-card__body custom-scrollbar">
                    {edificio.establecimientos.map((est, i) => (
                        <div key={i} className="school-card__est">
                            <p className="school-card__est-name">
                                {est.nombre}
                            </p>
                            <div className="school-card__modalidades">
                                {est.modalidades?.map((mod, j) => (
                                    <div
                                        key={j}
                                        className="school-card__modalidad"
                                    >
                                        <span className="school-card__tag school-card__tag--nivel">
                                            {mod.nivel}
                                        </span>
                                        <span className="school-card__tag school-card__tag--area">
                                            {mod.area}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
    (prev, next) => prev.edificio?.id === next.edificio?.id,
);

// --- Main Export ---
export default function MapView({
    filteredEdificios,
    edificios = [],
    selectedEdificio,
    setSelectedEdificio,
    hoveredEdificioId,
    setHoveredEdificioId,
    sidebarOpen,
    showDeptoBorders = true,
    filterDepto = 'TODOS',
    isSatellite = false,
}) {
    const [geojsonData, setGeojsonData] = useState(null);

    // Tile layer URLs
    const TILE_STREET =
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const TILE_SAT =
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    useEffect(() => {
        fetch('/geojson/departamentos-san_juan.json')
            .then((res) => res.json())
            .then((data) => setGeojsonData(data))
            .catch((err) => console.error('Error loading GeoJSON:', err));
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedEdificio(null);
    }, [setSelectedEdificio]);

    // GeoJSON style: borders always visible for all depts, orange fill only for filtered dept
    const deptStyle = useCallback(
        (feature) => {
            const isHighlighted =
                filterDepto &&
                filterDepto !== 'TODOS' &&
                feature.properties?.departamento?.toUpperCase() ===
                    filterDepto.toUpperCase();

            return {
                color: isHighlighted ? '#FE8204' : '#94a3b8',
                weight: isHighlighted ? 2.5 : 1,
                fillColor: isHighlighted ? '#FE8204' : 'transparent',
                fillOpacity: isHighlighted ? 0.07 : 0,
                interactive: false, // No hover, no click events on polygons
            };
        },
        [filterDepto],
    );

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <MapContainer
                center={[-31.5375, -68.5364]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <HighPriorityTileLayer
                    key={isSatellite ? 'sat' : 'street'}
                    url={isSatellite ? TILE_SAT : TILE_STREET}
                    attribution={
                        isSatellite
                            ? '&copy; <a href="https://www.esri.com">Esri</a> World Imagery'
                            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                    subdomains={isSatellite ? '' : 'abc'}
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

                <ClearSelection onClear={handleClearSelection} />

                {/* Department borders layer — always shown when geojsonData is ready */}
                {geojsonData && showDeptoBorders && (
                    <GeoJSON
                        key={`geojson-${geojsonData.features.length}-${filterDepto}`}
                        data={geojsonData}
                        style={deptStyle}
                    />
                )}

                {/* School markers */}
                {filteredEdificios.map((edificio) => (
                    <CircleMarker
                        key={edificio.id}
                        pane="markerPane"
                        center={[edificio.latitud, edificio.longitud]}
                        radius={
                            hoveredEdificioId === edificio.id ||
                            selectedEdificio?.id === edificio.id
                                ? 14
                                : 9
                        }
                        pathOptions={{
                            fillColor:
                                edificio.ambito === 'PUBLICO'
                                    ? '#FE8204'
                                    : '#3B82F6',
                            color: 'white',
                            weight:
                                hoveredEdificioId === edificio.id ||
                                selectedEdificio?.id === edificio.id
                                    ? 4
                                    : 2,
                            fillOpacity:
                                hoveredEdificioId === edificio.id ||
                                selectedEdificio?.id === edificio.id
                                    ? 1
                                    : 0.8,
                        }}
                        eventHandlers={{
                            click: (e) => {
                                L.DomEvent.stopPropagation(e);
                                const fullEdificio = edificios.find(
                                    (e) => e.id === edificio.id,
                                );
                                setSelectedEdificio(fullEdificio || edificio);
                            },
                            mouseover: () => setHoveredEdificioId(edificio.id),
                            mouseout: () => setHoveredEdificioId(null),
                        }}
                    />
                ))}
            </MapContainer>

            {/* School card — pure HTML overlay, no Leaflet Popup */}
            {selectedEdificio && selectedEdificio.establecimientos && (
                <SchoolCard
                    key={selectedEdificio.id}
                    edificio={selectedEdificio}
                    onClose={handleClearSelection}
                />
            )}
        </div>
    );
}

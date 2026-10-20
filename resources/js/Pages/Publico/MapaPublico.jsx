import '@/../css/mapa-publico.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import MapaSidebar from './Partials/MapaSidebar';
import ReportModal from './Partials/ReportModal';

// Lazy-load the heavy map component (Leaflet + react-leaflet) — split into its own chunk
const MapView = lazy(() => import('./MapView'));

export default function MapaPublico({ edificios = [] }) {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return false;
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({
        publico: true,
        privado: true,
    });
    const [filterNivel, setFilterNivel] = useState('TODOS');
    const [filterDepto, setFilterDepto] = useState('TODOS');
    const [selectedEdificio, setSelectedEdificio] = useState(null);
    const [hoveredEdificioId, setHoveredEdificioId] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [showDeptoBorders] = useState(false);
    const [isSatellite, setIsSatellite] = useState(false);
    const [isLoading, setIsLoading] = useState(edificios.length === 0);

    useEffect(() => {
        if (edificios.length === 0) {
            router.reload({
                only: ['edificios'],
                onFinish: () => setIsLoading(false),
            });
        } else {
            setIsLoading(false);
        }
    }, [edificios.length]);

    // Get unique levels and departments dynamically based on other active filters (Faceted search)
    const deptosDisponibles = useMemo(() => {
        const set = new Set();
        edificios.forEach((edificio) => {
            const hasMatchingModality = edificio.establecimientos.some((est) =>
                est.modalidades.some((m) => {
                    const matchesScope =
                        (m.ambito === 'PUBLICO' && activeFilters.publico) ||
                        (m.ambito === 'PRIVADO' && activeFilters.privado);
                    const matchesNivel =
                        filterNivel === 'TODOS' || m.nivel === filterNivel;
                    return matchesScope && matchesNivel;
                }),
            );

            if (hasMatchingModality && edificio.zona_departamento) {
                set.add(edificio.zona_departamento);
            }
        });
        return Array.from(set).sort();
    }, [edificios, activeFilters, filterNivel]);

    const nivelesDisponibles = useMemo(() => {
        const set = new Set();
        edificios.forEach((edificio) => {
            const matchesDepto =
                filterDepto === 'TODOS' ||
                edificio.zona_departamento === filterDepto;
            if (!matchesDepto) return;

            edificio.establecimientos.forEach((est) => {
                est.modalidades.forEach((m) => {
                    const matchesScope =
                        (m.ambito === 'PUBLICO' && activeFilters.publico) ||
                        (m.ambito === 'PRIVADO' && activeFilters.privado);
                    const isEducativo =
                        m.area && !m.area.toUpperCase().includes('ADMINISTRA');
                    if (matchesScope && m.nivel && isEducativo) {
                        set.add(m.nivel);
                    }
                });
            });
        });
        return Array.from(set).sort();
    }, [edificios, activeFilters, filterDepto]);

    // Sets for O(1) membership lookups (js-set-map-lookups)
    const deptosSet = useMemo(
        () => new Set(deptosDisponibles),
        [deptosDisponibles],
    );
    const nivelesSet = useMemo(
        () => new Set(nivelesDisponibles),
        [nivelesDisponibles],
    );

    // Auto-reset filters if selected option is no longer available
    useEffect(() => {
        if (filterDepto !== 'TODOS' && !deptosSet.has(filterDepto)) {
            setFilterDepto('TODOS');
        }
    }, [deptosSet, filterDepto]);

    useEffect(() => {
        if (filterNivel !== 'TODOS' && !nivelesSet.has(filterNivel)) {
            setFilterNivel('TODOS');
        }
    }, [nivelesSet, filterNivel]);

    // Filter Logic: Single-pass iteration without redundant intermediate arrays (js-combine-iterations)
    const filteredEdificios = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const results = [];

        for (const edificio of edificios) {
            // Check department match early if not in search mode (js-early-exit)
            if (
                query.length < 2 &&
                filterDepto !== 'TODOS' &&
                edificio.zona_departamento !== filterDepto
            ) {
                continue;
            }

            // 1. Filter establishments and modalities in one pass
            const filteredEsts = [];
            let hasPrivate = false;
            let hasPublic = false;

            for (const est of edificio.establecimientos) {
                const filteredMods = [];
                for (const m of est.modalidades) {
                    const matchesScope =
                        (m.ambito === 'PUBLICO' && activeFilters.publico) ||
                        (m.ambito === 'PRIVADO' && activeFilters.privado);
                    const matchesNivel =
                        filterNivel === 'TODOS' || m.nivel === filterNivel;
                    if (matchesScope && matchesNivel) {
                        filteredMods.push(m);
                        if (m.ambito === 'PRIVADO') {
                            hasPrivate = true;
                        }
                        if (m.ambito === 'PUBLICO') {
                            hasPublic = true;
                        }
                    }
                }

                if (filteredMods.length > 0) {
                    filteredEsts.push({
                        ...est,
                        modalidades: filteredMods,
                    });
                }
            }

            if (filteredEsts.length === 0) continue;

            const dynamicAmbito =
                hasPublic && hasPrivate
                    ? 'MIXTO'
                    : hasPrivate
                      ? 'PRIVADO'
                      : 'PUBLICO';

            // 2. Filter by search query if active
            if (query.length >= 2) {
                const matchesBuilding =
                    (edificio.cui?.toString().toLowerCase() || '').includes(
                        query,
                    ) ||
                    (
                        edificio.localidad?.toString().toLowerCase() || ''
                    ).includes(query) ||
                    (edificio.calle?.toString().toLowerCase() || '').includes(
                        query,
                    );

                const finalEsts = filteredEsts.filter((est) => {
                    if (matchesBuilding) return true;
                    return (
                        (est.nombre?.toString().toLowerCase() || '').includes(
                            query,
                        ) ||
                        (est.cue?.toString().toLowerCase() || '').includes(
                            query,
                        )
                    );
                });

                if (finalEsts.length === 0) continue;

                results.push({
                    ...edificio,
                    ambito: dynamicAmbito,
                    establecimientos: finalEsts,
                });
            } else {
                results.push({
                    ...edificio,
                    ambito: dynamicAmbito,
                    establecimientos: filteredEsts,
                });
            }
        }

        return results;
    }, [edificios, searchQuery, activeFilters, filterNivel, filterDepto]);

    // Statistics for the sidebar
    const stats = useMemo(() => {
        const totalEdificios = filteredEdificios.length;

        let totalEstablecimientos = 0;
        let publicos = 0;
        let privados = 0;

        filteredEdificios.forEach((e) => {
            totalEstablecimientos += e.establecimientos.length;
            e.establecimientos.forEach((est) => {
                const isPrivate = est.modalidades.some(
                    (m) => m.ambito === 'PRIVADO',
                );
                if (isPrivate) {
                    privados++;
                } else {
                    publicos++;
                }
            });
        });

        return { totalEdificios, totalEstablecimientos, publicos, privados };
    }, [filteredEdificios]);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        setIsSearching(query.length > 0);
    }, []);

    const handleSelectSchool = useCallback(
        (edificio) => {
            const matchingFiltered = filteredEdificios.find(
                (e) => e.id === edificio.id,
            );
            setSelectedEdificio(matchingFiltered || edificio);
            setIsSearching(false);
            setSearchQuery('');
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                setSidebarOpen(false);
            }
        },
        [filteredEdificios],
    );

    const searchResults = useMemo(() => {
        if (!searchQuery || searchQuery.length < 2) return [];
        const query = searchQuery.trim().toLowerCase();
        const results = [];

        filteredEdificios.forEach((edificio) => {
            edificio.establecimientos.forEach((est) => {
                const matchesName = (
                    est.nombre?.toString().toLowerCase() || ''
                ).includes(query);
                const matchesCue = (
                    est.cue?.toString().toLowerCase() || ''
                ).includes(query);
                const matchesCui = (
                    edificio.cui?.toString().toLowerCase() || ''
                ).includes(query);

                if (matchesName || matchesCue || matchesCui) {
                    results.push({
                        ...est,
                        edificio: edificio,
                    });
                }
            });
        });
        return results.slice(0, 10);
    }, [filteredEdificios, searchQuery]);

    const toggleFilter = useCallback((type) => {
        setActiveFilters((prev) => {
            // Prevent disabling both filters
            if (
                prev[type] &&
                !prev[type === 'publico' ? 'privado' : 'publico']
            ) {
                return prev;
            }
            return { ...prev, [type]: !prev[type] };
        });
    }, []);

    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setActiveFilters({ publico: true, privado: true });
        setFilterNivel('TODOS');
        setFilterDepto('TODOS');
        setSelectedEdificio(null);
    }, []);

    const hasActiveFilters = useMemo(() => {
        return (
            !activeFilters.publico ||
            !activeFilters.privado ||
            filterDepto !== 'TODOS' ||
            filterNivel !== 'TODOS' ||
            searchQuery.trim().length > 0
        );
    }, [activeFilters, filterDepto, filterNivel, searchQuery]);

    return (
        <AuthenticatedLayout
            header={false}
            fullWidth={true}
            showSidebar={false}
            padding={false}
        >
            <Head>
                <title>Mapa de Escuelas de San Juan</title>
                <meta
                    name="description"
                    content="Explora el Mapa Escolar de San Juan. Encuentra establecimientos educativos públicos y privados, consulta niveles, modalidades y ubicaciones exactas de todas las escuelas de la provincia."
                />
            </Head>

            <div className="relative flex h-[calc(100vh-64px)] w-full overflow-hidden bg-white">
                {/* Mobile Backdrop Overlay */}
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="backdrop-blur-xs fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden"
                        aria-hidden="true"
                    />
                )}

                {/* Sidebar Drawer */}
                <MapaSidebar
                    sidebarOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    searchQuery={searchQuery}
                    handleSearch={handleSearch}
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                    searchResults={searchResults}
                    handleSelectSchool={handleSelectSchool}
                    activeFilters={activeFilters}
                    toggleFilter={toggleFilter}
                    filterDepto={filterDepto}
                    setFilterDepto={setFilterDepto}
                    deptosDisponibles={deptosDisponibles}
                    filterNivel={filterNivel}
                    setFilterNivel={setFilterNivel}
                    nivelesDisponibles={nivelesDisponibles}
                    isLoading={isLoading}
                    stats={stats}
                    clearFilters={clearFilters}
                />

                {/* Desktop Map Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label={
                        sidebarOpen
                            ? 'Cerrar panel lateral'
                            : 'Abrir panel lateral'
                    }
                    className={`absolute top-6 z-[1002] hidden items-center justify-center rounded-r-xl border bg-white p-3 text-brand-orange shadow-xl transition-all duration-300 hover:bg-orange-50 lg:flex ${
                        sidebarOpen ? 'left-80' : 'left-0'
                    }`}
                >
                    <i
                        className={`fas fa-chevron-left transition-transform ${sidebarOpen ? '' : 'rotate-180'}`}
                    ></i>
                </button>

                {/* Map Area */}
                <div className="relative z-0 flex-1">
                    {/* Floating Filter Button (Visible whenever sidebar is closed) */}
                    {!sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Abrir filtros del mapa"
                            className="absolute left-3 top-3 z-[1002] flex items-center gap-2 rounded-2xl border border-orange-200 bg-white/95 px-3.5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-xl backdrop-blur-md transition-all hover:bg-orange-50 hover:text-brand-orange sm:left-4 sm:top-4"
                        >
                            <i className="fas fa-sliders-h text-brand-orange"></i>
                            <span>Filtros</span>
                            {hasActiveFilters && (
                                <span className="flex h-2 w-2 animate-pulse rounded-full bg-brand-orange"></span>
                            )}
                        </button>
                    )}

                    {/* Map Loading Skeleton */}
                    <Suspense
                        fallback={
                            <div className="flex h-full w-full items-center justify-center bg-orange-50/30">
                                <div className="flex flex-col items-center gap-4 text-brand-orange">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-orange/20 border-t-brand-orange"></div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                                        Cargando Mapa...
                                    </p>
                                </div>
                            </div>
                        }
                    >
                        <MapView
                            filteredEdificios={filteredEdificios}
                            selectedEdificio={selectedEdificio}
                            setSelectedEdificio={setSelectedEdificio}
                            hoveredEdificioId={hoveredEdificioId}
                            setHoveredEdificioId={setHoveredEdificioId}
                            sidebarOpen={sidebarOpen}
                            showDeptoBorders={showDeptoBorders}
                            filterDepto={filterDepto}
                            isSatellite={isSatellite}
                        />
                    </Suspense>

                    {/* Map Action Buttons (Satellite & Recenter) */}
                    <div
                        className={`absolute right-3 top-3 z-[1002] flex flex-col gap-2.5 sm:right-6 sm:top-6 sm:gap-3 ${
                            sidebarOpen ? 'hidden lg:flex' : 'flex'
                        }`}
                    >
                        <button
                            onClick={() => {
                                setSelectedEdificio(null);
                                setSelectedEdificio({
                                    latitud: -31.5375,
                                    longitud: -68.5364,
                                    zoom: 11,
                                    _isCenter: true,
                                });
                            }}
                            aria-label="Recentrar mapa en San Juan"
                            className="group flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-50 bg-white text-gray-600 shadow-xl transition-all hover:text-brand-orange sm:h-12 sm:w-12"
                            title="Recentrar Mapa"
                        >
                            <i className="fas fa-expand-arrows-alt text-sm transition-transform group-hover:scale-110 sm:text-base"></i>
                        </button>

                        <button
                            onClick={() => setIsSatellite((v) => !v)}
                            aria-label={
                                isSatellite
                                    ? 'Cambiar a mapa normal'
                                    : 'Cambiar a vista satelital'
                            }
                            title={
                                isSatellite ? 'Vista Normal' : 'Vista Satélite'
                            }
                            className={`group flex h-10 w-10 items-center justify-center rounded-2xl border shadow-xl transition-all sm:h-12 sm:w-12 ${
                                isSatellite
                                    ? 'border-orange-300 bg-brand-orange text-white'
                                    : 'border-orange-50 bg-white text-gray-600 hover:text-brand-orange'
                            }`}
                        >
                            <i
                                className={`fas fa-satellite text-sm transition-transform group-hover:scale-110 sm:text-base ${isSatellite ? 'text-white' : ''}`}
                            ></i>
                        </button>
                    </div>

                    {/* Report Bug / School Btn */}
                    {(() => {
                        const hasSelectedEdificio = Boolean(
                            selectedEdificio &&
                            !selectedEdificio._isCenter &&
                            selectedEdificio.id,
                        );
                        const nombreEdificio =
                            selectedEdificio?.establecimientos?.[0]?.nombre ||
                            (selectedEdificio?.cui
                                ? `CUI ${selectedEdificio.cui}`
                                : '');

                        return (
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className={`group absolute ${
                                    hasSelectedEdificio
                                        ? 'bottom-28 sm:bottom-6'
                                        : 'bottom-4 sm:bottom-6'
                                } right-3 z-[1002] flex items-center gap-2 rounded-2xl border p-2.5 text-black shadow-xl backdrop-blur-md transition-all hover:scale-105 sm:right-6 sm:gap-3 sm:px-5 sm:py-3 sm:shadow-2xl ${
                                    hasSelectedEdificio
                                        ? 'border-red-300 bg-red-50/95 ring-2 ring-red-500/20'
                                        : 'border-red-100 bg-white/90'
                                }`}
                                title={
                                    hasSelectedEdificio
                                        ? `Reportar inconveniente sobre ${nombreEdificio}`
                                        : 'Reportar error general en el mapa'
                                }
                            >
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors sm:h-10 sm:w-10 ${
                                        hasSelectedEdificio
                                            ? 'bg-red-500 text-white'
                                            : 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white'
                                    }`}
                                >
                                    <i
                                        className={`text-xs sm:text-sm ${
                                            hasSelectedEdificio
                                                ? 'fas fa-school'
                                                : 'fas fa-bug'
                                        }`}
                                    ></i>
                                </div>
                                <div className="hidden text-left sm:block">
                                    <p className="mb-1 text-[10px] font-black uppercase leading-none text-red-500">
                                        {hasSelectedEdificio
                                            ? 'Edificio Seleccionado'
                                            : '¿Problemas?'}
                                    </p>
                                    <span className="line-clamp-1 max-w-[170px] text-sm font-black text-gray-800">
                                        {hasSelectedEdificio
                                            ? 'Reportar Edificio'
                                            : 'Reportar Error'}
                                    </span>
                                </div>
                            </button>
                        );
                    })()}
                </div>
            </div>

            {/* Report Modal */}
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                selectedEdificio={selectedEdificio}
            />
        </AuthenticatedLayout>
    );
}

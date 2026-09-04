import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

// Lazy-load the heavy map component (Leaflet + react-leaflet) — split into its own chunk
const MapView = lazy(() => import('./MapView'));

export default function MapaPublico({ edificios = [] }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
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
    const [showDeptoBorders, setShowDeptoBorders] = useState(true);
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

    const { data, setData, post, processing, reset, errors } = useForm({
        edificio_id: '',
        tipo: 'ERROR_DATOS',
        descripcion: '',
        nombre_remitente: '',
        email_remitente: '',
    });

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
                    if (matchesScope && m.nivel) {
                        set.add(m.nivel);
                    }
                });
            });
        });
        return Array.from(set).sort();
    }, [edificios, activeFilters, filterDepto]);

    // Auto-reset filters if selected option is no longer available
    useEffect(() => {
        if (
            filterDepto !== 'TODOS' &&
            !deptosDisponibles.includes(filterDepto)
        ) {
            setFilterDepto('TODOS');
        }
    }, [deptosDisponibles, filterDepto]);

    useEffect(() => {
        if (
            filterNivel !== 'TODOS' &&
            !nivelesDisponibles.includes(filterNivel)
        ) {
            setFilterNivel('TODOS');
        }
    }, [nivelesDisponibles, filterNivel]);

    // Filter Logic
    const filteredEdificios = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return edificios
            .map((edificio) => {
                // 1. Filter establishments and their modalities by Scope and Nivel
                const filteredEsts = edificio.establecimientos
                    .map((est) => {
                        const filteredMods = est.modalidades.filter((m) => {
                            const matchesScope =
                                (m.ambito === 'PUBLICO' &&
                                    activeFilters.publico) ||
                                (m.ambito === 'PRIVADO' &&
                                    activeFilters.privado);
                            const matchesNivel =
                                filterNivel === 'TODOS' ||
                                m.nivel === filterNivel;
                            return matchesScope && matchesNivel;
                        });

                        if (filteredMods.length === 0) return null;

                        return {
                            ...est,
                            modalidades: filteredMods,
                        };
                    })
                    .filter(Boolean);

                if (filteredEsts.length === 0) return null;

                // 2. Determine dynamic building scope (ambito) based on filtered establishments
                const hasPrivate = filteredEsts.some((est) =>
                    est.modalidades.some((m) => m.ambito === 'PRIVADO'),
                );
                const dynamicAmbito = hasPrivate ? 'PRIVADO' : 'PUBLICO';

                // 3. Filter by search query if active (search query length >= 2)
                if (query.length >= 2) {
                    const matchesBuilding =
                        (edificio.cui?.toString().toLowerCase() || '').includes(
                            query,
                        ) ||
                        (
                            edificio.localidad?.toString().toLowerCase() || ''
                        ).includes(query) ||
                        (
                            edificio.calle?.toString().toLowerCase() || ''
                        ).includes(query);

                    const finalEsts = filteredEsts.filter((est) => {
                        if (matchesBuilding) return true;

                        const matchesEst =
                            (
                                est.nombre?.toString().toLowerCase() || ''
                            ).includes(query) ||
                            (est.cue?.toString().toLowerCase() || '').includes(
                                query,
                            );
                        return matchesEst;
                    });

                    if (finalEsts.length === 0) return null;

                    return {
                        ...edificio,
                        ambito: dynamicAmbito,
                        establecimientos: finalEsts,
                    };
                }

                // 4. Filter by department if not searching
                const matchesDepto =
                    filterDepto === 'TODOS' ||
                    edificio.zona_departamento === filterDepto;
                if (!matchesDepto) return null;

                return {
                    ...edificio,
                    ambito: dynamicAmbito,
                    establecimientos: filteredEsts,
                };
            })
            .filter(Boolean);
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
            const fullEdificio = edificios.find((e) => e.id === edificio.id);
            setSelectedEdificio(fullEdificio || edificio);
            setIsSearching(false);
            setSearchQuery('');
        },
        [edificios],
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

    const openReportModal = useCallback(() => {
        setData((prev) => ({
            ...prev,
            edificio_id: selectedEdificio?.id || '',
            descripcion: selectedEdificio
                ? `Reporte sobre: ${selectedEdificio.establecimientos[0]?.nombre || 'Escuela sin nombre'}\n\n`
                : '',
        }));
        setIsReportModalOpen(true);
    }, [selectedEdificio, setData]);

    const submitReport = useCallback(
        (e) => {
            e.preventDefault();
            post(route('publico.reportes.store'), {
                onSuccess: () => {
                    setIsReportModalOpen(false);
                    reset();
                },
            });
        },
        [post, reset],
    );

    return (
        <AuthenticatedLayout
            header={false}
            fullWidth={true}
            showSidebar={false}
            padding={false}
        >
            <Head>
                <title>Mapa de Escuelas - San Juan</title>
                <meta
                    name="description"
                    content="Explora el Mapa Escolar de San Juan. Encuentra establecimientos educativos públicos y privados, consulta niveles, modalidades y ubicaciones exactas de todas las escuelas de la provincia."
                />
            </Head>

            <div className="relative flex h-[calc(100vh-64px)] w-full overflow-hidden bg-white">
                {/* Sidebar */}
                <aside
                    className={`absolute z-20 flex h-full flex-col overflow-hidden bg-white transition-all duration-500 lg:relative ${
                        sidebarOpen
                            ? 'w-80 translate-x-0 border-r border-orange-100 shadow-2xl'
                            : 'w-0 -translate-x-full border-transparent'
                    }`}
                >
                    <div className="flex h-full w-80 flex-col bg-white text-black">
                        {/* Header */}
                        <div className="border-b border-orange-50 bg-orange-50/20 p-6">
                            {/* Search */}
                            <div className="relative mb-4">
                                <input
                                    id="search-input"
                                    type="text"
                                    placeholder="Buscar CUE, CUI o Nombre..."
                                    aria-label="Buscar establecimientos por CUE, CUI o Nombre"
                                    className="w-full rounded-xl border-orange-100 bg-white py-2.5 pl-10 pr-4 text-sm font-medium transition-all focus:border-brand-orange"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    onFocus={() =>
                                        setIsSearching(searchQuery.length > 0)
                                    }
                                />
                                <i className="fas fa-search absolute left-3.5 top-3.5 text-gray-300"></i>

                                {/* Autocomplete Dropdown */}
                                {isSearching && searchResults.length > 0 && (
                                    <div className="animate-in fade-in slide-in-from-top-2 absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-orange-100 bg-white shadow-2xl duration-200">
                                        {searchResults.map((result, idx) => (
                                            <div
                                                key={`${result.id}-${idx}`}
                                                onClick={() =>
                                                    handleSelectSchool(
                                                        result.edificio,
                                                    )
                                                }
                                                className="group cursor-pointer border-b border-gray-50 p-3 last:border-0 hover:bg-orange-50"
                                            >
                                                <p className="truncate text-[10px] font-black text-gray-900 transition-colors group-hover:text-brand-orange">
                                                    {result.nombre}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[8px] font-bold text-gray-400">
                                                        CUE: {result.cue}
                                                    </p>
                                                    <span className="text-[8px] font-black text-brand-orange/40">
                                                        •
                                                    </span>
                                                    <p className="text-[8px] font-bold text-gray-400">
                                                        {
                                                            result.edificio
                                                                .localidad
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-6">
                            {/* Ambito Section */}
                            <section>
                                <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <i className="fas fa-layer-group text-brand-orange"></i>{' '}
                                    Ámbito
                                </h3>
                                <div className="flex gap-2 rounded-xl border border-gray-100 bg-gray-50 p-1">
                                    <FilterBtn
                                        active={activeFilters.publico}
                                        onClick={() => toggleFilter('publico')}
                                        label="Público"
                                        color="orange"
                                    />
                                    <FilterBtn
                                        active={activeFilters.privado}
                                        onClick={() => toggleFilter('privado')}
                                        label="Privado"
                                        color="blue"
                                    />
                                </div>
                            </section>

                            {/* Departamento Section */}
                            <section>
                                <label
                                    htmlFor="depto-select"
                                    className="mb-4 flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"
                                >
                                    <i className="fas fa-map-marked-alt text-brand-orange"></i>{' '}
                                    Departamento
                                </label>
                                <div className="relative">
                                    <select
                                        id="depto-select"
                                        value={filterDepto}
                                        onChange={(e) =>
                                            setFilterDepto(e.target.value)
                                        }
                                        className="w-full appearance-none rounded-xl border-gray-100 bg-gray-50 py-3 pl-4 pr-10 text-xs font-black uppercase text-gray-700 shadow-sm transition-all focus:border-brand-orange focus:ring-brand-orange"
                                    >
                                        <option value="TODOS">
                                            Todos los Departamentos
                                        </option>
                                        {deptosDisponibles.map((d) => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                    <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                </div>
                            </section>

                            {/* Nivel Section */}
                            <section>
                                <label
                                    htmlFor="nivel-select"
                                    className="mb-4 flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400"
                                >
                                    <i className="fas fa-graduation-cap text-brand-orange"></i>{' '}
                                    Nivel Educativo
                                </label>
                                <div className="relative">
                                    <select
                                        id="nivel-select"
                                        value={filterNivel}
                                        onChange={(e) =>
                                            setFilterNivel(e.target.value)
                                        }
                                        className="w-full appearance-none rounded-xl border-gray-100 bg-gray-50 py-3 pl-4 pr-10 text-xs font-black uppercase text-gray-700 shadow-sm transition-all focus:border-brand-orange focus:ring-brand-orange"
                                    >
                                        <option value="TODOS">
                                            Todos los Niveles
                                        </option>
                                        {nivelesDisponibles.map((n) => (
                                            <option key={n} value={n}>
                                                {n}
                                            </option>
                                        ))}
                                    </select>
                                    <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                </div>
                            </section>

                            {/* Opciones de Capa Section */}
                            <section className="border-t border-orange-50 pt-6">
                                <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <i className="fas fa-cog text-brand-orange"></i>{' '}
                                    Opciones de Capa
                                </h3>
                                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
                                    <span className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                        <i className="fas fa-map text-brand-orange/60"></i>{' '}
                                        Límites de Departamentos
                                    </span>
                                    <label className="relative inline-flex cursor-pointer select-none items-center">
                                        <input
                                            type="checkbox"
                                            checked={showDeptoBorders}
                                            onChange={() =>
                                                setShowDeptoBorders(
                                                    !showDeptoBorders,
                                                )
                                            }
                                            className="peer sr-only"
                                        />
                                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-orange peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                                    </label>
                                </div>
                            </section>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-orange-100 bg-orange-50/10 p-6 space-y-4">
                            {/* Stats Summary */}
                            <div className="flex gap-2">
                                <div className="flex flex-1 flex-col justify-center rounded-xl border border-orange-100/60 bg-white p-2.5 shadow-sm">
                                    <p className="text-[8px] font-black uppercase tracking-wider text-gray-400">
                                        Edificios
                                    </p>
                                    <div className="flex h-6 items-center">
                                        {isLoading ? (
                                            <i className="fas fa-circle-notch fa-spin text-xs text-brand-orange"></i>
                                        ) : (
                                            <p className="text-base font-black leading-none text-gray-800">
                                                {stats.totalEdificios}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col justify-center rounded-xl border border-orange-100/60 bg-white p-2.5 shadow-sm">
                                    <p className="text-[8px] font-black uppercase tracking-wider text-gray-400">
                                        Establecimientos
                                    </p>
                                    <div className="flex h-6 items-center">
                                        {isLoading ? (
                                            <i className="fas fa-circle-notch fa-spin text-xs text-brand-orange"></i>
                                        ) : (
                                            <p className="text-base font-black leading-none text-gray-800">
                                                {stats.totalEstablecimientos}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={clearFilters}
                                className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 bg-white py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all hover:border-brand-orange hover:text-brand-orange shadow-sm"
                            >
                                <i className="fas fa-sync-alt"></i> Limpiar Filtros
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Map Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label={
                        sidebarOpen
                            ? 'Cerrar panel lateral'
                            : 'Abrir panel lateral'
                    }
                    className={`absolute top-6 z-[1002] flex items-center justify-center rounded-r-xl border bg-white p-3 text-brand-orange shadow-xl transition-all duration-300 hover:bg-orange-50 ${
                        sidebarOpen ? 'left-80' : 'left-0'
                    }`}
                >
                    <i
                        className={`fas fa-chevron-left transition-transform ${sidebarOpen ? '' : 'rotate-180'}`}
                    ></i>
                </button>

                {/* Map Area */}
                <div className="relative z-0 flex-1">
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
                            edificios={edificios}
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

                    {/* Map Buttons */}
                    <div className="absolute right-6 top-6 z-[1001] flex flex-col gap-3">
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
                            className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-50 bg-white text-gray-500 shadow-xl transition-all hover:text-brand-orange"
                            title="Recentrar Mapa"
                        >
                            <i className="fas fa-expand-arrows-alt transition-transform group-hover:scale-110"></i>
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
                            className={`group flex h-12 w-12 items-center justify-center rounded-2xl border shadow-xl transition-all ${
                                isSatellite
                                    ? 'border-orange-300 bg-brand-orange text-white'
                                    : 'border-orange-50 bg-white text-gray-500 hover:text-brand-orange'
                            }`}
                        >
                            <i
                                className={`fas fa-satellite transition-transform group-hover:scale-110 ${isSatellite ? 'text-white' : ''}`}
                            ></i>
                        </button>
                    </div>

                    {/* Report Bug Btn */}
                    <button
                        onClick={openReportModal}
                        className="group absolute bottom-6 right-6 z-[1001] flex items-center gap-3 rounded-2xl border border-red-100 bg-white/90 px-5 py-3 text-black shadow-2xl backdrop-blur-md transition-all hover:scale-105"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors group-hover:bg-red-500 group-hover:text-white">
                            <i className="fas fa-bug"></i>
                        </div>
                        <div>
                            <p className="mb-1 text-[10px] font-black uppercase leading-none text-red-400">
                                ¿Problemas?
                            </p>
                            <span className="text-sm font-black text-gray-800">
                                Reportar Error
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Report Modal */}
            <Modal
                show={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                maxWidth="lg"
            >
                <div className="bg-white p-8">
                    <div className="mb-8 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-500 shadow-inner">
                            <i className="fas fa-bullhorn"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black leading-tight text-gray-900">
                                Reportar un{' '}
                                <span className="text-red-500">
                                    Inconveniente
                                </span>
                            </h2>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                Ayúdanos a mejorar el mapa escolar
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submitReport} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Tipo de Reporte */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="tipo-reporte"
                                    className="flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400"
                                >
                                    <i className="fas fa-tag text-red-400"></i>{' '}
                                    Motivo del Reporte
                                </label>
                                <select
                                    id="tipo-reporte"
                                    className="w-full rounded-xl border-gray-100 bg-gray-50 p-3 text-sm font-bold text-gray-700 focus:border-red-500 focus:ring-red-500"
                                    value={data.tipo}
                                    onChange={(e) =>
                                        setData('tipo', e.target.value)
                                    }
                                    required
                                >
                                    <option value="ERROR_DATOS">
                                        Error en los datos (Nombre, CUE, etc)
                                    </option>
                                    <option value="UBICACION_INCORRECTA">
                                        Ubicación incorrecta en el mapa
                                    </option>
                                    <option value="INFO_FALTANTE">
                                        Falta información (Nivel, modalidad)
                                    </option>
                                    <option value="OTRO">Otro motivo</option>
                                </select>
                            </div>

                            {/* Email Remitente */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email-reporte"
                                    className="flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400"
                                >
                                    <i className="fas fa-envelope text-red-400"></i>{' '}
                                    Tu Correo (Opcional)
                                </label>
                                <input
                                    id="email-reporte"
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    className="w-full rounded-xl border-gray-100 bg-gray-50 p-3 text-sm font-bold focus:border-red-500 focus:ring-red-500"
                                    value={data.email_remitente}
                                    onChange={(e) =>
                                        setData(
                                            'email_remitente',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <label
                                htmlFor="desc-reporte"
                                className="flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400"
                            >
                                <i className="fas fa-comment-alt text-red-400"></i>{' '}
                                Descripción detallada
                            </label>
                            <textarea
                                id="desc-reporte"
                                rows="4"
                                placeholder="Describe el error lo más detallado posible..."
                                className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm font-bold focus:border-red-500 focus:ring-red-500"
                                value={data.descripcion}
                                onChange={(e) =>
                                    setData('descripcion', e.target.value)
                                }
                                required
                            ></textarea>
                            {errors.descripcion && (
                                <p className="text-[10px] font-bold italic text-red-500">
                                    {errors.descripcion}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsReportModalOpen(false)}
                                className="flex-1 rounded-2xl border-2 border-gray-100 py-4 text-xs font-black uppercase tracking-widest text-gray-400 transition-all hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex flex-[2] items-center justify-center gap-3 rounded-2xl bg-red-500 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-600 disabled:opacity-50"
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
                /* ── Custom Orange Cursor for Leaflet Map ────────────── */
                .leaflet-container,
                .leaflet-grab,
                .leaflet-interactive {
                    cursor: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyNCcgaGVpZ2h0PScyNCcgdmlld0JveD0nMCAwIDI0IDI0Jz48cGF0aCBmaWxsPScjRkU4MjA0JyBzdHJva2U9JyNmZmZmZmYnIHN0cm9rZS13aWR0aD0nMS41JyBkPSdNNC41IDIuMjV2MTkuNWw1LjYyNS01LjYyNWg3Ljg3NUw0LjUgMi4yNXonLz48L3N2Zz4=") 4 2, auto !important;
                }
                .leaflet-dragging,
                .leaflet-dragging .leaflet-grab,
                .leaflet-dragging .leaflet-interactive {
                    cursor: grabbing !important;
                }

                /* ── Scrollbars ─────────────────────────────────────── */
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #FE820430; border-radius: 10px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

                /* ── Remove focus ring on SVG paths (department borders) */
                path.leaflet-interactive:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }

                /* ── School Card Overlay ─────────────────────────────── */
                .school-card {
                    position: absolute;
                    bottom: 32px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 320px;
                    max-width: calc(100vw - 32px);
                    z-index: 1000;
                    background: rgba(255,255,255,0.98);
                    border-radius: 20px;
                    border: 1px solid rgba(254,130,4,0.12);
                    box-shadow: 0 12px 48px rgba(0,0,0,0.18);
                    overflow: hidden;
                    animation: card-in 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
                    pointer-events: all;
                }
                @keyframes card-in {
                    from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.96); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);    }
                }

                .school-card__header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 8px;
                    padding: 14px 14px 10px;
                    border-bottom: 1px solid rgba(254,130,4,0.08);
                    background: rgba(254,130,4,0.02);
                }
                .school-card__header-left {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    flex: 1;
                    min-width: 0;
                }
                .school-card__icon {
                    flex-shrink: 0;
                    width: 34px; height: 34px;
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 14px;
                }
                .school-card__icon--orange { background: #FFF7ED; color: #FE8204; }
                .school-card__icon--blue   { background: #EFF6FF; color: #3B82F6; }

                .school-card__depto {
                    font-size: 10px; font-weight: 900;
                    color: #FE8204; text-transform: uppercase;
                    letter-spacing: 0.05em; line-height: 1.2;
                    margin: 0 0 2px;
                }
                .school-card__localidad {
                    font-size: 10px; font-weight: 900;
                    color: #111827; text-transform: uppercase;
                    line-height: 1.2; margin: 0 0 2px;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .school-card__address {
                    font-size: 9px; font-weight: 700;
                    color: #9CA3AF; margin: 0;
                }

                .school-card__actions {
                    display: flex; align-items: center; gap: 6px; flex-shrink: 0;
                }
                .school-card__maps-btn {
                    display: flex; align-items: center; gap: 5px;
                    padding: 6px 10px; border-radius: 10px;
                    background: #F0FDF4; color: #16A34A;
                    border: 1px solid #DCFCE7;
                    font-size: 9px; font-weight: 900;
                    text-transform: uppercase; text-decoration: none;
                    transition: background 0.2s, color 0.2s;
                }
                .school-card__maps-btn:hover { background: #16A34A; color: white; }

                .school-card__close-btn {
                    width: 28px; height: 28px; border-radius: 8px;
                    border: 1px solid #F3F4F6; background: white;
                    color: #9CA3AF; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 11px;
                    transition: background 0.15s, color 0.15s;
                }
                .school-card__close-btn:hover { background: #FEE2E2; color: #EF4444; border-color: #FECACA; }

                .school-card__body {
                    padding: 10px 12px;
                    max-height: 220px;
                    overflow-y: auto;
                    display: flex; flex-direction: column; gap: 8px;
                }
                .school-card__est {
                    padding: 10px 12px;
                    background: #F9FAFB;
                    border-radius: 12px;
                    border: 1px solid #F3F4F6;
                }
                .school-card__est-name {
                    font-size: 11px; font-weight: 900;
                    color: #1F2937; margin: 0 0 6px;
                }
                .school-card__modalidades {
                    display: flex; flex-direction: column; gap: 4px;
                }
                .school-card__modalidad {
                    display: flex; gap: 4px; flex-wrap: wrap;
                }
                .school-card__tag {
                    font-size: 9px; font-weight: 700;
                    padding: 2px 6px; border-radius: 5px;
                }
                .school-card__tag--nivel {
                    background: #FFF7ED; color: #FE8204; border: 1px solid #FFEDD5;
                }
                .school-card__tag--area {
                    background: #F9FAFB; color: #6B7280; border: 1px solid #F3F4F6;
                    max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}

function FilterBtn({ active, onClick, label, color }) {
    const activeClass =
        color === 'orange'
            ? 'bg-orange-50 text-brand-orange border-brand-orange/30 shadow-sm'
            : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm';
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-xs font-bold transition-all ${
                active
                    ? activeClass
                    : 'border-gray-100 bg-gray-50 text-gray-400 grayscale'
            }`}
        >
            <div
                className={`h-2 w-2 rounded-full ${color === 'orange' ? 'bg-brand-orange shadow-orange-500/50' : 'bg-blue-500 shadow-blue-500/50'} shadow-sm`}
            ></div>
            <span>{label}</span>
        </button>
    );
}

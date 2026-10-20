import FilterBtn from './FilterBtn';

export default function MapaSidebar({
    sidebarOpen,
    onClose,
    searchQuery,
    handleSearch,
    isSearching,
    setIsSearching,
    searchResults,
    handleSelectSchool,
    activeFilters,
    toggleFilter,
    filterDepto,
    setFilterDepto,
    deptosDisponibles,
    filterNivel,
    setFilterNivel,
    nivelesDisponibles,
    isLoading,
    stats,
    clearFilters,
}) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col overflow-hidden bg-white shadow-2xl transition-all duration-300 lg:relative lg:z-20 lg:shadow-none ${
                sidebarOpen
                    ? 'w-[85vw] max-w-xs translate-x-0 border-r border-orange-100 lg:w-80'
                    : 'w-0 -translate-x-full border-transparent lg:w-0'
            }`}
        >
            <div className="flex h-full w-full flex-col bg-white text-black">
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50/40 px-4 py-3 lg:hidden">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-sliders-h text-brand-orange"></i>
                        <span className="text-xs font-black uppercase tracking-wider text-black">
                            Filtros del Mapa
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar panel de filtros"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-orange-50 hover:text-brand-orange"
                    >
                        <i className="fas fa-times text-sm"></i>
                    </button>
                </div>

                {/* Header */}
                <div className="border-b border-orange-50 bg-orange-50/20 p-4 sm:p-6">
                    {/* Search */}
                    <div className="relative mb-4">
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Buscar CUE, CUI o Nombre..."
                            aria-label="Buscar establecimientos por CUE, CUI o Nombre"
                            className="w-full rounded-xl border-orange-100 bg-white py-2.5 pl-10 pr-4 text-sm font-medium transition-all focus:border-brand-orange"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
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
                                        onClick={() => {
                                            handleSelectSchool(result.edificio);
                                            onClose?.();
                                        }}
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
                                                {result.edificio.localidad}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Advanced Filters */}
                <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-4 sm:space-y-8 sm:p-6">
                    {/* Ambito Section */}
                    <section>
                        <h3 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
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
                            className="mb-4 flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                        >
                            <i className="fas fa-map-marked-alt text-brand-orange"></i>{' '}
                            Departamento
                        </label>
                        <div className="relative">
                            <select
                                id="depto-select"
                                value={filterDepto}
                                onChange={(e) => setFilterDepto(e.target.value)}
                                className="w-full appearance-none rounded-xl border-gray-100 bg-gray-50 py-3 pl-4 pr-10 text-xs font-bold uppercase text-black shadow-sm transition-all focus:border-brand-orange focus:ring-brand-orange"
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
                            <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </section>

                    {/* Nivel Educativo Section */}
                    <section>
                        <label
                            htmlFor="nivel-select"
                            className="mb-4 flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"
                        >
                            <i className="fas fa-graduation-cap text-brand-orange"></i>{' '}
                            Nivel Educativo
                        </label>
                        <div className="relative">
                            <select
                                id="nivel-select"
                                value={filterNivel}
                                onChange={(e) => setFilterNivel(e.target.value)}
                                className="w-full appearance-none rounded-xl border-gray-100 bg-gray-50 py-3 pl-4 pr-10 text-xs font-bold uppercase text-black shadow-sm transition-all focus:border-brand-orange focus:ring-brand-orange"
                            >
                                <option value="TODOS">Todos los Niveles</option>
                                {nivelesDisponibles.map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                            <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="space-y-4 border-t border-orange-100 bg-orange-50/10 p-4 sm:p-6">
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
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 bg-white py-3.5 text-[10px] font-black uppercase tracking-widest text-gray-400 shadow-sm transition-all hover:border-brand-orange hover:text-brand-orange"
                    >
                        <i className="fas fa-sync-alt"></i> Limpiar Filtros
                    </button>
                </div>
            </div>
        </aside>
    );
}

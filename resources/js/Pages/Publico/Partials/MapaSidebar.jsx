import FilterBtn from './FilterBtn';

export default function MapaSidebar({
    sidebarOpen,
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
    showDeptoBorders,
    setShowDeptoBorders,
    isLoading,
    stats,
    clearFilters,
}) {
    return (
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
                                        onClick={() =>
                                            handleSelectSchool(result.edificio)
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
                                onChange={(e) => setFilterDepto(e.target.value)}
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

                    {/* Nivel Educativo Section */}
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
                                onChange={(e) => setFilterNivel(e.target.value)}
                                className="w-full appearance-none rounded-xl border-gray-100 bg-gray-50 py-3 pl-4 pr-10 text-xs font-black uppercase text-gray-700 shadow-sm transition-all focus:border-brand-orange focus:ring-brand-orange"
                            >
                                <option value="TODOS">Todos los Niveles</option>
                                {nivelesDisponibles.map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                            <i className="fas fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                        </div>
                    </section>

                    {/* Department Borders Toggle */}
                    <section>
                        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-draw-polygon text-brand-orange"></i>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-tight text-gray-800">
                                        Límites Departamentales
                                    </p>
                                    <p className="text-[9px] font-bold text-gray-400">
                                        Mostrar u ocultar bordes
                                    </p>
                                </div>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={showDeptoBorders}
                                    onChange={() =>
                                        setShowDeptoBorders(!showDeptoBorders)
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
    );
}

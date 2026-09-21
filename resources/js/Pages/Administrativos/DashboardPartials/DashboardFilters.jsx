import FilterSelect from './FilterSelect';

export default function DashboardFilters({
    showFilters,
    onToggleShowFilters,
    localFilters,
    options,
    onFilterChange,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/30 px-6 py-3">
                <div className="flex items-center gap-2">
                    <i className="fas fa-filter text-xs text-brand-orange"></i>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Filtros de Análisis
                    </h3>
                </div>
                <button
                    onClick={onToggleShowFilters}
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-orange transition hover:text-orange-600"
                >
                    {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    <i
                        className={`fas fa-chevron-${showFilters ? 'up' : 'down'}`}
                    ></i>
                </button>
            </div>

            {showFilters && (
                <div className="animate-in fade-in slide-in-from-top-2 p-4 duration-300">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {/* Ámbito */}
                        <div className="space-y-1.5">
                            <label className="ml-1 text-[10px] font-bold uppercase text-gray-400">
                                Ámbito
                            </label>
                            <div className="flex gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1">
                                {['TODOS', 'PUBLICO', 'PRIVADO'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() =>
                                            onFilterChange('ambito', opt)
                                        }
                                        className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-bold transition-all ${
                                            localFilters.ambito === opt
                                                ? 'border border-orange-100 bg-white text-brand-orange shadow-sm'
                                                : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Departamento */}
                        <div className="space-y-1.5">
                            <FilterSelect
                                label="Departamento"
                                name="departamento"
                                value={localFilters.departamento}
                                options={options.departamentos}
                                onChange={(v) =>
                                    onFilterChange('departamento', v)
                                }
                                icon="fas fa-map-marker-alt"
                                compact={true}
                            />
                        </div>

                        {/* Dirección de Área */}
                        <div className="space-y-1.5">
                            <FilterSelect
                                label="Dirección de Área"
                                name="direccion_area"
                                value={localFilters.direccion_area}
                                options={options.direcciones_area}
                                onChange={(v) =>
                                    onFilterChange('direccion_area', v)
                                }
                                icon="fas fa-sitemap"
                                compact={true}
                            />
                        </div>

                        {/* Nivel (solo si hay dirección) */}
                        <div className="space-y-1.5">
                            <FilterSelect
                                label="Modalidad"
                                name="nivel_educativo"
                                value={localFilters.nivel_educativo}
                                options={options.niveles_educativos}
                                onChange={(v) =>
                                    onFilterChange('nivel_educativo', v)
                                }
                                icon="fas fa-graduation-cap"
                                highlight={!!localFilters.direccion_area}
                                disabled={!localFilters.direccion_area}
                                compact={true}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

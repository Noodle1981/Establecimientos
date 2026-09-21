export default function AuditoriaFilters({
    filters,
    options,
    onFilterChange,
    onExportPdf,
    onExportExcel,
    isExporting,
    isExportingExcel,
}) {
    return (
        <div className="space-y-4 rounded-2xl border border-orange-50 bg-white p-4 shadow-sm">
            {/* Top Row: Search inputs & Export buttons */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative w-full flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por Nombre o CUE..."
                            className="w-full rounded-xl border-gray-200 py-2 pl-9 pr-3 text-xs font-medium transition-all focus:border-brand-orange focus:ring-brand-orange"
                            defaultValue={filters.search}
                            onChange={(e) => {
                                const val = e.target.value;
                                clearTimeout(window.searchTimeout);
                                window.searchTimeout = setTimeout(() => {
                                    onFilterChange('search', val);
                                }, 300);
                            }}
                        />
                        <i className="fas fa-search absolute left-3 top-2.5 text-xs text-gray-300"></i>
                    </div>

                    <div className="relative w-full sm:w-44">
                        <input
                            type="text"
                            placeholder="Buscar CUI..."
                            className="w-full rounded-xl border-gray-200 py-2 pl-9 pr-3 text-xs font-medium transition-all focus:border-brand-orange focus:ring-brand-orange"
                            defaultValue={filters.cui}
                            onChange={(e) => {
                                const val = e.target.value;
                                clearTimeout(window.cuiTimeout);
                                window.cuiTimeout = setTimeout(() => {
                                    onFilterChange('cui', val);
                                }, 300);
                            }}
                        />
                        <i className="fas fa-building absolute left-3 top-2.5 text-xs text-gray-300"></i>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onExportPdf}
                        disabled={isExporting}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-transparent bg-red-600 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {isExporting ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fas fa-file-pdf"></i>
                        )}
                        <span>{isExporting ? 'Generando...' : 'Exportar PDF'}</span>
                    </button>

                    <button
                        onClick={onExportExcel}
                        disabled={isExportingExcel}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-transparent bg-emerald-600 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {isExportingExcel ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fas fa-file-excel"></i>
                        )}
                        <span>{isExportingExcel ? 'Generando...' : 'Exportar Excel'}</span>
                    </button>
                </div>
            </div>

            {/* Bottom Row: Select Filters */}
            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-2 sm:grid-cols-4">
                <select
                    className="w-full rounded-xl border-gray-200 py-1.5 text-xs font-black uppercase text-gray-600"
                    value={filters.estado || ''}
                    onChange={(e) =>
                        onFilterChange('estado', e.target.value)
                    }
                >
                    <option value="">Todos los Estados</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CORRECTO">CORRECTO</option>
                    <option value="CORREGIDO">CORREGIDO</option>
                    <option value="REVISAR">REVISAR</option>
                    <option value="BAJA">BAJA</option>
                </select>

                <select
                    className="w-full rounded-xl border-gray-200 py-1.5 text-xs font-black uppercase text-gray-600"
                    value={filters.nivel || ''}
                    onChange={(e) =>
                        onFilterChange('nivel', e.target.value)
                    }
                >
                    <option value="">Todos los Niveles</option>
                    {options.niveles.map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>

                <select
                    className="w-full rounded-xl border-gray-200 py-1.5 text-xs font-black uppercase text-gray-600"
                    value={filters.departamento || ''}
                    onChange={(e) =>
                        onFilterChange('departamento', e.target.value)
                    }
                >
                    <option value="">Todos los Deptos</option>
                    {options.departamentos.map((d) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>

                <select
                    className="w-full rounded-xl border-gray-200 py-1.5 text-xs font-black uppercase text-gray-600"
                    value={filters.ambito || ''}
                    onChange={(e) =>
                        onFilterChange('ambito', e.target.value)
                    }
                >
                    <option value="">Todos los Ámbitos</option>
                    {options.ambitos.map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

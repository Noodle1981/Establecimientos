import PrimaryButton from '@/Components/PrimaryButton';

export default function EdificiosFilters({
    searchCui,
    onSearchCuiChange,
    search,
    onSearchChange,
    filters,
    options,
    onParamChange,
    totalCount,
    onOpenCreateModal,
    onResetFilters,
}) {
    const hasActiveFilters = Boolean(
        searchCui ||
            search ||
            filters.zona_departamento ||
            filters.localidad ||
            filters.ambito,
    );

    return (
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            {/* Top row: Search Inputs & Action Buttons */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-52">
                        <input
                            type="text"
                            placeholder="Buscar por CUI..."
                            className="w-full rounded-xl border-gray-200 py-2 pl-10 pr-4 text-xs font-medium text-black transition-all focus:border-brand-orange focus:ring-brand-orange"
                            value={searchCui}
                            onChange={onSearchCuiChange}
                        />
                        <i className="fas fa-search absolute left-3.5 top-3 text-xs text-gray-400"></i>
                    </div>

                    <div className="relative w-full flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por CUE o Establecimiento..."
                            className="w-full rounded-xl border-gray-200 py-2 pl-10 pr-4 text-xs font-medium text-black transition-all focus:border-brand-orange focus:ring-brand-orange"
                            value={search}
                            onChange={onSearchChange}
                        />
                        <i className="fas fa-search absolute left-3.5 top-3 text-xs text-gray-400"></i>
                    </div>
                </div>

                {/* Counter & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
                    <div
                        className="flex h-[38px] items-center justify-center rounded-xl border border-gray-100 bg-gray-50 px-3.5 text-xs font-black text-black shadow-sm"
                        title="Total de edificios registrados"
                    >
                        <span className="mr-1.5 hidden text-[10px] font-bold uppercase tracking-wider text-black/50 sm:inline">
                            Total
                        </span>
                        {totalCount}
                    </div>

                    <div className="flex items-center gap-2">
                        {hasActiveFilters && onResetFilters && (
                            <button
                                type="button"
                                onClick={onResetFilters}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-black transition hover:border-brand-orange hover:bg-orange-50 hover:text-brand-orange"
                                title="Limpiar todos los filtros"
                            >
                                <i className="fas fa-times text-xs"></i>
                                <span>Limpiar</span>
                            </button>
                        )}
                        <a
                            href={route('administrativos.edificios.export')}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-transparent bg-green-600 px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-green-700"
                        >
                            <i className="fas fa-file-excel"></i>
                            <span>Exportar</span>
                        </a>
                        <PrimaryButton
                            className="gap-1.5 !rounded-xl !px-3.5 !py-2 !text-[10px]"
                            onClick={onOpenCreateModal}
                        >
                            <i className="fas fa-plus"></i>
                            <span>Nuevo</span>
                        </PrimaryButton>
                    </div>
                </div>
            </div>

            {/* Bottom row: Select Dropdowns */}
            <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-3 sm:grid-cols-3">
                <select
                    value={filters.zona_departamento || ''}
                    onChange={(e) =>
                        onParamChange('zona_departamento', e.target.value)
                    }
                    className="w-full rounded-xl border-gray-200 py-2 text-xs font-black text-black focus:border-brand-orange focus:ring-brand-orange"
                >
                    <option value="">Departamentos (Todos)</option>
                    {options.zonas.map((z) => (
                        <option key={z} value={z}>
                            {z}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.localidad || ''}
                    onChange={(e) => onParamChange('localidad', e.target.value)}
                    className="w-full rounded-xl border-gray-200 py-2 text-xs font-black text-black focus:border-brand-orange focus:ring-brand-orange"
                >
                    <option value="">Localidades (Todas)</option>
                    {options.localidades.map((l) => (
                        <option key={l} value={l}>
                            {l}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.ambito || ''}
                    onChange={(e) => onParamChange('ambito', e.target.value)}
                    className="w-full rounded-xl border-gray-200 py-2 text-xs font-black uppercase text-black focus:border-brand-orange focus:ring-brand-orange"
                >
                    <option value="">Ámbito (Todos)</option>
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

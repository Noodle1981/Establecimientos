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
}) {
    return (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row">
            <div className="relative w-full md:w-52">
                <input
                    type="text"
                    placeholder="Buscar por CUI..."
                    className="w-full rounded-xl border-gray-200 py-2 pl-10 pr-4 text-sm transition-all focus:border-brand-orange focus:ring-brand-orange"
                    value={searchCui}
                    onChange={onSearchCuiChange}
                />
                <i className="fas fa-search absolute left-3.5 top-3 text-gray-400"></i>
            </div>

            <div className="relative w-full flex-1">
                <input
                    type="text"
                    placeholder="Buscar por CUE o Establecimiento..."
                    className="w-full rounded-xl border-gray-200 py-2 pl-10 pr-4 text-sm transition-all focus:border-brand-orange focus:ring-brand-orange"
                    value={search}
                    onChange={onSearchChange}
                />
                <i className="fas fa-search absolute left-3.5 top-3 text-gray-400"></i>
            </div>

            <select
                value={filters.zona_departamento || ''}
                onChange={(e) =>
                    onParamChange('zona_departamento', e.target.value)
                }
                className="min-w-[200px] rounded-xl border-gray-200 text-sm focus:border-brand-orange focus:ring-brand-orange"
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
                onChange={(e) =>
                    onParamChange('localidad', e.target.value)
                }
                className="min-w-[150px] rounded-xl border-gray-200 text-sm focus:border-brand-orange focus:ring-brand-orange"
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
                onChange={(e) =>
                    onParamChange('ambito', e.target.value)
                }
                className="min-w-[150px] rounded-xl border-gray-200 text-sm font-black uppercase focus:border-brand-orange focus:ring-brand-orange"
            >
                <option value="">Ámbito (Todos)</option>
                {options.ambitos.map((a) => (
                    <option key={a} value={a}>
                        {a}
                    </option>
                ))}
            </select>

            <div className="flex h-[38px] min-w-[50px] items-center justify-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-black text-black shadow-sm">
                {totalCount}
            </div>

            <div className="ml-2 flex shrink-0 gap-2 border-l border-gray-100 pl-4">
                <a
                    href={route('administrativos.edificios.export')}
                    className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-green-600 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-green-700"
                >
                    <i className="fas fa-file-excel"></i> Exportar
                </a>
                <PrimaryButton
                    className="gap-2 !rounded-xl !px-4 !py-2 !text-[10px]"
                    onClick={onOpenCreateModal}
                >
                    <i className="fas fa-plus"></i> Nuevo
                </PrimaryButton>
            </div>
        </div>
    );
}

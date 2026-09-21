import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import FilterSelect from './FilterSelect';

export default function EstablecimientosFilters({
    search,
    onSearchChange,
    filters,
    options,
    filteredRadios,
    filteredCategorias,
    onParamChange,
    onZonaDepartamentoChange,
    onResetFilters,
    totalCount,
    onOpenCreateModal,
}) {
    return (
        <div className="sticky top-6 space-y-4 self-start lg:col-span-1">
            {/* Primary Actions Area */}
            <div className="mb-6 flex flex-col gap-2">
                <PrimaryButton
                    className="w-full gap-3 !rounded-2xl !py-4"
                    onClick={onOpenCreateModal}
                >
                    <i className="fas fa-plus"></i>
                    <span className="text-sm">Nueva Modalidad</span>
                </PrimaryButton>
                <a
                    href={route('administrativos.establecimientos.export')}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-green-100 bg-green-50 py-3 text-[10px] font-black uppercase tracking-widest text-green-700 shadow-sm transition-all hover:bg-green-600 hover:text-white"
                >
                    <i className="fas fa-file-excel"></i> Exportar Datos
                </a>
            </div>

            <div className="space-y-6 overflow-hidden rounded-2xl border border-orange-100 bg-white p-0 shadow-sm">
                <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50/50 px-5 py-3">
                    <div className="flex items-center gap-3">
                        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-orange">
                            <i className="fas fa-filter"></i>
                            Filtros
                        </h3>
                        <span className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-1.5 text-xl font-black text-black shadow-sm">
                            {totalCount}
                        </span>
                    </div>
                    <button
                        onClick={onResetFilters}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-orange hover:underline"
                    >
                        Limpiar
                    </button>
                </div>
                <div className="space-y-6 px-5 pb-6">
                    {/* Search Input */}
                    <div className="space-y-1">
                        <InputLabel value="Búsqueda" />
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Nombre, CUE, CUI..."
                                className="w-full rounded-xl border-gray-200 py-2 pl-9 pr-4 text-xs font-bold transition-all focus:border-brand-orange focus:ring-brand-orange"
                                value={search}
                                onChange={onSearchChange}
                            />
                            <i className="fas fa-search absolute left-3 top-2.5 text-gray-300"></i>
                        </div>
                    </div>

                    <FilterSelect
                        label="Dirección de Área"
                        value={filters.direccion_area}
                        options={options.areas}
                        onChange={(v) => onParamChange('direccion_area', v)}
                    />
                    <FilterSelect
                        label="Nivel Educativo"
                        value={filters.nivel_educativo}
                        options={options.niveles}
                        onChange={(v) => onParamChange('nivel_educativo', v)}
                    />
                    <FilterSelect
                        label="Ámbito"
                        value={filters.ambito}
                        options={options.ambitos}
                        onChange={(v) => onParamChange('ambito', v)}
                    />

                    <div className="space-y-1">
                        <InputLabel value="Estado" />
                        <select
                            value={filters.estado || ''}
                            onChange={(e) =>
                                onParamChange('estado', e.target.value)
                            }
                            className="w-full rounded-xl border-gray-200 text-xs font-bold focus:border-brand-orange focus:ring-brand-orange"
                        >
                            <option value="">Cualquiera</option>
                            <option value="VALIDADO">Validado</option>
                            <option value="PENDIENTE">Pendiente</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FilterSelect
                            label="Radio"
                            value={filters.radio}
                            options={filteredRadios}
                            onChange={(v) => onParamChange('radio', v)}
                        />
                        <div className="space-y-1">
                            <InputLabel value="Sector" />
                            <input
                                type="text"
                                placeholder="Sector..."
                                className="w-full rounded-xl border-gray-200 text-xs font-bold focus:border-brand-orange focus:ring-brand-orange"
                                defaultValue={filters.sector || ''}
                                onBlur={(e) =>
                                    onParamChange('sector', e.target.value)
                                }
                                onKeyDown={(e) =>
                                    e.key === 'Enter' &&
                                    onParamChange('sector', e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <FilterSelect
                        label="Zona / Departamento"
                        value={filters.zona_departamento}
                        options={options.zonas}
                        onChange={onZonaDepartamentoChange}
                    />
                    <FilterSelect
                        label="Categoría"
                        value={filters.categoria}
                        options={filteredCategorias}
                        onChange={(v) => onParamChange('categoria', v)}
                    />
                </div>
            </div>
        </div>
    );
}

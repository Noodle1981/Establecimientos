import Pagination from '@/Components/Pagination';

export const getEdificioAmbito = (edificio) => {
    if (!edificio.establecimientos || edificio.establecimientos.length === 0)
        return 'S/D';

    for (const est of edificio.establecimientos) {
        if (est.modalidades && est.modalidades.length > 0) {
            return est.modalidades[0].ambito || 'S/D';
        }
    }
    return 'S/D';
};

export default function EdificiosTable({
    edificios,
    filters,
    onSort,
    onView,
    onEdit,
    onDelete,
    onResetFilters,
}) {
    return (
        <div className="space-y-6">
            {/* Mobile Cards View (sm / md:hidden) */}
            <div className="space-y-3.5 md:hidden">
                {edificios.data.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-brand-orange">
                            <i className="fas fa-building text-2xl opacity-60"></i>
                        </div>
                        <p className="text-sm font-black uppercase tracking-wider text-black">
                            No se encontraron edificios
                        </p>
                        <p className="mt-1 text-xs font-medium text-black/50">
                            Prueba ajustando los filtros o el término de búsqueda.
                        </p>
                        {onResetFilters && (
                            <button
                                type="button"
                                onClick={onResetFilters}
                                className="mt-4 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white"
                            >
                                Limpiar todos los filtros
                            </button>
                        )}
                    </div>
                ) : (
                    edificios.data.map((edificio) => {
                        const ambito = getEdificioAmbito(edificio);
                        return (
                            <div
                                key={edificio.id}
                                className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-brand-orange/40 hover:shadow-md"
                            >
                                {/* Header: CUI + Ambito + Actions */}
                                <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-black text-black">
                                            CUI: {edificio.cui}
                                        </span>
                                        <span
                                            className={`inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                                                ambito === 'PUBLICO'
                                                    ? 'border border-orange-100 bg-orange-50 text-brand-orange'
                                                    : 'border border-blue-100 bg-blue-50 text-blue-600'
                                            }`}
                                        >
                                            {ambito}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex shrink-0 items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => onView(edificio)}
                                            className="rounded-lg bg-gray-50 p-2 text-gray-500 shadow-sm transition hover:bg-brand-orange hover:text-white"
                                            title="Ver detalles"
                                            aria-label="Ver detalles"
                                        >
                                            <i className="fas fa-eye text-xs"></i>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onEdit(edificio)}
                                            className="rounded-lg bg-orange-50 p-2 text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white"
                                            title="Editar edificio"
                                            aria-label="Editar edificio"
                                        >
                                            <i className="fas fa-edit text-xs"></i>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(edificio.id)}
                                            className="rounded-lg border border-brand-red/20 bg-red-50 p-2 text-brand-red shadow-sm transition hover:bg-brand-red hover:text-white"
                                            title="Eliminar edificio"
                                            aria-label="Eliminar edificio"
                                        >
                                            <i className="fas fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Body Info */}
                                <div className="space-y-2 text-xs">
                                    <div>
                                        <span className="block text-[10px] font-black uppercase tracking-wider text-black/50">
                                            Establecimiento Cabecera
                                        </span>
                                        <p className="font-black text-black">
                                            {edificio.cabecera?.nombre ||
                                                'Sin Cabecera'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-2">
                                        <div>
                                            <span className="block text-[10px] font-black uppercase tracking-wider text-black/50">
                                                Ubicación
                                            </span>
                                            <p className="font-medium text-black">
                                                {edificio.calle}{' '}
                                                {edificio.numero_puerta ||
                                                    'S/N'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black uppercase tracking-wider text-black/50">
                                                Depto / Localidad
                                            </span>
                                            <p className="font-medium text-black">
                                                {edificio.zona_departamento}
                                                {edificio.localidad
                                                    ? ` - ${edificio.localidad}`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Desktop Table View (hidden on mobile, visible on md and up) */}
            <div className="hidden overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-2xl md:block">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-orange-600 bg-brand-orange text-[10px] font-black uppercase text-white">
                                <th
                                    className="group cursor-pointer px-6 py-3 transition-colors hover:bg-orange-600"
                                    onClick={() => onSort('cui')}
                                >
                                    <div className="flex items-center gap-2">
                                        CUI / Ubicación
                                        <i
                                            className={`fas fa-sort${filters.sort_by === 'cui' ? (filters.sort_dir === 'asc' ? '-up' : '-down') : ''} opacity-60 group-hover:opacity-100`}
                                        ></i>
                                    </div>
                                </th>
                                <th className="px-6 py-3">
                                    Establecimiento Cabecera
                                </th>
                                <th
                                    className="group cursor-pointer px-6 py-3 transition-colors hover:bg-orange-600"
                                    onClick={() => onSort('zona_departamento')}
                                >
                                    <div className="flex items-center gap-2">
                                        Depto / Localidad
                                        <i
                                            className={`fas fa-sort${filters.sort_by === 'zona_departamento' ? (filters.sort_dir === 'asc' ? '-up' : '-down') : ''} opacity-60 group-hover:opacity-100`}
                                        ></i>
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-center">
                                    Ámbito
                                </th>
                                <th className="px-6 py-3 text-right">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {edificios.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-brand-orange">
                                                <i className="fas fa-building text-2xl opacity-60"></i>
                                            </div>
                                            <p className="text-sm font-black uppercase tracking-wider text-black">
                                                No se encontraron edificios
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-black/50">
                                                Prueba ajustando los filtros o el
                                                término de búsqueda.
                                            </p>
                                            {onResetFilters && (
                                                <button
                                                    type="button"
                                                    onClick={onResetFilters}
                                                    className="mt-4 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white"
                                                >
                                                    Limpiar todos los filtros
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                edificios.data.map((edificio) => (
                                    <tr
                                        key={edificio.id}
                                        className="group transition-colors hover:bg-orange-50/30"
                                    >
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-black group-hover:text-brand-orange">
                                                    {edificio.cui}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-black/50">
                                                    {edificio.calle}{' '}
                                                    {edificio.numero_puerta ||
                                                        'S/N'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="line-clamp-2 text-xs font-black leading-tight text-black">
                                                {edificio.cabecera?.nombre ||
                                                    'Sin Cabecera'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-black">
                                                    {edificio.zona_departamento}
                                                </span>
                                                <span className="text-[10px] font-black text-black/50">
                                                    {edificio.localidad}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span
                                                className={`inline-flex items-center justify-center rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${
                                                    getEdificioAmbito(
                                                        edificio,
                                                    ) === 'PUBLICO'
                                                        ? 'border border-orange-100 bg-orange-50 text-brand-orange'
                                                        : 'border border-blue-100 bg-blue-50 text-blue-600'
                                                }`}
                                            >
                                                {getEdificioAmbito(edificio)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onView(edificio)}
                                                    className="rounded-lg bg-gray-50 p-2 text-gray-500 shadow-sm transition hover:bg-brand-orange hover:text-white"
                                                    title="Ver detalles"
                                                    aria-label="Ver detalles"
                                                >
                                                    <i className="fas fa-eye text-xs"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(edificio)}
                                                    className="rounded-lg bg-orange-50 p-2 text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white"
                                                    title="Editar edificio"
                                                    aria-label="Editar edificio"
                                                >
                                                    <i className="fas fa-edit text-xs"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDelete(edificio.id)
                                                    }
                                                    className="rounded-lg border border-brand-red/20 bg-red-50 p-2 text-brand-red shadow-sm transition hover:bg-brand-red hover:text-white"
                                                    title="Eliminar edificio"
                                                    aria-label="Eliminar edificio"
                                                >
                                                    <i className="fas fa-trash text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="-mt-2 flex justify-center">
                <Pagination links={edificios.links} />
            </div>
        </div>
    );
}

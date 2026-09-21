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
}) {
    return (
        <div className="space-y-6">
            <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-orange-600 bg-brand-orange text-[10px] font-black uppercase text-white">
                                <th
                                    className="group cursor-pointer px-6 py-2 transition-colors hover:bg-orange-600"
                                    onClick={() => onSort('cui')}
                                >
                                    <div className="flex items-center gap-2">
                                        CUI / Ubicación
                                        <i
                                            className={`fas fa-sort${filters.sort_by === 'cui' ? (filters.sort_dir === 'asc' ? '-up' : '-down') : ''} opacity-50 group-hover:opacity-100`}
                                        ></i>
                                    </div>
                                </th>
                                <th className="px-6 py-2">
                                    Establecimiento Cabecera
                                </th>
                                <th
                                    className="group cursor-pointer px-6 py-2 transition-colors hover:bg-orange-600"
                                    onClick={() => onSort('zona_departamento')}
                                >
                                    <div className="flex items-center gap-2">
                                        Depto / Localidad
                                        <i
                                            className={`fas fa-sort${filters.sort_by === 'zona_departamento' ? (filters.sort_dir === 'asc' ? '-up' : '-down') : ''} opacity-50 group-hover:opacity-100`}
                                        ></i>
                                    </div>
                                </th>
                                <th className="px-6 py-2 text-center">
                                    Ámbito
                                </th>
                                <th className="px-6 py-2 text-right">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {edificios.data.map((edificio) => (
                                <tr
                                    key={edificio.id}
                                    className="group transition-colors hover:bg-orange-50/30"
                                >
                                    <td className="px-6 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-black group-hover:text-brand-orange">
                                                {edificio.cui}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-black/40">
                                                {edificio.calle}{' '}
                                                {edificio.numero_puerta ||
                                                    'S/N'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2">
                                        <span className="line-clamp-2 text-xs font-black leading-tight text-black/80">
                                            {edificio.cabecera?.nombre ||
                                                'Sin Cabecera'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-black/70">
                                                {edificio.zona_departamento}
                                            </span>
                                            <span className="text-[10px] font-black text-black/40">
                                                {edificio.localidad}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 text-center">
                                        <span
                                            className={`inline-flex items-center justify-center rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${
                                                getEdificioAmbito(edificio) ===
                                                'PUBLICO'
                                                    ? 'border border-orange-100 bg-orange-50 text-brand-orange'
                                                    : 'border border-blue-100 bg-blue-50 text-blue-600'
                                            }`}
                                        >
                                            {getEdificioAmbito(edificio)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onView(edificio)}
                                                className="rounded-lg bg-gray-50 p-2 text-gray-400 shadow-sm transition hover:bg-brand-orange hover:text-white"
                                                title="Ver detalles"
                                            >
                                                <i className="fas fa-eye text-xs"></i>
                                            </button>
                                            <button
                                                onClick={() => onEdit(edificio)}
                                                className="rounded-lg bg-orange-50 p-2 text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white"
                                                title="Editar edificio"
                                            >
                                                <i className="fas fa-edit text-xs"></i>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDelete(edificio.id)
                                                }
                                                className="rounded-lg border border-brand-red/20 bg-red-50 p-2 text-brand-red shadow-sm transition hover:bg-brand-red hover:text-white"
                                                title="Eliminar edificio"
                                            >
                                                <i className="fas fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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

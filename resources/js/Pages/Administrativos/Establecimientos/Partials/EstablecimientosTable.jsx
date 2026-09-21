import Pagination from '@/Components/Pagination';
import { getNombreEdificio } from '../constants/areasNiveles';

export default function EstablecimientosTable({
    modalidades,
    nombresEdificios,
    onView,
    onEdit,
    onDelete,
    onResetFilters,
}) {
    return (
        <div className="space-y-6 lg:col-span-3">
            <div className="overflow-hidden border border-l-4 border-gray-100 border-l-brand-orange bg-white shadow-sm sm:rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-orange-600 bg-brand-orange text-[10px] font-black uppercase text-white">
                                <th className="px-6 py-2">
                                    Establecimiento / CUE
                                </th>
                                <th className="px-6 py-2">Edificio</th>
                                <th className="px-6 py-2">Nivel / Área</th>
                                <th className="px-6 py-2">Estado</th>
                                <th className="px-6 py-2 text-right">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {modalidades.data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="group transition-colors hover:bg-orange-50/30"
                                >
                                    <td className="px-6 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black leading-tight text-black group-hover:text-brand-orange">
                                                {item.establecimiento.nombre}
                                            </span>
                                            <span className="mt-1 text-[9px] font-black uppercase text-black/40">
                                                CUE: {item.establecimiento.cue}
                                                {item.establecimiento?.edificio
                                                    ?.zona_departamento &&
                                                    ` - ${item.establecimiento.edificio.zona_departamento}`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2">
                                        <div className="flex max-w-[200px] flex-col">
                                            {getNombreEdificio(
                                                item,
                                                nombresEdificios,
                                            ) ? (
                                                <>
                                                    <span
                                                        className="text-[10px] font-black leading-tight text-gray-900"
                                                        title={getNombreEdificio(
                                                            item,
                                                            nombresEdificios,
                                                        )}
                                                    >
                                                        {getNombreEdificio(
                                                            item,
                                                            nombresEdificios,
                                                        )}
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase tracking-tighter text-brand-orange">
                                                        CUI:{' '}
                                                        {
                                                            item.establecimiento
                                                                .edificio?.cui
                                                        }
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-[10px] font-black leading-tight text-brand-orange">
                                                    CUI:{' '}
                                                    {item.establecimiento
                                                        .edificio?.cui || 'S/D'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-black/70">
                                                {item.nivel_educativo}
                                            </span>
                                            <span className="max-w-[150px] truncate text-[9px] font-black uppercase text-black/40">
                                                {item.direccion_area}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2">
                                        <span
                                            className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                                                item.validado
                                                    ? 'border-brand-orange/20 bg-orange-50 text-brand-orange'
                                                    : 'border-brand-red/20 bg-red-50 text-brand-red'
                                            }`}
                                        >
                                            <i
                                                className={`fas ${item.validado ? 'fa-check-circle' : 'fa-clock'} mr-1`}
                                            ></i>
                                            {item.validado
                                                ? 'Validado'
                                                : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onView(item)}
                                                className="rounded-lg bg-gray-50 p-2 text-gray-400 shadow-sm transition hover:bg-brand-orange hover:text-white"
                                                title="Ver detalle"
                                            >
                                                <i className="fas fa-eye text-xs"></i>
                                            </button>
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="rounded-lg bg-orange-50 p-2 text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white"
                                                title="Editar modalidad"
                                            >
                                                <i className="fas fa-edit text-xs"></i>
                                            </button>
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="rounded-lg border border-brand-red/20 bg-red-50 p-2 text-brand-red shadow-sm transition hover:bg-brand-red hover:text-white"
                                                title="Dar de baja modalidad"
                                            >
                                                <i className="fas fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {modalidades.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-20 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                                                <i className="fas fa-search text-2xl"></i>
                                            </div>
                                            <h4 className="text-sm font-black uppercase tracking-tight text-gray-900">
                                                No se encontraron resultados
                                            </h4>
                                            <p className="mx-auto max-w-[250px] text-xs font-medium text-gray-400">
                                                Intenta ajustar los filtros o la
                                                búsqueda para encontrar lo que
                                                necesitas.
                                            </p>
                                            <button
                                                onClick={onResetFilters}
                                                className="mt-4 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-orange shadow-sm transition-all hover:bg-brand-orange hover:text-white"
                                            >
                                                Limpiar todos los filtros
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="-mt-2 flex justify-center">
                <Pagination links={modalidades.links} />
            </div>
        </div>
    );
}

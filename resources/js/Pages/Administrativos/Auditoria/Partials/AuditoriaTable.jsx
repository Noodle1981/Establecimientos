import Pagination from '@/Components/Pagination';
import StatusBadge from './StatusBadge';

export default function AuditoriaTable({
    modalidades,
    getNombreEdificio,
    onSelectModalidad,
}) {
    return (
        <div className="space-y-6">
            <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-orange-600 bg-brand-orange text-[10px] font-black uppercase text-white">
                                <th className="px-3.5 py-2.5">
                                    Establecimiento / CUE
                                </th>
                                <th className="px-3.5 py-2.5">Modalidad</th>
                                <th className="px-3.5 py-2.5">Edificio</th>
                                <th className="px-3.5 py-2.5">
                                    Última Validación
                                </th>
                                <th className="px-3.5 py-2.5">Estado</th>
                                <th className="px-3.5 py-2.5">
                                    Modificaciones
                                </th>
                                <th className="px-3.5 py-2.5">Observaciones</th>
                                <th className="px-3.5 py-2.5 text-right">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {modalidades.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-4 py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center py-4">
                                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-brand-orange">
                                                <i className="fas fa-search text-2xl opacity-50"></i>
                                            </div>
                                            <p className="text-sm font-black uppercase tracking-widest text-gray-900">
                                                No se encontraron resultados
                                            </p>
                                            <p className="mt-2 text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                                                Prueba ajustando los filtros
                                                o el término de búsqueda
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                modalidades.data.map((mod) => (
                                    <tr
                                        key={mod.id}
                                        className="group transition-colors hover:bg-orange-50/5"
                                    >
                                        <td className="px-3.5 py-2.5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black leading-tight text-gray-900">
                                                    {mod.establecimiento
                                                        ?.nombre ||
                                                        'Sin Establecimiento'}
                                                </span>
                                                <span className="text-[9px] font-bold text-gray-400">
                                                    CUE:{' '}
                                                    {mod.establecimiento
                                                        ?.cue || 'S/D'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3.5 py-2.5">
                                            <div className="flex flex-col gap-1">
                                                <span className="w-fit rounded-lg border border-orange-100 bg-orange-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-tight text-brand-orange">
                                                    {mod.nivel_educativo ||
                                                        'S/D'}
                                                </span>
                                                <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">
                                                    R:{mod.radio || '-'} |
                                                    S:{mod.sector || '-'} |
                                                    C:{mod.categoria || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3.5 py-2.5">
                                            <div className="flex max-w-[180px] flex-col">
                                                {getNombreEdificio(mod) ? (
                                                    <>
                                                        <span
                                                            className="text-[10px] font-black leading-tight text-gray-900"
                                                            title={getNombreEdificio(
                                                                mod,
                                                            )}
                                                        >
                                                            {getNombreEdificio(
                                                                mod,
                                                            )}
                                                        </span>
                                                        <span className="text-[9px] font-bold uppercase tracking-tighter text-gray-400">
                                                            CUI:{' '}
                                                            {mod
                                                                .establecimiento
                                                                ?.edificio
                                                                ?.cui ||
                                                                mod
                                                                    .establecimiento
                                                                    ?.establecimiento_cabecera ||
                                                                'S/D'}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-[10px] font-black leading-tight text-brand-orange">
                                                        CUI:{' '}
                                                        {mod.establecimiento
                                                            ?.edificio
                                                            ?.cui ||
                                                            mod
                                                                .establecimiento
                                                                ?.establecimiento_cabecera ||
                                                            'S/D'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3.5 py-2.5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-gray-700">
                                                    {mod.usuario_validacion
                                                        ?.name || 'Sistema'}
                                                </span>
                                                <span className="text-[9px] font-bold text-gray-400">
                                                    {mod.validado_en ||
                                                        'S/D'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3.5 py-2.5">
                                            <div className="flex max-w-[140px] flex-wrap gap-1">
                                                {mod.campos_auditados &&
                                                mod.campos_auditados
                                                    .length > 0 ? (
                                                    mod.campos_auditados.map(
                                                        (campo) => (
                                                            <span
                                                                key={campo}
                                                                className="rounded border border-orange-100 bg-orange-50 px-1.5 py-0.5 text-[8px] font-black uppercase text-brand-orange"
                                                            >
                                                                {campo}
                                                            </span>
                                                        ),
                                                    )
                                                ) : (
                                                    <span className="text-[9px] font-medium italic text-gray-400">
                                                        Sin cambios
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3.5 py-2.5">
                                            <p className="line-clamp-2 max-w-[180px] text-[10px] font-medium italic text-gray-400">
                                                {mod.observaciones || '-'}
                                            </p>
                                        </td>
                                        <td className="px-3.5 py-2.5 text-right">
                                            <button
                                                onClick={() =>
                                                    onSelectModalidad(mod)
                                                }
                                                className="rounded-xl border border-orange-100 bg-orange-50 p-2.5 text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white"
                                                title="Ver y Validar"
                                            >
                                                <i className="fas fa-eye text-sm"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
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

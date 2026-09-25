import Pagination from '@/Components/Pagination';

export default function ReportesList({
    reportes,
    selectedReporte,
    onSelectReporte,
}) {
    return (
        <div className="flex w-full flex-col border-r border-gray-100 md:w-1/3">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">
                    Mensajes
                </h3>
                <span className="rounded-full bg-brand-orange px-2.5 py-0.5 text-[10px] font-black text-white">
                    {reportes.total} Total
                </span>
            </div>
            <div className="custom-scrollbar flex-1 overflow-y-auto">
                {reportes.data.length === 0 ? (
                    <div className="p-10 text-center">
                        <i className="fas fa-inbox mb-4 text-4xl text-gray-200"></i>
                        <p className="text-xs font-bold uppercase text-gray-400">
                            Sin reportes nuevos
                        </p>
                    </div>
                ) : (
                    <>
                        {reportes.data.map((reporte) => (
                            <button
                                key={reporte.id}
                                onClick={() => onSelectReporte(reporte)}
                                className={`relative flex w-full flex-col gap-2 border-b border-gray-100 p-6 text-left transition-all hover:bg-orange-50/30 ${
                                    selectedReporte?.id === reporte.id
                                        ? 'border-l-4 border-l-brand-orange bg-orange-50/50'
                                        : ''
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <span
                                        className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase ${
                                            reporte.estado === 'PENDIENTE'
                                                ? 'bg-orange-100 text-brand-orange'
                                                : reporte.estado === 'PROCESADO'
                                                  ? 'bg-emerald-100 text-emerald-700'
                                                  : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        {reporte.estado}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400">
                                        {new Date(
                                            reporte.created_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="line-clamp-1 text-xs font-black uppercase text-black">
                                    {reporte.edificio
                                        ? `CUI: ${reporte.edificio.cui} - ${reporte.edificio.localidad}`
                                        : 'Reporte General'}
                                </p>
                                <p className="line-clamp-2 text-[11px] italic text-gray-600">
                                    "{reporte.descripcion}"
                                </p>
                            </button>
                        ))}
                        {/* Controles de Paginación */}
                        <div className="flex justify-center border-t border-gray-100 bg-gray-50/50 p-4">
                            <Pagination links={reportes.links} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

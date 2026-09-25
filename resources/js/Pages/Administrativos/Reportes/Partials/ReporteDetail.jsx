export default function ReporteDetail({
    selectedReporte,
    onUpdateStatus,
    onDelete,
    isUpdating,
}) {
    if (!selectedReporte) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center p-12 text-center bg-gray-50/30">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-300">
                    <i className="fas fa-mouse-pointer"></i>
                </div>
                <h4 className="text-lg font-black uppercase text-gray-400">
                    Selecciona un mensaje
                </h4>
                <p className="mt-2 max-w-xs text-xs font-bold uppercase text-gray-400">
                    Haz clic en un reporte de la lista para ver los detalles y gestionarlo
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col bg-gray-50/30">
            <div className="animate-in fade-in slide-in-from-right-4 flex h-full flex-col duration-300">
                {/* Detail Header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-white p-8">
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-sm ${
                                selectedReporte.tipo === 'ERROR_DATOS'
                                    ? 'bg-red-50 text-brand-red'
                                    : selectedReporte.tipo === 'UBICACION_INCORRECTA'
                                      ? 'bg-blue-50 text-blue-500'
                                      : 'bg-orange-50 text-brand-orange'
                            }`}
                        >
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div>
                            <h4 className="mb-1 text-lg font-black uppercase leading-none text-black">
                                {selectedReporte.tipo.replace('_', ' ')}
                            </h4>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                Detalles del Reporte #{selectedReporte.id}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={isUpdating}
                            onClick={() => onUpdateStatus(selectedReporte, 'PROCESADO')}
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:opacity-50"
                        >
                            <i
                                className={`fas ${
                                    isUpdating ? 'fa-spinner fa-spin' : 'fa-check'
                                } mr-2`}
                            ></i>{' '}
                            Solucionado
                        </button>
                        <button
                            disabled={isUpdating}
                            onClick={() => onUpdateStatus(selectedReporte, 'DESCARTADO')}
                            className="rounded-xl bg-gray-100 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 transition hover:bg-gray-200 disabled:opacity-50"
                        >
                            <i className="fas fa-ban mr-2"></i> Descartar
                        </button>
                        <button
                            onClick={() => onDelete(selectedReporte)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-brand-red transition hover:bg-brand-red hover:text-white"
                            title="Eliminar reporte"
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>

                {/* Detail Body */}
                <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-8">
                    {/* Info Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                                <i className="fas fa-building text-brand-orange"></i>{' '}
                                Datos de la Escuela
                            </p>
                            {selectedReporte.edificio ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-black uppercase text-black">
                                        {selectedReporte.edificio.localidad}
                                    </p>
                                    <p className="text-[11px] font-bold text-gray-600">
                                        {selectedReporte.edificio.calle}{' '}
                                        {selectedReporte.edificio.numero_puerta}
                                    </p>
                                    <div className="pt-2">
                                        <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase text-brand-orange">
                                            CUI: {selectedReporte.edificio.cui}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs font-bold italic text-gray-400">
                                    No asociado a una escuela específica
                                </p>
                            )}
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                                <i className="fas fa-user text-brand-orange"></i>{' '}
                                Remitente
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm font-black uppercase text-black">
                                    {selectedReporte.nombre_remitente || 'Anónimo'}
                                </p>
                                <p className="text-[11px] font-bold text-gray-600">
                                    {selectedReporte.email_remitente ||
                                        'Sin correo electrónico'}
                                </p>
                                <div className="pt-2">
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase text-blue-600">
                                        IP Registrada
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-8 shadow-sm">
                        <div className="absolute right-0 top-0 p-4 opacity-5">
                            <i className="fas fa-quote-right text-6xl text-brand-orange"></i>
                        </div>
                        <p className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                            <i className="fas fa-align-left text-brand-orange"></i>{' '}
                            Mensaje del Usuario
                        </p>
                        <p className="whitespace-pre-wrap text-base font-medium italic leading-relaxed text-gray-800">
                            "{selectedReporte.descripcion}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ReportModal({ isOpen, onClose, selectedEdificio }) {
    const isRealEdificio = Boolean(
        selectedEdificio && !selectedEdificio._isCenter && selectedEdificio.id,
    );
    const [asociarEdificio, setAsociarEdificio] = useState(true);

    const { data, setData, post, processing, reset, errors } = useForm({
        edificio_id: '',
        tipo: 'ERROR_DATOS',
        descripcion: '',
        nombre_remitente: '',
        email_remitente: '',
    });

    useEffect(() => {
        if (isOpen) {
            setAsociarEdificio(true);
            if (isRealEdificio) {
                setData('edificio_id', selectedEdificio.id);
            } else {
                setData('edificio_id', '');
            }
        }
    }, [isOpen, isRealEdificio, selectedEdificio]);

    const handleToggleAsociacion = () => {
        const nextState = !asociarEdificio;
        setAsociarEdificio(nextState);
        setData('edificio_id', nextState && isRealEdificio ? selectedEdificio.id : '');
    };

    const submitReport = (e) => {
        e.preventDefault();
        post(route('publico.reportes.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const nombreEdificio =
        selectedEdificio?.establecimientos?.map((e) => e.nombre).filter(Boolean).join(' / ') ||
        (selectedEdificio?.cui ? `Edificio CUI ${selectedEdificio.cui}` : '');

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="bg-white p-8">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-500 shadow-inner">
                        <i className={isRealEdificio && asociarEdificio ? 'fas fa-school' : 'fas fa-bullhorn'}></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black leading-tight text-gray-900">
                            Reportar{' '}
                            <span className="text-red-500">
                                {isRealEdificio && asociarEdificio ? 'este Edificio' : 'un Inconveniente'}
                            </span>
                        </h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            {isRealEdificio && asociarEdificio
                                ? `Asociado a CUI ${selectedEdificio.cui}`
                                : 'Ayúdanos a mejorar el mapa escolar'}
                        </p>
                    </div>
                </div>

                {/* Card de asociación de edificio si hay uno seleccionado */}
                {isRealEdificio && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50/60 p-4 transition-all">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                                            {asociarEdificio
                                                ? 'Edificio Vinculado al Reporte'
                                                : 'Reporte General (Desvinculado)'}
                                        </span>
                                        <span className="rounded-md bg-red-200/70 px-1.5 py-0.5 text-[10px] font-bold text-red-800">
                                            CUI: {selectedEdificio.cui}
                                        </span>
                                    </div>
                                    <p className="text-xs font-black text-gray-800 mt-0.5 line-clamp-1">
                                        {nombreEdificio}
                                    </p>
                                    <p className="text-[11px] text-gray-500">
                                        {selectedEdificio.calle} {selectedEdificio.numero_puerta},{' '}
                                        {selectedEdificio.localidad} ({selectedEdificio.zona_departamento})
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleAsociacion}
                                className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold text-gray-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                                title={
                                    asociarEdificio
                                        ? 'Desvincular para hacer un reporte general'
                                        : 'Volver a vincular este edificio'
                                }
                            >
                                {asociarEdificio ? (
                                    <span>
                                        <i className="fas fa-times-circle mr-1"></i>
                                        Desvincular
                                    </span>
                                ) : (
                                    <span>
                                        <i className="fas fa-link mr-1"></i>
                                        Vincular
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={submitReport} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Tipo de Reporte */}
                        <div className="space-y-2">
                            <label
                                htmlFor="tipo-reporte"
                                className="flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400"
                            >
                                <i className="fas fa-tag text-red-400"></i> Motivo
                                del Reporte
                            </label>
                            <select
                                id="tipo-reporte"
                                className="w-full rounded-xl border-gray-100 bg-gray-50 p-3 text-sm font-bold text-gray-700 focus:border-red-500 focus:ring-red-500"
                                value={data.tipo}
                                onChange={(e) =>
                                    setData('tipo', e.target.value)
                                }
                                required
                            >
                                <option value="ERROR_DATOS">
                                    Error en los datos (Nombre, CUE, etc)
                                </option>
                                <option value="UBICACION_INCORRECTA">
                                    Ubicación incorrecta en el mapa
                                </option>
                                <option value="INFO_FALTANTE">
                                    Falta información (Nivel, modalidad)
                                </option>
                                <option value="OTRO">Otro motivo</option>
                            </select>
                        </div>

                        {/* Email Remitente */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email-reporte"
                                className="flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400"
                            >
                                <i className="fas fa-envelope text-red-400"></i>{' '}
                                Tu Correo (Opcional)
                            </label>
                            <input
                                id="email-reporte"
                                type="email"
                                placeholder="ejemplo@correo.com"
                                className="w-full rounded-xl border-gray-100 bg-gray-50 p-3 text-sm font-bold focus:border-red-500 focus:ring-red-500"
                                value={data.email_remitente}
                                onChange={(e) =>
                                    setData('email_remitente', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <label
                            htmlFor="desc-reporte"
                            className="flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400"
                        >
                            <i className="fas fa-comment-alt text-red-400"></i>{' '}
                            Descripción detallada
                        </label>
                        <textarea
                            id="desc-reporte"
                            rows="4"
                            placeholder="Describe el error lo más detallado posible..."
                            className="w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm font-bold focus:border-red-500 focus:ring-red-500"
                            value={data.descripcion}
                            onChange={(e) =>
                                setData('descripcion', e.target.value)
                            }
                            required
                        ></textarea>
                        {errors.descripcion && (
                            <p className="text-[10px] font-bold italic text-red-500">
                                {errors.descripcion}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-2xl border-2 border-gray-100 py-4 text-xs font-black uppercase tracking-widest text-gray-400 transition-all hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex flex-[2] items-center justify-center gap-3 rounded-2xl bg-red-500 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-600 disabled:opacity-50"
                        >
                            {processing ? (
                                <i className="fas fa-circle-notch fa-spin"></i>
                            ) : (
                                <i className="fas fa-paper-plane"></i>
                            )}
                            Enviar Reporte
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

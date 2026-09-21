import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const CAMPOS_AUDITORIA = [
    'Nombre',
    'Dirección',
    'Edificio',
    'CUI',
    'CUE',
    'GPS',
    'RADIO',
    'SECTOR',
    'MODALIDAD',
    'CATEGORÍA',
];

export default function StatusUpdateModal({ show, onClose, modalidad, getNombreEdificio }) {
    const { data, setData, patch, processing } = useForm({
        estado: modalidad?.estado_validacion || 'PENDIENTE',
        observaciones: modalidad?.observaciones || '',
        campos_auditados: modalidad?.campos_auditados || [],
        propagar_al_edificio: false,
    });

    const [vinculados, setVinculados] = useState([]);
    const [copiedField, setCopiedField] = useState(null);

    const handleCopy = (text, fieldName) => {
        if (!text) return;
        const stringText = String(text);

        if (
            typeof navigator !== 'undefined' &&
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {
            navigator.clipboard
                .writeText(stringText)
                .then(() => {
                    setCopiedField(fieldName);
                    setTimeout(() => setCopiedField(null), 1500);
                })
                .catch((err) => {
                    console.warn(
                        'Failed using navigator.clipboard, trying fallback:',
                        err,
                    );
                    fallbackCopy(stringText, fieldName);
                });
        } else {
            fallbackCopy(stringText, fieldName);
        }
    };

    const fallbackCopy = (text, fieldName) => {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                setCopiedField(fieldName);
                setTimeout(() => setCopiedField(null), 1500);
            } else {
                console.error('Fallback copy failed');
            }
        } catch (err) {
            console.error('Fallback copy threw error:', err);
        }
    };

    const decimalToDMS = (val, isLat) => {
        if (val === undefined || val === null || val === '') {
            return {
                cardinal: '-',
                cardinalShort: '-',
                degrees: '-',
                minutes: '-',
                seconds: '-',
            };
        }
        const num = parseFloat(val);
        if (isNaN(num)) {
            return {
                cardinal: '-',
                cardinalShort: '-',
                degrees: '-',
                minutes: '-',
                seconds: '-',
            };
        }

        const absolute = Math.abs(num);
        const degrees = Math.floor(absolute);
        const minutesNotTruncated = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesNotTruncated);
        const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

        let cardinal = '';
        let cardinalShort = '';
        if (isLat) {
            cardinal = num >= 0 ? 'Norte (N)' : 'Sur (S)';
            cardinalShort = num >= 0 ? 'N' : 'S';
        } else {
            cardinal = num >= 0 ? 'Este (E)' : 'Oeste (O)';
            cardinalShort = num >= 0 ? 'E' : 'O';
        }

        return {
            cardinal,
            cardinalShort,
            degrees: String(degrees),
            minutes: String(minutes),
            seconds: String(seconds).replace('.', ','),
        };
    };

    // Sincronizar el formulario cuando cambia la modalidad seleccionada o se abre el modal
    useEffect(() => {
        if (modalidad && show) {
            setData({
                estado: modalidad.estado_validacion || 'PENDIENTE',
                observaciones: modalidad.observaciones || '',
                campos_auditados: modalidad.campos_auditados || [],
                propagar_al_edificio: false,
            });

            // Cargar establecimientos vinculados (mismo edificio)
            fetch(route('administrativos.auditoria.vinculados', modalidad.id))
                .then((res) => res.json())
                .then((resData) => {
                    setVinculados(resData);
                })
                .catch((err) => {
                    console.error('Error cargando vinculados:', err);
                });
        }
    }, [modalidad, show, setData]);

    if (!modalidad) return null;

    const toggleCampo = (campo) => {
        const current = data.campos_auditados || [];
        if (current.includes(campo)) {
            setData(
                'campos_auditados',
                current.filter((c) => c !== campo),
            );
        } else {
            setData('campos_auditados', [...current, campo]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('administrativos.auditoria.updateEstado', modalidad.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="5xl">
            <form onSubmit={submit} className="p-6">
                <div className="mb-6 flex items-center gap-4 border-b pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-xl text-brand-orange shadow-sm">
                        <i className="fas fa-tasks"></i>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-black uppercase leading-none tracking-tight text-gray-900">
                            Validación de Datos
                        </h3>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {modalidad.establecimiento?.nombre ||
                                'Sin Establecimiento'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="text-gray-400 transition-colors hover:text-brand-orange"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Fila 1 (Superior): Datos del Establecimiento e Información del Edificio */}
                    {/* Bloque 1: Datos del Establecimiento */}
                    <div className="space-y-3">
                        <InputLabel
                            value="Datos del Establecimiento (CUE)"
                            className="text-[10px] font-black uppercase tracking-widest text-brand-orange"
                        />
                        <div className="space-y-2">
                            <div className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
                                <div className="min-w-0 flex-1">
                                    <p className="mb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                                        Nombre del Establecimiento
                                    </p>
                                    <p
                                        className="truncate text-xs font-black leading-tight text-gray-800"
                                        title={
                                            modalidad.establecimiento?.nombre ||
                                            ''
                                        }
                                    >
                                        {modalidad.establecimiento?.nombre ||
                                            'Sin Establecimiento'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCopy(
                                            modalidad.establecimiento?.nombre ||
                                                '',
                                            'nombre_est',
                                        )
                                    }
                                    className="ml-2 shrink-0 rounded-lg border border-gray-100 bg-white p-1 text-gray-400 shadow-sm transition-all hover:text-brand-orange"
                                    title="Copiar nombre"
                                >
                                    <i
                                        className={`fas ${copiedField === 'nombre_est' ? 'fa-check text-green-500' : 'fa-copy'} text-[10px]`}
                                    ></i>
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
                                    <div className="min-w-0">
                                        <p className="mb-0.5 text-[8px] font-black uppercase text-gray-400">
                                            CUE
                                        </p>
                                        <p className="text-xs font-black text-gray-800">
                                            {modalidad.establecimiento?.cue ||
                                                'S/D'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(
                                                modalidad.establecimiento
                                                    ?.cue || '',
                                                'cue',
                                            )
                                        }
                                        className="shrink-0 rounded-lg border border-gray-100 bg-white p-1 text-gray-400 shadow-sm transition-all hover:text-brand-orange"
                                        title="Copiar CUE"
                                    >
                                        <i
                                            className={`fas ${copiedField === 'cue' ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}
                                        ></i>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
                                    <div className="min-w-0">
                                        <p className="mb-0.5 text-[8px] font-black uppercase text-gray-400">
                                            CUI
                                        </p>
                                        <p className="text-xs font-black text-gray-800">
                                            {modalidad.establecimiento?.edificio
                                                ?.cui || 'S/D'}
                                        </p>
                                    </div>
                                    {modalidad.establecimiento?.edificio
                                        ?.cui && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(
                                                    modalidad.establecimiento
                                                        ?.edificio?.cui,
                                                    'cui',
                                                )
                                            }
                                            className="shrink-0 rounded-lg border border-gray-100 bg-white p-1 text-gray-400 shadow-sm transition-all hover:text-brand-orange"
                                            title="Copiar CUI"
                                        >
                                            <i
                                                className={`fas ${copiedField === 'cui' ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}
                                            ></i>
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
                                    <div className="min-w-0">
                                        <p className="mb-0.5 text-[8px] font-black uppercase text-gray-400">
                                            Categoría
                                        </p>
                                        <p
                                            className="truncate text-xs font-black text-gray-800"
                                            title={modalidad.categoria}
                                        >
                                            {(modalidad.categoria ?? '') !== ''
                                                ? modalidad.categoria
                                                : 'S/D'}
                                        </p>
                                    </div>
                                    {modalidad.categoria && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(
                                                    modalidad.categoria,
                                                    'categoria',
                                                )
                                            }
                                            className="shrink-0 rounded-lg border border-gray-100 bg-white p-1 text-gray-400 shadow-sm transition-all hover:text-brand-orange"
                                            title="Copiar Categoría"
                                        >
                                            <i
                                                className={`fas ${copiedField === 'categoria' ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}
                                            ></i>
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
                                    <div className="min-w-0">
                                        <p className="mb-0.5 text-[8px] font-black uppercase text-gray-400">
                                            Sector
                                        </p>
                                        <p
                                            className="truncate text-xs font-black text-gray-800"
                                            title={modalidad.sector}
                                        >
                                            {(modalidad.sector ?? '') !== ''
                                                ? modalidad.sector
                                                : 'S/D'}
                                        </p>
                                    </div>
                                    {modalidad.sector && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(
                                                    modalidad.sector,
                                                    'sector',
                                                )
                                            }
                                            className="shrink-0 rounded-lg border border-gray-100 bg-white p-1 text-gray-400 shadow-sm transition-all hover:text-brand-orange"
                                            title="Copiar Sector"
                                        >
                                            <i
                                                className={`fas ${copiedField === 'sector' ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}
                                            ></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-2.5">
                                <p className="mb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                                    Modalidad / Nivel Educativo
                                </p>
                                <p className="text-xs font-black leading-none text-gray-800">
                                    {modalidad.nivel_educativo}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bloque 2: Información del Edificio */}
                    <div className="space-y-3">
                        <InputLabel
                            value="Información del Edificio"
                            className="text-[10px] font-black uppercase tracking-widest text-brand-orange"
                        />
                        <div className="space-y-2">
                            {getNombreEdificio(modalidad) && (
                                <div className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="mb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                                            Edificio / Establecimiento Cabecera
                                        </p>
                                        <p
                                            className="truncate text-[11px] font-black leading-tight text-brand-orange"
                                            title={getNombreEdificio(modalidad)}
                                        >
                                            {getNombreEdificio(modalidad)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(
                                                getNombreEdificio(modalidad),
                                                'edificio',
                                            )
                                        }
                                        className="ml-2 shrink-0 rounded-lg border border-gray-100 bg-white p-1 text-gray-400 shadow-sm transition-all hover:text-brand-orange"
                                        title="Copiar edificio"
                                    >
                                        <i
                                            className={`fas ${copiedField === 'edificio' ? 'fa-check text-green-500' : 'fa-copy'} text-[10px]`}
                                        ></i>
                                    </button>
                                </div>
                            )}
                            <div className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
                                <div className="min-w-0 flex-1">
                                    <p className="mb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                                        Dirección Física
                                    </p>
                                    <p
                                        className="truncate text-[11px] font-black leading-tight text-gray-800"
                                        title={`${modalidad.establecimiento?.edificio?.calle} ${modalidad.establecimiento?.edificio?.numero_puerta || 'S/N'}`}
                                    >
                                        {
                                            modalidad.establecimiento?.edificio
                                                ?.calle
                                        }{' '}
                                        {modalidad.establecimiento?.edificio
                                            ?.numero_puerta || 'S/N'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCopy(
                                            `${modalidad.establecimiento?.edificio?.calle} ${modalidad.establecimiento?.edificio?.numero_puerta || 'S/N'}`,
                                            'direccion',
                                        )
                                    }
                                    className="ml-2 shrink-0 rounded-lg border border-gray-100 bg-white p-1 text-gray-400 shadow-sm transition-all hover:text-brand-orange"
                                    title="Copiar dirección"
                                >
                                    <i
                                        className={`fas ${copiedField === 'direccion' ? 'fa-check text-green-500' : 'fa-copy'} text-[10px]`}
                                    ></i>
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-1.5 text-center">
                                    <p className="mb-0.5 text-[7px] font-black uppercase text-gray-400">
                                        Radio
                                    </p>
                                    <p className="text-[10px] font-black text-gray-800">
                                        {(modalidad.radio ?? '') !== ''
                                            ? modalidad.radio
                                            : '-'}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-1.5 text-center">
                                    <p className="mb-0.5 text-[7px] font-black uppercase text-gray-400">
                                        Sector
                                    </p>
                                    <p className="text-[10px] font-black text-gray-800">
                                        {(modalidad.sector ?? '') !== ''
                                            ? modalidad.sector
                                            : '-'}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-1.5 text-center">
                                    <p className="mb-0.5 text-[7px] font-black uppercase text-gray-400">
                                        Cat.
                                    </p>
                                    <p className="text-[10px] font-black text-gray-800">
                                        {(modalidad.categoria ?? '') !== ''
                                            ? modalidad.categoria
                                            : '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
                                <div className="min-w-0 flex-1">
                                    <p className="mb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                                        GPS
                                    </p>
                                    <p
                                        className="truncate text-xs font-black leading-tight text-brand-orange"
                                        title={`${modalidad.establecimiento?.edificio?.latitud}, ${modalidad.establecimiento?.edificio?.longitud}`}
                                    >
                                        {
                                            modalidad.establecimiento?.edificio
                                                ?.latitud
                                        }
                                        ,{' '}
                                        {
                                            modalidad.establecimiento?.edificio
                                                ?.longitud
                                        }
                                    </p>
                                </div>
                                {modalidad.establecimiento?.edificio
                                    ?.latitud && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(
                                                `${modalidad.establecimiento?.edificio?.latitud}, ${modalidad.establecimiento?.edificio?.longitud}`,
                                                'gps',
                                            )
                                        }
                                        className="ml-2 shrink-0 rounded-lg border border-gray-100 bg-white p-1 text-gray-400 shadow-sm transition-all hover:text-brand-orange"
                                        title="Copiar GPS"
                                    >
                                        <i
                                            className={`fas ${copiedField === 'gps' ? 'fa-check text-green-500' : 'fa-copy'} text-[10px]`}
                                        ></i>
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-2">
                                    <p className="mb-0.5 text-[8px] font-black uppercase text-gray-400">
                                        Departamento
                                    </p>
                                    <p
                                        className="truncate text-xs font-black text-gray-700"
                                        title={
                                            modalidad.establecimiento?.edificio
                                                ?.zona_departamento
                                        }
                                    >
                                        {
                                            modalidad.establecimiento?.edificio
                                                ?.zona_departamento
                                        }
                                    </p>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
                                    <div className="min-w-0">
                                        <p className="mb-0.5 text-[8px] font-black uppercase text-gray-400">
                                            C.P.
                                        </p>
                                        <p className="text-xs font-black text-gray-800">
                                            {modalidad.establecimiento?.edificio
                                                ?.codigo_postal || 'S/D'}
                                        </p>
                                    </div>
                                    {modalidad.establecimiento?.edificio
                                        ?.codigo_postal && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(
                                                    modalidad.establecimiento
                                                        ?.edificio
                                                        ?.codigo_postal,
                                                    'cp',
                                                )
                                            }
                                            className="shrink-0 rounded-lg border border-gray-100 bg-white p-1 text-gray-400 shadow-sm transition-all hover:text-brand-orange"
                                            title="Copiar Código Postal"
                                        >
                                            <i
                                                className={`fas ${copiedField === 'cp' ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}
                                            ></i>
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2">
                                    <div className="min-w-0">
                                        <p className="mb-0.5 text-[8px] font-black uppercase text-gray-400">
                                            Orientación
                                        </p>
                                        <p
                                            className="truncate text-xs font-black text-gray-800"
                                            title={
                                                modalidad.establecimiento
                                                    ?.edificio?.orientacion
                                            }
                                        >
                                            {modalidad.establecimiento?.edificio
                                                ?.orientacion || 'S/D'}
                                        </p>
                                    </div>
                                    {modalidad.establecimiento?.edificio
                                        ?.orientacion && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(
                                                    modalidad.establecimiento
                                                        ?.edificio?.orientacion,
                                                    'orientacion',
                                                )
                                            }
                                            className="shrink-0 rounded-lg border border-gray-100 bg-white p-1 text-gray-400 shadow-sm transition-all hover:text-brand-orange"
                                            title="Copiar Orientación"
                                        >
                                            <i
                                                className={`fas ${copiedField === 'orientacion' ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}
                                            ></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fila 2 (Inferior): Georreferenciación + Nuevo Estado (Izquierda) y Campos Auditados + Observaciones (Derecha) */}
                    {/* Columna Izquierda Inferior */}
                    <div className="space-y-6">
                        {modalidad.establecimiento?.edificio?.latitud &&
                            modalidad.establecimiento?.edificio?.longitud && (
                                <div>
                                    <InputLabel
                                        value="Georreferenciación para EDUGE (DMS)"
                                        className="mb-3 text-[10px] font-black uppercase tracking-widest text-brand-orange"
                                    />
                                    <div className="space-y-3 rounded-xl border border-orange-100/50 bg-orange-50/20 p-3">
                                        {/* Latitud */}
                                        {(() => {
                                            const latDms = decimalToDMS(
                                                modalidad.establecimiento
                                                    ?.edificio?.latitud,
                                                true,
                                            );
                                            return (
                                                <div>
                                                    <p className="mb-1.5 border-b border-orange-100/30 pb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                                                        Latitud (Sur)
                                                    </p>
                                                    <div className="grid grid-cols-4 gap-1.5">
                                                        <div className="group relative flex min-h-[48px] flex-col items-center justify-between rounded-lg border border-gray-100 bg-white p-1.5 text-center">
                                                            <span className="text-[6px] font-black uppercase tracking-wider text-gray-400">
                                                                Card.
                                                            </span>
                                                            <span className="text-[11px] font-black leading-none text-gray-700">
                                                                {
                                                                    latDms.cardinalShort
                                                                }
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        latDms.cardinal,
                                                                        'lat_card',
                                                                    )
                                                                }
                                                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-brand-orange/95 text-[8px] font-black uppercase text-white opacity-0 shadow-md transition-all group-hover:opacity-100"
                                                            >
                                                                {copiedField ===
                                                                'lat_card'
                                                                    ? '¡Copió!'
                                                                    : 'Copiar'}
                                                            </button>
                                                        </div>
                                                        <div className="group relative flex min-h-[48px] flex-col items-center justify-between rounded-lg border border-gray-100 bg-white p-1.5 text-center">
                                                            <span className="text-[6px] font-black uppercase tracking-wider text-gray-400">
                                                                Grado
                                                            </span>
                                                            <span className="text-[11px] font-black leading-none text-gray-700">
                                                                {latDms.degrees}
                                                                °
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        latDms.degrees,
                                                                        'lat_deg',
                                                                    )
                                                                }
                                                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-brand-orange/95 text-[8px] font-black uppercase text-white opacity-0 shadow-md transition-all group-hover:opacity-100"
                                                            >
                                                                {copiedField ===
                                                                'lat_deg'
                                                                    ? '¡Copió!'
                                                                    : 'Copiar'}
                                                            </button>
                                                        </div>
                                                        <div className="group relative flex min-h-[48px] flex-col items-center justify-between rounded-lg border border-gray-100 bg-white p-1.5 text-center">
                                                            <span className="text-[6px] font-black uppercase tracking-wider text-gray-400">
                                                                Minuto
                                                            </span>
                                                            <span className="text-[11px] font-black leading-none text-gray-700">
                                                                {latDms.minutes}
                                                                ′
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        latDms.minutes,
                                                                        'lat_min',
                                                                    )
                                                                }
                                                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-brand-orange/95 text-[8px] font-black uppercase text-white opacity-0 shadow-md transition-all group-hover:opacity-100"
                                                            >
                                                                {copiedField ===
                                                                'lat_min'
                                                                    ? '¡Copió!'
                                                                    : 'Copiar'}
                                                            </button>
                                                        </div>
                                                        <div className="group relative flex min-h-[48px] flex-col items-center justify-between rounded-lg border border-gray-100 bg-white p-1.5 text-center">
                                                            <span className="text-[6px] font-black uppercase tracking-wider text-gray-400">
                                                                Segundo
                                                            </span>
                                                            <span
                                                                className="max-w-[50px] truncate text-[11px] font-black leading-none text-gray-700"
                                                                title={
                                                                    latDms.seconds
                                                                }
                                                            >
                                                                {latDms.seconds}
                                                                ″
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        latDms.seconds,
                                                                        'lat_sec',
                                                                    )
                                                                }
                                                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-brand-orange/95 text-[8px] font-black uppercase text-white opacity-0 shadow-md transition-all group-hover:opacity-100"
                                                            >
                                                                {copiedField ===
                                                                'lat_sec'
                                                                    ? '¡Copió!'
                                                                    : 'Copiar'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Longitud */}
                                        {(() => {
                                            const lngDms = decimalToDMS(
                                                modalidad.establecimiento
                                                    ?.edificio?.longitud,
                                                false,
                                            );
                                            return (
                                                <div>
                                                    <p className="mb-1.5 border-b border-orange-100/30 pb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                                                        Longitud (Oeste)
                                                    </p>
                                                    <div className="grid grid-cols-4 gap-1.5">
                                                        <div className="group relative flex min-h-[48px] flex-col items-center justify-between rounded-lg border border-gray-100 bg-white p-1.5 text-center">
                                                            <span className="text-[6px] font-black uppercase tracking-wider text-gray-400">
                                                                Card.
                                                            </span>
                                                            <span className="text-[11px] font-black leading-none text-gray-700">
                                                                {
                                                                    lngDms.cardinalShort
                                                                }
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        lngDms.cardinal,
                                                                        'lng_card',
                                                                    )
                                                                }
                                                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-brand-orange/95 text-[8px] font-black uppercase text-white opacity-0 shadow-md transition-all group-hover:opacity-100"
                                                            >
                                                                {copiedField ===
                                                                'lng_card'
                                                                    ? '¡Copió!'
                                                                    : 'Copiar'}
                                                            </button>
                                                        </div>
                                                        <div className="group relative flex min-h-[48px] flex-col items-center justify-between rounded-lg border border-gray-100 bg-white p-1.5 text-center">
                                                            <span className="text-[6px] font-black uppercase tracking-wider text-gray-400">
                                                                Grado
                                                            </span>
                                                            <span className="text-[11px] font-black leading-none text-gray-700">
                                                                {lngDms.degrees}
                                                                °
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        lngDms.degrees,
                                                                        'lng_deg',
                                                                    )
                                                                }
                                                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-brand-orange/95 text-[8px] font-black uppercase text-white opacity-0 shadow-md transition-all group-hover:opacity-100"
                                                            >
                                                                {copiedField ===
                                                                'lng_deg'
                                                                    ? '¡Copió!'
                                                                    : 'Copiar'}
                                                            </button>
                                                        </div>
                                                        <div className="group relative flex min-h-[48px] flex-col items-center justify-between rounded-lg border border-gray-100 bg-white p-1.5 text-center">
                                                            <span className="text-[6px] font-black uppercase tracking-wider text-gray-400">
                                                                Minuto
                                                            </span>
                                                            <span className="text-[11px] font-black leading-none text-gray-700">
                                                                {lngDms.minutes}
                                                                ′
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        lngDms.minutes,
                                                                        'lng_min',
                                                                    )
                                                                }
                                                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-brand-orange/95 text-[8px] font-black uppercase text-white opacity-0 shadow-md transition-all group-hover:opacity-100"
                                                            >
                                                                {copiedField ===
                                                                'lng_min'
                                                                    ? '¡Copió!'
                                                                    : 'Copiar'}
                                                            </button>
                                                        </div>
                                                        <div className="group relative flex min-h-[48px] flex-col items-center justify-between rounded-lg border border-gray-100 bg-white p-1.5 text-center">
                                                            <span className="text-[6px] font-black uppercase tracking-wider text-gray-400">
                                                                Segundo
                                                            </span>
                                                            <span
                                                                className="max-w-[50px] truncate text-[11px] font-black leading-none text-gray-700"
                                                                title={
                                                                    lngDms.seconds
                                                                }
                                                            >
                                                                {lngDms.seconds}
                                                                ″
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCopy(
                                                                        lngDms.seconds,
                                                                        'lng_sec',
                                                                    )
                                                                }
                                                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-brand-orange/95 text-[8px] font-black uppercase text-white opacity-0 shadow-md transition-all group-hover:opacity-100"
                                                            >
                                                                {copiedField ===
                                                                'lng_sec'
                                                                    ? '¡Copió!'
                                                                    : 'Copiar'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}

                        <div>
                            <InputLabel
                                value="Nuevo Estado de Validación"
                                className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400"
                            />
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    'PENDIENTE',
                                    'CORRECTO',
                                    'CORREGIDO',
                                    'REVISAR',
                                ].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setData('estado', s)}
                                        className={`rounded-xl border-2 px-1.5 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${
                                            data.estado === s
                                                ? 'border-brand-orange bg-orange-50 text-brand-orange shadow-sm'
                                                : 'border-gray-100 text-gray-400 hover:border-orange-100'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha Inferior: Campos Auditados / Reportados + Observaciones */}
                    <div className="space-y-6">
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <InputLabel
                                    value="Campos Auditados / Reportados"
                                    className="text-[10px] font-black uppercase tracking-widest text-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData(
                                            'campos_auditados',
                                            CAMPOS_AUDITORIA,
                                        )
                                    }
                                    className="text-[9px] font-black uppercase text-brand-orange hover:underline"
                                >
                                    Marcar Todo
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {CAMPOS_AUDITORIA.map((campo) => (
                                    <button
                                        key={campo}
                                        type="button"
                                        onClick={() => toggleCampo(campo)}
                                        className={`rounded-lg border px-1 py-2 text-[9px] font-bold uppercase transition-all ${
                                            data.campos_auditados?.includes(
                                                campo,
                                            )
                                                ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
                                                : 'border-gray-100 bg-white text-gray-400'
                                        }`}
                                    >
                                        {campo}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <InputLabel
                                value="Observaciones"
                                className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400"
                            />
                            <textarea
                                className="h-32 w-full rounded-xl border-gray-200 bg-gray-50/20 p-3 text-sm font-medium focus:border-brand-orange focus:ring-brand-orange"
                                placeholder="Escribe aquí las observaciones..."
                                value={data.observaciones}
                                onChange={(e) =>
                                    setData('observaciones', e.target.value)
                                }
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose} className="px-6 py-2.5">
                        Cancelar
                    </SecondaryButton>
                    {vinculados.length > 0 && (
                        <button
                            type="button"
                            onClick={() =>
                                setData(
                                    'propagar_al_edificio',
                                    !data.propagar_al_edificio,
                                )
                            }
                            className={`flex items-center gap-2 rounded-xl border px-4 py-1.5 text-xs font-black transition-all ${
                                data.propagar_al_edificio
                                    ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <i
                                className={`fas ${data.propagar_al_edificio ? 'fa-check-double' : 'fa-link'}`}
                            ></i>
                            <div className="text-left">
                                <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest">
                                    Sincronizar Edificio ({vinculados.length})
                                </p>
                                <p
                                    className={`text-[8px] font-bold ${data.propagar_al_edificio ? 'text-white/80' : 'text-gray-400'}`}
                                >
                                    Aplicar validación a todo el CUI
                                </p>
                            </div>
                        </button>
                    )}
                    <PrimaryButton
                        className="px-12 py-2.5"
                        disabled={processing}
                    >
                        {processing ? 'Guardando...' : 'Confirmar Validación'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

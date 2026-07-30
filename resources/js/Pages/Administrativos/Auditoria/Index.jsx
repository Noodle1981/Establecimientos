import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({
    modalidades,
    stats,
    filters,
    nombresEdificios = {},
    options = { departamentos: [], niveles: [] },
}) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedMod, setSelectedMod] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    // Función para obtener el nombre descriptivo del edificio
    const getNombreEdificio = (mod) => {
        try {
            const edificioId = mod?.establecimiento?.edificio_id;
            const mapa = nombresEdificios || {};
            if (edificioId && mapa[edificioId]) {
                return mapa[edificioId];
            }
            // Fallback: nombre de la cabecera en el establecimiento o establecimiento mismo
            return (
                mod?.establecimiento?.edificio?.cabecera?.nombre ??
                mod?.establecimiento?.nombre ??
                null
            );
        } catch (e) {
            console.error('Error en getNombreEdificio:', e);
            return null;
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        if (key !== 'page') {
            delete newFilters.page;
        }
        router.get(route('administrativos.auditoria.index'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleExportPdf = async () => {
        setIsExporting(true);
        try {
            const response = await window.axios.get(route('administrativos.auditoria.exportPdf', filters), {
                responseType: 'blob',
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'reporte_auditoria.pdf';
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2)
                    fileName = fileNameMatch[1];
            }
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert('Hubo un error al generar el PDF. Por favor, intente nuevamente.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Auditoría" />

            {/* KPIs */}
            <div className="mb-8 grid grid-cols-1 gap-4 pt-2 md:grid-cols-2 lg:grid-cols-6">
                <KPICard
                    label="Avance Global"
                    value={`${stats.porcentajeAvance}%`}
                    icon="fas fa-percentage"
                    color="orange"
                />
                <KPICard
                    label="PENDIENTE"
                    value={stats.pendientes}
                    icon="fas fa-clock"
                    color="amber"
                />
                <KPICard
                    label="CORRECTO"
                    value={stats.correctos}
                    icon="fas fa-check-double"
                    color="emerald"
                />
                <KPICard
                    label="CORREGIDO"
                    value={stats.corregidos}
                    icon="fas fa-tools"
                    color="blue"
                />
                <KPICard
                    label="REVISAR"
                    value={stats.revisar}
                    icon="fas fa-exclamation-triangle"
                    color="rose"
                />
                <KPICard
                    label="BAJA"
                    value={stats.bajas}
                    icon="fas fa-arrow-down"
                    color="orange"
                />
            </div>

            <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-orange-50 bg-white p-5 shadow-sm lg:flex-row">
                    <div className="relative w-full flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por Nombre o CUE..."
                            className="w-full rounded-xl border-gray-200 py-2.5 pl-10 pr-4 text-sm font-medium transition-all focus:border-brand-orange focus:ring-brand-orange"
                            defaultValue={filters.search}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Debounce simple manual
                                clearTimeout(window.searchTimeout);
                                window.searchTimeout = setTimeout(() => {
                                    handleFilterChange('search', val);
                                }, 300);
                            }}
                        />
                        <i className="fas fa-search absolute left-3.5 top-3.5 text-gray-300"></i>
                    </div>

                    <div className="relative w-full lg:w-48">
                        <input
                            type="text"
                            placeholder="Buscar CUI..."
                            className="w-full rounded-xl border-gray-200 py-2.5 pl-10 pr-4 text-sm font-medium transition-all focus:border-brand-orange focus:ring-brand-orange"
                            defaultValue={filters.cui}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Debounce simple manual
                                clearTimeout(window.cuiTimeout);
                                window.cuiTimeout = setTimeout(() => {
                                    handleFilterChange('cui', val);
                                }, 300);
                            }}
                        />
                        <i className="fas fa-building absolute left-3.5 top-3.5 text-gray-300"></i>
                    </div>

                    <select
                        className="w-full rounded-xl border-gray-200 text-xs font-black uppercase text-gray-500 lg:w-48"
                        value={filters.estado || ''}
                        onChange={(e) =>
                            handleFilterChange('estado', e.target.value)
                        }
                    >
                        <option value="">Todos los Estados</option>
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CORRECTO">CORRECTO</option>
                        <option value="CORREGIDO">CORREGIDO</option>
                        <option value="REVISAR">REVISAR</option>
                        <option value="BAJA">BAJA</option>
                    </select>

                    <select
                        className="w-full rounded-xl border-gray-200 text-xs font-black uppercase text-gray-500 lg:w-48"
                        value={filters.nivel || ''}
                        onChange={(e) =>
                            handleFilterChange('nivel', e.target.value)
                        }
                    >
                        <option value="">Todos los Niveles</option>
                        {options.niveles.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>

                    <select
                        className="w-full rounded-xl border-gray-200 text-xs font-black uppercase text-gray-500 lg:w-48"
                        value={filters.departamento || ''}
                        onChange={(e) =>
                            handleFilterChange('departamento', e.target.value)
                        }
                    >
                        <option value="">Todos los Deptos</option>
                        {options.departamentos.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>

                    <select
                        className="w-full rounded-xl border-gray-200 text-xs font-black uppercase text-gray-500 lg:w-48"
                        value={filters.ambito || ''}
                        onChange={(e) =>
                            handleFilterChange('ambito', e.target.value)
                        }
                    >
                        <option value="">Todos los Ámbitos</option>
                        {options.ambitos.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </select>

                    <div className="ml-2 flex w-full shrink-0 gap-2 border-l border-orange-50 pl-4 lg:w-auto">
                        <button
                            onClick={handleExportPdf}
                            disabled={isExporting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50 lg:w-auto"
                        >
                            {isExporting ? (
                                <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fas fa-file-pdf"></i>
                            )}
                            {isExporting ? 'Generando...' : 'Exportar PDF'}
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-orange-600 bg-brand-orange text-[10px] font-black uppercase text-white">
                                    <th className="px-6 py-2">
                                        Establecimiento / CUE
                                    </th>
                                    <th className="px-6 py-2">Modalidad</th>
                                    <th className="px-6 py-2">Edificio</th>
                                    <th className="px-6 py-2">
                                        Última Validación
                                    </th>
                                    <th className="px-6 py-2">Estado</th>
                                    <th className="px-6 py-2">
                                        Modificaciones
                                    </th>
                                    <th className="px-6 py-2">Observaciones</th>
                                    <th className="px-6 py-2 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {modalidades.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-12 text-center"
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
                                            <td className="px-6 py-2">
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
                                            <td className="whitespace-nowrap px-6 py-2">
                                                <div className="flex flex-col gap-1">
                                                    <span className="w-fit rounded-lg border border-orange-100 bg-orange-50 px-2 py-1 text-[10px] font-black uppercase tracking-tight text-brand-orange">
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
                                            <td className="px-6 py-2">
                                                <div className="flex max-w-[200px] flex-col">
                                                    {/* Usamos la función de búsqueda de nombre de cabecera */}
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
                                            <td className="px-6 py-2">
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
                                            <td className="px-6 py-2">
                                                <StatusBadge
                                                    status={
                                                        mod.estado_validacion
                                                    }
                                                />
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex max-w-[150px] flex-wrap gap-1">
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
                                            <td className="px-6 py-2">
                                                <p className="line-clamp-2 max-w-[200px] text-[10px] font-medium italic text-gray-400">
                                                    {mod.observaciones || '-'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-2 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedMod(mod);
                                                        setShowStatusModal(
                                                            true,
                                                        );
                                                    }}
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

            <StatusUpdateModal
                show={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                modalidad={selectedMod}
                getNombreEdificio={getNombreEdificio}
            />
        </AuthenticatedLayout>
    );
}

function KPICard({ label, value, icon, color }) {
    const colors = {
        orange: 'bg-orange-50 text-brand-orange border-brand-orange/20',
        amber: 'bg-amber-50 text-amber-600 border-amber-200',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        rose: 'bg-rose-50 text-rose-600 border-rose-200',
    };
    return (
        <div
            className={`flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm`}
        >
            <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${colors[color]}`}
            >
                <i className={icon}></i>
            </div>
            <div>
                <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-black opacity-60">
                    {label}
                </p>
                <p className="text-xl font-black leading-none tracking-tight text-black">
                    {value}
                </p>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
        CORRECTO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        CORREGIDO: 'bg-blue-50 text-blue-700 border-blue-200',
        REVISAR: 'bg-rose-50 text-rose-700 border-rose-200',
        BAJA: 'bg-gray-100 text-black border-gray-300',
    };
    return (
        <span
            className={`rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${config[status] || config.PENDIENTE}`}
        >
            {status || 'PENDIENTE'}
        </span>
    );
}

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

function StatusUpdateModal({ show, onClose, modalidad, getNombreEdificio }) {
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

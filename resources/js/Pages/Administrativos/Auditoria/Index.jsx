import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ modalidades, stats, filters, nombresEdificios = {}, options = { departamentos: [], niveles: [] } }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        estado: '',
        observaciones: '',
    });

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedMod, setSelectedMod] = useState(null);

    // Función para obtener el nombre descriptivo del edificio
    const getNombreEdificio = (mod) => {
        try {
            const edificioId = mod?.establecimiento?.edificio_id;
            const mapa = nombresEdificios || {};
            if (edificioId && mapa[edificioId]) {
                return mapa[edificioId];
            }
            // Fallback: nombre de la cabecera en el establecimiento o establecimiento mismo
            return mod?.establecimiento?.edificio?.cabecera?.nombre
                ?? mod?.establecimiento?.nombre
                ?? null;
        } catch (e) {
            console.error("Error en getNombreEdificio:", e);
            return null;
        }
    };

    const handleSearch = (query) => {
        const newFilters = { ...filters, search: query };
        delete newFilters.page;
        router.get(route('administrativos.auditoria.index'), newFilters, { 
            preserveState: true, 
            replace: true
        });
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        if (key !== 'page') {
            delete newFilters.page;
        }
        router.get(route('administrativos.auditoria.index'), newFilters, {
            preserveState: true, replace: true
        });
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Auditoría" />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8 pt-2">
                <KPICard label="Avance Global" value={`${stats.porcentajeAvance}%`} icon="fas fa-percentage" color="orange" />
                <KPICard label="PENDIENTE" value={stats.pendientes} icon="fas fa-clock" color="amber" />
                <KPICard label="CORRECTO" value={stats.correctos} icon="fas fa-check-double" color="emerald" />
                <KPICard label="CORREGIDO" value={stats.corregidos} icon="fas fa-tools" color="blue" />
                <KPICard label="REVISAR" value={stats.revisar} icon="fas fa-exclamation-triangle" color="rose" />
                <KPICard label="BAJA" value={stats.bajas} icon="fas fa-arrow-down" color="orange" />
            </div>

            <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-50 flex flex-col lg:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full">
                        <input 
                            type="text"
                            placeholder="Buscar por Nombre o CUE..."
                            className="w-full pl-10 pr-4 py-2.5 border-gray-200 rounded-xl focus:border-brand-orange focus:ring-brand-orange transition-all text-sm font-medium"
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

                    <div className="w-full lg:w-48 relative">
                        <input 
                            type="text"
                            placeholder="Buscar CUI..."
                            className="w-full pl-10 pr-4 py-2.5 border-gray-200 rounded-xl focus:border-brand-orange focus:ring-brand-orange transition-all text-sm font-medium"
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
                        className="w-full lg:w-48 border-gray-200 rounded-xl text-xs font-black uppercase text-gray-500"
                        value={filters.estado || ''}
                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                    >
                        <option value="">Todos los Estados</option>
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CORRECTO">CORRECTO</option>
                        <option value="CORREGIDO">CORREGIDO</option>
                        <option value="REVISAR">REVISAR</option>
                        <option value="BAJA">BAJA</option>
                    </select>

                    <select 
                        className="w-full lg:w-48 border-gray-200 rounded-xl text-xs font-black uppercase text-gray-500"
                        value={filters.nivel || ''}
                        onChange={(e) => handleFilterChange('nivel', e.target.value)}
                    >
                        <option value="">Todos los Niveles</option>
                        {options.niveles.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>

                    <select 
                        className="w-full lg:w-48 border-gray-200 rounded-xl text-xs font-black uppercase text-gray-500"
                        value={filters.departamento || ''}
                        onChange={(e) => handleFilterChange('departamento', e.target.value)}
                    >
                        <option value="">Todos los Deptos</option>
                        {options.departamentos.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select 
                        className="w-full lg:w-48 border-gray-200 rounded-xl text-xs font-black uppercase text-gray-500"
                        value={filters.ambito || ''}
                        onChange={(e) => handleFilterChange('ambito', e.target.value)}
                    >
                        <option value="">Todos los Ámbitos</option>
                        {options.ambitos.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>

                    <div className="flex gap-2 w-full lg:w-auto shrink-0 border-l pl-4 border-orange-50 ml-2">
                        <a 
                            href={route('administrativos.auditoria.exportPdf', filters)}
                            target="_blank"
                            className="w-full lg:w-auto inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-xl font-black text-[10px] text-white uppercase tracking-widest hover:bg-red-700 transition shadow-sm gap-2"
                        >
                            <i className="fas fa-file-pdf"></i> Exportar PDF
                        </a>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-brand-orange text-[10px] uppercase font-black text-white border-b border-orange-600">
                                    <th className="px-6 py-2">Establecimiento / CUE</th>
                                    <th className="px-6 py-2">Modalidad</th>
                                    <th className="px-6 py-2">Edificio</th>
                                    <th className="px-6 py-2">Última Validación</th>
                                    <th className="px-6 py-2">Estado</th>
                                    <th className="px-6 py-2">Modificaciones</th>
                                    <th className="px-6 py-2">Observaciones</th>
                                    <th className="px-6 py-2 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {modalidades.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center py-4">
                                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-brand-orange mb-4">
                                                    <i className="fas fa-search text-2xl opacity-50"></i>
                                                </div>
                                                <p className="text-sm font-black text-gray-900 uppercase tracking-widest">No se encontraron resultados</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-tighter">
                                                    Prueba ajustando los filtros o el término de búsqueda
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    modalidades.data.map((mod) => (
                                        <tr key={mod.id} className="hover:bg-orange-50/5 transition-colors group">
                                            <td className="px-6 py-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-900 leading-tight">{mod.establecimiento.nombre}</span>
                                                    <span className="text-[9px] font-bold text-gray-400">CUE: {mod.establecimiento.cue}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-brand-orange bg-orange-50 px-2 py-1 rounded-lg border border-orange-100 uppercase tracking-tight w-fit">
                                                        {mod.nivel_educativo || 'S/D'}
                                                    </span>
                                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                                                        R:{mod.radio || '-'} | S:{mod.sector || '-'} | C:{mod.categoria || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex flex-col max-w-[200px]">
                                                    {/* Usamos la función de búsqueda de nombre de cabecera */}
                                                    {getNombreEdificio(mod) ? (
                                                        <>
                                                            <span className="text-[10px] font-black text-gray-900 leading-tight" title={getNombreEdificio(mod)}>
                                                                {getNombreEdificio(mod)}
                                                            </span>
                                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                                                CUI: {mod.establecimiento.edificio?.cui || mod.establecimiento.establecimiento_cabecera}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-brand-orange leading-tight">
                                                            CUI: {mod.establecimiento.edificio?.cui || mod.establecimiento.establecimiento_cabecera || 'S/D'}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-700 uppercase">{mod.usuario_validacion?.name || 'Sistema'}</span>
                                                    <span className="text-[9px] text-gray-400 font-bold">{mod.validado_en || 'S/D'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <StatusBadge status={mod.estado_validacion} />
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                    {mod.campos_auditados && mod.campos_auditados.length > 0 ? (
                                                        mod.campos_auditados.map(campo => (
                                                            <span key={campo} className="px-1.5 py-0.5 rounded bg-orange-50 text-brand-orange text-[8px] font-black uppercase border border-orange-100">
                                                                {campo}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[9px] text-gray-400 font-medium italic">Sin cambios</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="text-[10px] text-gray-400 line-clamp-2 italic font-medium max-w-[200px]">
                                                    {mod.observaciones || '-'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-2 text-right">
                                                <button 
                                                    onClick={() => { setSelectedMod(mod); setShowStatusModal(true); }}
                                                    className="p-2.5 rounded-xl bg-orange-50 text-brand-orange hover:bg-brand-orange hover:text-white transition shadow-sm border border-orange-100"
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

                <div className="flex justify-center -mt-2">
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
        <div className={`p-4 rounded-2xl border bg-white shadow-sm flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colors[color]}`}>
                <i className={icon}></i>
            </div>
            <div>
                <p className="text-[10px] font-black text-black uppercase tracking-widest leading-none mb-1 opacity-60">{label}</p>
                <p className="text-xl font-black text-black leading-none tracking-tight">{value}</p>
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
        <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${config[status] || config.PENDIENTE}`}>
            {status || 'PENDIENTE'}
        </span>
    );
}

const CAMPOS_AUDITORIA = [
    'Nombre', 'Dirección', 'Edificio', 'CUI', 'CUE', 'GPS', 'RADIO', 'SECTOR', 'MODALIDAD', 'CATEGORÍA'
];

function StatusUpdateModal({ show, onClose, modalidad, getNombreEdificio }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        estado: modalidad?.estado_validacion || 'PENDIENTE',
        observaciones: modalidad?.observaciones || '',
        campos_auditados: modalidad?.campos_auditados || [],
        propagar_al_edificio: false,
    });

    const [vinculados, setVinculados] = useState([]);
    const [loadingVinculados, setLoadingVinculados] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const handleCopy = (text, fieldName) => {
        if (!text) return;
        const stringText = String(text);
        
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(stringText)
                .then(() => {
                    setCopiedField(fieldName);
                    setTimeout(() => setCopiedField(null), 1500);
                })
                .catch(err => {
                    console.warn("Failed using navigator.clipboard, trying fallback:", err);
                    fallbackCopy(stringText, fieldName);
                });
        } else {
            fallbackCopy(stringText, fieldName);
        }
    };

    const fallbackCopy = (text, fieldName) => {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand("copy");
            document.body.removeChild(textArea);
            if (successful) {
                setCopiedField(fieldName);
                setTimeout(() => setCopiedField(null), 1500);
            } else {
                console.error("Fallback copy failed");
            }
        } catch (err) {
            console.error("Fallback copy threw error:", err);
        }
    };

    const decimalToDMS = (val, isLat) => {
        if (val === undefined || val === null || val === '') {
            return { cardinal: '-', cardinalShort: '-', degrees: '-', minutes: '-', seconds: '-' };
        }
        const num = parseFloat(val);
        if (isNaN(num)) {
            return { cardinal: '-', cardinalShort: '-', degrees: '-', minutes: '-', seconds: '-' };
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
            seconds: String(seconds).replace('.', ',')
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
            setLoadingVinculados(true);
            fetch(route('administrativos.auditoria.vinculados', modalidad.id))
                .then(res => res.json())
                .then(resData => {
                    setVinculados(resData);
                    setLoadingVinculados(false);
                })
                .catch(err => {
                    console.error("Error cargando vinculados:", err);
                    setLoadingVinculados(false);
                });
        }
    }, [modalidad?.id, show]);

    if (!modalidad) return null;

    // Detectar discrepancias
    const tieneDiscrepancias = vinculados.some(v => 
        v.estado_validacion !== data.estado || 
        JSON.stringify(v.campos_auditados || []) !== JSON.stringify(data.campos_auditados || [])
    );

    const toggleCampo = (campo) => {
        const current = data.campos_auditados || [];
        if (current.includes(campo)) {
            setData('campos_auditados', current.filter(c => c !== campo));
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
                <div className="flex items-center gap-4 mb-6 border-b pb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center text-xl shadow-sm border border-orange-100">
                        <i className="fas fa-tasks"></i>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-black text-gray-900 leading-none uppercase tracking-tight">Validación de Datos</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">
                            {modalidad.establecimiento.nombre}
                        </p>
                    </div>
                    <button onClick={onClose} type="button" className="text-gray-400 hover:text-brand-orange transition-colors">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Fila 1 (Superior): Datos del Establecimiento e Información del Edificio */}
                    {/* Bloque 1: Datos del Establecimiento */}
                    <div className="space-y-3">
                        <InputLabel value="Datos del Establecimiento (CUE)" className="text-[10px] font-black uppercase tracking-widest text-brand-orange" />
                        <div className="space-y-2">
                            <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between group">
                                <div className="flex-1 min-w-0">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5 tracking-widest">Nombre del Establecimiento</p>
                                    <p className="text-xs font-black text-gray-800 leading-tight truncate" title={modalidad.establecimiento.nombre}>
                                        {modalidad.establecimiento.nombre}
                                    </p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => handleCopy(modalidad.establecimiento.nombre, 'nombre_est')}
                                    className="ml-2 p-1 text-gray-400 hover:text-brand-orange bg-white rounded-lg border border-gray-100 shadow-sm transition-all shrink-0"
                                    title="Copiar nombre"
                                >
                                    <i className={`fas ${copiedField === 'nombre_est' ? 'fa-check text-green-500' : 'fa-copy'} text-[10px]`}></i>
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">CUE</p>
                                        <p className="text-xs font-black text-gray-800">{modalidad.establecimiento.cue}</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleCopy(modalidad.establecimiento.cue, 'cue')}
                                        className="p-1 text-gray-400 hover:text-brand-orange bg-white rounded-lg border border-gray-100 shadow-sm transition-all shrink-0"
                                        title="Copiar CUE"
                                    >
                                        <i className={`fas ${copiedField === 'cue' ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}></i>
                                    </button>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">CUI</p>
                                        <p className="text-xs font-black text-gray-800">{modalidad.establecimiento.edificio?.cui || 'S/D'}</p>
                                    </div>
                                    {modalidad.establecimiento.edificio?.cui && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleCopy(modalidad.establecimiento.edificio.cui, 'cui')}
                                            className="p-1 text-gray-400 hover:text-brand-orange bg-white rounded-lg border border-gray-100 shadow-sm transition-all shrink-0"
                                            title="Copiar CUI"
                                        >
                                            <i className={`fas ${copiedField === 'cui' ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}></i>
                                        </button>
                                    )}
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Categoría</p>
                                        <p className="text-xs font-black text-gray-800 truncate" title={modalidad.categoria}>
                                            {(modalidad.categoria ?? '') !== '' ? modalidad.categoria : 'S/D'}
                                        </p>
                                    </div>
                                    {modalidad.categoria && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleCopy(modalidad.categoria, 'categoria')}
                                            className="p-1 text-gray-400 hover:text-brand-orange bg-white rounded-lg border border-gray-100 shadow-sm transition-all shrink-0"
                                            title="Copiar Categoría"
                                        >
                                            <i className={`fas ${copiedField === 'categoria' ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5 tracking-widest">Modalidad / Nivel Educativo</p>
                                <p className="text-xs font-black text-gray-800 leading-none">
                                    {modalidad.nivel_educativo}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bloque 2: Información del Edificio */}
                    <div className="space-y-3">
                        <InputLabel value="Información del Edificio" className="text-[10px] font-black uppercase tracking-widest text-brand-orange" />
                        <div className="space-y-2">
                            {getNombreEdificio(modalidad) && (
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between group">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5 tracking-widest">Edificio / Establecimiento Cabecera</p>
                                        <p className="text-[11px] font-black text-brand-orange leading-tight truncate" title={getNombreEdificio(modalidad)}>
                                            {getNombreEdificio(modalidad)}
                                        </p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleCopy(getNombreEdificio(modalidad), 'edificio')}
                                        className="ml-2 p-1 text-gray-400 hover:text-brand-orange bg-white rounded-lg border border-gray-100 shadow-sm transition-all shrink-0"
                                        title="Copiar edificio"
                                    >
                                        <i className={`fas ${copiedField === 'edificio' ? 'fa-check text-green-500' : 'fa-copy'} text-[10px]`}></i>
                                    </button>
                                </div>
                            )}
                            <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between group">
                                <div className="flex-1 min-w-0">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5 tracking-widest">Dirección Física</p>
                                    <p className="text-[11px] font-black text-gray-800 leading-tight truncate" title={`${modalidad.establecimiento.edificio?.calle} ${modalidad.establecimiento.edificio?.numero_puerta || 'S/N'}`}>
                                        {modalidad.establecimiento.edificio?.calle} {modalidad.establecimiento.edificio?.numero_puerta || 'S/N'}
                                    </p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => handleCopy(`${modalidad.establecimiento.edificio?.calle} ${modalidad.establecimiento.edificio?.numero_puerta || 'S/N'}`, 'direccion')}
                                    className="ml-2 p-1 text-gray-400 hover:text-brand-orange bg-white rounded-lg border border-gray-100 shadow-sm transition-all shrink-0"
                                    title="Copiar dirección"
                                >
                                    <i className={`fas ${copiedField === 'direccion' ? 'fa-check text-green-500' : 'fa-copy'} text-[10px]`}></i>
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                                <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-100 text-center">
                                    <p className="text-[7px] font-black text-gray-400 uppercase mb-0.5">Radio</p>
                                    <p className="text-[10px] font-black text-gray-800">{(modalidad.radio ?? '') !== '' ? modalidad.radio : '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-100 text-center">
                                    <p className="text-[7px] font-black text-gray-400 uppercase mb-0.5">Sector</p>
                                    <p className="text-[10px] font-black text-gray-800">{(modalidad.sector ?? '') !== '' ? modalidad.sector : '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-100 text-center">
                                    <p className="text-[7px] font-black text-gray-400 uppercase mb-0.5">Cat.</p>
                                    <p className="text-[10px] font-black text-gray-800">{(modalidad.categoria ?? '') !== '' ? modalidad.categoria : '-'}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between group">
                                <div className="flex-1 min-w-0">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5 tracking-widest">GPS</p>
                                    <p className="text-xs font-black text-brand-orange leading-tight truncate" title={`${modalidad.establecimiento.edificio?.latitud}, ${modalidad.establecimiento.edificio?.longitud}`}>
                                        {modalidad.establecimiento.edificio?.latitud}, {modalidad.establecimiento.edificio?.longitud}
                                    </p>
                                </div>
                                {modalidad.establecimiento.edificio?.latitud && (
                                    <button 
                                        type="button" 
                                        onClick={() => handleCopy(`${modalidad.establecimiento.edificio?.latitud}, ${modalidad.establecimiento.edificio?.longitud}`, 'gps')}
                                        className="ml-2 p-1 text-gray-400 hover:text-brand-orange bg-white rounded-lg border border-gray-100 shadow-sm transition-all shrink-0"
                                        title="Copiar GPS"
                                    >
                                        <i className={`fas ${copiedField === 'gps' ? 'fa-check text-green-500' : 'fa-copy'} text-[10px]`}></i>
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Departamento</p>
                                    <p className="text-xs font-black text-gray-700 truncate" title={modalidad.establecimiento.edificio?.zona_departamento}>
                                        {modalidad.establecimiento.edificio?.zona_departamento}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">C.P.</p>
                                        <p className="text-xs font-black text-gray-800">{modalidad.establecimiento.edificio?.codigo_postal || 'S/D'}</p>
                                    </div>
                                    {modalidad.establecimiento.edificio?.codigo_postal && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleCopy(modalidad.establecimiento.edificio.codigo_postal, 'cp')}
                                            className="p-1 text-gray-400 hover:text-brand-orange bg-white rounded-lg border border-gray-100 shadow-sm transition-all shrink-0"
                                            title="Copiar Código Postal"
                                        >
                                            <i className={`fas ${copiedField === 'cp' ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}></i>
                                        </button>
                                    )}
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-gray-400 uppercase mb-0.5">Orientación</p>
                                        <p className="text-xs font-black text-gray-800 truncate" title={modalidad.establecimiento.edificio?.orientacion}>
                                            {modalidad.establecimiento.edificio?.orientacion || 'S/D'}
                                        </p>
                                    </div>
                                    {modalidad.establecimiento.edificio?.orientacion && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleCopy(modalidad.establecimiento.edificio.orientacion, 'orientacion')}
                                            className="p-1 text-gray-400 hover:text-brand-orange bg-white rounded-lg border border-gray-100 shadow-sm transition-all shrink-0"
                                            title="Copiar Orientación"
                                        >
                                            <i className={`fas ${copiedField === 'orientacion' ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fila 2 (Inferior): Georreferenciación + Nuevo Estado (Izquierda) y Campos Auditados + Observaciones (Derecha) */}
                    {/* Columna Izquierda Inferior */}
                    <div className="space-y-6">
                        {modalidad.establecimiento.edificio?.latitud && modalidad.establecimiento.edificio?.longitud && (
                            <div>
                                <InputLabel value="Georreferenciación para EDUGE (DMS)" className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-3" />
                                <div className="bg-orange-50/20 p-3 rounded-xl border border-orange-100/50 space-y-3">
                                    {/* Latitud */}
                                    {(() => {
                                        const latDms = decimalToDMS(modalidad.establecimiento.edificio.latitud, true);
                                        return (
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5 border-b border-orange-100/30 pb-0.5">Latitud (Sur)</p>
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    <div className="bg-white p-1.5 rounded-lg border border-gray-100 text-center flex flex-col justify-between items-center relative group min-h-[48px]">
                                                        <span className="text-[6px] font-black text-gray-400 uppercase tracking-wider">Card.</span>
                                                        <span className="text-[11px] font-black text-gray-700 leading-none">{latDms.cardinalShort}</span>
                                                        <button type="button" onClick={() => handleCopy(latDms.cardinal, 'lat_card')} className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-brand-orange/95 text-white rounded-lg text-[8px] font-black uppercase transition-all flex items-center justify-center shadow-md cursor-pointer">
                                                            {copiedField === 'lat_card' ? '¡Copió!' : 'Copiar'}
                                                        </button>
                                                    </div>
                                                    <div className="bg-white p-1.5 rounded-lg border border-gray-100 text-center flex flex-col justify-between items-center relative group min-h-[48px]">
                                                        <span className="text-[6px] font-black text-gray-400 uppercase tracking-wider">Grado</span>
                                                        <span className="text-[11px] font-black text-gray-700 leading-none">{latDms.degrees}°</span>
                                                        <button type="button" onClick={() => handleCopy(latDms.degrees, 'lat_deg')} className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-brand-orange/95 text-white rounded-lg text-[8px] font-black uppercase transition-all flex items-center justify-center shadow-md cursor-pointer">
                                                            {copiedField === 'lat_deg' ? '¡Copió!' : 'Copiar'}
                                                        </button>
                                                    </div>
                                                    <div className="bg-white p-1.5 rounded-lg border border-gray-100 text-center flex flex-col justify-between items-center relative group min-h-[48px]">
                                                        <span className="text-[6px] font-black text-gray-400 uppercase tracking-wider">Minuto</span>
                                                        <span className="text-[11px] font-black text-gray-700 leading-none">{latDms.minutes}′</span>
                                                        <button type="button" onClick={() => handleCopy(latDms.minutes, 'lat_min')} className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-brand-orange/95 text-white rounded-lg text-[8px] font-black uppercase transition-all flex items-center justify-center shadow-md cursor-pointer">
                                                            {copiedField === 'lat_min' ? '¡Copió!' : 'Copiar'}
                                                        </button>
                                                    </div>
                                                    <div className="bg-white p-1.5 rounded-lg border border-gray-100 text-center flex flex-col justify-between items-center relative group min-h-[48px]">
                                                        <span className="text-[6px] font-black text-gray-400 uppercase tracking-wider">Segundo</span>
                                                        <span className="text-[11px] font-black text-gray-700 leading-none truncate max-w-[50px]" title={latDms.seconds}>
                                                            {latDms.seconds}″
                                                        </span>
                                                        <button type="button" onClick={() => handleCopy(latDms.seconds, 'lat_sec')} className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-brand-orange/95 text-white rounded-lg text-[8px] font-black uppercase transition-all flex items-center justify-center shadow-md cursor-pointer">
                                                            {copiedField === 'lat_sec' ? '¡Copió!' : 'Copiar'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Longitud */}
                                    {(() => {
                                        const lngDms = decimalToDMS(modalidad.establecimiento.edificio.longitud, false);
                                        return (
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5 border-b border-orange-100/30 pb-0.5">Longitud (Oeste)</p>
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    <div className="bg-white p-1.5 rounded-lg border border-gray-100 text-center flex flex-col justify-between items-center relative group min-h-[48px]">
                                                        <span className="text-[6px] font-black text-gray-400 uppercase tracking-wider">Card.</span>
                                                        <span className="text-[11px] font-black text-gray-700 leading-none">{lngDms.cardinalShort}</span>
                                                        <button type="button" onClick={() => handleCopy(lngDms.cardinal, 'lng_card')} className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-brand-orange/95 text-white rounded-lg text-[8px] font-black uppercase transition-all flex items-center justify-center shadow-md cursor-pointer">
                                                            {copiedField === 'lng_card' ? '¡Copió!' : 'Copiar'}
                                                        </button>
                                                    </div>
                                                    <div className="bg-white p-1.5 rounded-lg border border-gray-100 text-center flex flex-col justify-between items-center relative group min-h-[48px]">
                                                        <span className="text-[6px] font-black text-gray-400 uppercase tracking-wider">Grado</span>
                                                        <span className="text-[11px] font-black text-gray-700 leading-none">{lngDms.degrees}°</span>
                                                        <button type="button" onClick={() => handleCopy(lngDms.degrees, 'lng_deg')} className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-brand-orange/95 text-white rounded-lg text-[8px] font-black uppercase transition-all flex items-center justify-center shadow-md cursor-pointer">
                                                            {copiedField === 'lng_deg' ? '¡Copió!' : 'Copiar'}
                                                        </button>
                                                    </div>
                                                    <div className="bg-white p-1.5 rounded-lg border border-gray-100 text-center flex flex-col justify-between items-center relative group min-h-[48px]">
                                                        <span className="text-[6px] font-black text-gray-400 uppercase tracking-wider">Minuto</span>
                                                        <span className="text-[11px] font-black text-gray-700 leading-none">{lngDms.minutes}′</span>
                                                        <button type="button" onClick={() => handleCopy(lngDms.minutes, 'lng_min')} className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-brand-orange/95 text-white rounded-lg text-[8px] font-black uppercase transition-all flex items-center justify-center shadow-md cursor-pointer">
                                                            {copiedField === 'lng_min' ? '¡Copió!' : 'Copiar'}
                                                        </button>
                                                    </div>
                                                    <div className="bg-white p-1.5 rounded-lg border border-gray-100 text-center flex flex-col justify-between items-center relative group min-h-[48px]">
                                                        <span className="text-[6px] font-black text-gray-400 uppercase tracking-wider">Segundo</span>
                                                        <span className="text-[11px] font-black text-gray-700 leading-none truncate max-w-[50px]" title={lngDms.seconds}>
                                                            {lngDms.seconds}″
                                                        </span>
                                                        <button type="button" onClick={() => handleCopy(lngDms.seconds, 'lng_sec')} className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-brand-orange/95 text-white rounded-lg text-[8px] font-black uppercase transition-all flex items-center justify-center shadow-md cursor-pointer">
                                                            {copiedField === 'lng_sec' ? '¡Copió!' : 'Copiar'}
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
                            <InputLabel value="Nuevo Estado de Validación" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                            <div className="grid grid-cols-4 gap-2">
                                {['PENDIENTE', 'CORRECTO', 'CORREGIDO', 'REVISAR'].map(s => (
                                    <button
                                        key={s} type="button" onClick={() => setData('estado', s)}
                                        className={`py-3 px-1.5 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${
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
                            <div className="flex justify-between items-center mb-3">
                                <InputLabel value="Campos Auditados / Reportados" className="text-[10px] font-black uppercase tracking-widest text-gray-400" />
                                <button type="button" onClick={() => setData('campos_auditados', CAMPOS_AUDITORIA)} className="text-[9px] font-black text-brand-orange uppercase hover:underline">Marcar Todo</button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {CAMPOS_AUDITORIA.map(campo => (
                                    <button
                                        key={campo} type="button" onClick={() => toggleCampo(campo)}
                                        className={`py-2 px-1 rounded-lg border text-[9px] font-bold uppercase transition-all ${
                                            data.campos_auditados?.includes(campo)
                                                ? 'bg-brand-orange text-white border-brand-orange shadow-sm'
                                                : 'bg-white text-gray-400 border-gray-100'
                                        }`}
                                    >
                                        {campo}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Observaciones" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                            <textarea 
                                className="w-full h-32 rounded-xl border-gray-200 focus:border-brand-orange focus:ring-brand-orange text-sm font-medium p-3 bg-gray-50/20"
                                placeholder="Escribe aquí las observaciones..."
                                value={data.observaciones}
                                onChange={e => setData('observaciones', e.target.value)}
                            ></textarea>
                        </div>


                    </div>
                </div>

                <div className="mt-8 flex justify-end items-center gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose} className="px-6 py-2.5">Cancelar</SecondaryButton>
                    {vinculados.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setData('propagar_al_edificio', !data.propagar_al_edificio)}
                            className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-black transition-all ${
                                data.propagar_al_edificio
                                    ? 'bg-brand-orange border-brand-orange text-white shadow-sm'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <i className={`fas ${data.propagar_al_edificio ? 'fa-check-double' : 'fa-link'}`}></i>
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                                    Sincronizar Edificio ({vinculados.length})
                                </p>
                                <p className={`text-[8px] font-bold ${data.propagar_al_edificio ? 'text-white/80' : 'text-gray-400'}`}>
                                    Aplicar validación a todo el CUI
                                </p>
                            </div>
                        </button>
                    )}
                    <PrimaryButton className="px-12 py-2.5" disabled={processing}>
                        {processing ? 'Guardando...' : 'Confirmar Validación'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}


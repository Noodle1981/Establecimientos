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
            if (!mod || !mod.establecimiento) return null;
            
            const mapa = nombresEdificios || {};
            
            // 1. Prioridad: Nombre directo
            if (mod.establecimiento.edificio && mod.establecimiento.edificio.nombre) {
                return mod.establecimiento.edificio.nombre;
            }
            
            // 2. Prioridad: Cabecera (Nombre o Código)
            const cab = mod.establecimiento.establecimiento_cabecera;
            if (cab) {
                if (mapa[cab]) return mapa[cab]; // Si es un código que está en el mapa
                if (isNaN(cab)) return cab; // Si es directamente un nombre (texto)
            }

            // 3. Fallback: CUI del edificio propio
            if (mod.establecimiento.edificio && mod.establecimiento.edificio.cui && mapa[mod.establecimiento.edificio.cui]) {
                return mapa[mod.establecimiento.edificio.cui];
            }
        } catch (e) {
            console.error("Error en getNombreEdificio:", e);
        }
        return null;
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
                            placeholder="Buscar por Nombre, CUE o CUI..."
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
    'Nombre', 'Dirección', 'Edificio', 'CUI', 'CUE', 'GPS', 'RADIO', 'SECTOR', 'MODALIDAD'
];

function StatusUpdateModal({ show, onClose, modalidad }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        estado: modalidad?.estado_validacion || 'PENDIENTE',
        observaciones: modalidad?.observaciones || '',
        campos_auditados: modalidad?.campos_auditados || [],
        propagar_al_edificio: false,
    });

    const [vinculados, setVinculados] = useState([]);
    const [loadingVinculados, setLoadingVinculados] = useState(false);

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
        <Modal show={show} onClose={onClose} maxWidth="2xl">
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
                    {/* Columna Izquierda: Detalles e Información */}
                    <div className="space-y-6">
                        <div>
                            <InputLabel value="Información del Edificio" className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-3" />
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 col-span-2">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1 tracking-widest">Dirección Física</p>
                                    <p className="text-[11px] font-black text-gray-800 uppercase">
                                        {modalidad.establecimiento.edificio?.calle} {modalidad.establecimiento.edificio?.numero_puerta || 'S/N'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Radio</p>
                                    <p className="text-xs font-black text-gray-800">{modalidad.radio || '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Sector</p>
                                    <p className="text-xs font-black text-gray-800">{modalidad.sector || '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Categoría</p>
                                    <p className="text-xs font-black text-gray-800">{modalidad.categoria || '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">GPS</p>
                                    <p className="text-[10px] font-black text-brand-orange">
                                        {modalidad.establecimiento.edificio?.latitud}, {modalidad.establecimiento.edificio?.longitud}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 col-span-2">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1 tracking-widest">Depto / Localidad</p>
                                    <p className="text-[10px] font-bold text-gray-700 uppercase">
                                        {modalidad.establecimiento.edificio?.zona_departamento} - {modalidad.establecimiento.edificio?.localidad}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Nuevo Estado de Validación" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                            <div className="grid grid-cols-2 gap-2">
                                {['PENDIENTE', 'CORRECTO', 'CORREGIDO', 'REVISAR'].map(s => (
                                    <button
                                        key={s} type="button" onClick={() => setData('estado', s)}
                                        className={`py-3 px-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                            data.estado === s 
                                                ? 'border-brand-orange bg-orange-50 text-brand-orange' 
                                                : 'border-gray-100 text-gray-400 hover:border-orange-100'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Verificación y Auditoría */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <InputLabel value="Campos Verificados" className="text-[10px] font-black uppercase tracking-widest text-gray-400" />
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

                        {vinculados.length > 0 && (
                            <div className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                                data.propagar_al_edificio 
                                    ? 'bg-brand-orange border-brand-orange text-white shadow-md' 
                                    : 'bg-gray-50 border-gray-100 text-gray-500'
                            }`}
                            onClick={() => setData('propagar_al_edificio', !data.propagar_al_edificio)}
                            >
                                <i className={`fas ${data.propagar_al_edificio ? 'fa-check-double' : 'fa-link'} text-xl`}></i>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Sincronizar Edificio ({vinculados.length})</p>
                                    <p className={`text-[8px] font-bold ${data.propagar_al_edificio ? 'text-white/80' : 'text-gray-400'}`}>Aplicar validación a todo el CUI</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose} className="px-6 py-2.5">Cancelar</SecondaryButton>
                    <PrimaryButton className="px-12 py-2.5" disabled={processing}>
                        {processing ? 'Guardando...' : 'Confirmar Validación'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}


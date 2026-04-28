import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState, useCallback, useEffect } from 'react';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import debounce from 'lodash/debounce';

// Función para obtener el nombre descriptivo del edificio
const getNombreEdificio = (item, mapa = {}) => {
    try {
        if (!item || !item.establecimiento) return null;
        
        // 1. Prioridad: Nombre directo del edificio
        if (item.establecimiento.edificio && item.establecimiento.edificio.nombre) {
            return item.establecimiento.edificio.nombre;
        }
        
        // 2. Prioridad: Cabecera (Nombre o Código)
        const cab = item.establecimiento.establecimiento_cabecera;
        if (cab) {
            if (mapa[cab]) return mapa[cab];
            if (isNaN(cab)) return cab;
        }

        // 3. Fallback: CUI
        if (item.establecimiento.edificio && item.establecimiento.edificio.cui && mapa[item.establecimiento.edificio.cui]) {
            return mapa[item.establecimiento.edificio.cui];
        }
    } catch (e) {
        console.error("Error en getNombreEdificio:", e);
    }
    return null;
};

export default function Index({ modalidades, filters, options, nombresEdificios = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedModalidad, setSelectedModalidad] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Filter handling
    const applyFilters = useCallback(
        debounce((query) => {
            const newFilters = { ...filters, search: query };
            delete newFilters.page;
            router.get(route('administrativos.establecimientos.index'), newFilters, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 300),
        [filters]
    );

    const handleSearch = (e) => {
        setSearch(e.target.value);
        applyFilters(e.target.value);
    };

    const handleParamChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        delete newFilters.page;
        router.get(route('administrativos.establecimientos.index'), newFilters, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const resetFilters = () => {
        router.get(route('administrativos.establecimientos.index'), {});
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Establecimientos" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
                
                {/* Actions & Filters Sidebar - Sticky */}
                <div className="lg:col-span-1 space-y-4 sticky top-6 self-start">
                    {/* Primary Actions Area */}
                    <div className="flex flex-col gap-2 mb-6">
                        <PrimaryButton className="w-full !py-4 gap-3 !rounded-2xl" onClick={() => setShowCreateModal(true)}>
                            <i className="fas fa-plus"></i>
                            <span className="text-sm">Nueva Modalidad</span>
                        </PrimaryButton>
                        <a 
                            href={route('administrativos.establecimientos.export')}
                            className="flex items-center justify-center gap-3 w-full py-3 bg-green-50 text-green-700 border border-green-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm"
                        >
                            <i className="fas fa-file-excel"></i> Exportar Datos
                        </a>
                    </div>

                    <div className="bg-white p-0 rounded-2xl shadow-sm border border-orange-100 overflow-hidden space-y-6">
                        <div className="flex justify-between items-center bg-orange-50/50 px-5 py-3 border-b border-orange-100">
                            <div className="flex items-center gap-3">
                                <h3 className="text-[10px] font-black text-brand-orange uppercase tracking-widest flex items-center gap-2">
                                    <i className="fas fa-filter"></i>
                                    Filtros
                                </h3>
                                <span className="bg-gray-100 text-black text-xs font-black px-2.5 py-1 rounded-lg border border-gray-200 shadow-sm">
                                    {modalidades.total}
                                </span>
                            </div>
                            <button onClick={resetFilters} className="text-[10px] font-black text-brand-orange hover:underline uppercase tracking-widest">Limpiar</button>
                        </div>
                        <div className="px-5 pb-6 space-y-6">

                        {/* Search Input in Sidebar for mobile/desktop harmony */}
                        <div className="space-y-1">
                            <InputLabel value="Búsqueda" />
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder="Nombre, CUE, CUI..."
                                    className="w-full pl-9 pr-4 py-2 border-gray-200 rounded-xl focus:border-brand-orange focus:ring-brand-orange transition-all text-xs font-bold"
                                    value={search}
                                    onChange={handleSearch}
                                />
                                <i className="fas fa-search absolute left-3 top-2.5 text-gray-300"></i>
                            </div>
                        </div>

                        <FilterSelect label="Dirección de Área" value={filters.direccion_area} options={options.areas} onChange={v => handleParamChange('direccion_area', v)} />
                        <FilterSelect label="Nivel Educativo" value={filters.nivel_educativo} options={options.niveles} onChange={v => handleParamChange('nivel_educativo', v)} />
                        <FilterSelect label="Ámbito" value={filters.ambito} options={options.ambitos} onChange={v => handleParamChange('ambito', v)} />
                        
                        <div className="space-y-1">
                            <InputLabel value="Estado de Validación" />
                            <select 
                                value={filters.estado || ''}
                                onChange={(e) => handleParamChange('estado', e.target.value)}
                                className="w-full border-gray-200 rounded-xl focus:border-brand-orange focus:ring-brand-orange text-xs font-bold"
                            >
                                <option value="">Todos los estados</option>
                                <option value="VALIDADO">Solo VALIDADOS</option>
                                <option value="PENDIENTE">Solo PENDIENTES</option>
                            </select>
                        </div>

                        <FilterSelect label="Radio" value={filters.radio} options={options.radios} onChange={v => handleParamChange('radio', v)} />
                        <FilterSelect label="Zona / Departamento" value={filters.zona_departamento} options={options.zonas} onChange={v => handleParamChange('zona_departamento', v)} />
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100 border-l-4 border-l-brand-orange">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-brand-orange text-[10px] uppercase font-black text-white border-b border-orange-600">
                                            <th className="px-6 py-2">Establecimiento / CUE</th>
                                            <th className="px-6 py-2">Edificio</th>
                                            <th className="px-6 py-2">Nivel / Área</th>
                                            <th className="px-6 py-2">Estado</th>
                                            <th className="px-6 py-2 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {modalidades.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-orange-50/30 transition-colors group">
                                            <td className="px-6 py-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-black group-hover:text-brand-orange leading-tight">{item.establecimiento.nombre}</span>
                                                    <span className="text-[9px] font-black text-black/40 uppercase mt-1">CUE: {item.establecimiento.cue}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex flex-col max-w-[200px]">
                                                    {getNombreEdificio(item, nombresEdificios) ? (
                                                        <>
                                                            <span className="text-[10px] font-black text-gray-900 leading-tight" title={getNombreEdificio(item, nombresEdificios)}>
                                                                {getNombreEdificio(item, nombresEdificios)}
                                                            </span>
                                                            <span className="text-[9px] text-brand-orange font-black uppercase tracking-tighter">
                                                                CUI: {item.establecimiento.edificio?.cui}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-brand-orange leading-tight">
                                                            CUI: {item.establecimiento.edificio?.cui || 'S/D'}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-black/70 uppercase tracking-tighter">{item.nivel_educativo}</span>
                                                    <span className="text-[9px] text-black/40 font-black uppercase truncate max-w-[150px]">{item.direccion_area}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                                                    item.validado 
                                                        ? 'bg-orange-50 text-brand-orange border-brand-orange/20' 
                                                        : 'bg-red-50 text-brand-red border-brand-red/20'
                                                }`}>
                                                    <i className={`fas ${item.validado ? 'fa-check-circle' : 'fa-clock'} mr-1`}></i>
                                                    {item.validado ? 'Validado' : 'Pendiente'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-2 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => { setSelectedModalidad(item); setShowViewModal(true); }}
                                                        className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-brand-orange hover:text-white transition shadow-sm"
                                                    >
                                                        <i className="fas fa-eye text-xs"></i>
                                                    </button>
                                                    <button 
                                                        onClick={() => { setSelectedModalidad(item); setShowEditModal(true); }}
                                                        className="p-2 rounded-lg bg-orange-50 text-brand-orange hover:bg-brand-orange hover:text-white transition shadow-sm"
                                                    >
                                                        <i className="fas fa-edit text-xs"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {modalidades.data.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-2">
                                                        <i className="fas fa-search text-2xl"></i>
                                                    </div>
                                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">No se encontraron resultados</h4>
                                                    <p className="text-xs text-gray-400 font-medium max-w-[250px] mx-auto">
                                                        Intenta ajustar los filtros o la búsqueda para encontrar lo que necesitas.
                                                    </p>
                                                    <button 
                                                        onClick={resetFilters}
                                                        className="mt-4 px-4 py-2 bg-orange-50 text-brand-orange rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all shadow-sm border border-orange-100"
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
                    <div className="flex justify-center -mt-2">
                        <Pagination links={modalidades.links} />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ViewModalidadModal show={showViewModal} onClose={() => setShowViewModal(false)} modalidad={selectedModalidad} nombresEdificios={nombresEdificios} />
            <EditModalidadModal show={showEditModal} onClose={() => setShowEditModal(false)} modalidad={selectedModalidad} options={options} />
            <CreateModalidadModal show={showCreateModal} onClose={() => setShowCreateModal(false)} options={options} />

        </AuthenticatedLayout>
    );
}

function FilterSelect({ label, value, options, onChange }) {
    return (
        <div className="space-y-1">
            <InputLabel value={label} />
            <select 
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border-gray-200 rounded-xl focus:border-brand-orange focus:ring-brand-orange text-xs font-bold"
            >
                <option value="">Cualquiera</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );
}

function ViewModalidadModal({ show, onClose, modalidad, nombresEdificios }) {
    if (!modalidad) return null;
    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm border ${
                            modalidad.validado ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'
                        }`}>
                            <i className={`fas ${modalidad.validado ? 'fa-school' : 'fa-clock'}`}></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 leading-tight">{modalidad.establecimiento.nombre}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CUE: {modalidad.establecimiento.cue}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl"><i className="fas fa-times"></i></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <DetailItem icon="fas fa-building" label="Edificio" value={getNombreEdificio(modalidad, nombresEdificios) || 'Sin Nombre'} />
                    <DetailItem icon="fas fa-id-card" label="CUI Edificio" value={modalidad.establecimiento.edificio.cui} />
                    <DetailItem icon="fas fa-map-marker-alt" label="Dirección" value={`${modalidad.establecimiento.edificio.calle} ${modalidad.establecimiento.edificio.numero_puerta || 'S/N'}`} />
                    <DetailItem icon="fas fa-graduation-cap" label="Nivel Educativo" value={modalidad.nivel_educativo} />
                    <DetailItem icon="fas fa-university" label="Dirección de Área" value={modalidad.direccion_area} />
                    <DetailItem icon="fas fa-landmark" label="Ámbito" value={modalidad.ambito} />
                    <DetailItem icon="fas fa-users" label="Sector" value={modalidad.sector || 'S/D'} />
                    <DetailItem icon="fas fa-broadcast-tower" label="Radio / Zona" value={`${modalidad.radio || '?'}, ${modalidad.zona || '?'}`} />
                    <DetailItem icon="fas fa-check-circle" label="Estado Validación" value={modalidad.validado ? 'CONSOLIDADO' : 'PENDIENTE DE REVISIÓN'} />
                </div>

                <div className="mt-8 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cerrar Panel</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}

function EditModalidadModal({ show, onClose, modalidad, options }) {
    if (!modalidad) return null;

    const { data, setData, patch, processing, errors, reset } = useForm({
        cui: modalidad.establecimiento.edificio.cui || '',
        cue: modalidad.establecimiento.cue || '',
        nombre_establecimiento: modalidad.establecimiento.nombre || '',
        nivel_educativo: modalidad.nivel_educativo || '',
        direccion_area: modalidad.direccion_area || '',
        ambito: modalidad.ambito || '',
        radio: modalidad.radio || '',
        sector: modalidad.sector || '',
        validado: !!modalidad.validado,
    });

    useEffect(() => {
        if (show && modalidad) {
            setData({
                cui: modalidad.establecimiento.edificio.cui || '',
                cue: modalidad.establecimiento.cue || '',
                nombre_establecimiento: modalidad.establecimiento.nombre || '',
                nivel_educativo: modalidad.nivel_educativo || '',
                direccion_area: modalidad.direccion_area || '',
                ambito: modalidad.ambito || '',
                radio: modalidad.radio || '',
                sector: modalidad.sector || '',
                validado: !!modalidad.validado,
            });
        }
    }, [modalidad, show]);

    const submit = (e) => {
        e.preventDefault();
        patch(route('administrativos.establecimientos.update', modalidad.id), {
            onSuccess: () => { onClose(); },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-6">
                <h3 className="text-xl font-black text-gray-900 border-b pb-4 mb-6">Actualizar Establecimiento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <ModalInput label="CUI Edificio" value={data.cui} onChange={v => setData('cui', v)} error={errors.cui} />
                    <ModalInput label="CUE Establecimiento" value={data.cue} onChange={v => setData('cue', v)} error={errors.cue} />
                    <div className="col-span-2">
                        <ModalInput label="Nombre del Establecimiento" value={data.nombre_establecimiento} onChange={v => setData('nombre_establecimiento', v)} error={errors.nombre_establecimiento} />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel value="Ámbito" />
                        <select className="w-full mt-1 rounded-xl border-gray-300" value={data.ambito} onChange={e => setData('ambito', e.target.value)}>
                            {options.ambitos.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>

                    <div className="col-span-2 md:col-span-1 flex items-center gap-3 pt-6">
                        <input 
                            type="checkbox" 
                            id="validado"
                            checked={data.validado} 
                            onChange={e => setData('validado', e.target.checked)}
                            className="rounded-lg border-gray-300 text-brand-orange focus:ring-brand-orange w-6 h-6"
                        />
                        <label htmlFor="validado" className="text-sm font-black text-gray-700">MARCAR COMO VALIDADO</label>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel value="Dirección de Área" />
                        <select className="w-full mt-1 rounded-xl border-gray-300" value={data.direccion_area} onChange={e => setData('direccion_area', e.target.value)}>
                            {options.areas.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>

                    <div className="col-span-1">
                        <ModalInput label="Nivel Educativo" value={data.nivel_educativo} onChange={v => setData('nivel_educativo', v)} error={errors.nivel_educativo} />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose}>Descartar</SecondaryButton>
                    <PrimaryButton disabled={processing}>{processing ? 'Guardando...' : 'Guardar Cambios'}</PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

function CreateModalidadModal({ show, onClose, options }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre_establecimiento: '',
        cue: '',
        cui: '',
        establecimiento_cabecera: '',
        nivel_educativo: '',
        direccion_area: '',
        ambito: 'PUBLICO',
        sector: '',
        radio: '',
        zona: '',
        calle: '',
        localidad: '',
        zona_departamento: '',
    });

    const lookupCUI = (cui) => {
        if (cui.length < 3) return;
        fetch(route('api.lookup-edificio', cui))
            .then(res => res.json())
            .then(res => {
                if (res) {
                    setData(prev => ({
                        ...prev,
                        cui,
                        calle: res.calle,
                        localidad: res.localidad,
                        zona_departamento: res.zona_departamento,
                    }));
                }
            });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('administrativos.establecimientos.store'), {
            onSuccess: () => { onClose(); reset(); },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <form onSubmit={submit} className="p-8">
                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-brand-orange rounded-xl"><i className="fas fa-plus"></i></div>
                    Nueva Modalidad Escolar
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4 lg:col-span-1 border-r pr-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Datos de Ubicación</h4>
                        <div>
                            <InputLabel value="CUI del Edificio" />
                            <TextInput className="w-full mt-1" value={data.cui} onChange={e => { setData('cui', e.target.value); lookupCUI(e.target.value); }} />
                            <InputError message={errors.cui} />
                        </div>
                        <ModalInput label="Calle" value={data.calle} onChange={v => setData('calle', v)} />
                        <ModalInput label="Localidad" value={data.localidad} onChange={v => setData('localidad', v)} />
                        <ModalInput label="Departamento" value={data.zona_departamento} onChange={v => setData('zona_departamento', v)} />
                    </div>

                    <div className="space-y-4 lg:col-span-2">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Datos Académicos / Institucionales</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 lg:col-span-1">
                                <InputLabel value="CUE de la Modalidad" />
                                <TextInput className="w-full mt-1" value={data.cue} onChange={e => setData('cue', e.target.value)} />
                                <InputError message={errors.cue} />
                            </div>
                            <div className="col-span-2 lg:col-span-1">
                                <InputLabel value="Establecimiento Cabecera" />
                                <TextInput className="w-full mt-1" value={data.establecimiento_cabecera} onChange={e => setData('establecimiento_cabecera', e.target.value)} />
                                <InputError message={errors.establecimiento_cabecera} />
                            </div>
                            <div className="col-span-2">
                                <InputLabel value="Nombre Completo" />
                                <TextInput className="w-full mt-1" value={data.nombre_establecimiento} onChange={e => setData('nombre_establecimiento', e.target.value)} />
                                <InputError message={errors.nombre_establecimiento} />
                            </div>
                            
                            <div className="col-span-1">
                                <InputLabel value="Dirección de Área" />
                                <select className="w-full mt-1 rounded-xl border-gray-300 text-sm" value={data.direccion_area} onChange={e => setData('direccion_area', e.target.value)}>
                                    <option value="">Seleccione...</option>
                                    {options.areas.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                            <div className="col-span-1">
                                <InputLabel value="Nivel Educativo" />
                                <TextInput className="w-full mt-1" value={data.nivel_educativo} onChange={e => setData('nivel_educativo', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-end gap-4 border-t pt-8">
                    <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                    <PrimaryButton className="px-8 py-3 text-sm" disabled={processing}>Confirmar Alta</PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

function ModalInput({ label, value, onChange, error, type = "text" }) {
    return (
        <div className="space-y-1">
            <InputLabel value={label} />
            <TextInput type={type} className="w-full mt-1" value={value} onChange={e => onChange(e.target.value)} />
            {error && <InputError message={error} />}
        </div>
    );
}

function DetailItem({ icon, label, value }) {
    return (
        <div className="flex gap-4 items-start p-3 bg-gray-50/50 rounded-xl border border-gray-50">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-100 shrink-0 shadow-sm">
                <i className={icon}></i>
            </div>
            <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-xs font-bold text-gray-800 leading-tight">{value}</p>
            </div>
        </div>
    );
}

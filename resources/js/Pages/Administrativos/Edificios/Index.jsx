import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import debounce from 'lodash/debounce';

export default function Index({ edificios, filters, options }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedEdificio, setSelectedEdificio] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Filter handling
    const applyFilters = useCallback(
        debounce((query) => {
            router.get(route('administrativos.edificios.index'), { ...filters, search: query }, {
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
        router.get(route('administrativos.edificios.index'), { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSort = (field) => {
        const direction = filters.sort_by === field && filters.sort_dir === 'asc' ? 'desc' : 'asc';
        router.get(route('administrativos.edificios.index'), { 
            ...filters, 
            sort_by: field, 
            sort_dir: direction 
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Modal Handlers
    const openEdit = (edificio) => {
        setSelectedEdificio(edificio);
        setShowEditModal(true);
    };

    const openView = (edificio) => {
        setSelectedEdificio(edificio);
        setShowViewModal(true);
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Edificios" />

            <div className="space-y-6">
                {/* Filters & Actions Bar */}
                <div className="bg-white p-4 rounded-2x border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative">
                        <input 
                            type="text"
                            placeholder="Buscar por CUI, CUE, Localidad..."
                            className="w-full pl-10 pr-4 py-2 border-gray-200 rounded-xl focus:border-brand-orange focus:ring-brand-orange transition-all text-sm"
                            value={search}
                            onChange={handleSearch}
                        />
                        <i className="fas fa-search absolute left-3.5 top-3 text-gray-400"></i>
                    </div>
                    
                    <select 
                        value={filters.zona_departamento || ''}
                        onChange={(e) => handleParamChange('zona_departamento', e.target.value)}
                        className="border-gray-200 rounded-xl focus:border-brand-orange focus:ring-brand-orange text-sm min-w-[200px]"
                    >
                        <option value="">Departamentos (Todos)</option>
                        {options.zonas.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>

                    <select 
                        value={filters.localidad || ''}
                        onChange={(e) => handleParamChange('localidad', e.target.value)}
                        className="border-gray-200 rounded-xl focus:border-brand-orange focus:ring-brand-orange text-sm min-w-[150px]"
                    >
                        <option value="">Localidades (Todas)</option>
                        {options.localidades.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>

                    <select 
                        value={filters.ambito || ''}
                        onChange={(e) => handleParamChange('ambito', e.target.value)}
                        className="border-gray-200 rounded-xl focus:border-brand-orange focus:ring-brand-orange text-sm min-w-[150px] font-black uppercase"
                    >
                        <option value="">Ámbito (Todos)</option>
                        {options.ambitos.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>

                    <div className="bg-gray-50 text-black px-4 py-2 rounded-xl border border-gray-100 text-sm font-black shadow-sm h-[38px] flex items-center justify-center min-w-[50px]">
                        {edificios.total}
                    </div>

                    <div className="flex gap-2 shrink-0 border-l pl-4 border-gray-100 ml-2">
                        <a 
                            href={route('administrativos.edificios.export')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-xl font-bold text-[10px] text-white uppercase tracking-widest hover:bg-green-700 transition shadow-sm gap-2"
                        >
                            <i className="fas fa-file-excel"></i> Exportar
                        </a>
                        <PrimaryButton className="gap-2 !py-2 !px-4 !rounded-xl !text-[10px]" onClick={() => setShowCreateModal(true)}>
                            <i className="fas fa-plus"></i> Nuevo
                        </PrimaryButton>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-brand-orange text-[10px] uppercase font-black text-white border-b border-orange-600">
                                    <th className="px-6 py-2 cursor-pointer hover:bg-orange-600 transition-colors group" onClick={() => handleSort('cui')}>
                                        <div className="flex items-center gap-2">
                                            CUI / Ubicación
                                            <i className={`fas fa-sort${filters.sort_by === 'cui' ? (filters.sort_dir === 'asc' ? '-up' : '-down') : ''} opacity-50 group-hover:opacity-100`}></i>
                                        </div>
                                    </th>
                                    <th className="px-6 py-2">Establecimiento Cabecera</th>
                                    <th className="px-6 py-2 cursor-pointer hover:bg-orange-600 transition-colors group" onClick={() => handleSort('zona_departamento')}>
                                        <div className="flex items-center gap-2">
                                            Depto / Localidad
                                            <i className={`fas fa-sort${filters.sort_by === 'zona_departamento' ? (filters.sort_dir === 'asc' ? '-up' : '-down') : ''} opacity-50 group-hover:opacity-100`}></i>
                                        </div>
                                    </th>
                                    <th className="px-6 py-2 text-center">Ámbito</th>
                                    <th className="px-6 py-2 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {edificios.data.map((edificio) => (
                                    <tr key={edificio.id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="px-6 py-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-black group-hover:text-brand-orange">{edificio.cui}</span>
                                                <span className="text-[10px] font-black text-black/40 uppercase tracking-tighter">{edificio.calle} {edificio.numero_puerta || 'S/N'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2">
                                            <span className="text-xs font-black text-black/80 leading-tight line-clamp-2">
                                                {edificio.establecimientos[0]?.establecimiento_cabecera || edificio.establecimientos[0]?.nombre || 'Sin Cabecera'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-black/70">{edificio.zona_departamento}</span>
                                                <span className="text-[10px] text-black/40 font-black">{edificio.localidad}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 text-center">
                                            <span className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors ${
                                                getEdificioAmbito(edificio) === 'PUBLICO' 
                                                    ? 'bg-orange-50 text-brand-orange border border-orange-100' 
                                                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                                            }`}>
                                                {getEdificioAmbito(edificio)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openView(edificio)}
                                                    className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-brand-orange hover:text-white transition shadow-sm"
                                                    title="Ver detalles"
                                                >
                                                    <i className="fas fa-eye text-xs"></i>
                                                </button>
                                                <button 
                                                    onClick={() => openEdit(edificio)}
                                                    className="p-2 rounded-lg bg-orange-50 text-brand-orange hover:bg-brand-orange hover:text-white transition shadow-sm"
                                                    title="Editar edificio"
                                                >
                                                    <i className="fas fa-edit text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center -mt-2">
                    <Pagination links={edificios.links} />
                </div>
            </div>

            {/* Modals */}
            <ViewEdificioModal show={showViewModal} onClose={() => setShowViewModal(false)} edificio={selectedEdificio} />
            <EditEdificioModal show={showEditModal} onClose={() => setShowEditModal(false)} edificio={selectedEdificio} />
            <CreateEdificioModal show={showCreateModal} onClose={() => setShowCreateModal(false)} />

        </AuthenticatedLayout>
    );
}

function CreateEdificioModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        cui: '',
        calle: '',
        numero_puerta: '',
        localidad: '',
        zona_departamento: '',
        codigo_postal: '',
        latitud: '',
        longitud: '',
        letra_zona: '',
        orientacion: '',
        te_voip: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('administrativos.edificios.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center text-xl shadow-sm border border-orange-100">
                        <i className="fas fa-plus-circle"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-black uppercase">Nuevo Edificio</h3>
                        <p className="text-[10px] font-black text-black/40 tracking-widest">ALTA DE REGISTRO</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="cui" value="CUI" />
                        <TextInput
                            id="cui"
                            className="mt-1 block w-full bg-orange-50/50 border-orange-100"
                            value={data.cui}
                            onChange={(e) => setData('cui', e.target.value)}
                            required
                        />
                        <InputError message={errors.cui} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-2 border-t pt-4 border-orange-100">
                         <h4 className="text-[10px] font-black text-black/50 uppercase tracking-widest mb-2">Información de Ubicación</h4>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="calle" value="Calle" />
                        <TextInput
                            id="calle"
                            className="mt-1 block w-full"
                            value={data.calle}
                            onChange={(e) => setData('calle', e.target.value)}
                            required
                        />
                        <InputError message={errors.calle} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="numero" value="Número" />
                        <TextInput
                            id="numero"
                            className="mt-1 block w-full"
                            value={data.numero_puerta}
                            onChange={(e) => setData('numero_puerta', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="localidad" value="Localidad" />
                        <TextInput
                            id="localidad"
                            className="mt-1 block w-full"
                            value={data.localidad}
                            onChange={(e) => setData('localidad', e.target.value)}
                            required
                        />
                        <InputError message={errors.localidad} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="depto" value="Departamento" />
                        <TextInput
                            id="depto"
                            className="mt-1 block w-full"
                            value={data.zona_departamento}
                            onChange={(e) => setData('zona_departamento', e.target.value)}
                            required
                        />
                        <InputError message={errors.zona_departamento} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-2 border-t pt-4">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Geo-referenciación (Opcional)</h4>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="lat" value="Latitud" />
                        <TextInput
                            id="lat"
                            className="mt-1 block w-full"
                            value={data.latitud}
                            onChange={(e) => setData('latitud', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="lng" value="Longitud" />
                        <TextInput
                            id="lng"
                            className="mt-1 block w-full"
                            value={data.longitud}
                            onChange={(e) => setData('longitud', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-2 border-t pt-4">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Otros Datos</h4>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="cp" value="Código Postal" />
                        <TextInput
                            id="cp"
                            className="mt-1 block w-full"
                            value={data.codigo_postal}
                            onChange={(e) => setData('codigo_postal', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="orientacion" value="Orientación" />
                        <TextInput
                            id="orientacion"
                            className="mt-1 block w-full"
                            value={data.orientacion}
                            onChange={(e) => setData('orientacion', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="te_voip" value="Teléfono VoIP" />
                        <TextInput
                            id="te_voip"
                            className="mt-1 block w-full"
                            value={data.te_voip}
                            onChange={(e) => setData('te_voip', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="letra_zona" value="Letra Zona" />
                        <TextInput
                            id="letra_zona"
                            className="mt-1 block w-full"
                            value={data.letra_zona}
                            onChange={(e) => setData('letra_zona', e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-10 flex justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose} disabled={processing}>Cancelar</SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Creando...' : 'Crear Edificio'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

function ViewEdificioModal({ show, onClose, edificio }) {
    if (!edificio) return null;
    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center text-xl shadow-sm border border-orange-100">
                            <i className="fas fa-info-circle"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Detalles del Edificio</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">CUI: {edificio.cui}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <DetailItem icon="fas fa-map-marker-alt" label="Ubicación" value={`${edificio.calle} ${edificio.numero_puerta || 'S/N'}`} />
                    <DetailItem icon="fas fa-city" label="Localidad / Depto" value={`${edificio.localidad} - ${edificio.zona_departamento}`} />
                    <DetailItem icon="fas fa-mail-bulk" label="Código Postal" value={edificio.codigo_postal || 'N/A'} />
                    <DetailItem icon="fas fa-compass" label="Coordenadas" value={`${edificio.latitud || '?'}, ${edificio.longitud || '?'}`} />
                </div>

                <div className="border-t pt-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Establecimientos que comparten este edificio</h4>
                    <div className="space-y-3">
                        {edificio.establecimientos.map(est => (
                            <div key={est.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center group hover:border-brand-orange transition-colors">
                                <div>
                                    <p className="text-xs font-black text-gray-800 leading-none mb-1">{est.nombre}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">CUE: {est.cue}</p>
                                </div>
                                <i className="fas fa-chevron-right text-gray-200 group-hover:text-brand-orange transition-colors"></i>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cerrar</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}

function EditEdificioModal({ show, onClose, edificio }) {
    if (!edificio) return null;

    const { data, setData, patch, processing, errors, reset } = useForm({
        cui: edificio.cui || '',
        calle: edificio.calle || '',
        numero_puerta: edificio.numero_puerta || '',
        localidad: edificio.localidad || '',
        zona_departamento: edificio.zona_departamento || '',
        codigo_postal: edificio.codigo_postal || '',
        latitud: edificio.latitud || '',
        longitud: edificio.longitud || '',
        letra_zona: edificio.letra_zona || '',
        orientacion: edificio.orientacion || '',
        te_voip: edificio.te_voip || '',
        cue_cabecera: edificio.establecimientos?.find(e => e.nombre === e.establecimiento_cabecera)?.cue || edificio.establecimientos?.[0]?.cue || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('administrativos.edificios.update', edificio.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center text-xl shadow-sm border border-orange-100">
                        <i className="fas fa-edit"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 uppercase">Editar Edificio</h3>
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest">ACTUALIZACIÓN DE REGISTRO</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="cui" value="CUI" />
                        <TextInput
                            id="cui"
                            className="mt-1 block w-full bg-orange-50/50 border-orange-100"
                            value={data.cui}
                            onChange={(e) => setData('cui', e.target.value)}
                            required
                        />
                        <InputError message={errors.cui} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="cue_cabecera" value="CUE de la Cabecera" />
                        <TextInput
                            id="cue_cabecera"
                            className="mt-1 block w-full bg-orange-50 border-orange-200 font-black text-brand-orange"
                            placeholder="Ingrese CUE para actualizar nombre"
                            value={data.cue_cabecera}
                            onChange={(e) => setData('cue_cabecera', e.target.value)}
                        />
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Nombre Detectado:</p>
                            <p className="text-xs font-black text-gray-800 uppercase leading-tight">
                                {edificio.establecimientos?.find(e => String(e.cue) === String(data.cue_cabecera))?.nombre || 'No se encontró en este edificio'}
                            </p>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold italic">
                            * Cambiará el nombre de cabecera en todos los establecimientos vinculados.
                        </p>
                        <InputError message={errors.cue_cabecera} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-2 border-t pt-4">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Información de Ubicación</h4>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="calle" value="Calle" />
                        <TextInput
                            id="calle"
                            className="mt-1 block w-full"
                            value={data.calle}
                            onChange={(e) => setData('calle', e.target.value)}
                            required
                        />
                        <InputError message={errors.calle} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="numero" value="Número" />
                        <TextInput
                            id="numero"
                            className="mt-1 block w-full"
                            value={data.numero_puerta}
                            onChange={(e) => setData('numero_puerta', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="localidad" value="Localidad" />
                        <TextInput
                            id="localidad"
                            className="mt-1 block w-full"
                            value={data.localidad}
                            onChange={(e) => setData('localidad', e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="depto" value="Departamento" />
                        <TextInput
                            id="depto"
                            className="mt-1 block w-full"
                            value={data.zona_departamento}
                            onChange={(e) => setData('zona_departamento', e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-span-2 md:col-span-2 border-t pt-4">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Geo-referenciación</h4>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="lat_edit" value="Latitud" />
                        <TextInput
                            id="lat_edit"
                            className="mt-1 block w-full"
                            value={data.latitud}
                            onChange={(e) => setData('latitud', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="lng_edit" value="Longitud" />
                        <TextInput
                            id="lng_edit"
                            className="mt-1 block w-full"
                            value={data.longitud}
                            onChange={(e) => setData('longitud', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-2 border-t pt-4">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Otros Datos</h4>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="cp_edit" value="Código Postal" />
                        <TextInput
                            id="cp_edit"
                            className="mt-1 block w-full"
                            value={data.codigo_postal}
                            onChange={(e) => setData('codigo_postal', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="orientacion_edit" value="Orientación" />
                        <TextInput
                            id="orientacion_edit"
                            className="mt-1 block w-full"
                            value={data.orientacion}
                            onChange={(e) => setData('orientacion', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="te_voip_edit" value="Teléfono VoIP" />
                        <TextInput
                            id="te_voip_edit"
                            className="mt-1 block w-full"
                            value={data.te_voip}
                            onChange={(e) => setData('te_voip', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="letra_zona_edit" value="Letra Zona" />
                        <TextInput
                            id="letra_zona_edit"
                            className="mt-1 block w-full"
                            value={data.letra_zona}
                            onChange={(e) => setData('letra_zona', e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-10 flex justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose} disabled={processing}>Cancelar</SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

function DetailItem({ icon, label, value }) {
    return (
        <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-brand-orange border border-orange-100 shrink-0">
                <i className={icon}></i>
            </div>
            <div>
                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-black text-black leading-tight">{value}</p>
            </div>
        </div>
    );
}

const getEdificioAmbito = (edificio) => {
    if (!edificio.establecimientos || edificio.establecimientos.length === 0) return 'S/D';
    
    // Buscar en todos los establecimientos del edificio
    for (const est of edificio.establecimientos) {
        if (est.modalidades && est.modalidades.length > 0) {
            // Retornar el primer ámbito encontrado
            return est.modalidades[0].ambito || 'S/D';
        }
    }
    return 'S/D';
};

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ modalidades, filters }) {
    const [selectedMod, setSelectedMod] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleSearch = (query) => {
        router.get(route('administrativos.instrumentos.index'), { ...filters, search: query }, {
            preserveState: true, replace: true
        });
    };

    const toggleMissing = (checked) => {
        router.get(route('administrativos.instrumentos.index'), { ...filters, missing: checked }, {
            preserveState: true
        });
    };

    const openEdit = (mod) => {
        setSelectedMod(mod);
        setShowEditModal(true);
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Instrumentos Legales" />

            <div className="space-y-6 pt-2">
                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-50 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 relative w-full">
                        <input 
                            type="text"
                            placeholder="Buscar por Escuela, CUE o CUI..."
                            className="w-full pl-10 pr-4 py-2 border-gray-200 rounded-xl focus:border-brand-orange focus:ring-brand-orange transition-all text-sm"
                            defaultValue={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-3.5 top-3 text-gray-400"></i>
                    </div>
                    
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={!!filters.missing}
                                onChange={(e) => toggleMissing(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                        </div>
                        <span className="text-sm font-bold text-gray-600 group-hover:text-brand-orange transition-colors">Ver solo faltantes</span>
                    </label>
                </div>

                {/* Table */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-brand-orange text-[10px] uppercase font-black text-white border-b border-orange-600">
                                    <th className="px-6 py-2">Establecimiento</th>
                                    <th className="px-6 py-2">I.L. Radio</th>
                                    <th className="px-6 py-2">I.L. Categoría</th>
                                    <th className="px-6 py-2">I.L. Creación</th>
                                    <th className="px-6 py-2 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {modalidades.data.map((mod) => (
                                    <tr key={mod.id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="px-6 py-2">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-black group-hover:text-brand-orange leading-tight">{mod.establecimiento.nombre}</span>
                                                <span className="text-[9px] font-black text-black/40 uppercase">CUE: {mod.establecimiento.cue}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2">
                                            <InstrumentBadge value={mod.inst_legal_radio} />
                                        </td>
                                        <td className="px-6 py-2">
                                            <InstrumentBadge value={mod.inst_legal_categoria} />
                                        </td>
                                        <td className="px-6 py-2">
                                            <InstrumentBadge value={mod.inst_legal_creacion} />
                                        </td>
                                        <td className="px-6 py-2 text-right">
                                            <button 
                                                onClick={() => openEdit(mod)}
                                                className="p-2 rounded-lg bg-orange-50 text-brand-orange hover:bg-brand-orange hover:text-white transition shadow-sm"
                                            >
                                                <i className="fas fa-edit text-xs"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-center -mt-2">
                    <Pagination links={modalidades.links} />
                </div>
            </div>

            <EditModal show={showEditModal} onClose={() => setShowEditModal(false)} modalidad={selectedMod} />

        </AuthenticatedLayout>
    );
}

function InstrumentBadge({ value }) {
    const isMissing = !value || value.toLowerCase().includes('sin inst') || value === '';
    return (
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest ${
            isMissing 
                ? 'bg-red-50 text-brand-red border-brand-red/20 italic' 
                : 'bg-orange-50 text-brand-orange border-brand-orange/20'
        }`}>
            {value || 'Sin Instrumento'}
        </span>
    );
}

function EditModal({ show, onClose, modalidad }) {
    if (!modalidad) return null;

    const { data, setData, patch, processing, errors } = useForm({
        inst_legal_radio: modalidad.inst_legal_radio || '',
        inst_legal_categoria: modalidad.inst_legal_categoria || '',
        inst_legal_creacion: modalidad.inst_legal_creacion || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('administrativos.instrumentos.update', modalidad.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center text-lg shadow-sm">
                        <i className="fas fa-file-signature"></i>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 leading-none">Editar Instrumentos</h3>
                        <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-widest">{modalidad.establecimiento.nombre}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <InputLabel value="Instrumento Legal Radio" />
                        <TextInput 
                            className="w-full mt-1" 
                            value={data.inst_legal_radio} 
                            onChange={e => setData('inst_legal_radio', e.target.value)} 
                        />
                    </div>
                    <div>
                        <InputLabel value="Instrumento Legal Categoría" />
                        <TextInput 
                            className="w-full mt-1" 
                            value={data.inst_legal_categoria} 
                            onChange={e => setData('inst_legal_categoria', e.target.value)} 
                        />
                    </div>
                    <div>
                        <InputLabel value="Instrumento Legal Creación" />
                        <TextInput 
                            className="w-full mt-1" 
                            value={data.inst_legal_creacion} 
                            onChange={e => setData('inst_legal_creacion', e.target.value)} 
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                    <PrimaryButton disabled={processing}>{processing ? 'Guardando...' : 'Guardar Cambios'}</PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

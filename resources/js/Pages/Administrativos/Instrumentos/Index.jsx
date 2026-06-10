import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({ modalidades, filters }) {
    const [selectedMod, setSelectedMod] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleSearch = (query) => {
        router.get(
            route('administrativos.instrumentos.index'),
            { ...filters, search: query },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const toggleMissing = (checked) => {
        router.get(
            route('administrativos.instrumentos.index'),
            { ...filters, missing: checked },
            {
                preserveState: true,
            },
        );
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
                <div className="flex flex-col items-center gap-6 rounded-2xl border border-orange-50 bg-white p-4 shadow-sm md:flex-row">
                    <div className="relative w-full flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por Escuela, CUE o CUI..."
                            className="w-full rounded-xl border-gray-200 py-2 pl-10 pr-4 text-sm transition-all focus:border-brand-orange focus:ring-brand-orange"
                            defaultValue={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-3.5 top-3 text-gray-400"></i>
                    </div>

                    <label className="group flex cursor-pointer items-center gap-3">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={!!filters.missing}
                                onChange={(e) =>
                                    toggleMissing(e.target.checked)
                                }
                            />
                            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-orange peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rtl:peer-checked:after:-translate-x-full"></div>
                        </div>
                        <span className="text-sm font-bold text-gray-600 transition-colors group-hover:text-brand-orange">
                            Ver solo faltantes
                        </span>
                    </label>
                </div>

                {/* Table */}
                <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-orange-600 bg-brand-orange text-[10px] font-black uppercase text-white">
                                    <th className="px-6 py-2">
                                        Establecimiento
                                    </th>
                                    <th className="px-6 py-2">I.L. Radio</th>
                                    <th className="px-6 py-2">
                                        I.L. Categoría
                                    </th>
                                    <th className="px-6 py-2">I.L. Creación</th>
                                    <th className="px-6 py-2 text-right">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {modalidades.data.map((mod) => (
                                    <tr
                                        key={mod.id}
                                        className="group transition-colors hover:bg-orange-50/30"
                                    >
                                        <td className="px-6 py-2">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black leading-tight text-black group-hover:text-brand-orange">
                                                    {mod.establecimiento.nombre}
                                                </span>
                                                <span className="text-[9px] font-black uppercase text-black/40">
                                                    CUE:{' '}
                                                    {mod.establecimiento.cue}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2">
                                            <InstrumentBadge
                                                value={mod.inst_legal_radio}
                                            />
                                        </td>
                                        <td className="px-6 py-2">
                                            <InstrumentBadge
                                                value={mod.inst_legal_categoria}
                                            />
                                        </td>
                                        <td className="px-6 py-2">
                                            <InstrumentBadge
                                                value={mod.inst_legal_creacion}
                                            />
                                        </td>
                                        <td className="px-6 py-2 text-right">
                                            <button
                                                onClick={() => openEdit(mod)}
                                                className="rounded-lg bg-orange-50 p-2 text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white"
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

                <div className="-mt-2 flex justify-center">
                    <Pagination links={modalidades.links} />
                </div>
            </div>

            <EditModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                modalidad={selectedMod}
            />
        </AuthenticatedLayout>
    );
}

function InstrumentBadge({ value }) {
    const isMissing =
        !value || value.toLowerCase().includes('sin inst') || value === '';
    return (
        <span
            className={`rounded-lg border px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                isMissing
                    ? 'border-brand-red/20 bg-red-50 italic text-brand-red'
                    : 'border-brand-orange/20 bg-orange-50 text-brand-orange'
            }`}
        >
            {value || 'Sin Instrumento'}
        </span>
    );
}

function EditModal({ show, onClose, modalidad }) {
    const { data, setData, patch, processing } = useForm({
        inst_legal_radio: modalidad?.inst_legal_radio || '',
        inst_legal_categoria: modalidad?.inst_legal_categoria || '',
        inst_legal_creacion: modalidad?.inst_legal_creacion || '',
    });

    useEffect(() => {
        if (show && modalidad) {
            setData({
                inst_legal_radio: modalidad.inst_legal_radio || '',
                inst_legal_categoria: modalidad.inst_legal_categoria || '',
                inst_legal_creacion: modalidad.inst_legal_creacion || '',
            });
        }
    }, [modalidad, show, setData]);

    if (!modalidad) return null;

    const submit = (e) => {
        e.preventDefault();
        patch(route('administrativos.instrumentos.update', modalidad.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg text-brand-orange shadow-sm">
                        <i className="fas fa-file-signature"></i>
                    </div>
                    <div>
                        <h3 className="text-lg font-black leading-none text-gray-900">
                            Editar Instrumentos
                        </h3>
                        <p className="mt-1 text-[9px] font-bold tracking-widest text-gray-400">
                            {modalidad.establecimiento.nombre}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <InputLabel value="Instrumento Legal Radio" />
                        <TextInput
                            className="mt-1 w-full"
                            value={data.inst_legal_radio}
                            onChange={(e) =>
                                setData('inst_legal_radio', e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <InputLabel value="Instrumento Legal Categoría" />
                        <TextInput
                            className="mt-1 w-full"
                            value={data.inst_legal_categoria}
                            onChange={(e) =>
                                setData('inst_legal_categoria', e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <InputLabel value="Instrumento Legal Creación" />
                        <TextInput
                            className="mt-1 w-full"
                            value={data.inst_legal_creacion}
                            onChange={(e) =>
                                setData('inst_legal_creacion', e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

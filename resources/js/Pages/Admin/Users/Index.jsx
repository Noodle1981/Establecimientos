import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ users, filters }) {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleSearch = (query) => {
        router.get(
            route('admin.users.index'),
            { search: query },
            { preserveState: true, replace: true },
        );
    };

    const resetPass = (id) => {
        if (
            confirm(
                '¿Estás seguro de blanquear la contraseña? Se asignará una clave temporal.',
            )
        ) {
            router.post(route('admin.users.reset', id));
        }
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Usuarios" />

            <div className="space-y-6 pt-2">
                <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            className="w-full rounded-xl border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-brand-orange focus:ring-brand-orange"
                            defaultValue={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-4 top-3 text-gray-400"></i>
                    </div>
                    <PrimaryButton
                        className="gap-2 !rounded-xl !py-2.5"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <i className="fas fa-user-plus text-xs"></i>
                        <span className="text-[10px] font-black uppercase">
                            Nuevo Usuario
                        </span>
                    </PrimaryButton>
                </div>

                <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-orange-600 bg-brand-orange text-[10px] font-black uppercase text-white">
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">
                                    Último Acceso / Cambio Clave
                                </th>
                                <th className="px-6 py-4 text-right">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="group transition-colors hover:bg-orange-50/10"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-black text-brand-orange">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black leading-tight text-black">
                                                    {user.name}
                                                </span>
                                                <span className="text-[10px] font-black text-black/40">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-lg border px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                                                user.role === 'admin'
                                                    ? 'border-purple-100 bg-purple-50 text-purple-600'
                                                    : 'border-blue-100 bg-blue-50 text-blue-600'
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-bold italic text-gray-500">
                                            {user.password_changed_at
                                                ? 'Clave Actualizada'
                                                : 'PENDIENTE DE CAMBIO'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    resetPass(user.id)
                                                }
                                                className="rounded-lg bg-orange-50 p-2 text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white"
                                                title="Reestablecer Clave"
                                            >
                                                <i className="fas fa-key text-xs"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center">
                    <Pagination links={users.links} />
                </div>
            </div>

            <CreateUserModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </AuthenticatedLayout>
    );
}

function CreateUserModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'administrativos',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="p-6">
                <h3 className="mb-6 border-b pb-4 text-lg font-black text-gray-900">
                    Registrar Nuevo Usuario
                </h3>
                <div className="space-y-4">
                    <ModalInput
                        label="Nombre Completo"
                        value={data.name}
                        onChange={(v) => setData('name', v)}
                        error={errors.name}
                    />
                    <ModalInput
                        label="Correo Electrónico"
                        type="email"
                        value={data.email}
                        onChange={(v) => setData('email', v)}
                        error={errors.email}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <ModalInput
                            label="Contraseña"
                            type="password"
                            value={data.password}
                            onChange={(v) => setData('password', v)}
                            error={errors.password}
                        />
                        <ModalInput
                            label="Confirmar"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(v) =>
                                setData('password_confirmation', v)
                            }
                        />
                    </div>

                    <div>
                        <InputLabel value="Rol del Usuario" />
                        <select
                            className="mt-1 w-full rounded-xl border-gray-300 text-sm font-bold"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                        >
                            <option value="administrativos">
                                Administrativo (Consultas y CRUDS)
                            </option>
                            <option value="admin">
                                Administrador (Control Total)
                            </option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        Crear Usuario
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

function ModalInput({ label, value, onChange, error, type = 'text' }) {
    return (
        <div className="space-y-1">
            <InputLabel value={label} />
            <TextInput
                type={type}
                className="w-full"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <InputError message={error} />}
        </div>
    );
}

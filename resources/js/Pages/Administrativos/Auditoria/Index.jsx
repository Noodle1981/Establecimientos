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

export default function Index({ modalidades, stats, filters, options }) {
    const [selectedMod, setSelectedMod] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const handleFilterChange = (key, value) => {
        router.get(route('administrativos.auditoria.index'), { ...filters, [key]: value }, {
            preserveState: true, replace: true
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-black flex items-center gap-2">
                    <i className="fas fa-clipboard-check text-brand-orange"></i>
                    Panel de Auditoría y Validación
                </h2>
            }
        >
            <Head title="Auditoría" />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <KPICard label="Avance Global" value={`${stats.porcentajeAvance}%`} icon="fas fa-percentage" color="orange" />
                <KPICard label="Pendientes" value={stats.pendientes} icon="fas fa-clock" color="yellow" />
                <KPICard label="Correctos" value={stats.correctos} icon="fas fa-check-double" color="green" />
                <KPICard label="Corregidos" value={stats.corregidos} icon="fas fa-tools" color="blue" />
                <KPICard label="A Revisar" value={stats.revisar} icon="fas fa-exclamation-triangle" color="red" />
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
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                        <i className="fas fa-search absolute left-3.5 top-3.5 text-gray-300"></i>
                    </div>

                    <select 
                        className="w-full lg:w-48 border-gray-200 rounded-xl text-xs font-black uppercase text-gray-500"
                        value={filters.estado || ''}
                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                    >
                        <option value="">Todos los Estados</option>
                        <option value="PENDIENTE">Pendientes</option>
                        <option value="CORRECTO">Correctos</option>
                        <option value="CORREGIDO">Corregidos</option>
                        <option value="REVISAR">A Revisar</option>
                    </select>

                    <select 
                        className="w-full lg:w-48 border-gray-200 rounded-xl text-xs font-black uppercase text-gray-500"
                        value={filters.departamento || ''}
                        onChange={(e) => handleFilterChange('departamento', e.target.value)}
                    >
                        <option value="">Todos los Deptos</option>
                        {options.departamentos.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b">
                                    <th className="px-6 py-4">Establecimiento / CUE</th>
                                    <th className="px-6 py-4">Última Validación</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Observaciones</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {modalidades.data.map((mod) => (
                                    <tr key={mod.id} className="hover:bg-orange-50/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-900 leading-tight">{mod.establecimiento.nombre}</span>
                                                <span className="text-[9px] font-bold text-gray-400">CUE: {mod.establecimiento.cue}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-gray-700 uppercase">{mod.usuario_validacion?.name || 'Sistema'}</span>
                                                <span className="text-[9px] text-gray-400 font-bold">{mod.validado_en || 'S/D'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={mod.estado_validacion} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-[10px] text-gray-400 line-clamp-2 italic font-medium max-w-[200px]">
                                                {mod.observaciones || 'Sin observaciones registradas'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => { setSelectedMod(mod); setShowStatusModal(true); }}
                                                className="p-2.5 rounded-xl bg-orange-50 text-brand-orange hover:bg-brand-orange hover:text-white transition shadow-sm border border-orange-100"
                                            >
                                                <i className="fas fa-check-circle text-sm"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-center">
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
        orange: 'bg-orange-50 text-brand-orange border-orange-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        yellow: 'bg-yellow-50 text-yellow-500 border-yellow-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        red: 'bg-red-50 text-red-500 border-red-100',
    };
    return (
        <div className={`p-4 rounded-2xl border bg-white shadow-sm flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colors[color]}`}>
                <i className={icon}></i>
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-xl font-black text-gray-900 leading-none tracking-tight">{value}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        PENDIENTE: 'bg-yellow-50 text-yellow-600 border-yellow-100',
        CORRECTO: 'bg-green-50 text-green-700 border-green-100',
        CORREGIDO: 'bg-blue-50 text-blue-600 border-blue-100',
        REVISAR: 'bg-red-50 text-red-600 border-red-100',
        BAJA: 'bg-gray-50 text-gray-500 border-gray-100',
    };
    return (
        <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${config[status] || config.PENDIENTE}`}>
            {status || 'PENDIENTE'}
        </span>
    );
}

function StatusUpdateModal({ show, onClose, modalidad }) {
    if (!modalidad) return null;

    const { data, setData, patch, processing, errors } = useForm({
        estado: modalidad.estado_validacion || 'PENDIENTE',
        observaciones: modalidad.observaciones || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('administrativos.auditoria.updateEstado', modalidad.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="p-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center text-2xl shadow-sm border border-orange-100">
                        <i className="fas fa-tasks"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 leading-none">Validación de Datos</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">
                            {modalidad.establecimiento.nombre}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <InputLabel value="Nuevo Estado de Validación" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                        <div className="grid grid-cols-2 gap-2">
                            {['PENDIENTE', 'CORRECTO', 'CORREGIDO', 'REVISAR'].map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setData('estado', s)}
                                    className={`py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                        data.estado === s 
                                            ? 'border-brand-orange bg-orange-50 text-brand-orange' 
                                            : 'border-gray-100 text-gray-400 hover:border-orange-100'
                                    }`}
                                >
                                    {s === 'CORRECTO' && <i className="fas fa-check-circle mr-2 text-green-500"></i>}
                                    {s === 'REVISAR' && <i className="fas fa-exclamation-circle mr-2 text-red-500"></i>}
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Observaciones y Comentarios" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2" />
                        <textarea 
                            className="w-full h-32 rounded-xl border-gray-200 focus:border-brand-orange focus:ring-brand-orange text-sm font-medium"
                            placeholder="Escribe detalles sobre la validación o inconsistencias encontradas..."
                            value={data.observaciones}
                            onChange={e => setData('observaciones', e.target.value)}
                        ></textarea>
                        <InputError message={errors.observaciones} />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
                    <PrimaryButton className="px-10" disabled={processing}>
                        {processing ? 'Procesando...' : 'Aplicar Validación'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}


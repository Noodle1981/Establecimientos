import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';

export default function Index({ logs, filters }) {
    const handleSearch = (query) => {
        router.get(route('admin.logs.index'), { search: query }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-black flex items-center gap-2">
                    <i className="fas fa-history text-brand-orange"></i>
                    Audit Log: Registro de Cambios
                </h2>
            }
        >
            <Head title="Logs de Actividad" />

            <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl border border-orange-50 relative shadow-sm">
                    <input 
                        type="text"
                        placeholder="Buscar por descripción, acción..."
                        className="w-full pl-10 pr-4 py-2.5 border-gray-200 rounded-xl focus:border-brand-orange focus:ring-brand-orange text-sm font-medium"
                        defaultValue={filters?.search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <i className="fas fa-search absolute left-7 top-7 text-gray-300"></i>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] uppercase font-black text-gray-500 border-b">
                                    <th className="px-6 py-4">Usuario</th>
                                    <th className="px-6 py-4">Acción / Descripción</th>
                                    <th className="px-6 py-4">Modelo</th>
                                    <th className="px-6 py-4">Fecha / Hora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-[11px]">
                                {logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-orange-50/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[10px]">
                                                    {log.user?.name.charAt(0) || 'S'}
                                                </div>
                                                <span className="font-black text-gray-700">{log.user?.name || 'Sistema'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-600 max-w-sm truncate" title={log.description}>{log.description}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-brand-orange uppercase tracking-widest text-[9px]">
                                            {log.loggable_type?.split('\\').pop() || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 font-bold">
                                            {new Date(log.created_at).toLocaleString('es-AR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-center"><Pagination links={logs.links} /></div>
            </div>
        </AuthenticatedLayout>
    );
}


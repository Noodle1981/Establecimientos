import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';

export default function Index({ logs, filters }) {
    const handleSearch = (query) => {
        router.get(route('bitacora.index'), { search: query }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-black leading-tight text-gray-900 flex items-center gap-2">
                    <i className="fas fa-history text-brand-orange"></i>
                    Bitácora de Modificaciones
                </h2>
            }
        >
            <Head title="Bitácora" />

            <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-gray-900 leading-none">Historial de Cambios</h3>
                        <p className="text-gray-500 text-xs mt-1">Registro detallado de acciones CRUD (Creación, Edición y Borrado)</p>
                    </div>
                    <div className="relative w-80">
                        <input 
                            type="text"
                            placeholder="Buscar en la bitácora..."
                            className="w-full pl-10 pr-4 py-3 border-gray-200 rounded-2xl focus:border-brand-orange focus:ring-brand-orange text-sm font-medium shadow-sm transition-all"
                            defaultValue={filters?.search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-4 top-4 text-gray-300"></i>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-500 border-b">
                                    <th className="px-6 py-4">Usuario / Fecha</th>
                                    <th className="px-6 py-4">Acción / Descripción</th>
                                    <th className="px-6 py-4">Modelo</th>
                                    <th className="px-6 py-4 text-right">IP Origen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-[11px]">
                                {logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-orange-50/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center font-black text-sm shadow-sm">
                                                    {log.user?.name.charAt(0) || 'S'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 leading-tight">{log.user?.name || 'Sistema'}</span>
                                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                                                        {new Date(log.created_at).toLocaleString('es-AR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`w-fit px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                                    log.action?.includes('Creó') ? 'bg-green-50 text-green-700 border-green-100' :
                                                    log.action?.includes('Actualizó') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-gray-50 text-gray-600 border-gray-100'
                                                }`}>
                                                    {log.action || 'MOVIMIENTO'}
                                                </span>
                                                <p className="font-bold text-gray-600 max-w-sm" title={log.description}>{log.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-black text-brand-orange uppercase tracking-widest text-[9px]">
                                                    {log.model_type?.split('\\').pop() || 'Entidad'}
                                                </span>
                                                <span className="text-[9px] text-gray-300 font-bold">ID: {log.model_id || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-[10px] font-bold text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                                {log.ip_address || '0.0.0.0'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-center p-6 border-t bg-gray-50/30 rounded-b-2xl">
                    <Pagination links={logs.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


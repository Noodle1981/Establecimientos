import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ logs, filters }) {
    const handleSearch = (query) => {
        router.get(
            route('bitacora.index'),
            { search: query },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Bitácora" />

            <div className="space-y-6 pt-2">
                <div className="flex items-center justify-end rounded-2xl border border-orange-50 bg-white p-4 shadow-sm">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar en la bitácora..."
                            className="w-full rounded-xl border-gray-200 py-2.5 pl-10 pr-4 text-sm font-medium shadow-sm transition-all focus:border-brand-orange focus:ring-brand-orange"
                            defaultValue={filters?.search}
                            onChange={(e) => {
                                const val = e.target.value;
                                clearTimeout(window.searchTimeout);
                                window.searchTimeout = setTimeout(() => {
                                    handleSearch(val);
                                }, 300);
                            }}
                        />
                        <i className="fas fa-search absolute left-4 top-3 text-gray-300"></i>
                    </div>
                </div>

                <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-orange-600 bg-brand-orange text-[10px] font-black uppercase tracking-widest text-white">
                                    <th className="px-6 py-4">
                                        Usuario / Fecha
                                    </th>
                                    <th className="px-6 py-4">
                                        Acción / Descripción
                                    </th>
                                    <th className="px-6 py-4">Modelo</th>
                                    <th className="px-6 py-4 text-right">
                                        IP Origen
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-[11px]">
                                {logs.data.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="group transition-colors hover:bg-orange-50/5"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-sm font-black text-brand-orange shadow-sm">
                                                    {log.user?.name.charAt(0) ||
                                                        'S'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black leading-tight text-black">
                                                        {log.user?.name ||
                                                            'Sistema'}
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase tracking-tight text-black/50">
                                                        {new Date(
                                                            log.created_at,
                                                        ).toLocaleString(
                                                            'es-AR',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span
                                                    className={`w-fit rounded border px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                                                        log.action?.includes(
                                                            'Creó',
                                                        )
                                                            ? 'border-brand-orange/20 bg-orange-50 text-brand-orange'
                                                            : log.action?.includes(
                                                                    'Actualizó',
                                                                )
                                                              ? 'border-brand-yellow/30 bg-yellow-50 text-brand-orange'
                                                              : 'border-brand-red/20 bg-red-50 text-brand-red'
                                                    }`}
                                                >
                                                    {log.action || 'MOVIMIENTO'}
                                                </span>
                                                <p
                                                    className="max-w-sm font-black text-black/80"
                                                    title={log.description}
                                                >
                                                    {log.description}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-brand-orange">
                                                    {log.model_type
                                                        ?.split('\\')
                                                        .pop() || 'Entidad'}
                                                </span>
                                                <span className="text-[9px] font-bold text-gray-300">
                                                    ID: {log.model_id || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-1 font-mono text-[10px] font-bold text-gray-400">
                                                {log.ip_address || '0.0.0.0'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-center rounded-b-2xl border-t bg-gray-50/30 p-6">
                    <Pagination links={logs.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

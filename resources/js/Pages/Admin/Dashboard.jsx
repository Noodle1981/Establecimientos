import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats, recentActivity }) {
    return (
        <AuthenticatedLayout header={null}>
            <Head title="Admin Dashboard" />

            <div className="space-y-6 pt-2">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <StatCard
                        title="Usuarios Totales"
                        value={stats.users_total}
                        icon="fas fa-users"
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Administradores"
                        value={stats.users_admin}
                        icon="fas fa-user-shield"
                        color="bg-brand-orange"
                    />
                    <StatCard
                        title="Administrativos"
                        value={stats.users_administrativos}
                        icon="fas fa-user-tie"
                        color="bg-brand-yellow"
                        darkText={true}
                    />
                    <StatCard
                        title="Usuarios Básicos"
                        value={stats.users_user}
                        icon="fas fa-user"
                        color="bg-gray-500"
                    />
                    <StatCard
                        title="Nuevos (7d)"
                        value={stats.users_recent}
                        icon="fas fa-user-plus"
                        color="bg-green-500"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Recent Activity */}
                    <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-xl lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-6">
                            <h3 className="flex items-center gap-2 font-bold text-gray-800">
                                <i className="fas fa-history text-brand-orange"></i>
                                Actividad Reciente
                            </h3>
                            <button className="text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline">
                                Ver Todo
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-orange-600 bg-brand-orange text-[10px] font-black uppercase text-white">
                                        <th className="px-6 py-3">Usuario</th>
                                        <th className="px-6 py-3">Acción</th>
                                        <th className="px-6 py-3">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentActivity.map((activity) => (
                                        <tr
                                            key={activity.id}
                                            className="transition-colors hover:bg-gray-50/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-xs font-black text-brand-orange">
                                                        {activity.user?.name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-black text-black">
                                                        {activity.user?.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {activity.action}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-400">
                                                {new Date(
                                                    activity.created_at,
                                                ).toLocaleDateString('es-AR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Link Card */}
                    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-brand-orange p-6 text-white shadow-lg">
                        <i className="fas fa-school absolute -bottom-4 -right-4 rotate-12 text-9xl opacity-10"></i>
                        <div>
                            <h3 className="mb-2 text-xl font-bold">
                                Gestión de Establecimientos
                            </h3>
                            <p className="mb-6 text-sm font-medium text-white/80">
                                Accede rápidamente al listado completo para
                                editar o validar datos.
                            </p>
                        </div>
                        <button className="w-full rounded-xl bg-white py-3 font-bold text-brand-orange shadow-md transition hover:bg-orange-50">
                            Ir a Establecimientos
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon, color, darkText = false }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
                <div
                    className={`h-10 w-10 ${color} flex items-center justify-center rounded-xl ${darkText ? 'text-black' : 'text-white'} shadow-sm`}
                >
                    <i className={icon}></i>
                </div>
                <span className="text-3xl font-black text-black">{value}</span>
            </div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-black/40">
                {title}
            </h4>
        </div>
    );
}

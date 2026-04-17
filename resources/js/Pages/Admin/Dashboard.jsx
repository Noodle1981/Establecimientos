import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats, recentActivity }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-black flex items-center gap-2">
                    <i className="fas fa-chart-line text-brand-orange"></i>
                    Panel de Administración
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <i className="fas fa-history text-brand-orange"></i>
                                Actividad Reciente
                            </h3>
                            <button className="text-xs font-bold text-brand-orange hover:underline uppercase tracking-wider">Ver Todo</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b">
                                        <th className="px-6 py-3">Usuario</th>
                                        <th className="px-6 py-3">Acción</th>
                                        <th className="px-6 py-3">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentActivity.map((activity) => (
                                        <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-xs">
                                                        {activity.user?.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{activity.user?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {activity.action}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-400">
                                                {new Date(activity.created_at).toLocaleDateString('es-AR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Link Card */}
                    <div className="bg-brand-orange rounded-xl shadow-lg p-6 text-white flex flex-col justify-between relative overflow-hidden">
                        <i className="fas fa-school absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12"></i>
                        <div>
                            <h3 className="text-xl font-bold mb-2">Gestión de Establecimientos</h3>
                            <p className="text-sm text-white/80 mb-6 font-medium">Accede rápidamente al listado completo para editar o validar datos.</p>
                        </div>
                        <button className="w-full bg-white text-brand-orange font-bold py-3 rounded-xl hover:bg-orange-50 transition shadow-md">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                    <i className={icon}></i>
                </div>
                <span className="text-3xl font-black text-gray-900">{value}</span>
            </div>
            <h4 className="text-[11px] uppercase font-black tracking-widest text-gray-400">{title}</h4>
        </div>
    );
}

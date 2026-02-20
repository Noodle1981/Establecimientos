<div class="min-h-screen bg-white">
    <!-- HEADER ESTRATÉGICO -->
    <div class="px-4 sm:px-6 lg:px-8 py-8 mb-8">
        <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in">
            <div>
                <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 text-primary-orange">
                    <i class="fas fa-university"></i>
                    <span>Ministerio de Educación</span>
                    <span>•</span>
                    <span>Administración Central</span>
                </nav>
                <div class="flex items-center gap-3">
                    <div class="p-3 rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
                        <i class="fas fa-chart-line fa-2x text-primary-orange"></i>
                    </div>
                    <div>
                        <h2 class="text-3xl font-black tracking-tight text-black leading-tight">
                            Panel <span class="text-primary-orange">Administrativo</span>
                        </h2>
                        <p class="text-sm text-gray-500 font-medium">Control operativo y gestión de usuarios del sistema</p>
                    </div>
                </div>
            </div>
            
            <div class="flex flex-wrap gap-3 glass p-2 rounded-xl border border-orange-100/50 shadow-sm">
                <div class="px-4 py-2 bg-white rounded-lg border border-orange-100 flex items-center gap-3">
                    <span class="text-xs font-bold text-gray-500 uppercase">Estado Sistema:</span>
                    <span class="flex items-center gap-1.5 text-xs font-black text-green-600">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        ACTIVO
                    </span>
                </div>
            </div>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <!-- Total Users -->
            <div class="glass-strong rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-orange-500/5 transition-all">
                <div class="relative z-10">
                    <div class="flex items-center justify-between mb-4">
                        <div class="p-2 rounded-lg bg-orange-50 text-primary-orange">
                            <i class="fas fa-users"></i>
                        </div>
                        <span class="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                             +{{ $stats['users_recent'] }} New
                        </span>
                    </div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Usuarios</p>
                    <h3 class="text-4xl font-black text-black tracking-tight">{{ $stats['users_total'] }}</h3>
                </div>
                <div class="absolute right-[-10px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-110 transition-all text-primary-orange">
                    <i class="fas fa-users-cog fa-8x"></i>
                </div>
            </div>

            <!-- Admins -->
            <div class="glass-strong rounded-2xl p-6 relative group hover:shadow-xl transition-all border border-orange-100/30">
                <div class="flex items-center justify-between mb-4">
                    <div class="p-2 rounded-lg bg-red-50 text-red-600">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <span class="px-2 py-1 bg-red-100 text-red-800 text-[10px] rounded-full font-black uppercase tracking-tighter">Privilegiado</span>
                </div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Administradores</p>
                <h3 class="text-3xl font-black text-black tracking-tight">{{ $stats['users_admin'] }}</h3>
            </div>

            <!-- Administrativos -->
            <div class="glass-strong rounded-2xl p-6 relative group hover:shadow-xl transition-all border border-orange-100/30">
                <div class="flex items-center justify-between mb-4">
                    <div class="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <i class="fas fa-user-edit"></i>
                    </div>
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] rounded-full font-black uppercase tracking-tighter">Gestión</span>
                </div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Administrativos</p>
                <h3 class="text-3xl font-black text-black tracking-tight">{{ $stats['users_administrativos'] }}</h3>
            </div>

            <!-- Standard Users -->
            <div class="glass-strong rounded-2xl p-6 relative group hover:shadow-xl transition-all border border-orange-100/30">
                <div class="flex items-center justify-between mb-4">
                    <div class="p-2 rounded-lg bg-gray-50 text-gray-600">
                        <i class="fas fa-user"></i>
                    </div>
                    <span class="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] rounded-full font-black uppercase tracking-tighter">Estándar</span>
                </div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Usuarios</p>
                <h3 class="text-3xl font-black text-black tracking-tight">{{ $stats['users_user'] }}</h3>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Actions -->
            <div class="lg:col-span-2 space-y-6">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-1 h-6 bg-primary-orange rounded-full"></div>
                    <h2 class="text-xl font-black text-gray-900 tracking-tight uppercase text-sm italic">Acciones Estratégicas</h2>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <a href="{{ route('admin.users') }}" class="glass-strong p-8 rounded-3xl hover:shadow-2xl hover:shadow-orange-500/10 transition-all group border border-orange-100/30 relative overflow-hidden">
                        <div class="relative z-10 flex flex-col h-full">
                            <div class="w-14 h-14 bg-orange-50 text-primary-orange rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-orange group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
                                <i class="fas fa-users-cog fa-2x"></i>
                            </div>
                            <h3 class="text-xl font-black text-gray-900 mb-2 group-hover:text-primary-orange transition-colors">Gestión de Usuarios</h3>
                            <p class="text-sm text-gray-500 font-medium leading-relaxed">Administración profunda de cuentas, roles y permisos del ecosistema.</p>
                            <div class="mt-8 flex items-center gap-2 text-primary-orange font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                <span>Acceder</span>
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>
                        <!-- Abstract Background Detail -->
                        <div class="absolute top-[-20%] right-[-10%] w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
                    </a>

                    <a href="{{ route('admin.activity-log') }}" class="glass-strong p-8 rounded-3xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all group border border-orange-100/30 relative overflow-hidden">
                        <div class="relative z-10 flex flex-col h-full">
                            <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
                                <i class="fas fa-history fa-2x"></i>
                            </div>
                            <h3 class="text-xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Bitácora Global</h3>
                            <p class="text-sm text-gray-500 font-medium leading-relaxed">Auditoría centralizada de todas las modificaciones críticas del sistema.</p>
                            <div class="mt-8 flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                <span>Ver Historial</span>
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>
                        <div class="absolute top-[-20%] right-[-10%] w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                    </a>
                </div>
            </div>

            <!-- Recent Activity Widget -->
            <div class="glass-strong rounded-3xl p-8 border border-orange-100/30 shadow-lg relative overflow-hidden">
                <div class="relative z-10">
                    <div class="flex items-center justify-between mb-8 pb-4 border-b border-orange-100/50">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary-orange">
                                <i class="fas fa-bell"></i>
                            </div>
                            <h2 class="text-lg font-black text-gray-900 tracking-tight uppercase italic">Eventos</h2>
                        </div>
                        <a href="{{ route('admin.activity-log') }}" class="text-[10px] font-black uppercase tracking-widest text-primary-orange hover:text-orange-700 transition-colors bg-orange-50 px-3 py-1 rounded-full">Ver todo</a>
                    </div>

                    <div class="space-y-8">
                        @forelse($recentActivity as $log)
                            <div class="flex gap-4 group cursor-default">
                                <div class="flex-shrink-0">
                                    <div class="w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shadow-sm transform group-hover:scale-110 transition-all
                                        @if($log->action === 'create') bg-green-50 text-green-600 border border-green-100
                                        @elseif($log->action === 'update') bg-blue-50 text-blue-600 border border-blue-100
                                        @elseif($log->action === 'delete') bg-red-50 text-red-600 border border-red-100
                                        @else bg-gray-50 text-gray-600 border border-gray-100
                                        @endif">
                                        {{ strtoupper(substr($log->action, 0, 1)) }}
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-gray-900 font-bold leading-tight group-hover:text-primary-orange transition-colors">{{ $log->description }}</p>
                                    <div class="flex items-center gap-2 mt-1.5 font-bold uppercase tracking-tighter italic">
                                        <span class="text-[10px] text-gray-400">{{ $log->user->name ?? 'Sistema' }}</span>
                                        <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
                                        <span class="text-[10px] text-primary-orange lg:opacity-70">{{ $log->created_at->diffForHumans() }}</span>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="flex flex-col items-center justify-center py-20 text-gray-300">
                                <i class="fas fa-stream fa-3x mb-4 opacity-20"></i>
                                <p class="text-xs font-black uppercase tracking-widest">Sin actividad reciente</p>
                            </div>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

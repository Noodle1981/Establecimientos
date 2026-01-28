<div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header -->
        <div class="mb-10">
            <h1 class="text-4xl font-bold text-black mb-2">Panel de Administración</h1>
            <p class="text-gray-600">Visión general del sistema y gestión</p>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <!-- Total Users -->
            <div class="glass rounded-2xl p-6 relative overflow-hidden">
                <div class="relative z-10">
                    <p class="text-sm font-medium text-gray-500 mb-1">Total Usuarios</p>
                    <h3 class="text-3xl font-bold text-black">{{ $stats['users_total'] }}</h3>
                    <p class="text-xs text-green-600 mt-2 font-medium">
                        +{{ $stats['users_recent'] }} en los últimos 7 días
                    </p>
                </div>
                <div class="absolute right-[-10px] top-[-10px] opacity-5">
                    <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                </div>
            </div>

            <!-- Admins -->
            <div class="glass rounded-2xl p-6">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-500">Administradores</p>
                    <span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-bold">Privilegiado</span>
                </div>
                <h3 class="text-2xl font-bold text-black">{{ $stats['users_admin'] }}</h3>
            </div>

            <!-- Administrativos -->
            <div class="glass rounded-2xl p-6">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-500">Administrativos</p>
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-bold">Gestión</span>
                </div>
                <h3 class="text-2xl font-bold text-black">{{ $stats['users_administrativos'] }}</h3>
            </div>

            <!-- Standard Users -->
            <div class="glass rounded-2xl p-6">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-500">Usuarios</p>
                    <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-bold">Estándar</span>
                </div>
                <h3 class="text-2xl font-bold text-black">{{ $stats['users_user'] }}</h3>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Actions -->
            <div class="lg:col-span-2 space-y-6">
                <h2 class="text-xl font-bold text-black">Acciones Rápidas</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="{{ route('admin.users') }}" class="glass p-6 rounded-2xl hover:shadow-lg transition group border border-gray-100">
                        <div class="flex items-start justify-between">
                            <div>
                                <h3 class="font-bold text-lg mb-1 group-hover:text-orange-600 transition">Gestionar Usuarios</h3>
                                <p class="text-sm text-gray-500">Crear, editar y eliminar usuarios del sistema.</p>
                            </div>
                            <div class="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100 transition">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                        </div>
                    </a>

                    <a href="{{ route('admin.activity-log') }}" class="glass p-6 rounded-2xl hover:shadow-lg transition group border border-gray-100">
                        <div class="flex items-start justify-between">
                            <div>
                                <h3 class="font-bold text-lg mb-1 group-hover:text-blue-600 transition">Registro de Actividad</h3>
                                <p class="text-sm text-gray-500">Auditar cambios y acciones en el sistema.</p>
                            </div>
                            <div class="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Recent Activity Widget -->
            <div class="glass rounded-2xl p-6 h-full">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-black">Actividad Reciente</h2>
                    <a href="{{ route('admin.activity-log') }}" class="text-sm text-orange-600 hover:text-orange-700 font-medium">Ver todo</a>
                </div>

                <div class="space-y-6">
                    @forelse($recentActivity as $log)
                        <div class="flex gap-4">
                            <div class="flex-shrink-0 mt-1">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                    @if($log->action === 'create') bg-green-100 text-green-700
                                    @elseif($log->action === 'update') bg-blue-100 text-blue-700
                                    @elseif($log->action === 'delete') bg-red-100 text-red-700
                                    @else bg-gray-100 text-gray-700
                                    @endif">
                                    {{ strtoupper(substr($log->action, 0, 1)) }}
                                </div>
                            </div>
                            <div>
                                <p class="text-sm text-black font-medium">{{ $log->description }}</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="text-xs text-gray-500">{{ $log->user->name ?? 'Usuario Sistema' }}</span>
                                    <span class="text-xs text-gray-300">•</span>
                                    <span class="text-xs text-gray-400">{{ $log->created_at->diffForHumans() }}</span>
                                </div>
                            </div>
                        </div>
                    @empty
                        <div class="text-center py-10 text-gray-400">
                            <p class="text-sm">No hay actividad reciente</p>
                        </div>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</div>

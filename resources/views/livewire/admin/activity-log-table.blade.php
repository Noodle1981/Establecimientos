<div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-black mb-2">Registro de Actividad</h1>
            <p class="text-gray-600">Historial de cambios y acciones realizadas por usuarios administrativos</p>
        </div>

        <!-- Filtros -->
        <div class="glass rounded-2xl p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Search -->
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Buscar</label>
                    <input type="text" 
                           wire:model.live.debounce.300ms="search"
                           placeholder="Descripción..."
                           class="input-primary w-full text-sm">
                </div>

                <!-- User Filter -->
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Usuario</label>
                    <select wire:model.live="userFilter" class="input-primary w-full text-sm">
                        <option value="">Todos los usuarios</option>
                        @foreach($users as $user)
                            <option value="{{ $user->id }}">{{ $user->name }}</option>
                        @endforeach
                    </select>
                </div>

                <!-- Action Filter -->
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Acción</label>
                    <select wire:model.live="actionFilter" class="input-primary w-full text-sm">
                        <option value="">Todas las acciones</option>
                        <option value="create">Creación</option>
                        <option value="update">Actualización</option>
                        <option value="delete">Eliminación</option>
                    </select>
                </div>

                <!-- Date Range -->
                <div class="flex gap-2">
                    <div class="flex-1">
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Desde</label>
                        <input type="date" wire:model.live="dateFrom" class="input-primary w-full text-sm">
                    </div>
                    <div class="flex-1">
                        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Hasta</label>
                        <input type="date" wire:model.live="dateTo" class="input-primary w-full text-sm">
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabla -->
        <div class="glass rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead style="background-color: rgba(255, 130, 0, 0.05);">
                        <tr>
                            <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Fecha</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Usuario</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Acción</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Descripción</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Detalles</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                        @forelse($logs as $log)
                            <tr class="hover:bg-orange-50 transition" x-data="{ expanded: false }">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-black">
                                        {{ $log->created_at->format('d/m/Y H:i') }}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {{ $log->created_at->diffForHumans() }}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                                            {{ substr($log->user->name ?? '?', 0, 2) }}
                                        </div>
                                        <div class="ml-3">
                                            <div class="text-sm font-medium text-black">{{ $log->user->name ?? 'Usuario Eliminado' }}</div>
                                            <div class="text-xs text-gray-500">{{ $log->user->role ?? '-' }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                        @if($log->action === 'create') bg-green-100 text-green-800
                                        @elseif($log->action === 'update') bg-blue-100 text-blue-800
                                        @elseif($log->action === 'delete') bg-red-100 text-red-800
                                        @else bg-gray-100 text-gray-800
                                        @endif">
                                        {{ strtoupper($log->action) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-sm text-gray-900">{{ $log->description }}</div>
                                    <div class="text-xs text-gray-500 font-mono mt-1">{{ class_basename($log->model_type) }} #{{ $log->model_id }}</div>
                                </td>
                                <td class="px-6 py-4">
                                    @if($log->changes)
                                        <button @click="expanded = !expanded" 
                                                class="text-xs text-blue-600 hover:text-blue-800 font-medium underline">
                                            <span x-show="!expanded">Ver cambios</span>
                                            <span x-show="expanded">Ocultar</span>
                                        </button>
                                        
                                        <div x-show="expanded" x-transition class="mt-2 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
                                            <pre>{{ json_encode($log->changes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre>
                                        </div>
                                    @else
                                        <span class="text-xs text-gray-400">-</span>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                                    No hay registros de actividad que coincidan con los filtros.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-6">
            {{ $logs->links() }}
        </div>
    </div>
</div>

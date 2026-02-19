<div>
    <!-- HEADER ESTRATÉGICO -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in">
        <div>
            <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 text-primary-orange">
                <i class="fas fa-university"></i>
                <span>Ministerio de Educación</span>
                <span>•</span>
                <span>Auditoría de Actividad</span>
            </nav>
            <div class="flex items-center gap-3">
                <div class="p-3 rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
                    <i class="fas fa-history fa-2x text-primary-orange"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-black tracking-tight text-black">
                        Bitácora de <span class="text-primary-orange">Cambios</span>
                    </h2>
                    <p class="text-sm text-gray-500 font-medium">Historial detallado de modificaciones y acciones en el sistema</p>
                </div>
            </div>
        </div>
    </div>

    <!-- FLASH MESSAGES -->
    <div class="mb-4">
        <x-toast-notifications />
    </div>

    <!-- FILTROS AVANZADOS -->
    <div class="mb-8 glass-strong rounded-xl overflow-hidden shadow-lg" x-data="{ filtersOpen: true }">
        <div class="px-6 py-4 flex justify-between items-center bg-orange-50/50 border-b border-orange-100">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg shadow-sm text-primary-orange">
                    <i class="fas fa-filter"></i>
                </div>
                <h3 class="font-bold text-gray-800">Filtros de Búsqueda</h3>
            </div>
            <button @click="filtersOpen = !filtersOpen" class="text-gray-400 hover:text-primary-orange transition-colors">
                <i class="fas fa-chevron-down transform transition duration-300" :class="filtersOpen ? 'rotate-180' : ''"></i>
            </button>
        </div>

        <div x-show="filtersOpen" x-collapse class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- Search -->
                <div class="md:col-span-2">
                    <label class="block text-xs font-bold uppercase mb-2 ml-1 text-gray-500">Buscar en Descripción</label>
                    <div class="relative">
                        <input type="text" 
                               wire:model.live.debounce.300ms="search"
                               placeholder="Ej: Modificación de escuela..."
                               class="input-glass w-full pl-10 pr-4 py-2.5 rounded-lg transition-all focus:ring-2 focus:ring-orange-500/20">
                        <i class="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
                    </div>
                </div>

                <!-- User Filter (Admin only) -->
                @if(!auth()->user()->isAdministrativo())
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1 text-gray-500">Usuario</label>
                    <select wire:model.live="userFilter" class="input-glass w-full py-2.5 rounded-lg">
                        <option value="">Todos los usuarios</option>
                        @foreach($users as $user)
                            <option value="{{ $user->id }}">{{ $user->name }}</option>
                        @endforeach
                    </select>
                </div>
                @endif

                <!-- Action Filter -->
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1 text-gray-500">Acción</label>
                    <select wire:model.live="actionFilter" class="input-glass w-full py-2.5 rounded-lg">
                        <option value="">Todas</option>
                        <option value="create">Creación</option>
                        <option value="update">Actualización</option>
                        <option value="delete">Eliminación</option>
                    </select>
                </div>

                <!-- Date Range -->
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1 text-gray-500">Desde</label>
                    <input type="date" wire:model.live="dateFrom" class="input-glass w-full py-2.5 rounded-lg">
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1 text-gray-500">Hasta</label>
                    <input type="date" wire:model.live="dateTo" class="input-glass w-full py-2.5 rounded-lg">
                </div>
            </div>
        </div>
    </div>

    <!-- TABLA DE RESULTADOS -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-primary-orange text-white">
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Fecha</th>
                        @if(!auth()->user()->isAdministrativo())
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Usuario</th>
                        @endif
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Acción</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Descripción</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Detalles</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    @forelse($logs as $log)
                        <tr class="group hover:bg-orange-50/30 transition-colors duration-200" x-data="{ expanded: false }">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm font-bold text-gray-800 bg-gray-50 px-2 py-1 rounded border border-gray-200 font-mono">
                                    {{ $log->created_at->format('d/m/Y H:i') }}
                                </span>
                            </td>
                            @if(!auth()->user()->isAdministrativo())
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm bg-primary-orange">
                                        {{ substr($log->user->name ?? '?', 0, 1) }}
                                    </div>
                                    <div class="ml-3">
                                        <div class="text-sm font-bold text-gray-900">{{ $log->user->name ?? 'Usuario Eliminado' }}</div>
                                        <div class="text-[10px] text-gray-500 uppercase tracking-wide">{{ $log->user->role ?? '-' }}</div>
                                    </div>
                                </div>
                            </td>
                            @endif
                            <td class="px-6 py-4">
                                @php
                                    $actionClasses = [
                                        'create' => 'bg-green-100 text-green-800 border-green-200',
                                        'update' => 'bg-blue-100 text-blue-800 border-blue-200',
                                        'delete' => 'bg-red-100 text-red-800 border-red-200',
                                    ];
                                    $class = $actionClasses[$log->action] ?? 'bg-gray-100 text-gray-800 border-gray-200';
                                @endphp
                                <span class="px-2 py-1 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full border {{ $class }}">
                                    {{ strtoupper($log->action) }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">{{ $log->description }}</div>
                                
                                @if($log->model_type === 'App\Models\Modalidad' && $log->model)
                                    <div class="mt-1 text-xs text-gray-600 flex flex-col pl-2 border-l-2 border-primary-orange">
                                        <span class="font-bold text-primary-orange">{{ $log->model->establecimiento->nombre ?? 'Establecimiento desconocido' }}</span>
                                        <span>{{ $log->model->direccion_area }} • {{ $log->model->nivel_educativo }}</span>
                                    </div>
                                @elseif($log->model_type === 'App\Models\Establecimiento' && $log->model)
                                    <div class="mt-1 text-xs text-gray-600 pl-2 border-l-2 border-primary-orange">
                                        <span class="font-bold text-primary-orange">{{ $log->model->nombre }}</span>
                                    </div>
                                @elseif($log->model_type === 'App\Models\Edificio' && $log->model)
                                    <div class="mt-1 text-xs text-gray-600 pl-2 border-l-2 border-primary-orange">
                                        <span>Edificio de: </span>
                                        <span class="font-bold text-primary-orange">{{ $log->model->establecimientos->first()->nombre ?? 'Sin establecimiento' }}</span>
                                    </div>
                                @else
                                    <div class="text-[10px] text-gray-500 font-mono mt-1 bg-gray-50 inline-block px-1 rounded border border-gray-200">{{ class_basename($log->model_type) }} #{{ $log->model_id }}</div>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                @if(is_array($log->changes) && isset($log->changes['after']))
                                    <button @click="expanded = !expanded" 
                                            class="text-xs font-bold text-gray-400 hover:text-primary-orange transition-colors flex items-center gap-1">
                                        <span x-show="!expanded">Ver cambios</span>
                                        <span x-show="expanded">Ocultar</span>
                                        <i class="fas fa-chevron-down text-[10px] transition-transform duration-300" :class="expanded ? 'rotate-180' : ''"></i>
                                    </button>
                                    
                                    <div x-show="expanded" x-collapse class="mt-2 text-xs p-3 rounded-lg border border-gray-100 shadow-inner bg-gray-50/50 space-y-2">
                                        @foreach($log->changes['after'] as $key => $newValue)
                                            @if($key === 'validado') @continue @endif
                                            @php
                                                $oldValue = $log->changes['before'][$key] ?? '-';
                                                $friendlyKey = match($key) {
                                                    'nombre' => 'Nombre',
                                                    'categoria' => 'Categoría',
                                                    'radio' => 'Radio',
                                                    'zona' => 'Zona',
                                                    'zona_departamento' => 'Departamento',
                                                    'nivel_educativo' => 'Nivel',
                                                    'ambito' => 'Ámbito',
                                                    'sector' => 'Sector',
                                                    'calle' => 'Calle',
                                                    'numero_puerta' => 'Número',
                                                    'localidad' => 'Localidad',
                                                    default => ucfirst($key),
                                                };
                                                
                                                if(is_bool($newValue)) $newValue = $newValue ? 'Sí' : 'No';
                                                if(is_bool($oldValue)) $oldValue = $oldValue ? 'Sí' : 'No';
                                            @endphp
                                            
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 border-b border-gray-200/50 last:border-0 pb-1 last:pb-0">
                                                <span class="font-bold text-gray-600 min-w-[80px]">{{ $friendlyKey }}:</span>
                                                <div class="flex items-center gap-2 font-mono text-gray-600">
                                                    <span class="line-through text-red-400 opacity-70">{{ $oldValue }}</span>
                                                    <i class="fas fa-arrow-right text-[10px] text-gray-300"></i>
                                                    <span class="font-bold text-green-600">{{ $newValue }}</span>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif($log->changes)
                                    <button @click="expanded = !expanded" class="text-xs font-bold text-gray-400 hover:text-primary-orange underline decoration-dotted">Datos Raw</button>
                                    <div x-show="expanded" class="mt-2 text-[10px] bg-gray-800 text-gray-200 p-2 rounded overflow-auto max-w-xs"><pre>{{ json_encode($log->changes, JSON_PRETTY_PRINT) }}</pre></div>
                                @else
                                    <span class="text-xs text-gray-300 italic">Sin detalles</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center justify-center">
                                    <div class="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                                        <i class="fas fa-search fa-2x text-primary-orange/50"></i>
                                    </div>
                                    <h3 class="text-lg font-bold text-gray-900">No hay actividad registrada</h3>
                                    <p class="text-gray-500 text-sm">Prueba ajustando los filtros de búsqueda</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            {{ $logs->links() }}
        </div>
    </div>
</div>

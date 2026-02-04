<div>
    <!-- HEADER ESTRATÉGICO -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2" style="color: #FE8204;">
                <i class="fas fa-university"></i>
                <span>Ministerio de Educación</span>
                <span>•</span>
                <span>Auditoría de Actividad</span>
            </nav>
            <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg" style="background-color: rgba(254, 130, 4, 0.1);">
                    <i class="fas fa-history fa-2x" style="color: #FE8204;"></i>
                </div>
                <h2 class="text-4xl font-extrabold tracking-tight" style="color: #000000;">Bitácora de Cambios</h2>
            </div>
            <p class="mt-1 ml-14" style="color: #000000;">Historial detallado de modificaciones y acciones en el sistema.</p>
        </div>
    </div>

    <!-- FILTROS AVANZADOS -->
    <div class="mb-8 bg-white rounded-lg overflow-hidden" style="border: 1px solid #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);" x-data="{ filtersOpen: true }">
        <div class="px-6 py-4 flex justify-between items-center" style="background-color: #FE8204; border-bottom: 1px solid #FADC3C;">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg">
                    <i class="fas fa-search" style="color: #FE8204;"></i>
                </div>
                <h3 class="font-bold text-white">Filtros de Búsqueda</h3>
            </div>
            <button @click="filtersOpen = !filtersOpen" class="text-white hover:text-yellow-200 transition">
                <i class="fas fa-chevron-down transform transition" :class="filtersOpen ? 'rotate-180' : ''"></i>
            </button>
        </div>

        <div x-show="filtersOpen" x-transition class="p-6 space-y-6 bg-white">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- Search -->
                <div class="md:col-span-2">
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Buscar en Descripción</label>
                    <div class="relative">
                        <input type="text" 
                               wire:model.live.debounce.300ms="search"
                               placeholder="Ej: Modificación de escuela..."
                               class="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg transition"
                               style="border: 1px solid #FE8204; color: #000000;"
                               onfocus="this.style.borderColor='#FE8204'; this.style.boxShadow='0 0 0 3px rgba(254, 130, 4, 0.1)'"
                               onblur="this.style.boxShadow='none'">
                        <i class="fas fa-search absolute left-3 top-3.5" style="color: #FE8204;"></i>
                    </div>
                </div>

                <!-- User Filter (Admin only) -->
                @if(!auth()->user()->isAdministrativo())
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Usuario</label>
                    <select wire:model.live="userFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todos los usuarios</option>
                        @foreach($users as $user)
                            <option value="{{ $user->id }}">{{ $user->name }}</option>
                        @endforeach
                    </select>
                </div>
                @endif

                <!-- Action Filter -->
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Acción</label>
                    <select wire:model.live="actionFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todas</option>
                        <option value="create">Creación</option>
                        <option value="update">Actualización</option>
                        <option value="delete">Eliminación</option>
                    </select>
                </div>

                <!-- Date Range -->
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Desde</label>
                    <input type="date" wire:model.live="dateFrom" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Hasta</label>
                    <input type="date" wire:model.live="dateTo" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                </div>
            </div>
        </div>
    </div>

    <!-- TABLA DE RESULTADOS -->
    <div class="bg-white rounded-lg overflow-hidden" style="border: 1px solid #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);">
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead>
                    <tr style="background-color: #FE8204;">
                        <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Fecha</th>
                        @if(!auth()->user()->isAdministrativo())
                        <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Usuario</th>
                        @endif
                        <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Acción</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Descripción</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Detalles</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y" style="border-color: #FADC3C;">
                    @forelse($logs as $log)
                        <tr class="hover:bg-orange-50 transition" x-data="{ expanded: false }"
                            onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.05)'"
                            onmouseout="this.style.backgroundColor='#FFFFFF'">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-bold text-black">
                                    {{ $log->created_at->format('d/m/Y') }}
                                </div>
                            </td>
                            @if(!auth()->user()->isAdministrativo())
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm" style="background-color: #FE8204;">
                                        {{ substr($log->user->name ?? '?', 0, 1) }}
                                    </div>
                                    <div class="ml-3">
                                        <div class="text-sm font-bold text-black">{{ $log->user->name ?? 'Usuario Eliminado' }}</div>
                                        <div class="text-xs text-gray-500">{{ $log->user->role ?? '-' }}</div>
                                    </div>
                                </div>
                            </td>
                            @endif
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full border shadow-sm"
                                    @if($log->action === 'create') style="background-color: #DCFCE7; color: #166534; border-color: #166534;"
                                    @elseif($log->action === 'update') style="background-color: #DBEAFE; color: #1E40AF; border-color: #1E40AF;"
                                    @elseif($log->action === 'delete') style="background-color: #FEE2E2; color: #991B1B; border-color: #991B1B;"
                                    @else style="background-color: #F3F4F6; color: #374151; border-color: #374151;"
                                    @endif>
                                    {{ strtoupper($log->action) }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-black">{{ $log->description }}</div>
                                
                                @if($log->model_type === 'App\Models\Modalidad' && $log->model)
                                    <div class="mt-1 text-xs text-gray-600 flex flex-col">
                                        <span class="font-bold text-orange-600">{{ $log->model->establecimiento->nombre ?? 'Establecimiento desconocido' }}</span>
                                        <span>{{ $log->model->direccion_area }} • {{ $log->model->nivel_educativo }}</span>
                                    </div>
                                @elseif($log->model_type === 'App\Models\Establecimiento' && $log->model)
                                    <div class="mt-1 text-xs text-gray-600">
                                        <span class="font-bold text-orange-600">{{ $log->model->nombre }}</span>
                                    </div>
                                @elseif($log->model_type === 'App\Models\Edificio' && $log->model)
                                    <div class="mt-1 text-xs text-gray-600">
                                        <span>Edificio de: </span>
                                        <span class="font-bold text-orange-600">{{ $log->model->establecimientos->first()->nombre ?? 'Sin establecimiento' }}</span>
                                    </div>
                                @else
                                    <div class="text-xs text-gray-500 font-mono mt-1 bg-gray-100 inline-block px-1 rounded">{{ class_basename($log->model_type) }} #{{ $log->model_id }}</div>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                @if(is_array($log->changes) && isset($log->changes['after']))
                                    <button @click="expanded = !expanded" 
                                            class="text-xs font-bold underline transition"
                                            style="color: #FE8204;"
                                            onmouseover="this.style.color='#E57303'"
                                            onmouseout="this.style.color='#FE8204'">
                                        <span x-show="!expanded">Ver detalles</span>
                                        <span x-show="expanded">Ocultar</span>
                                    </button>
                                    
                                    <div x-show="expanded" x-transition class="mt-2 text-xs p-3 rounded-lg border shadow-inner space-y-2" style="background-color: #FAFAFA; border-color: #E5E7EB;">
                                        @foreach($log->changes['after'] as $key => $newValue)
                                            @if($key === 'validado') @continue @endif
                                            @php
                                                $oldValue = $log->changes['before'][$key] ?? '-';
                                                // Mapeo básico de nombres de campos
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
                                                
                                                // Formateo de booleanos
                                                if(is_bool($newValue)) $newValue = $newValue ? 'Sí' : 'No';
                                                if(is_bool($oldValue)) $oldValue = $oldValue ? 'Sí' : 'No';
                                            @endphp
                                            
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                                                <span class="font-bold text-gray-700 min-w-[80px]">{{ $friendlyKey }}:</span>
                                                <div class="flex items-center gap-2 font-mono text-gray-600">
                                                    <span class="line-through text-red-400">{{ $oldValue }}</span>
                                                    <i class="fas fa-arrow-right text-[10px] text-gray-400"></i>
                                                    <span class="font-bold text-green-600">{{ $newValue }}</span>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif($log->changes)
                                    <!-- Fallback para logs antiguos o sin estructura standard -->
                                    <button @click="expanded = !expanded" class="text-xs font-bold underline text-gray-400">JSON</button>
                                    <div x-show="expanded" class="mt-2 text-xs"><pre>{{ json_encode($log->changes) }}</pre></div>
                                @else
                                    <span class="text-xs text-gray-400">-</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                                <i class="fas fa-search fa-3x mb-3 text-gray-300"></i>
                                <p class="text-lg font-medium">No se encontraron registros de actividad.</p>
                                <p class="text-sm">Prueba ajustando los filtros de búsqueda.</p>
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

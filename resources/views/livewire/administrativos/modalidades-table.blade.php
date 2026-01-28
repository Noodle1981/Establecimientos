<div>
    <!-- 1. HEADER ESTRATÉGICO -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <nav class="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">
                <span class="opacity-60">Ministerio de Educación</span>
                <span>•</span>
                <span>Auditoría de Establecimientos</span>
            </nav>
            <h2 class="text-4xl font-extrabold text-slate-900 tracking-tight">Gestión de Establecimientos</h2>
            <p class="text-slate-500 mt-1">Control y comparación de datos entre Direcciones de Área y Plataforma de Gestión.</p>
        </div>
        
        <div class="flex gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            @can('create', App\Models\Modalidad::class)
                <button wire:click="openCreateModal" 
                        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold transition hover:bg-orange-600 shadow-md">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Nuevo Establecimiento
                </button>
            @endcan
            <button wire:click="$toggle('showDeleted')" 
                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold transition hover:bg-slate-50">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                {{ $showDeleted ? 'Ver Activos' : 'Ver Eliminados' }}
            </button>
        </div>
    </div>

    <!-- 2. TARJETAS DE ESTADO (KPIs) - Esto impresiona a los jefes -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="glass p-5 rounded-2xl border-l-4 border-orange-500 shadow-sm">
            <p class="text-slate-500 text-sm font-medium">Total Unidades</p>
            <h4 class="text-2xl font-bold text-slate-900">{{ $modalidades->total() }}</h4>
        </div>
        <div class="glass p-5 rounded-2xl border-l-4 border-blue-500 shadow-sm">
            <p class="text-slate-500 text-sm font-medium">Ámbito Público</p>
            <h4 class="text-2xl font-bold text-slate-900">{{ $modalidades->where('ambito', 'PUBLICO')->count() }}</h4>
        </div>
        <div class="glass p-5 rounded-2xl border-l-4 border-yellow-500 shadow-sm">
            <p class="text-slate-500 text-sm font-medium">Pendientes Validación</p>
            <h4 class="text-2xl font-bold text-slate-900">12 <!-- Dato estático de ejemplo --></h4>
        </div>
        <div class="glass p-5 rounded-2xl border-l-4 border-red-500 shadow-sm">
            <p class="text-slate-500 text-sm font-medium">Discrepancias</p>
            <h4 class="text-2xl font-bold text-slate-900">4 <!-- Dato estático de ejemplo --></h4>
        </div>
    </div>

    <!-- 3. FILTROS AVANZADOS (Estilo Panel de Control) -->
    <div class="mb-8 glass rounded-2xl shadow-sm border border-orange-100 overflow-hidden" x-data="{ filtersOpen: true }">
        <div class="bg-white/50 px-6 py-4 border-b border-orange-50 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                </div>
                <h3 class="font-bold text-slate-800">Panel de Búsqueda y Filtros</h3>
            </div>
            <button @click="filtersOpen = !filtersOpen" class="text-slate-400 hover:text-orange-600 transition">
                <svg class="w-6 h-6 transform transition" :class="filtersOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
        </div>

        <div x-show="filtersOpen" x-transition class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="md:col-span-2">
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Buscar por Nombre o CUE</label>
                    <div class="relative">
                        <input type="text" wire:model.live.debounce.300ms="search" placeholder="Ej: Escuela Normal Sarmiento..." 
                               class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm">
                        <svg class="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nivel Educativo</label>
                    <select wire:model.live="nivelFilter" class="w-full py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 shadow-sm">
                        <option value="">Todos los niveles</option>
                        @foreach($niveles as $nivel) <option value="{{ $nivel }}">{{ $nivel }}</option> @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Ámbito</label>
                    <select wire:model.live="ambitoFilter" class="w-full py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 shadow-sm">
                        <option value="">Todos</option>
                        <option value="PUBLICO">Público</option>
                        <option value="PRIVADO">Privado</option>
                    </select>
                </div>
            </div>
            <!-- Botón para limpiar si hay activos -->
            @if($this->activeFiltersCount > 0)
                <div class="flex justify-end border-t border-slate-100 pt-4">
                    <button wire:click="clearFilters" class="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        Limpiar todos los filtros
                    </button>
                </div>
            @endif
        </div>
    </div>

    <!-- 4. TABLA DE RESULTADOS (Estilo Ficha) -->
    <div class="glass rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        <table class="min-w-full border-separate border-spacing-0">
            <thead>
                <tr class="bg-slate-900">
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Detalles del Establecimiento</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Dirección de Área</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider text-center">Gestión</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Ubicación</th>
                    <th class="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
                @forelse($modalidades as $modalidad)
                    <tr class="group hover:bg-orange-50/50 transition-all cursor-default">
                        <td class="px-6 py-5">
                            <div class="flex items-center gap-3">
                                <div class="w-1.5 h-12 rounded-full {{ $modalidad->validado ? 'bg-green-500' : 'bg-orange-400' }}"></div>
                                <div>
                                    <div class="text-sm font-bold text-slate-800 group-hover:text-orange-700 transition-colors uppercase leading-tight">
                                        {{ $modalidad->establecimiento->nombre }}
                                    </div>
                                    <div class="flex gap-2 mt-1.5">
                                        <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 font-mono">CUE {{ $modalidad->establecimiento->cue }}</span>
                                        <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 font-mono">CUI {{ $modalidad->establecimiento->edificio->cui }}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-5">
                            <div class="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">{{ $modalidad->nivel_educativo }}</div>
                            <div class="text-sm text-slate-700 font-medium">{{ $modalidad->direccion_area }}</div>
                        </td>
                        <td class="px-6 py-5 text-center">
                            <span class="px-3 py-1 text-[10px] font-bold rounded-lg {{ $modalidad->ambito === 'PUBLICO' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700' }}">
                                {{ $modalidad->ambito }}
                            </span>
                        </td>
                        <td class="px-6 py-5">
                            <div class="text-sm text-slate-700 font-medium">{{ $modalidad->establecimiento->edificio->zona_departamento }}</div>
                            <div class="text-xs text-slate-400">{{ $modalidad->establecimiento->edificio->localidad }}</div>
                        </td>
                        <td class="px-6 py-5 text-right">
                            <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-[-10px]">
                                <button wire:click="viewModalidad({{ $modalidad->id }})" class="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition" title="Ver Detalle">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                </button>
                                @can('update', $modalidad)
                                <button wire:click="editModalidad({{ $modalidad->id }})" class="p-2 hover:bg-green-50 text-green-600 rounded-lg transition" title="Editar">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                </button>
                                @endcan
                                @can('delete', $modalidad)
                                <button wire:click="confirmDelete({{ $modalidad->id }})" class="p-2 hover:bg-red-50 text-red-600 rounded-lg transition" title="Eliminar">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                                @endcan
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-6 py-20 text-center">
                            <div class="flex flex-col items-center justify-center">
                                <div class="p-4 bg-slate-50 rounded-full mb-4">
                                    <svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <p class="text-slate-500 font-medium text-lg">No se encontraron establecimientos</p>
                                <p class="text-slate-400 text-sm">Prueba ajustando los filtros de búsqueda</p>
                            </div>
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Paginación -->
    <div class="mt-8">
        {{ $modalidades->links() }}
    </div>
</div>

<!-- RECOMENDACIÓN PARA EL MODAL DE "VER": -->
<!-- 
     En el modal de ver, usa un layout de "Comparación Espejo".
     Coloca el dato de la Dirección de Área a la izquierda 
     y el dato de la Plataforma a la derecha. 
     Si son distintos, resalta ambos en rojo. 
-->
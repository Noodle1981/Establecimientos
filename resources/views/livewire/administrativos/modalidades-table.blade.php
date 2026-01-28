<div>
    <!-- HEADER ESTRATÉGICO -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2" style="color: #FE8204;">
                <i class="fas fa-university"></i>
                <span>Ministerio de Educación</span>
                <span>•</span>
                <span>Auditoría de Establecimientos</span>
            </nav>
            <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg" style="background-color: rgba(254, 130, 4, 0.1);">
                    <i class="fas fa-school fa-2x" style="color: #FE8204;"></i>
                </div>
                <h2 class="text-4xl font-extrabold tracking-tight" style="color: #000000;">Gestión de Establecimientos</h2>
            </div>
            <p class="mt-1 ml-14" style="color: #000000;">Control y comparación de datos entre Direcciones de Área y Plataforma de Gestión.</p>
        </div>
        
        <div class="flex gap-3 bg-white p-1.5 rounded-lg shadow-sm" style="border: 1px solid #FE8204;">
            @can('create', App\Models\Modalidad::class)
                <button wire:click="openCreateModal" 
                        class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold transition shadow-md"
                        style="background-color: #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);"
                        onmouseover="this.style.backgroundColor='#E57303'"
                        onmouseout="this.style.backgroundColor='#FE8204'">
                    <i class="fas fa-plus"></i>
                    Nuevo Establecimiento
                </button>
            @endcan
            <button wire:click="$toggle('showDeleted')" 
                    class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white font-semibold transition"
                    style="border: 1px solid #FE8204; color: #000000;"
                    onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.05)'"
                    onmouseout="this.style.backgroundColor='#FFFFFF'">
                <i class="fas fa-trash-restore" style="color: #FE8204;"></i>
                {{ $showDeleted ? 'Ver Activos' : 'Ver Eliminados' }}
            </button>
        </div>
    </div>

    <!-- TARJETAS DE ESTADO (KPIs) -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-5 rounded-lg shadow-sm" style="border: 2px solid #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);">
            <div class="flex flex-col">
                <span class="text-sm font-medium" style="color: #000000;">Total Unidades</span>
                <h4 class="text-2xl font-bold" style="color: #FE8204;">{{ $modalidades->total() }}</h4>
            </div>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm" style="border: 2px solid #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);">
            <div class="flex flex-col">
                <span class="text-sm font-medium" style="color: #000000;">Ámbito Público</span>
                <h4 class="text-2xl font-bold" style="color: #FE8204;">{{ $modalidades->where('ambito', 'PUBLICO')->count() }}</h4>
            </div>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm" style="border: 2px solid #FADC3C; box-shadow: 0 4px 12px rgba(250, 220, 60, 0.15);">
            <div class="flex flex-col">
                <span class="text-sm font-medium" style="color: #000000;">Pendientes Validación</span>
                <h4 class="text-2xl font-bold" style="color: #FADC3C;">12</h4>
            </div>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm" style="border: 2px solid #E43C2F; box-shadow: 0 4px 12px rgba(228, 60, 47, 0.15);">
            <div class="flex flex-col">
                <span class="text-sm font-medium" style="color: #000000;">Discrepancias</span>
                <h4 class="text-2xl font-bold" style="color: #E43C2F;">4</h4>
            </div>
        </div>
    </div>

    <!-- FILTROS AVANZADOS -->
    <div class="mb-8 bg-white rounded-lg overflow-hidden" style="border: 1px solid #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);" x-data="{ filtersOpen: true }">
        <div class="px-6 py-4 flex justify-between items-center" style="background-color: #FE8204; border-bottom: 1px solid #FADC3C;">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg">
                    <i class="fas fa-search" style="color: #FE8204;"></i>
                </div>
                <h3 class="font-bold text-white">Panel de Búsqueda y Filtros</h3>
            </div>
            <button @click="filtersOpen = !filtersOpen" class="text-white hover:text-yellow-200 transition">
                <i class="fas fa-chevron-down transform transition" :class="filtersOpen ? 'rotate-180' : ''"></i>
            </button>
        </div>

        <div x-show="filtersOpen" x-transition class="p-6 space-y-6 bg-white">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="md:col-span-2">
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Buscar por Nombre o CUE</label>
                    <div class="relative">
                        <input type="text" wire:model.live.debounce.300ms="search" placeholder="Ej: Escuela Normal Sarmiento..." 
                               class="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg transition"
                               style="border: 1px solid #FE8204; color: #000000;"
                               onfocus="this.style.borderColor='#FE8204'; this.style.boxShadow='0 0 0 3px rgba(254, 130, 4, 0.1)'"
                               onblur="this.style.boxShadow='none'">
                        <i class="fas fa-search absolute left-3 top-3.5" style="color: #FE8204;"></i>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Nivel Educativo</label>
                    <select wire:model.live="nivelFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todos los niveles</option>
                        @foreach($niveles as $nivel) <option value="{{ $nivel }}">{{ $nivel }}</option> @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Ámbito</label>
                    <select wire:model.live="ambitoFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todos</option>
                        <option value="PUBLICO">Público</option>
                        <option value="PRIVADO">Privado</option>
                    </select>
                </div>
            </div>
            @if($this->activeFiltersCount > 0)
                <div class="flex justify-end border-t pt-4" style="border-color: #FADC3C;">
                    <button wire:click="clearFilters" class="text-sm font-bold flex items-center gap-1 hover:underline" style="color: #E43C2F;">
                        <i class="fas fa-times"></i>
                        Limpiar todos los filtros
                    </button>
                </div>
            @endif
        </div>
    </div>

    <!-- TABLA DE RESULTADOS -->
    <div class="bg-white rounded-lg overflow-hidden" style="border: 1px solid #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);">
        <table class="min-w-full">
            <thead>
                <tr style="background-color: #FE8204;">
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Detalles del Establecimiento</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Dirección de Área</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider text-center">Gestión</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Ubicación</th>
                    <th class="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y" style="border-color: #FADC3C;">
                @forelse($modalidades as $modalidad)
                    <tr class="group transition-all cursor-default" 
                        onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.05)'"
                        onmouseout="this.style.backgroundColor='#FFFFFF'">
                        <td class="px-6 py-5">
                            <div class="flex items-center gap-3">
                                <div class="w-1.5 h-12 rounded-full" style="background-color: {{ $modalidad->validado ? '#22c55e' : '#FE8204' }};"></div>
                                <div>
                                    <div class="text-sm font-bold uppercase leading-tight" style="color: #000000;">
                                        {{ $modalidad->establecimiento->nombre }}
                                    </div>
                                    <div class="flex gap-2 mt-1.5">
                                        <span class="text-[10px] px-2 py-0.5 rounded-md border font-mono" style="background-color: #FFFFFF; color: #000000; border-color: #FE8204;">CUE {{ $modalidad->establecimiento->cue }}</span>
                                        <span class="text-[10px] px-2 py-0.5 rounded-md border font-mono" style="background-color: #FFFFFF; color: #000000; border-color: #FE8204;">CUI {{ $modalidad->establecimiento->edificio->cui }}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-5">
                            <div class="text-xs font-bold uppercase tracking-tighter mb-1" style="color: #FE8204;">{{ $modalidad->nivel_educativo }}</div>
                            <div class="text-sm font-medium" style="color: #000000;">{{ $modalidad->direccion_area }}</div>
                        </td>
                        <td class="px-6 py-5 text-center">
                            <span class="px-3 py-1 text-[10px] font-bold rounded-lg" 
                                  style="{{ $modalidad->ambito === 'PUBLICO' ? 'background-color: #FE8204; color: #FFFFFF;' : 'background-color: #FFFFFF; color: #FE8204; border: 1px solid #FE8204;' }}">
                                {{ $modalidad->ambito }}
                            </span>
                        </td>
                        <td class="px-6 py-5">
                            <div class="text-sm font-medium" style="color: #000000;">{{ $modalidad->establecimiento->edificio->zona_departamento }}</div>
                            <div class="text-xs" style="color: #000000;">{{ $modalidad->establecimiento->edificio->localidad }}</div>
                        </td>
                        <td class="px-6 py-5 text-right">
                            <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button wire:click="viewModalidad({{ $modalidad->id }})" 
                                        class="p-2 rounded-lg transition" 
                                        style="background-color: #FFFFFF; color: #FE8204; border: 1px solid #FE8204;"
                                        onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'"
                                        onmouseout="this.style.backgroundColor='#FFFFFF'"
                                        title="Ver Detalle">
                                    <i class="fas fa-eye"></i>
                                </button>
                                @can('update', $modalidad)
                                <button wire:click="editModalidad({{ $modalidad->id }})" 
                                        class="p-2 rounded-lg transition" 
                                        style="background-color: #FFFFFF; color: #FE8204; border: 1px solid #FE8204;"
                                        onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'"
                                        onmouseout="this.style.backgroundColor='#FFFFFF'"
                                        title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
                                @endcan
                                @can('delete', $modalidad)
                                <button wire:click="confirmDelete({{ $modalidad->id }})" 
                                        class="p-2 rounded-lg transition" 
                                        style="background-color: #FFFFFF; color: #E43C2F; border: 1px solid #E43C2F;"
                                        onmouseover="this.style.backgroundColor='rgba(228, 60, 47, 0.1)'"
                                        onmouseout="this.style.backgroundColor='#FFFFFF'"
                                        title="Eliminar">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                @endcan
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-6 py-20 text-center">
                            <div class="flex flex-col items-center justify-center">
                                <div class="p-4 rounded-full mb-4" style="background-color: rgba(254, 130, 4, 0.1);">
                                    <i class="fas fa-search fa-3x" style="color: #FE8204;"></i>
                                </div>
                                <p class="font-medium text-lg" style="color: #000000;">No se encontraron establecimientos</p>
                                <p class="text-sm" style="color: #000000; opacity: 0.6;">Prueba ajustando los filtros de búsqueda</p>
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
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
            <button wire:click="exportExcel" wire:loading.attr="disabled"
                    class="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition bg-white"
                    style="border: 1px solid #1D6F42; color: #1D6F42;"
                    onmouseover="this.style.backgroundColor='rgba(29, 111, 66, 0.1)'"
                    onmouseout="this.style.backgroundColor='#FFFFFF'">
                <i class="fas fa-file-excel" wire:loading.remove wire:target="exportExcel"></i>
                <i class="fas fa-spinner fa-spin" wire:loading wire:target="exportExcel"></i>
                <span wire:loading.remove wire:target="exportExcel">Exportar Excel</span>
                <span wire:loading wire:target="exportExcel">Generando...</span>
            </button>
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



    <!-- FLASH MESSAGES -->
    <div class="mb-4">
        @if (session()->has('success'))
            <div class="p-4 mb-4 text-sm text-orange-800 rounded-lg bg-orange-50 dark:bg-gray-800 dark:text-orange-400 border border-orange-200" role="alert">
                <span class="font-medium"><i class="fas fa-check-circle mr-2"></i>¡Éxito!</span> {{ session('success') }}
            </div>
        @endif

        @if (session()->has('error'))
            <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-200" role="alert">
                <span class="font-medium"><i class="fas fa-exclamation-circle mr-2"></i>¡Error!</span> {{ session('error') }}
            </div>
        @endif
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
                <!-- Fila 1 -->
                <div class="md:col-span-2">
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Buscar por Nombre, CUE o CUI</label>
                    <div class="flex gap-2">
                        <div class="relative flex-1">
                            <input type="text" wire:model.live.debounce.300ms="search" placeholder="Ej: Escuela Normal Sarmiento..." 
                                   class="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg transition"
                                   style="border: 1px solid #FE8204; color: #000000;"
                                   onfocus="this.style.borderColor='#FE8204'; this.style.boxShadow='0 0 0 3px rgba(254, 130, 4, 0.1)'"
                                   onblur="this.style.boxShadow='none'">
                            <i class="fas fa-search absolute left-3 top-3.5" style="color: #FE8204;"></i>
                        </div>
                        <button wire:click="$refresh" 
                                class="px-6 py-2.5 rounded-lg text-white font-bold transition shadow-md hover:shadow-lg"
                                style="background-color: #FE8204;"
                                onmouseover="this.style.backgroundColor='#E57303'"
                                onmouseout="this.style.backgroundColor='#FE8204'">
                            BUSCAR
                        </button>
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

                <!-- Fila 2 -->
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Dirección de Área</label>
                    <select wire:model.live="direccionAreaFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todas</option>
                        @foreach($direccionesArea as $area) <option value="{{ $area }}">{{ $area }}</option> @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Sector</label>
                    <select wire:model.live="sectorFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todos</option>
                        @foreach($sectores as $sector) <option value="{{ $sector }}">{{ $sector }}</option> @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Categoría</label>
                    <select wire:model.live="categoriaFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todas</option>
                        @foreach($categorias as $cat) <option value="{{ $cat }}">{{ $cat }}</option> @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Departamento</label>
                    <select wire:model.live="zonaFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todos</option>
                        @foreach($zonas as $zona) <option value="{{ $zona }}">{{ $zona }}</option> @endforeach
                    </select>
                    <div class="mt-1 text-right">
                        <span class="text-3xl font-bold" style="color: #FE8204;">
                            <i class="fas fa-list-ol mr-1"></i> Total: {{ $modalidades->total() }}
                        </span>
                    </div>
                </div>

                <!-- Fila 3 (Opcional si hay más) -->
                 <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Radio</label>
                    <select wire:model.live="radioFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todos</option>
                        @foreach($radios as $radio) <option value="{{ $radio }}">{{ $radio }}</option> @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Estado</label>
                    <select wire:model.live="estadoFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todos</option>
                        <option value="VALIDADO">Validado</option>
                        <option value="PENDIENTE">Pendiente</option>
                    </select>
                </div>
                 <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Zona (Letra)</label>
                    <select wire:model.live="zonaLetraFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todas</option>
                        @foreach($zonasLetras as $z) <option value="{{ $z }}">{{ $z }}</option> @endforeach
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
                    <tr wire:key="row-{{ $modalidad->id }}" class="group transition-all cursor-default {{ $modalidad->trashed() ? 'opacity-60 grayscale bg-gray-50' : '' }}" 
                        onmouseover="this.style.backgroundColor='{{ $modalidad->trashed() ? '#F9FAFB' : 'rgba(254, 130, 4, 0.05)' }}'"
                        onmouseout="this.style.backgroundColor='{{ $modalidad->trashed() ? '#F9FAFB' : '#FFFFFF' }}'">
                        <td class="px-6 py-5">
                            <div class="flex items-center gap-3">
                                <div class="w-1.5 h-12 rounded-full" style="background-color: {{ $modalidad->validado ? '#22c55e' : '#FE8204' }};"></div>
                                <div>
                                    <div class="text-sm font-bold uppercase leading-tight" style="color: #000000;">
                                        {{ $modalidad->establecimiento->nombre }}
                                    </div>
                                    <div class="flex gap-2 mt-1.5">
                                        <span class="text-xs px-2 py-0.5 rounded-md border font-mono" style="background-color: #FFFFFF; color: #000000; border-color: #FE8204;">CUE {{ $modalidad->establecimiento->cue }}</span>
                                        <span class="text-xs px-2 py-0.5 rounded-md border font-mono" style="background-color: #FFFFFF; color: #000000; border-color: #FE8204;">CUI {{ $modalidad->establecimiento->edificio->cui }}</span>
                                    </div>
                                    <div class="flex gap-2 mt-1">
                                        @if($modalidad->radio)
                                            <span class="text-xs px-2 py-0.5 rounded-md border font-mono" style="background-color: #f3f4f6; color: #374151; border-color: #d1d5db;">RAD {{ $modalidad->radio }}</span>
                                        @endif
                                        @if($modalidad->categoria)
                                            <span class="text-xs px-2 py-0.5 rounded-md border font-mono" style="background-color: #f3f4f6; color: #374151; border-color: #d1d5db;">CAT {{ $modalidad->categoria }}</span>
                                        @endif
                                    </div>
                                    @if($modalidad->observaciones)
                                    <div class="mt-1">
                                        <span class="text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 w-max" style="background-color: #FFF9C4; color: #F57F17; border: 1px solid #FBC02D;">
                                            <i class="fas fa-comment-dots"></i> CON OBSERVACIONES
                                        </span>
                                    </div>
                                    @endif
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
                            <div class="flex justify-end gap-1 transition-all">
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
                                        title="Editar ID: {{ $modalidad->id }}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                @endcan
                                @can('delete', $modalidad)
                                    @if(!$modalidad->trashed())
                                    <button wire:click="confirmDelete({{ $modalidad->id }})" 
                                            class="p-2 rounded-lg transition" 
                                            style="background-color: #FFFFFF; color: #E43C2F; border: 1px solid #E43C2F;"
                                            onmouseover="this.style.backgroundColor='rgba(228, 60, 47, 0.1)'"
                                            onmouseout="this.style.backgroundColor='#FFFFFF'"
                                            title="Eliminar">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                    @else
                                    <button wire:click="restore({{ $modalidad->id }})" 
                                            class="p-2 rounded-lg transition" 
                                            style="background-color: #FFFFFF; color: #22c55e; border: 1px solid #22c55e;"
                                            onmouseover="this.style.backgroundColor='rgba(34, 197, 94, 0.1)'"
                                            onmouseout="this.style.backgroundColor='#FFFFFF'"
                                            title="Restaurar">
                                        <i class="fas fa-trash-restore"></i>
                                    </button>
                                    @endif
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


    <!-- MODALES (Agregar al final del archivo) -->

    <!-- Modal Crear -->
    @if($showCreateModal)
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="closeModals"></div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full relative z-50">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="flex justify-between items-center mb-5">
                       <h3 class="text-xl leading-6 font-bold text-gray-900">Nuevo Establecimiento</h3>
                       <button wire:click="closeModals" class="text-gray-400 hover:text-gray-500">
                           <i class="fas fa-times"></i>
                       </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Identificación -->
                        <div class="md:col-span-3 bg-gray-50 p-4 rounded-lg border border-orange-200">
                            <h4 class="text-sm font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1">
                                <i class="fas fa-id-card mr-1"></i> Identificación Institucional
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-xs font-bold uppercase mb-1">Nombre del Establecimiento</label>
                                    <input type="text" wire:model="createForm.nombre_establecimiento" class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 uppercase">
                                    @error('createForm.nombre_establecimiento') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">CUE (9 dígitos)</label>
                                    <input type="text" wire:model="createForm.cue" class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                                    @error('createForm.cue') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">CUI (7 dígitos)</label>
                                    <input type="text" wire:model="createForm.cui" class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                                    @error('createForm.cui') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-xs font-bold uppercase mb-1">Establecimiento Cabecera (Opcional)</label>
                                    <input type="text" wire:model="createForm.establecimiento_cabecera" class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 uppercase" placeholder="NOMBRE DE LA CABECERA">
                                </div>
                                <div>
                                     <label class="block text-xs font-bold uppercase mb-1">Estado Validación</label>
                                     <div class="flex items-center mt-2">
                                        <input type="checkbox" wire:model="createForm.validado" class="rounded text-orange-600 focus:ring-orange-500 h-4 w-4">
                                        <span class="ml-2 text-sm text-gray-700">Validado</span>
                                     </div>
                                </div>
                            </div>
                        </div>

                        <!-- Ubicación -->
                        <div class="md:col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 class="text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                                <i class="fas fa-map-marker-alt mr-1"></i> Ubicación
                            </h4>
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Calle</label>
                                    <input type="text" wire:model="createForm.calle" class="w-full rounded-md border-gray-300 shadow-sm uppercase">
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <label class="block text-xs font-bold uppercase mb-1">N° Puerta</label>
                                        <input type="text" wire:model="createForm.numero_puerta" class="w-full rounded-md border-gray-300 shadow-sm text-center">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold uppercase mb-1">Localidad</label>
                                        <input type="text" wire:model="createForm.localidad" class="w-full rounded-md border-gray-300 shadow-sm uppercase">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Zona / Departamento</label>
                                    <select wire:model="createForm.zona_departamento" class="w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="">Seleccione...</option>
                                        @foreach($zonas as $zona) <option value="{{ $zona }}">{{ $zona }}</option> @endforeach
                                    </select>
                                    @error('createForm.zona_departamento') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <label class="block text-xs font-bold uppercase mb-1">Latitud</label>
                                        <input type="text" wire:model="createForm.latitud" class="w-full rounded-md border-gray-300 shadow-sm" placeholder="Ej: -31.5432">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold uppercase mb-1">Longitud</label>
                                        <input type="text" wire:model="createForm.longitud" class="w-full rounded-md border-gray-300 shadow-sm" placeholder="Ej: -68.5432">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Datos Académicos -->
                        <div class="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 class="text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                                <i class="fas fa-graduation-cap mr-1"></i> Datos Académicos
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Nivel Educativo</label>
                                    <select wire:model.live="createForm.nivel_educativo" class="w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="">Seleccione...</option>
                                        @foreach($niveles as $nivel) <option value="{{ $nivel }}">{{ $nivel }}</option> @endforeach
                                    </select>
                                    @error('createForm.nivel_educativo') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Dirección de Área</label>
                                    <input type="text" wire:model="createForm.direccion_area" class="w-full rounded-md border-gray-300 shadow-sm uppercase" readonly>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Ámbito</label>
                                    <select wire:model="createForm.ambito" class="w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="PUBLICO">PUBLICO</option>
                                        <option value="PRIVADO">PRIVADO</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Sector</label>
                                    <input type="text" wire:model="createForm.sector" class="w-full rounded-md border-gray-300 shadow-sm uppercase">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Radio</label>
                                    <input type="text" wire:model="createForm.radio" class="w-full rounded-md border-gray-300 shadow-sm uppercase">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Zona</label>
                                    <input type="text" wire:model="createForm.zona" maxlength="1" class="w-full rounded-md border-gray-300 shadow-sm uppercase text-center" placeholder="X">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Categoría</label>
                                    <select wire:model="createForm.categoria" class="w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="">Seleccione...</option>
                                            @foreach($categorias as $cat) <option value="{{ $cat }}">{{ $cat }}</option> @endforeach
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
                    <button wire:click="createEstablecimiento" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-bold text-white hover:bg-orange-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                        <i class="fas fa-save mr-2"></i> GUARDAR ESTABLECIMIENTO
                    </button>
                    <button wire:click="closeModals" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        CANCELAR
                    </button>
                </div>
            </div>
        </div>
    </div>
    @endif

    <!-- Modal Editar Completo -->
    @if($showEditModal)
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
             <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="closeModals"></div>

             <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full relative z-50">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="flex justify-between items-center mb-5">
                       <h3 class="text-xl leading-6 font-bold text-gray-900">Editar Establecimiento</h3>
                       <button wire:click="closeModals" class="text-gray-400 hover:text-gray-500">
                           <i class="fas fa-times"></i>
                       </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <!-- Identificación -->
                         <div class="md:col-span-3 bg-gray-50 p-4 rounded-lg border border-orange-200">
                            <h4 class="text-sm font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1">
                                <i class="fas fa-id-card mr-1"></i> Identificación Institucional
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-xs font-bold uppercase mb-1">Nombre del Establecimiento</label>
                                    <input type="text" wire:model="editForm.nombre_establecimiento" class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 uppercase">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">CUE (Solo Lectura)</label>
                                    <input type="text" value="{{ $editForm['cue'] }}" disabled class="w-full rounded-md border-gray-200 bg-gray-100 shadow-sm cursor-not-allowed">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">CUI (Solo Lectura)</label>
                                    <input type="text" value="{{ $editForm['cui'] }}" disabled class="w-full rounded-md border-gray-200 bg-gray-100 shadow-sm cursor-not-allowed">
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-xs font-bold uppercase mb-1">Establecimiento Cabecera</label>
                                    <input type="text" wire:model="editForm.establecimiento_cabecera" class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 uppercase" placeholder="NOMBRE DE LA CABECERA">
                                </div>
                                <div>
                                     <label class="block text-xs font-bold uppercase mb-1">Estado Validación</label>
                                     <div class="flex items-center mt-2">
                                        <input type="checkbox" wire:model="editForm.validado" class="rounded text-orange-600 focus:ring-orange-500 h-4 w-4">
                                        <span class="ml-2 text-sm text-gray-700">Validado</span>
                                     </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Ubicación -->
                        <div class="md:col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 class="text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                                <i class="fas fa-map-marker-alt mr-1"></i> Ubicación
                            </h4>
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Calle</label>
                                    <input type="text" wire:model="editForm.calle" class="w-full rounded-md border-gray-300 shadow-sm uppercase">
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <label class="block text-xs font-bold uppercase mb-1">N° Puerta</label>
                                        <input type="text" wire:model="editForm.numero_puerta" class="w-full rounded-md border-gray-300 shadow-sm text-center">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold uppercase mb-1">Localidad</label>
                                        <input type="text" wire:model="editForm.localidad" class="w-full rounded-md border-gray-300 shadow-sm uppercase">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Zona / Departamento</label>
                                    <select wire:model="editForm.zona_departamento" class="w-full rounded-md border-gray-300 shadow-sm">
                                         @foreach($zonas as $zona) <option value="{{ $zona }}">{{ $zona }}</option> @endforeach
                                    </select>
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <div>
                                        <label class="block text-xs font-bold uppercase mb-1">Latitud</label>
                                        <input type="text" wire:model="editForm.latitud" class="w-full rounded-md border-gray-300 shadow-sm" placeholder="Ej: -31.5432">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold uppercase mb-1">Longitud</label>
                                        <input type="text" wire:model="editForm.longitud" class="w-full rounded-md border-gray-300 shadow-sm" placeholder="Ej: -68.5432">
                                    </div>
                                </div>
                            </div>
                        </div>

                         <!-- Datos Académicos -->
                         <div class="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 class="text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                                <i class="fas fa-graduation-cap mr-1"></i> Datos Académicos
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Nivel Educativo</label>
                                    <select wire:model="editForm.nivel_educativo" class="w-full rounded-md border-gray-300 shadow-sm">
                                        @foreach($niveles as $nivel) <option value="{{ $nivel }}">{{ $nivel }}</option> @endforeach
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Dirección de Área</label>
                                    <select wire:model="editForm.direccion_area" class="w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="">Seleccione...</option>
                                        @foreach($direccionesArea as $area) <option value="{{ $area }}">{{ $area }}</option> @endforeach
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Ámbito</label>
                                    <select wire:model="editForm.ambito" class="w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="PUBLICO">PUBLICO</option>
                                        <option value="PRIVADO">PRIVADO</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Sector</label>
                                    <input type="text" wire:model="editForm.sector" class="w-full rounded-md border-gray-300 shadow-sm uppercase">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Radio</label>
                                    <input type="text" wire:model="editForm.radio" class="w-full rounded-md border-gray-300 shadow-sm uppercase">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Zona</label>
                                    <input type="text" wire:model="editForm.zona" maxlength="1" class="w-full rounded-md border-gray-300 shadow-sm uppercase text-center" placeholder="X">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Categoría</label>
                                    <select wire:model="editForm.categoria" class="w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="">Seleccione...</option>
                                        @foreach($categorias as $cat) <option value="{{ $cat }}">{{ $cat }}</option> @endforeach
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Observaciones (Full Width Card) -->
                    <div class="md:col-span-3 bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
                        <label class="block text-xs font-bold uppercase mb-1">Observaciones</label>
                        <textarea wire:model="editForm.observaciones" class="w-full rounded-md border-gray-300 shadow-sm h-20 uppercase" placeholder="Ingrese observaciones de validación..."></textarea>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
                    <button wire:click="updateModalidad" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-bold text-white hover:bg-orange-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                        <i class="fas fa-save mr-2"></i> ACTUALIZAR DATOS
                    </button>
                    <button wire:click="closeModals" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-bold text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        CANCELAR
                    </button>
                </div>
            </div>
        </div>
    </div>
    @endif

    <!-- Modal Ver Detalle -->
    @if($showViewModal && $selectedModalidad)
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
             <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="closeModals"></div>

             <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-50">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="flex justify-between items-start">
                        <h3 class="text-lg leading-6 font-bold text-gray-900 mb-4">{{ $selectedModalidad->establecimiento->nombre }}</h3>
                        <span class="px-2 py-1 text-xs rounded-full {{ $selectedModalidad->ambito == 'PUBLICO' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800' }}">
                            {{ $selectedModalidad->ambito }}
                        </span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <!-- Identificación -->
                        <div class="bg-gray-50 p-3 rounded">
                            <span class="block text-xs font-bold text-gray-500 uppercase">CUE</span>
                            <span class="block font-medium">{{ $selectedModalidad->establecimiento->cue }}</span>
                        </div>
                        <div class="bg-gray-50 p-3 rounded">
                            <span class="block text-xs font-bold text-gray-500 uppercase">CUI</span>
                            <span class="block font-medium">{{ $selectedModalidad->establecimiento->edificio->cui }}</span>
                        </div>
                        <div class="bg-gray-50 p-3 rounded">
                            <span class="block text-xs font-bold text-gray-500 uppercase">Estado</span>
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {{ $selectedModalidad->validado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' }}">
                                {{ $selectedModalidad->validado ? 'VALIDADO' : 'PENDIENTE' }}
                            </span>
                        </div>

                        <!-- Cabecera (Full width if present) -->
                        @if($selectedModalidad->establecimiento->establecimiento_cabecera)
                        <div class="md:col-span-3 bg-gray-50 p-3 rounded">
                            <span class="block text-xs font-bold text-gray-500 uppercase">Establecimiento Cabecera</span>
                            <span class="block font-medium">{{ $selectedModalidad->establecimiento->establecimiento_cabecera }}</span>
                        </div>
                        @endif

                        <!-- Datos Académicos -->
                        <div class="md:col-span-3 bg-gray-50 p-3 rounded">
                            <span class="block text-xs font-bold text-gray-500 uppercase mb-2">Datos Académicos</span>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <span class="block text-[10px] text-gray-400 uppercase">Nivel</span>
                                    <span class="block font-medium text-xs">{{ $selectedModalidad->nivel_educativo }}</span>
                                </div>
                                <div class="col-span-2">
                                    <span class="block text-[10px] text-gray-400 uppercase">Dirección de Área</span>
                                    <span class="block font-medium text-xs">{{ $selectedModalidad->direccion_area }}</span>
                                </div>
                                <div>
                                    <span class="block text-[10px] text-gray-400 uppercase">Sector</span>
                                    <span class="block font-medium text-xs">{{ $selectedModalidad->sector ?? '-' }}</span>
                                </div>
                                <div>
                                    <span class="block text-[10px] text-gray-400 uppercase">Categoría</span>
                                    <span class="block font-medium text-xs">{{ $selectedModalidad->categoria ?? '-' }}</span>
                                </div>
                                <div>
                                    <span class="block text-[10px] text-gray-400 uppercase">Radio</span>
                                    <span class="block font-medium text-xs">{{ $selectedModalidad->radio ?? '-' }}</span>
                                </div>
                                <div>
                                    <span class="block text-[10px] text-gray-400 uppercase">Zona</span>
                                    <span class="block font-medium text-xs">{{ $selectedModalidad->zona ?? '-' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Ubicación -->
                        <div class="md:col-span-3 bg-gray-50 p-3 rounded">
                            <span class="block text-xs font-bold text-gray-500 uppercase mb-2">Ubicación Geográfica</span>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span class="block text-[10px] text-gray-400 uppercase">Dirección</span>
                                    <span class="block font-medium">{{ $selectedModalidad->establecimiento->edificio->calle }} {{ $selectedModalidad->establecimiento->edificio->numero_puerta }}</span>
                                    <span class="block text-xs text-gray-600">{{ $selectedModalidad->establecimiento->edificio->localidad }} - {{ $selectedModalidad->establecimiento->edificio->zona_departamento }}</span>
                                </div>
                                <div>
                                    <span class="block text-[10px] text-gray-400 uppercase">Coordenadas</span>
                                    @if($selectedModalidad->establecimiento->edificio->latitud && $selectedModalidad->establecimiento->edificio->longitud)
                                        <div class="flex items-center gap-2">
                                            <span class="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                                                {{ $selectedModalidad->establecimiento->edificio->latitud }}, {{ $selectedModalidad->establecimiento->edificio->longitud }}
                                            </span>
                                            <a href="https://www.google.com/maps/search/?api=1&query={{ $selectedModalidad->establecimiento->edificio->latitud }},{{ $selectedModalidad->establecimiento->edificio->longitud }}" 
                                               target="_blank" 
                                               class="text-orange-500 hover:text-orange-600"
                                               title="Ver en Google Maps">
                                                <i class="fas fa-external-link-alt"></i>
                                            </a>
                                        </div>
                                    @else
                                        <span class="text-xs text-gray-400 italic">No registradas</span>
                                    @endif
                                </div>
                            </div>
                        </div>
                        </div>

                        <!-- Observaciones -->
                        @if($selectedModalidad->observaciones)
                        <div class="md:col-span-3 bg-yellow-50 p-3 rounded border border-yellow-200">
                            <span class="block text-xs font-bold text-yellow-800 uppercase mb-1">Observaciones / Notas de Validación</span>
                            <p class="text-sm text-gray-800 whitespace-pre-wrap">{{ $selectedModalidad->observaciones }}</p>
                        </div>
                        @endif
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button wire:click="closeModals" type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
    @endif

    <!-- Modal Eliminar -->
    @if($showDeleteModal)
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
             <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="closeModals"></div>

             <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <i class="fas fa-exclamation-triangle text-red-600"></i>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Confirmar Eliminación</h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">¿Estás seguro que deseas eliminar el establecimiento <strong>{{ $selectedModalidad->establecimiento->nombre }}</strong>?</p>
                                <p class="text-sm text-gray-500 mt-2">Esta acción moverá el registro a la papelera (soft delete).</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button wire:click="softDelete" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                        Eliminar
                    </button>
                    <button wire:click="closeModals" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
    @endif
</div>
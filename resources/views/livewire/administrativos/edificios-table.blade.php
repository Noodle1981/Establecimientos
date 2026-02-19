<div>
    <!-- HEADER ESTRATÉGICO -->
    <!-- HEADER ESTRATÉGICO -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in">
        <div>
            <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 text-primary-orange">
                <i class="fas fa-university"></i>
                <span>Ministerio de Educación</span>
                <span>•</span>
                <span>Gestión de Edificios</span>
            </nav>
            <div class="flex items-center gap-3">
                <div class="p-3 rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
                    <i class="fas fa-building fa-2x text-primary-orange"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-black tracking-tight text-black">
                        Gestión de <span class="text-primary-orange">Edificios</span>
                    </h2>
                    <p class="text-sm text-gray-500 font-medium">Control y administración de infraestructura educativa</p>
                </div>
            </div>
        </div>
        
        <div class="flex flex-wrap gap-3 glass p-2 rounded-xl">
            <button wire:click="openCreateModal"
                    class="btn-primary flex items-center gap-2">
                <i class="fas fa-plus"></i>
                <span>Nuevo</span>
            </button>

            <button wire:click="exportExcel" wire:loading.attr="disabled"
                    class="px-4 py-2 rounded-lg font-bold transition-all bg-white border border-green-600 text-green-700 hover:bg-green-50 shadow-sm flex items-center gap-2">
                <i class="fas fa-file-excel" wire:loading.remove wire:target="exportExcel"></i>
                <i class="fas fa-spinner fa-spin" wire:loading wire:target="exportExcel"></i>
                <span wire:loading.remove wire:target="exportExcel">Excel</span>
                <span wire:loading wire:target="exportExcel">...</span>
            </button>
            
            <button wire:click="exportRadioAudit" wire:loading.attr="disabled"
                    class="btn-secondary flex items-center gap-2">
                <i class="fas fa-map-marked-alt" wire:loading.remove wire:target="exportRadioAudit"></i>
                <i class="fas fa-spinner fa-spin" wire:loading wire:target="exportRadioAudit"></i>
                <span wire:loading.remove wire:target="exportRadioAudit">Auditoria Radios</span>
                <span wire:loading wire:target="exportRadioAudit">...</span>
            </button>
        </div>
    </div>

    <!-- FILTROS AVANZADOS -->
    <!-- FILTROS AVANZADOS -->
    <div class="mb-8 glass-strong rounded-xl overflow-hidden shadow-lg border border-gray-100" x-data="{ filtersOpen: true }">
        <div class="px-6 py-4 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg shadow-sm text-primary-orange">
                    <i class="fas fa-search"></i>
                </div>
                <h3 class="font-bold text-gray-800">Panel de Búsqueda y Filtros</h3>
            </div>
            <button @click="filtersOpen = !filtersOpen" class="text-gray-400 hover:text-primary-orange transition-colors">
                <i class="fas fa-chevron-down transform transition duration-200" :class="filtersOpen ? 'rotate-180' : ''"></i>
            </button>
        </div>

        <div x-show="filtersOpen" x-transition class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- Búsqueda -->
                <div class="md:col-span-1">
                    <label class="block text-xs font-bold uppercase text-gray-500 mb-2 ml-1">Búsqueda General</label>
                    <div class="relative">
                        <input type="text" wire:model.live.debounce.300ms="search" placeholder="CUI, Localidad..." 
                               class="input-glass w-full pl-10 pr-4 py-2.5 rounded-lg transition-all focus:ring-2 focus:ring-orange-500/20">
                        <i class="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
                    </div>
                </div>
                
                <!-- Departamento -->
                <div>
                    <label class="block text-xs font-bold uppercase text-gray-500 mb-2 ml-1">Departamento</label>
                    <select wire:model.live="zonaFilter" class="input-glass w-full py-2.5 rounded-lg bg-gray-50/50">
                        <option value="">Todos</option>
                        @foreach($zonas as $zona) <option value="{{ $zona }}">{{ $zona }}</option> @endforeach
                    </select>
                </div>
                
                <!-- Localidad -->
                <div>
                    <label class="block text-xs font-bold uppercase text-gray-500 mb-2 ml-1">Localidad</label>
                    <select wire:model.live="localidadFilter" class="input-glass w-full py-2.5 rounded-lg bg-gray-50/50">
                        <option value="">Todas</option>
                        @foreach($localidades as $loc) <option value="{{ $loc }}">{{ $loc }}</option> @endforeach
                    </select>
                </div>
                
                <!-- Ámbito -->
                <div>
                    <label class="block text-xs font-bold uppercase text-gray-500 mb-2 ml-1">Ámbito</label>
                    <div class="flex items-center gap-2">
                        <select wire:model.live="ambitoFilter" class="input-glass w-full py-2.5 rounded-lg bg-gray-50/50 flex-1">
                            <option value="">Todos</option>
                            <option value="PUBLICO">Público</option>
                            <option value="PRIVADO">Privado</option>
                        </select>
                        <div class="text-right whitespace-nowrap min-w-fit">
                            <span class="text-2xl font-bold text-gray-800">
                                {{ $edificios->total() }}
                            </span>
                            <span class="text-xs font-normal text-gray-500 uppercase block leading-none">Registros</span>
                        </div>
                    </div>
                </div>
            </div>
            
            @if($this->activeFiltersCount > 0)
                <div class="flex justify-end border-t border-gray-100 pt-4">
                    <button wire:click="clearFilters" class="text-sm font-bold flex items-center gap-2 text-secondary-red hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
                        <i class="fas fa-times"></i>
                        Limpiar filtros
                    </button>
                </div>
            @endif
        </div>
    </div>

    <!-- TABLA DE RESULTADOS -->
    <!-- TABLA DE RESULTADOS -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
            <thead>
                <tr class="bg-primary-orange">
                    <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Identificación</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Ubicación</th>
                    <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Coordenadas</th>
                    <th class="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">Establecimientos</th>
                    <th class="px-6 py-3 text-right text-xs font-bold text-white uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @forelse($edificios as $edificio)
                    @php
                        $establecimientoCabecera = $edificio->establecimientos->first(fn($e) => $e->cue_edificio_principal) ?? $edificio->establecimientos->first();
                    @endphp
                    <tr wire:key="row-{{ $edificio->id }}" class="group hover:bg-orange-50/50 transition-colors duration-150">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center gap-3">
                                <div class="w-1 h-10 rounded-full bg-primary-orange/20 group-hover:bg-primary-orange transition-colors"></div>
                                <div>
                                    <div class="text-sm font-bold text-gray-900 leading-tight uppercase">
                                        {{ $establecimientoCabecera->establecimiento_cabecera ?? 'SIN CABECERA' }}
                                    </div>
                                    <div class="flex gap-2 mt-1">
                                        <span class="text-[10px] px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-600 font-mono">CUI {{ $edificio->cui }}</span>
                                        @if($establecimientoCabecera && $establecimientoCabecera->cue_edificio_principal)
                                            <span class="text-[10px] px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-600 font-mono">CUE {{ $establecimientoCabecera->cue_edificio_principal }}</span>
                                        @endif
                                    </div>
                                    @if($edificio->letra_zona)
                                        <div class="mt-1">
                                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-bold">ZONA {{ $edificio->letra_zona }}</span>
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900">{{ $edificio->calle }} {{ $edificio->numero_puerta }}</div>
                            <div class="text-xs text-gray-500 uppercase">{{ $edificio->localidad }}</div>
                            <div class="text-xs font-bold text-primary-orange mt-0.5">{{ $edificio->zona_departamento }}</div>
                            @if($edificio->codigo_postal)
                                <div class="text-[10px] text-gray-400">CP: {{ $edificio->codigo_postal }}</div>
                            @endif
                        </td>
                        <td class="px-6 py-4">
                            @if($edificio->latitud && $edificio->longitud)
                                <div class="flex items-center gap-2">
                                    <span class="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                                        {{ $edificio->latitud }}, {{ $edificio->longitud }}
                                    </span>
                                    <a href="https://www.google.com/maps/search/?api=1&query={{ $edificio->latitud }},{{ $edificio->longitud }}" 
                                       target="_blank" 
                                       class="text-primary-orange hover:text-orange-700 transition-colors"
                                       title="Ver en Google Maps">
                                        <i class="fas fa-external-link-alt"></i>
                                    </a>
                                </div>
                            @else
                                <span class="text-xs text-gray-400 italic">No registradas</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 text-center">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                <i class="fas fa-school mr-1.5 opacity-70"></i>
                                {{ $edificio->establecimientos->count() }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                            <div class="flex justify-end gap-2">
                                <button wire:click="viewEdificio({{ $edificio->id }})" 
                                        class="text-gray-400 hover:text-primary-orange transition-colors p-1" 
                                        title="Ver Detalle">
                                    <i class="fas fa-eye fa-lg"></i>
                                </button>
                                <button wire:click="editEdificio({{ $edificio->id }})" 
                                        class="text-gray-400 hover:text-primary-orange transition-colors p-1" 
                                        title="Editar">
                                    <i class="fas fa-edit fa-lg"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center">
                                <div class="p-4 rounded-full bg-orange-50 mb-3">
                                    <i class="fas fa-search fa-2x text-primary-orange"></i>
                                </div>
                                <h3 class="font-bold text-gray-900 text-lg">No se encontraron edificios</h3>
                                <p class="text-sm text-gray-500 mt-1">Intenta ajustar los filtros de búsqueda.</p>
                            </div>
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Paginación -->
    <div class="mt-8">
        {{ $edificios->links() }}
    </div>

    <!-- Modal Ver Detalle -->
    @if($showViewModal && $selectedEdificio)
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
             <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="closeModals"></div>

             <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative z-50">
                <div class="px-6 py-4 flex justify-between items-center bg-primary-orange">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-white rounded-lg">
                            <i class="fas fa-building text-primary-orange"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white">Detalle del Edificio</h3>
                    </div>
                    <button wire:click="closeModals" class="text-white hover:text-yellow-200 transition">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <!-- Identificación -->
                        <div class="md:col-span-2 bg-orange-50 p-3 rounded border border-orange-200">
                            <span class="block text-xs font-bold text-orange-600 uppercase mb-2">Identificación</span>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <span class="block text-xs text-gray-500">CUI</span>
                                    <span class="block font-bold">{{ $selectedEdificio->cui }}</span>
                                </div>
                                @php
                                    $cabecera = $selectedEdificio->establecimientos->first(fn($e) => $e->cue_edificio_principal) ?? $selectedEdificio->establecimientos->first();
                                @endphp
                                @if($cabecera)
                                <div>
                                    <span class="block text-xs text-gray-500">CUE Edificio Principal</span>
                                    <span class="block font-bold">{{ $cabecera->cue_edificio_principal ?? $cabecera->cue }}</span>
                                </div>
                                <div class="col-span-2">
                                    <span class="block text-xs text-gray-500">Establecimiento Cabecera</span>
                                    <span class="block font-bold">{{ $cabecera->establecimiento_cabecera ?? 'SIN CABECERA' }}</span>
                                </div>
                                @endif
                            </div>
                        </div>

                        <!-- Ubicación -->
                        <div class="md:col-span-2 bg-gray-50 p-3 rounded">
                            <span class="block text-xs font-bold text-gray-500 uppercase mb-2">Ubicación</span>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <span class="block text-xs text-gray-400">Dirección</span>
                                    <span class="block font-medium">{{ $selectedEdificio->calle }} {{ $selectedEdificio->numero_puerta }}</span>
                                </div>
                                <div>
                                    <span class="block text-xs text-gray-400">Localidad</span>
                                    <span class="block font-medium">{{ $selectedEdificio->localidad }}</span>
                                </div>
                                <div>
                                    <span class="block text-xs text-gray-400">Departamento</span>
                                    <span class="block font-medium">{{ $selectedEdificio->zona_departamento }}</span>
                                </div>
                                <div>
                                    <span class="block text-xs text-gray-400">Código Postal</span>
                                    <span class="block font-medium">{{ $selectedEdificio->codigo_postal ?? 'N/A' }}</span>
                                </div>
                                @if($selectedEdificio->letra_zona)
                                <div>
                                    <span class="block text-xs text-gray-400">Letra Zona</span>
                                    <span class="block font-medium">{{ $selectedEdificio->letra_zona }}</span>
                                </div>
                                @endif
                            </div>
                        </div>

                        <!-- Coordenadas -->
                        <div class="md:col-span-2 bg-gray-50 p-3 rounded">
                            <span class="block text-xs font-bold text-gray-500 uppercase mb-2">Coordenadas</span>
                            @if($selectedEdificio->latitud && $selectedEdificio->longitud)
                                <div class="flex items-center gap-2">
                                    <span class="font-mono text-sm bg-gray-200 px-3 py-1 rounded">
                                        {{ $selectedEdificio->latitud }}, {{ $selectedEdificio->longitud }}
                                    </span>
                                    <a href="https://www.google.com/maps/search/?api=1&query={{ $selectedEdificio->latitud }},{{ $selectedEdificio->longitud }}" 
                                       target="_blank" 
                                       class="text-orange-500 hover:text-orange-600"
                                       title="Ver en Google Maps">
                                        <i class="fas fa-external-link-alt"></i> Ver en Mapa
                                    </a>
                                </div>
                            @else
                                <span class="text-sm text-gray-400 italic">No registradas</span>
                            @endif
                        </div>

                        <!-- Establecimientos -->
                        <div class="md:col-span-2 bg-gray-50 p-3 rounded">
                            <span class="block text-xs font-bold text-gray-500 uppercase mb-2">
                                Establecimientos en este Edificio ({{ $selectedEdificio->establecimientos->count() }})
                            </span>
                            <div class="space-y-2 max-h-60 overflow-y-auto">
                                @foreach($selectedEdificio->establecimientos as $est)
                                    <div class="bg-white p-2 rounded border border-gray-200">
                                        <div class="font-medium text-sm">{{ $est->nombre }}</div>
                                        <div class="flex justify-between items-center mt-1">
                                            <div class="text-xs text-gray-500">CUE: {{ $est->cue }}</div>
                                            @php
                                                $radios = $est->modalidades->pluck('radio')->filter()->unique()->implode(', ');
                                            @endphp
                                            @if($radios)
                                                <div class="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                                    Radio: {{ $radios }}
                                                </div>
                                            @endif
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
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

    <!-- Modal Editar -->
    @if($showEditModal)
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
             <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="closeModals"></div>

             <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-50">
                <div class="px-6 py-4 flex justify-between items-center bg-primary-orange">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-white rounded-lg">
                            <i class="fas fa-edit text-primary-orange"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white">Editar Edificio</h3>
                    </div>
                    <button wire:click="closeModals" class="text-white hover:text-yellow-200 transition">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <!-- Identificación -->
                         <div class="md:col-span-2 bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <h4 class="text-sm font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1">
                                <i class="fas fa-id-card mr-1"></i> Identificación
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">CUI (Solo Lectura)</label>
                                    <input type="text" value="{{ $editForm['cui'] }}" disabled class="w-full rounded-md border-gray-200 bg-gray-100 shadow-sm cursor-not-allowed">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">CUE Edificio Principal</label>
                                    <input type="text" wire:model.live.debounce.500ms="editForm.cue_edificio_principal" class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500">
                                    @if($nombreEstablecimientoPrincipal)
                                        <p class="mt-1 text-xs font-bold {{ str_contains($nombreEstablecimientoPrincipal, 'No se encontró') ? 'text-red-500' : 'text-blue-600' }}">
                                            <i class="fas fa-info-circle mr-1"></i> {{ $nombreEstablecimientoPrincipal }}
                                        </p>
                                    @endif
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Establecimiento Cabecera</label>
                                    <input type="text" wire:model="editForm.establecimiento_cabecera" class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 uppercase">
                                </div>
                            </div>
                        </div>
                        
                        <!-- Ubicación -->
                        <div class="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 class="text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                                <i class="fas fa-map-marker-alt mr-1"></i> Ubicación
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-xs font-bold uppercase mb-1">Calle</label>
                                    <input type="text" wire:model="editForm.calle" class="w-full rounded-md border-gray-300 shadow-sm uppercase">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">N° Puerta</label>
                                    <input type="text" wire:model="editForm.numero_puerta" class="w-full rounded-md border-gray-300 shadow-sm text-center">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Código Postal</label>
                                    <input type="text" wire:model="editForm.codigo_postal" class="w-full rounded-md border-gray-300 shadow-sm">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Localidad</label>
                                    <input type="text" wire:model="editForm.localidad" class="w-full rounded-md border-gray-300 shadow-sm uppercase">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Zona / Departamento</label>
                                    <input type="text" wire:model="editForm.zona_departamento" class="w-full rounded-md border-gray-300 shadow-sm uppercase">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Letra Zona</label>
                                    <input type="text" wire:model="editForm.letra_zona" maxlength="1" class="w-full rounded-md border-gray-300 shadow-sm uppercase text-center" placeholder="X">
                                </div>
                            </div>
                        </div>

                        <!-- Coordenadas -->
                        <div class="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 class="text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                                <i class="fas fa-map-pin mr-1"></i> Coordenadas Geográficas
                            </h4>
                            <div class="grid grid-cols-2 gap-4">
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
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
                    <button wire:click="updateEdificio" type="button" class="btn-primary w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 font-bold text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
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

    {{-- Modal Crear Edificio --}}
    @if($showCreateModal)
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-create-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="closeModals"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-50">
                {{-- Header del modal --}}
                {{-- Header del modal --}}
                <div class="px-6 py-4 flex justify-between items-center bg-primary-orange">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-white rounded-lg">
                            <i class="fas fa-building text-primary-orange"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white" id="modal-create-title">Nuevo Edificio</h3>
                    </div>
                    <button wire:click="closeModals" class="text-white hover:text-yellow-200 transition">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="bg-white px-6 py-5">
                    {{-- Mensajes de error --}}
                    @if($errors->any())
                        <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <ul class="text-sm text-red-600 list-disc list-inside">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {{-- Identificación --}}
                        <div class="md:col-span-2 bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <h4 class="text-sm font-bold text-orange-600 mb-3 border-b border-orange-200 pb-1">
                                <i class="fas fa-id-card mr-1"></i> Identificación
                            </h4>
                            <div>
                                <label class="block text-xs font-bold uppercase mb-1">CUI <span class="text-red-500">*</span></label>
                                <input type="text" wire:model="createForm.cui"
                                       class="w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-orange-500 uppercase"
                                       placeholder="Ej: 1234567 o PROV0443">
                                @error('createForm.cui') <span class="text-xs text-red-500">{{ $message }}</span> @enderror
                            </div>
                        </div>

                        {{-- Ubicación --}}
                        <div class="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 class="text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                                <i class="fas fa-map-marker-alt mr-1"></i> Ubicación
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-xs font-bold uppercase mb-1">Calle <span class="text-red-500">*</span></label>
                                    <input type="text" wire:model="createForm.calle"
                                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 uppercase"
                                           placeholder="Ej: AV. LIBERTADOR">
                                    @error('createForm.calle') <span class="text-xs text-red-500">{{ $message }}</span> @enderror
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">N° Puerta</label>
                                    <input type="text" wire:model="createForm.numero_puerta"
                                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 text-center"
                                           placeholder="Ej: 123">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Código Postal</label>
                                    <input type="number" wire:model="createForm.codigo_postal"
                                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500"
                                           placeholder="Ej: 5400">
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-xs font-bold uppercase mb-1">Localidad <span class="text-red-500">*</span></label>
                                    <input type="text" wire:model="createForm.localidad"
                                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 uppercase"
                                           placeholder="Ej: SAN JUAN">
                                    @error('createForm.localidad') <span class="text-xs text-red-500">{{ $message }}</span> @enderror
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Departamento <span class="text-red-500">*</span></label>
                                    <input type="text" wire:model="createForm.zona_departamento"
                                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 uppercase"
                                           placeholder="Ej: CAPITAL">
                                    @error('createForm.zona_departamento') <span class="text-xs text-red-500">{{ $message }}</span> @enderror
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Letra Zona</label>
                                    <input type="text" wire:model="createForm.letra_zona" maxlength="1"
                                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 uppercase text-center"
                                           placeholder="X">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Orientación</label>
                                    <select wire:model="createForm.orientacion"
                                            class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500">
                                        <option value="">-- Sin especificar --</option>
                                        <option value="NORTE">Norte</option>
                                        <option value="SUR">Sur</option>
                                        <option value="ESTE">Este</option>
                                        <option value="OESTE">Oeste</option>
                                        <option value="NORESTE">Noreste</option>
                                        <option value="NOROESTE">Noroeste</option>
                                        <option value="SURESTE">Sureste</option>
                                        <option value="SUROESTE">Suroeste</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {{-- Coordenadas --}}
                        <div class="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 class="text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">
                                <i class="fas fa-map-pin mr-1"></i> Coordenadas Geográficas
                            </h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Latitud</label>
                                    <input type="text" wire:model="createForm.latitud"
                                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500"
                                           placeholder="Ej: -31.5432">
                                    @error('createForm.latitud') <span class="text-xs text-red-500">{{ $message }}</span> @enderror
                                </div>
                                <div>
                                    <label class="block text-xs font-bold uppercase mb-1">Longitud</label>
                                    <input type="text" wire:model="createForm.longitud"
                                           class="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500"
                                           placeholder="Ej: -68.5432">
                                    @error('createForm.longitud') <span class="text-xs text-red-500">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        {{-- Teléfono VoIP (opcional) --}}
                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold uppercase mb-1">Teléfono VoIP</label>
                            <input type="text" wire:model="createForm.te_voip"
                                   class="w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-orange-500"
                                   placeholder="Ej: 264-4123456">
                        </div>

                    </div>
                </div>

                {{-- Footer --}}
                <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 border-t">
                    <button wire:click="createEdificio" wire:loading.attr="disabled" type="button"
                            class="btn-primary inline-flex items-center gap-2 rounded-md border border-transparent shadow-sm px-5 py-2 font-bold text-white text-sm focus:outline-none">
                        <i class="fas fa-save" wire:loading.remove wire:target="createEdificio"></i>
                        <i class="fas fa-spinner fa-spin" wire:loading wire:target="createEdificio"></i>
                        <span wire:loading.remove wire:target="createEdificio">GUARDAR EDIFICIO</span>
                        <span wire:loading wire:target="createEdificio">Guardando...</span>
                    </button>
                    <button wire:click="closeModals" type="button"
                            class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-5 py-2 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none">
                        CANCELAR
                    </button>
                </div>
            </div>
        </div>
    </div>
    @endif

</div>

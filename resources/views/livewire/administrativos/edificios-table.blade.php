<div>
    <!-- HEADER ESTRATÉGICO -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2" style="color: #FE8204;">
                <i class="fas fa-university"></i>
                <span>Ministerio de Educación</span>
                <span>•</span>
                <span>Gestión de Edificios</span>
            </nav>
            <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg" style="background-color: rgba(254, 130, 4, 0.1);">
                    <i class="fas fa-building fa-2x" style="color: #FE8204;"></i>
                </div>
                <h2 class="text-4xl font-extrabold tracking-tight" style="color: #000000;">Gestión de Edificios</h2>
            </div>
            <p class="mt-1 ml-14" style="color: #000000;">Control y administración de infraestructura educativa.</p>
        </div>
        
        <div class="flex gap-3 bg-white p-1.5 rounded-lg shadow-sm" style="border: 1px solid #FE8204;">
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
                <!-- Búsqueda -->
                <div class="md:col-span-2">
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Buscar por CUI, Localidad o Establecimiento Cabecera</label>
                    <div class="flex gap-2">
                        <div class="relative flex-1">
                            <input type="text" wire:model.live.debounce.300ms="search" placeholder="Ej: 1234567, San Juan..." 
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
                
                <!-- Departamento -->
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Departamento</label>
                    <select wire:model.live="zonaFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todos</option>
                        @foreach($zonas as $zona) <option value="{{ $zona }}">{{ $zona }}</option> @endforeach
                    </select>
                </div>
                
                <!-- Localidad -->
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Localidad</label>
                    <select wire:model.live="localidadFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todas</option>
                        @foreach($localidades as $loc) <option value="{{ $loc }}">{{ $loc }}</option> @endforeach
                    </select>
                </div>
                
                <!-- Letra Zona -->
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Letra Zona</label>
                    <select wire:model.live="letraZonaFilter" class="w-full py-2.5 bg-white rounded-lg" style="border: 1px solid #FE8204; color: #000000;">
                        <option value="">Todas</option>
                        @foreach($letrasZona as $letra) <option value="{{ $letra }}">{{ $letra }}</option> @endforeach
                    </select>
                    <div class="mt-1 text-right">
                        <span class="text-3xl font-bold" style="color: #FE8204;">
                            <i class="fas fa-list-ol mr-1"></i> Total: {{ $edificios->total() }}
                        </span>
                    </div>
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
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Identificación</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Ubicación</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Coordenadas</th>
                    <th class="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Establecimientos</th>
                    <th class="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y" style="border-color: #FADC3C;">
                @forelse($edificios as $edificio)
                    @php
                        $establecimientoCabecera = $edificio->establecimientos->first(fn($e) => $e->cue_edificio_principal) ?? $edificio->establecimientos->first();
                    @endphp
                    <tr wire:key="row-{{ $edificio->id }}" class="group transition-all cursor-default" 
                        onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.05)'"
                        onmouseout="this.style.backgroundColor='#FFFFFF'">
                        <td class="px-6 py-5">
                            <div class="flex items-center gap-3">
                                <div class="w-1.5 h-12 rounded-full" style="background-color: #FE8204;"></div>
                                <div>
                                    <div class="text-sm font-bold uppercase leading-tight" style="color: #000000;">
                                        {{ $establecimientoCabecera->establecimiento_cabecera ?? 'SIN CABECERA' }}
                                    </div>
                                    <div class="flex gap-2 mt-1.5">
                                        <span class="text-xs px-2 py-0.5 rounded-md border font-mono" style="background-color: #FFFFFF; color: #000000; border-color: #FE8204;">CUI {{ $edificio->cui }}</span>
                                        @if($establecimientoCabecera && $establecimientoCabecera->cue_edificio_principal)
                                            <span class="text-xs px-2 py-0.5 rounded-md border font-mono" style="background-color: #FFFFFF; color: #000000; border-color: #FE8204;">CUE {{ $establecimientoCabecera->cue_edificio_principal }}</span>
                                        @endif
                                    </div>
                                    @if($edificio->letra_zona)
                                        <div class="mt-1">
                                            <span class="text-xs px-2 py-0.5 rounded-md border font-mono" style="background-color: #f3f4f6; color: #374151; border-color: #d1d5db;">ZONA {{ $edificio->letra_zona }}</span>
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-5">
                            <div class="text-sm font-medium" style="color: #000000;">{{ $edificio->calle }} {{ $edificio->numero_puerta }}</div>
                            <div class="text-xs" style="color: #000000;">{{ $edificio->localidad }}</div>
                            <div class="text-xs font-bold" style="color: #FE8204;">{{ $edificio->zona_departamento }}</div>
                            @if($edificio->codigo_postal)
                                <div class="text-xs" style="color: #666;">CP: {{ $edificio->codigo_postal }}</div>
                            @endif
                        </td>
                        <td class="px-6 py-5">
                            @if($edificio->latitud && $edificio->longitud)
                                <div class="flex items-center gap-2">
                                    <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                        {{ $edificio->latitud }}, {{ $edificio->longitud }}
                                    </span>
                                    <a href="https://www.google.com/maps/search/?api=1&query={{ $edificio->latitud }},{{ $edificio->longitud }}" 
                                       target="_blank" 
                                       class="text-orange-500 hover:text-orange-600"
                                       title="Ver en Google Maps">
                                        <i class="fas fa-external-link-alt"></i>
                                    </a>
                                </div>
                            @else
                                <span class="text-xs text-gray-400 italic">No registradas</span>
                            @endif
                        </td>
                        <td class="px-6 py-5 text-center">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold" 
                                  style="background-color: rgba(254, 130, 4, 0.1); color: #FE8204;">
                                <i class="fas fa-school mr-1"></i>
                                {{ $edificio->establecimientos->count() }}
                            </span>
                        </td>
                        <td class="px-6 py-5 text-right">
                            <div class="flex justify-end gap-1 transition-all">
                                <button wire:click="viewEdificio({{ $edificio->id }})" 
                                        class="p-2 rounded-lg transition" 
                                        style="background-color: #FFFFFF; color: #FE8204; border: 1px solid #FE8204;"
                                        onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'"
                                        onmouseout="this.style.backgroundColor='#FFFFFF'"
                                        title="Ver Detalle">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button wire:click="editEdificio({{ $edificio->id }})" 
                                        class="p-2 rounded-lg transition" 
                                        style="background-color: #FFFFFF; color: #FE8204; border: 1px solid #FE8204;"
                                        onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'"
                                        onmouseout="this.style.backgroundColor='#FFFFFF'"
                                        title="Editar">
                                    <i class="fas fa-edit"></i>
                                </button>
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
                                <p class="font-medium text-lg" style="color: #000000;">No se encontraron edificios</p>
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
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-lg leading-6 font-bold text-gray-900">Detalle del Edificio</h3>
                        <button wire:click="closeModals" class="text-gray-400 hover:text-gray-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
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
                                        <div class="text-xs text-gray-500">CUE: {{ $est->cue }}</div>
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
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="flex justify-between items-center mb-5">
                       <h3 class="text-xl leading-6 font-bold text-gray-900">Editar Edificio</h3>
                       <button wire:click="closeModals" class="text-gray-400 hover:text-gray-500">
                           <i class="fas fa-times"></i>
                       </button>
                    </div>

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
                    <button wire:click="updateEdificio" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-bold text-white hover:bg-orange-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
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
</div>

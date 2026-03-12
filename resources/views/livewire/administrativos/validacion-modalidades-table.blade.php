<div>
    <!-- HEADER ESTRATÉGICO -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in">
        <div>
            <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 text-primary-orange">
                <i class="fas fa-university"></i>
                <span>Control de Calidad de Datos</span>
                <span>•</span>
                <span>Auditoría</span>
            </nav>
            <div class="flex items-center gap-3">
                <div class="p-3 rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
                    <i class="fas fa-clipboard-check fa-2x text-primary-orange"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-black tracking-tight text-black">
                        Validación de <span class="text-primary-orange">Establecimientos</span>
                    </h2>
                    <p class="text-sm text-gray-500 font-medium">Auditoría de consistencia y gestión de estados</p>
                </div>
            </div>
        </div>
        
        <div class="flex flex-wrap gap-3 glass p-2 rounded-xl">
            @if (session()->has('message'))
                <div class="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-bold flex items-center gap-2">
                    <i class="fas fa-check-circle"></i>
                    {{ session('message') }}
                </div>
            @endif
            
            <button wire:click="generarReporte" wire:loading.attr="disabled"
                    class="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                <i class="fas fa-file-pdf" wire:loading.remove wire:target="generarReporte"></i>
                <i class="fas fa-spinner fa-spin" wire:loading wire:target="generarReporte"></i>
                <span>Reporte de Auditoría</span>
            </button>
        </div>
    </div>

    <!-- FLASH MESSAGES -->
    <div class="mb-4">
        <x-toast-notifications />
    </div>

    <!-- CONTADORES TIPO DASHBOARD (KPIs) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @foreach($this->estadosMetadata as $key => $meta)
        <div wire:click="$set('estadoFilter', '{{ $key }}')" 
             class="group cursor-pointer">
            <div class="relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
                        {{ $estadoFilter === $key ? 'ring-2 ring-offset-2 ring-primary-orange shadow-md' : 'shadow-sm border border-gray-100' }}
                        {{ $meta['bg'] }}">
                
                <!-- Decorative Icon (Background) -->
                <div class="absolute -right-4 -bottom-4 text-6xl opacity-10 transform rotate-12 transition-transform group-hover:scale-110 {{ $meta['color'] }}">
                    <i class="fas {{ $meta['icon'] }}"></i>
                </div>

                <div class="relative z-10 flex flex-col items-start justify-between h-full space-y-2">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full {{ str_replace('text-', 'bg-', $meta['color']) }}"></div>
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-600 group-hover:text-gray-800 transition-colors">
                            {{ $meta['label'] }}
                        </span>
                    </div>
                    <h4 class="text-3xl font-black {{ $meta['color'] }} tracking-tight">
                        {{ number_format($contadores[$key] ?? 0, 0, ',', '.') }}
                    </h4>
                </div>
            </div>
        </div>
        @endforeach

        <!-- Tarjeta de Avance (Progreso) -->
        <div class="group cursor-default">
            <div class="relative overflow-hidden rounded-xl p-4 shadow-sm border border-gray-100 bg-purple-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <!-- Decorative Icon -->
                <div class="absolute -right-4 -bottom-4 text-6xl opacity-10 transform rotate-12 transition-transform group-hover:scale-110 text-purple-600">
                    <i class="fas fa-chart-pie"></i>
                </div>

                <div class="relative z-10 flex flex-col items-start justify-between h-full space-y-2">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-purple-600"></div>
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-600 transition-colors">
                            Progreso
                        </span>
                    </div>
                    <div class="flex items-baseline gap-1">
                        <h4 class="text-3xl font-black text-purple-600 tracking-tight">
                            {{ $porcentajeAvance }}%
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- FILTROS AVANZADOS -->
    <div class="mb-8 glass-strong rounded-xl overflow-hidden shadow-lg" x-data="{ filtersOpen: true }">
        <div class="px-6 py-4 flex justify-between items-center bg-orange-50/50 border-b border-orange-100">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg shadow-sm text-primary-orange">
                    <i class="fas fa-filter"></i>
                </div>
                <h3 class="font-bold text-gray-800">Filtros de Auditoría</h3>
            </div>
            <button @click="filtersOpen = !filtersOpen" class="text-gray-400 hover:text-primary-orange transition-colors">
                <i class="fas fa-chevron-down transform transition duration-300" :class="filtersOpen ? 'rotate-180' : ''"></i>
            </button>
        </div>

        <div x-show="filtersOpen" x-collapse class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <!-- Buscador (Línea completa o mayor peso) -->
                <div class="md:col-span-12 lg:col-span-4">
                    <label class="block text-xs font-bold uppercase mb-1 ml-1 text-gray-500">Buscar</label>
                    <div class="relative">
                        <input type="text" wire:model.live.debounce.300ms="search" 
                               placeholder="Nombre, CUE..." 
                               class="input-glass w-full pl-9 pr-4 py-2 rounded-lg text-sm transition-all focus:ring-2 focus:ring-orange-500/20">
                        <i class="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
                    </div>
                </div>

                <!-- Filtros (Grid) -->
                <div class="md:col-span-6 lg:col-span-2">
                    <label class="block text-xs font-bold uppercase mb-1 ml-1 text-gray-500">Estado</label>
                    <select wire:model.live="estadoFilter" class="input-glass w-full py-2 rounded-lg text-sm">
                        <option value="">Todos</option>
                        @foreach($this->estadosMetadata as $key => $meta)
                            <option value="{{ $key }}">{{ $meta['label'] }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="md:col-span-6 lg:col-span-3">
                    <label class="block text-xs font-bold uppercase mb-1 ml-1 text-gray-500">Nivel</label>
                    <select wire:model.live="nivelFilter" class="input-glass w-full py-2 rounded-lg text-sm">
                        <option value="">Todos</option>
                        @foreach($opciones['niveles'] as $nivel)
                            <option value="{{ $nivel }}">{{ $nivel }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="md:col-span-6 lg:col-span-3">
                    <label class="block text-xs font-bold uppercase mb-1 ml-1 text-gray-500">Ámbito</label>
                    <select wire:model.live="ambitoFilter" class="input-glass w-full py-2 rounded-lg text-sm">
                        <option value="">Todos</option>
                        @foreach($opciones['ambitos'] as $ambito)
                            <option value="{{ $ambito }}">{{ $ambito }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="md:col-span-12 lg:col-span-4">
                    <label class="block text-xs font-bold uppercase mb-1 ml-1 text-gray-500">Departamento</label>
                    <select wire:model.live="departamentoFilter" class="input-glass w-full py-2 rounded-lg text-sm">
                        <option value="">Todos</option>
                        @foreach($opciones['departamentos'] as $depto)
                            <option value="{{ $depto }}">{{ $depto }}</option>
                        @endforeach
                    </select>
                </div>

                <!-- Filtros de Fecha -->
                <div class="md:col-span-6 lg:col-span-2">
                    <label class="block text-xs font-bold uppercase mb-1 ml-1 text-gray-500">Desde (Auditado)</label>
                    <input type="date" wire:model.live="desdeFilter" class="input-glass w-full py-2 rounded-lg text-sm">
                </div>

                <div class="md:col-span-6 lg:col-span-2">
                    <label class="block text-xs font-bold uppercase mb-1 ml-1 text-gray-500">Hasta (Auditado)</label>
                    <input type="date" wire:model.live="hastaFilter" class="input-glass w-full py-2 rounded-lg text-sm">
                </div>

                <!-- Toggle Papelera -->
                <div class="md:col-span-12 flex items-end justify-end pt-2">
                    <label class="inline-flex items-center cursor-pointer group">
                        <input type="checkbox" wire:model.live="verEliminados" class="sr-only peer">
                        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        <span class="ms-3 text-sm font-bold text-gray-700 group-hover:text-red-700 transition-colors">
                            <i class="fas fa-trash-alt mr-1 {{ $verEliminados ? 'text-red-600' : 'text-gray-400' }}"></i>
                            Ver registros dado de Baja
                        </span>
                    </label>
                </div>
            <!-- Filtro de Año Eliminado -->
        </div>
    </div>

    <!-- TABLA DE VALIDACIÓN -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-primary-orange text-white">
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Establecimiento</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Detalles Educativos</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Ubicación</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Estado</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider w-32">Validador</th>
                        <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    @forelse($modalidades as $modalidad)
                        @php
                            $inactivo = $modalidad->trashed() || in_array($modalidad->estado_validacion, ['BAJA', 'ELIMINADO']);
                            $rowClass = $inactivo 
                                ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-200' 
                                : 'group hover:bg-orange-50/30 transition-colors duration-200';
                            $opacityClass = $inactivo ? 'opacity-70' : '';
                            
                            // Determinar ruta según rol
                            $auditoriaRoute = auth()->user()->isAdmin() 
                                ? route('admin.edificios.auditoria', $modalidad->establecimiento->edificio_id)
                                : route('administrativos.edificios.auditoria', $modalidad->establecimiento->edificio_id);
                        @endphp
                        <tr class="{{ $rowClass }}">
                            <td class="px-6 py-5 {{ $opacityClass }}">
                                <div class="flex items-center gap-4">

                                    <div>
                                        <p class="text-sm font-bold {{ $inactivo ? 'text-gray-600' : 'text-gray-800' }} leading-tight">
                                            {{ $modalidad->establecimiento->nombre }} 
                                            @if($modalidad->trashed())
                                                <span class="ml-1 text-[10px] text-red-500 font-black uppercase">(Papelera)</span>
                                            @endif
                                        </p>
                                        <span class="text-sm font-black bg-gray-900 text-primary-orange px-3 py-1 rounded-lg border border-gray-800 mt-2 inline-flex items-center gap-2 font-mono shadow-md">
                                            <i class="fas fa-barcode text-[10px] opacity-70"></i>
                                            CUE: {{ $modalidad->establecimiento->cue }}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5 {{ $opacityClass }}">
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold text-gray-700">{{ $modalidad->nivel_educativo }}</span>
                                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 self-start">{{ $modalidad->ambito }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-5 {{ $opacityClass }}">
                                <div class="flex flex-col gap-0.5 text-xs">
                                    <div class="flex items-center gap-1.5">
                                        <a href="{{ $auditoriaRoute }}" 
                                           wire:navigate
                                           class="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-primary-orange hover:bg-primary-orange hover:text-white transition-all shadow-sm border border-orange-100"
                                           title="Entrar a Auditoría de Edificio">
                                            <i class="fas fa-eye text-xs"></i>
                                        </a>
                                        <span class="text-gray-500 text-[10px]">{{ $modalidad->establecimiento->edificio->zona_departamento ?? 'S/D' }}</span>
                                    </div>
                                    <span class="text-gray-400 text-[10px] truncate max-w-[150px]" title="{{ $modalidad->establecimiento->edificio->calle ?? '' }}">
                                        {{ $modalidad->establecimiento->edificio->calle ?? '' }} {{ $modalidad->establecimiento->edificio->numero_puerta ?? '' }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-5 whitespace-nowrap">
                                @php
                                    $meta = $this->estadosMetadata[$modalidad->estado_validacion] ?? null;
                                    $class = $meta ? "{$meta['bg']} {$meta['color']} {$meta['border']}" : 'bg-gray-100 text-gray-800 border-gray-200';
                                    $label = $meta ? $meta['badge'] : $modalidad->estado_validacion;
                                    $icon = $meta ? $meta['icon'] : 'fa-question-circle';
                                @endphp
                                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit {{ $class }}">
                                    <i class="fas {{ $icon }}"></i>
                                    {{ $label }}
                                </span>
                            </td>
                            <td class="px-6 py-5 {{ $opacityClass }}">
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-user-check {{ $inactivo ? 'text-gray-400' : 'text-primary-orange' }}"></i>
                                    <div>
                                        <p class="text-xs font-bold {{ $inactivo ? 'text-gray-500' : 'text-gray-800' }}">{{ $modalidad->usuarioValidacion?->name ?? 'SISTEMA' }}</p>
                                        <p class="text-[10px] uppercase font-bold text-gray-400">{{ $modalidad->validado_en?->format('d/m/Y') ?? 'Pendiente' }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5 text-right">
                                <div class="flex justify-end gap-1.5 transition-all">
                                    @if($modalidad->estado_validacion === 'PENDIENTE')
                                    <button wire:click="toggleCorrecto({{ $modalidad->id }})"
                                            class="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm border border-green-100"
                                            title="Validar como Correcto">
                                        <i class="fas fa-check"></i>
                                    </button>
                                    @endif
                                    <button wire:click="abrirCambiarEstado({{ $modalidad->id }})"
                                            class="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 text-primary-orange hover:bg-primary-orange hover:text-white transition-all shadow-sm border border-orange-100"
                                            title="Editar Estado/Validar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button wire:click="abrirHistorial({{ $modalidad->id }})"
                                            class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all border border-gray-100"
                                            title="Ver Historial">
                                        <i class="fas fa-history text-[10px]"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center justify-center">
                                    <div class="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                                        <i class="fas fa-search fa-2x text-primary-orange/50"></i>
                                    </div>
                                    <h3 class="text-lg font-bold text-gray-900">No hay registros para validar</h3>
                                    <p class="text-gray-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            {{ $modalidades->links() }}
        </div>
    </div>

    <!-- MODAL CAMBIAR ESTADO -->
    @if($showCambiarEstadoModal)
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
             <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="cerrarModales"></div>

             <!-- Centering trick -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                <!-- Header -->
                <div class="px-6 py-4 flex justify-between items-center bg-orange-50/50 border-b border-orange-100">
                    <div class="flex items-center gap-3 text-primary-orange">
                        <div class="p-2 bg-orange-50 rounded-lg">
                            <i class="fas fa-edit"></i>
                        </div>
                        <h3 class="font-black text-xl">Validar Estado</h3>
                    </div>
                    <button wire:click="cerrarModales" class="text-gray-400 hover:text-primary-orange transition">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 space-y-4">
                    @if($modalidadSeleccionada)
                        <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p class="text-xs font-bold text-gray-400 uppercase mb-1">Establecimiento</p>
                            <p class="font-bold text-gray-800">{{ $modalidadSeleccionada->establecimiento->nombre }}</p>
                            <div class="flex gap-2 mt-2">
                                 <span class="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono">
                                    CUE: {{ $modalidadSeleccionada->establecimiento->cue }}
                                 </span>
                                 <span class="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono">
                                    Estado Actual: {{ $modalidadSeleccionada->estado_validacion }}
                                 </span>
                            </div>
                        </div>
                    @endif

                    <div class="grid grid-cols-1 gap-3">
                        <label class="block text-sm font-bold text-gray-700 mb-2 text-center">Seleccione el resultado de la auditoría</label>
                        <div class="grid grid-cols-3 gap-3">
                            @foreach($this->estadosMetadata as $key => $meta)
                                <button type="button" 
                                        wire:click="$set('nuevoEstado', '{{ $key }}')"
                                        class="flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 
                                               {{ $nuevoEstado === $key 
                                                  ? "{$meta['border']} {$meta['bg']} ring-2 ring-offset-2 ring-opacity-50 ".str_replace('text-', 'ring-', $meta['color']) 
                                                  : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50' }}">
                                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl {{ $meta['bg'] }} {{ $meta['color'] }}">
                                        <i class="fas {{ $meta['icon'] }}"></i>
                                    </div>
                                    <span class="text-[11px] font-black uppercase tracking-tight {{ $meta['color'] }}">{{ $meta['badge'] }}</span>
                                    <span class="text-[9px] text-gray-400 leading-tight text-center">{{ $meta['description'] }}</span>
                                </button>
                            @endforeach
                        </div>
                        @error('nuevoEstado') <span class="text-red-500 text-xs mt-1 block text-center">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Observaciones</label>
                        <textarea wire:model="observaciones" rows="3" 
                                  class="input-glass w-full" 
                                  placeholder="Ingrese detalles sobre la validación..."></textarea>
                        @error('observaciones') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
                        <p class="text-xs text-gray-400 mt-2">
                            <i class="fas fa-info-circle mr-1"></i>
                            Obligatorio para estados: CORREGIDO, BAJA, ELIMINADO.
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                    <button wire:click="cambiarEstado" class="btn-primary w-full sm:w-auto sm:ml-3">
                        <i class="fas fa-save mr-2"></i> Guardar Cambios
                    </button>
                    <button wire:click="cerrarModales" class="btn-secondary w-full sm:w-auto mt-3 sm:mt-0">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
    @endif

    <!-- MODAL HISTORIAL -->
    @if($showHistorialModal)
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
             <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="cerrarModales"></div>

             <!-- Centering trick -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-50">
                <!-- Header -->
                <div class="px-6 py-4 flex justify-between items-center bg-orange-50/50 border-b border-orange-100">
                    <div class="flex items-center gap-3 text-primary-orange">
                        <div class="p-2 bg-orange-50 rounded-lg">
                            <i class="fas fa-history"></i>
                        </div>
                        <h3 class="font-black text-xl">Historial de Cambios</h3>
                    </div>
                    <button wire:click="cerrarModales" class="text-gray-400 hover:text-primary-orange transition">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="space-y-4 max-h-[60vh] overflow-y-auto">
                        @if($modalidadSeleccionada && $modalidadSeleccionada->historialEstados && $modalidadSeleccionada->historialEstados->count() > 0)
                            <div class="relative border-l-2 border-gray-200 ml-3 space-y-6">
                                @foreach($modalidadSeleccionada->historialEstados as $historial)
                                    <div class="relative pl-6">
                                        <span class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-primary-orange"></span>
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <p class="font-bold text-gray-800">{{ $historial->estado_nuevo }}</p>
                                                <p class="text-xs text-gray-500">
                                                    Por: <span class="font-bold">{{ $historial->user->name ?? 'Sistema' }}</span>
                                                </p>
                                            </div>
                                            <span class="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                                {{ $historial->created_at->format('d/m/Y H:i') }}
                                            </span>
                                        </div>
                                        @if($historial->observaciones)
                                            <div class="mt-2 p-3 bg-orange-50/50 rounded-lg text-sm text-gray-600 border border-orange-100">
                                                <i class="fas fa-comment-alt text-primary-orange mr-1 opacity-50"></i>
                                                {{ $historial->observaciones }}
                                            </div>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <div class="text-center py-8 text-gray-400">
                                <i class="fas fa-history fa-2x mb-2 opacity-50"></i>
                                <p>No hay historial de cambios registrado.</p>
                            </div>
                        @endif
                    </div>
                </div>

                <!-- Footer -->
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                    <button wire:click="cerrarModales" class="btn-secondary w-full sm:w-auto">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
    @endif
</div>
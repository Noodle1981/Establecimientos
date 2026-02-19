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
        </div>
    </div>

    <!-- FLASH MESSAGES -->
    <div class="mb-4">
        <x-toast-notifications />
    </div>

    <!-- CONTADORES TIPO DASHBOARD (KPIs) -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        @php
            $estados = [
                'PENDIENTE' => ['label' => 'Pendientes', 'icon' => 'fa-clock', 'color' => 'text-yellow-500', 'border' => 'border-yellow-500', 'bg' => 'bg-yellow-50'],
                'CORRECTO'  => ['label' => 'Correctos', 'icon' => 'fa-check-circle', 'color' => 'text-primary-orange', 'border' => 'border-primary-orange', 'bg' => 'bg-orange-50'],
                'CORREGIDO' => ['label' => 'Corregidos', 'icon' => 'fa-sync', 'color' => 'text-blue-500', 'border' => 'border-blue-500', 'bg' => 'bg-blue-50'],
                'BAJA'      => ['label' => 'De Baja', 'icon' => 'fa-exclamation-triangle', 'color' => 'text-secondary-red', 'border' => 'border-secondary-red', 'bg' => 'bg-red-50'],
                'ELIMINADO' => ['label' => 'Eliminados', 'icon' => 'fa-trash-alt', 'color' => 'text-gray-800', 'border' => 'border-gray-800', 'bg' => 'bg-gray-50'],
            ];
        @endphp

        @foreach($estados as $key => $meta)
        <div wire:click="$set('estadoFilter', '{{ $key }}')" 
             class="group cursor-pointer transition-all duration-300">
            <div class="bg-white p-5 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all {{ $estadoFilter === $key ? 'ring-2 ring-offset-2 ring-primary-orange' : '' }}"
                 class="{{ $meta['border'] }}">
                <div class="flex flex-col">
                    <span class="text-xs font-bold uppercase {{ $meta['color'] }} opacity-80">{{ $meta['label'] }}</span>
                    <h4 class="text-3xl font-black {{ $meta['color'] }}">{{ $contadores[$key] ?? 0 }}</h4>
                </div>
            </div>
        </div>
        @endforeach
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
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="md:col-span-3">
                    <label class="block text-xs font-bold uppercase mb-2 ml-1 text-gray-500">Buscar Establecimiento</label>
                    <div class="relative">
                        <input type="text" wire:model.live.debounce.300ms="search" 
                               placeholder="Nombre o número de CUE..." 
                               class="input-glass w-full pl-10 pr-4 py-2.5 rounded-lg transition-all focus:ring-2 focus:ring-orange-500/20">
                        <i class="fas fa-school absolute left-3 top-3.5 text-gray-400"></i>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1 text-gray-500">Estado de Validación</label>
                    <select wire:model.live="estadoFilter" class="input-glass w-full py-2.5 rounded-lg">
                        <option value="">Todos</option>
                        @foreach($estados as $key => $meta)
                            <option value="{{ $key }}">{{ $meta['label'] }}</option>
                        @endforeach
                    </select>
                </div>
            </div>
        </div>
    </div>

    <!-- TABLA DE VALIDACIÓN -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-primary-orange text-white">
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Establecimiento / CUE</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Estado Auditoría</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Validador</th>
                        <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    @forelse($modalidades as $modalidad)
                        <tr class="group hover:bg-orange-50/30 transition-colors duration-200">
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-4">
                                    <!-- Identificador Visual -->
                                    <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-black border border-gray-200 text-primary-orange shadow-sm group-hover:border-primary-orange transition-colors">
                                        {{ substr($modalidad->establecimiento->nombre, 0, 1) }}
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-gray-800 leading-tight">
                                            {{ $modalidad->establecimiento->nombre }}
                                        </p>
                                        <div class="flex gap-2 mt-1.5 font-mono text-[10px]">
                                            <span class="px-2 py-0.5 rounded border border-gray-200 text-gray-500">CUE {{ $modalidad->establecimiento->cue }}</span>
                                            <span class="px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">{{ $modalidad->nivel_educativo }}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5">
                                @php
                                    $badgeClasses = [
                                        'PENDIENTE' => 'bg-yellow-100 text-yellow-800 border-yellow-200',
                                        'CORRECTO'  => 'bg-green-100 text-green-800 border-green-200',
                                        'CORREGIDO' => 'bg-blue-100 text-blue-800 border-blue-200',
                                        'BAJA'      => 'bg-red-100 text-red-800 border-red-200',
                                        'ELIMINADO' => 'bg-gray-100 text-gray-800 border-gray-200',
                                    ];
                                    $class = $badgeClasses[$modalidad->estado_validacion] ?? 'bg-gray-100 text-gray-800 border-gray-200';
                                @endphp
                                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border {{ $class }}">
                                    {{ $modalidad->estado_validacion }}
                                </span>
                            </td>
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-user-check text-primary-orange"></i>
                                    <div>
                                        <p class="text-xs font-bold text-gray-800">{{ $modalidad->usuarioValidacion?->name ?? 'SISTEMA' }}</p>
                                        <p class="text-[10px] uppercase font-bold text-gray-400">{{ $modalidad->validado_en?->format('d/m/Y') ?? 'Pendiente' }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5 text-right">
                                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button wire:click="abrirCambiarEstado({{ $modalidad->id }})"
                                            class="btn-primary px-4 py-2 text-[10px] uppercase tracking-tighter shadow-md">
                                        <i class="fas fa-edit mr-1"></i> Validar
                                    </button>
                                    <button wire:click="abrirHistorial({{ $modalidad->id }})"
                                            class="btn-secondary px-3 py-2 text-gray-500 hover:text-primary-orange border-gray-200">
                                        <i class="fas fa-history"></i>
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

                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Nuevo Estado</label>
                        <select wire:model="nuevoEstado" class="input-glass w-full">
                            <option value="">Seleccione un estado...</option>
                            <option value="PENDIENTE">PENDIENTE (En revisión)</option>
                            <option value="CORRECTO">CORRECTO (Aprobado)</option>
                            <option value="CORREGIDO">CORREGIDO (Con cambios)</option>
                            <option value="BAJA">DE BAJA (Inactivo)</option>
                            <option value="ELIMINADO">ELIMINADO (Error de carga)</option>
                        </select>
                        @error('nuevoEstado') <span class="text-red-500 text-xs mt-1 block">{{ $message }}</span> @enderror
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
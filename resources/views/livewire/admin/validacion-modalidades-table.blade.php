<div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-black mb-2">Validación de Modalidades</h1>
            <p class="text-gray-600">Gestión del estado de validación de modalidades educativas</p>
        </div>

        @if (session()->has('message'))
            <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                {{ session('message') }}
            </div>
        @endif

        <!-- Contadores por Estado -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div class="glass rounded-xl p-4 cursor-pointer hover:shadow-lg transition" 
                 wire:click="$set('estadoFilter', 'PENDIENTE')">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-2xl font-bold text-yellow-600">{{ $contadores['PENDIENTE'] }}</p>
                        <p class="text-xs text-gray-600">Pendientes</p>
                    </div>
                    <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                </div>
            </div>

            <div class="glass rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
                 wire:click="$set('estadoFilter', 'CORRECTO')">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-2xl font-bold text-green-600">{{ $contadores['CORRECTO'] }}</p>
                        <p class="text-xs text-gray-600">Correctos</p>
                    </div>
                    <div class="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
            </div>

            <div class="glass rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
                 wire:click="$set('estadoFilter', 'CORREGIDO')">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-2xl font-bold text-blue-600">{{ $contadores['CORREGIDO'] }}</p>
                        <p class="text-xs text-gray-600">Corregidos</p>
                    </div>
                    <div class="w-3 h-3 rounded-full bg-blue-400"></div>
                </div>
            </div>

            <div class="glass rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
                 wire:click="$set('estadoFilter', 'BAJA')">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-2xl font-bold text-orange-600">{{ $contadores['BAJA'] }}</p>
                        <p class="text-xs text-gray-600">De Baja</p>
                    </div>
                    <div class="w-3 h-3 rounded-full bg-orange-400"></div>
                </div>
            </div>

            <div class="glass rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
                 wire:click="$set('estadoFilter', 'ELIMINADO')">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-2xl font-bold text-red-600">{{ $contadores['ELIMINADO'] }}</p>
                        <p class="text-xs text-gray-600">Eliminados</p>
                    </div>
                    <div class="w-3 h-3 rounded-full bg-red-400"></div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="glass rounded-2xl p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Search -->
                <div class="md:col-span-2">
                    <input type="text" 
                           wire:model.live="search"
                           placeholder="Buscar por establecimiento o CUE..."
                           class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                </div>

                <!-- Estado Filter -->
                <div>
                    <select wire:model.live="estadoFilter"
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                        <option value="">Todos los estados</option>
                        <option value="PENDIENTE">🟡 Pendiente</option>
                        <option value="CORRECTO">🟢 Correcto</option>
                        <option value="CORREGIDO">🔵 Corregido</option>
                        <option value="BAJA">🟠 Baja</option>
                        <option value="ELIMINADO">🔴 Eliminado</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="glass rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Establecimiento</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CUE</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validado Por</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        @forelse($modalidades as $modalidad)
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 text-sm text-gray-900">
                                    {{ $modalidad->establecimiento->nombre }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">
                                    {{ $modalidad->establecimiento->cue }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">
                                    {{ $modalidad->nivel_educativo }}
                                </td>
                                <td class="px-6 py-4">
                                    @php
                                        $badgeClasses = [
                                            'PENDIENTE' => 'bg-yellow-100 text-yellow-800 border-yellow-300',
                                            'CORRECTO' => 'bg-green-100 text-green-800 border-green-300',
                                            'CORREGIDO' => 'bg-blue-100 text-blue-800 border-blue-300',
                                            'BAJA' => 'bg-orange-100 text-orange-800 border-orange-300',
                                            'ELIMINADO' => 'bg-red-100 text-red-800 border-red-300',
                                        ];
                                    @endphp
                                    <span class="px-3 py-1 rounded-full text-xs font-medium border {{ $badgeClasses[$modalidad->estado_validacion] ?? 'bg-gray-100 text-gray-800' }}">
                                        {{ $modalidad->estado_validacion }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">
                                    {{ $modalidad->usuarioValidacion?->name ?? '-' }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">
                                    {{ $modalidad->validado_en?->format('d/m/Y H:i') ?? '-' }}
                                </td>
                                <td class="px-6 py-4 text-right space-x-2">
                                    <button wire:click="abrirCambiarEstado({{ $modalidad->id }})"
                                            class="text-orange-600 hover:text-orange-800 text-sm font-medium">
                                        Cambiar Estado
                                    </button>
                                    <button wire:click="abrirHistorial({{ $modalidad->id }})"
                                            class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        Historial
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                                    No se encontraron modalidades
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-6 py-4 border-t border-gray-200">
                {{ $modalidades->links() }}
            </div>
        </div>
    </div>

    <!-- Modal: Cambiar Estado -->
    @if($showCambiarEstadoModal && $modalidadSeleccionada)
        <div class="fixed inset-0 z-50 overflow-y-auto" x-data="{ show: @entangle('showCambiarEstadoModal') }">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-black opacity-50" wire:click="cerrarModales"></div>
                
                <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                    <h3 class="text-xl font-bold text-black mb-4">Cambiar Estado</h3>
                    
                    <div class="mb-4">
                        <p class="text-sm text-gray-600 mb-2">Establecimiento:</p>
                        <p class="font-medium">{{ $modalidadSeleccionada->establecimiento->nombre }}</p>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nuevo Estado</label>
                        <select wire:model="nuevoEstado" 
                                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                            <option value="PENDIENTE">🟡 Pendiente</option>
                            <option value="CORRECTO">🟢 Correcto</option>
                            <option value="CORREGIDO">🔵 Corregido</option>
                            <option value="BAJA">🟠 Baja</option>
                            <option value="ELIMINADO">🔴 Eliminado</option>
                        </select>
                        @error('nuevoEstado') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Observaciones
                            @if(in_array($nuevoEstado, ['CORREGIDO', 'BAJA', 'ELIMINADO']))
                                <span class="text-red-500">*</span>
                            @endif
                        </label>
                        <textarea wire:model="observaciones" 
                                  rows="3"
                                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                                  placeholder="Ingrese las observaciones..."></textarea>
                        @error('observaciones') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button wire:click="cerrarModales"
                                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button wire:click="cambiarEstado"
                                class="px-4 py-2 rounded-lg text-white hover:opacity-90"
                                style="background-color: #FF8200;">
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    @endif

    <!-- Modal: Historial -->
    @if($showHistorialModal && $modalidadSeleccionada)
        <div class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-black opacity-50" wire:click="cerrarModales"></div>
                
                <div class="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6">
                    <h3 class="text-xl font-bold text-black mb-4">Historial de Estados</h3>
                    
                    <div class="mb-4">
                        <p class="text-sm text-gray-600 mb-2">Establecimiento:</p>
                        <p class="font-medium">{{ $modalidadSeleccionada->establecimiento->nombre }}</p>
                    </div>

                    <div class="space-y-4 max-h-96 overflow-y-auto">
                        @forelse($modalidadSeleccionada->historialEstados->sortByDesc('created_at') as $historial)
                            <div class="border-l-4 border-orange-500 pl-4 py-2">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <p class="font-medium text-sm">
                                            @if($historial->estado_anterior)
                                                {{ $historial->estado_anterior }} → 
                                            @endif
                                            <span class="text-orange-600">{{ $historial->estado_nuevo }}</span>
                                        </p>
                                        <p class="text-xs text-gray-600 mt-1">
                                            Por: {{ $historial->user->name ?? 'Sistema' }} • 
                                            {{ $historial->created_at->format('d/m/Y H:i') }}
                                        </p>
                                        @if($historial->observaciones)
                                            <p class="text-sm text-gray-700 mt-2 italic">
                                                "{{ $historial->observaciones }}"
                                            </p>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        @empty
                            <p class="text-center text-gray-500 py-8">No hay historial disponible</p>
                        @endforelse
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button wire:click="cerrarModales"
                                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    @endif
</div>

<div class="p-6 bg-white">
    <div class="mb-6 flex justify-between items-center">
        <div>
            <h2 class="text-3xl font-bold text-black">Gestión de Modalidades</h2>
            <p class="text-gray-600 mt-1">{{ $modalidades->total() }} modalidades encontradas</p>
        </div>
        
        <button wire:click="$toggle('showDeleted')" 
                class="px-6 py-3 rounded-lg text-white font-medium transition hover:opacity-90"
                style="background-color: var(--primary-orange);">
            {{ $showDeleted ? '👁️ Mostrar Activos' : '🗑️ Mostrar Eliminados' }}
        </button>
    </div>

    @if (session()->has('success'))
        <div class="mb-4 glass rounded-lg p-4 border-l-4" style="border-color: var(--primary-orange);">
            <p class="text-black font-medium">✅ {{ session('success') }}</p>
        </div>
    @endif

    <!-- Filtros -->
    <div class="mb-6 glass rounded-xl p-6">
        <h3 class="font-semibold text-black mb-4">Filtros</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">🔍 Buscar Establecimiento</label>
                <input type="text" 
                       wire:model.live="search" 
                       placeholder="Nombre del establecimiento..."
                       class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">📚 Nivel Educativo</label>
                <select wire:model.live="nivelFilter" 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition">
                    <option value="">Todos los niveles</option>
                    @foreach($niveles as $nivel)
                        <option value="{{ $nivel }}">{{ $nivel }}</option>
                    @endforeach
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">🏛️ Ámbito</label>
                <select wire:model.live="ambitoFilter" 
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition">
                    <option value="">Todos</option>
                    <option value="PUBLICO">Público</option>
                    <option value="PRIVADO">Privado</option>
                </select>
            </div>
        </div>
    </div>

    <!-- Tabla -->
    <div class="glass rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead style="background-color: rgba(255, 130, 0, 0.05);">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                            Establecimiento
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                            Nivel Educativo
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                            Dirección de Área
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                            Ámbito
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                            Localidad
                        </th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                    @forelse($modalidades as $modalidad)
                        <tr class="hover:bg-orange-50 transition {{ $modalidad->trashed() ? 'bg-red-50' : '' }}">
                            <td class="px-6 py-4">
                                <div class="text-sm font-semibold text-black">
                                    {{ $modalidad->establecimiento->nombre }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    CUE: {{ $modalidad->establecimiento->cue }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-sm font-medium text-black">{{ $modalidad->nivel_educativo }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-sm text-gray-700">{{ $modalidad->direccion_area }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    {{ $modalidad->ambito === 'PUBLICO' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800' }}">
                                    {{ $modalidad->ambito }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-sm text-gray-700">{{ $modalidad->establecimiento->edificio->localidad }}</span>
                            </td>
                            <td class="px-6 py-4">
                                @if($modalidad->trashed())
                                    <div class="flex space-x-2">
                                        @can('restore', $modalidad)
                                            <button wire:click="restore({{ $modalidad->id }})" 
                                                    class="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition">
                                                ↩️ Restaurar
                                            </button>
                                        @endcan
                                        
                                        @can('forceDelete', $modalidad)
                                            <button wire:click="forceDelete({{ $modalidad->id }})" 
                                                    wire:confirm="⚠️ ¿Eliminar PERMANENTEMENTE? Esta acción no se puede deshacer."
                                                    class="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition">
                                                🗑️ Eliminar Permanentemente
                                            </button>
                                        @endcan
                                    </div>
                                @else
                                    @can('delete', $modalidad)
                                        <button wire:click="softDelete({{ $modalidad->id }})" 
                                                wire:confirm="¿Estás seguro de eliminar esta modalidad?"
                                                class="px-3 py-1 text-white text-xs rounded-lg hover:opacity-90 transition"
                                                style="background-color: var(--primary-orange);">
                                            🗑️ Eliminar
                                        </button>
                                    @endcan
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center">
                                <div class="text-gray-400">
                                    <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <p class="text-lg font-medium">No se encontraron modalidades</p>
                                    <p class="text-sm">Intenta ajustar los filtros de búsqueda</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- Paginación -->
    <div class="mt-6">
        {{ $modalidades->links() }}
    </div>
</div>

<div class="p-6">
    <div class="mb-6 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800">Gestión de Modalidades</h2>
        
        <button wire:click="$toggle('showDeleted')" 
                class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            {{ $showDeleted ? 'Mostrar Activos' : 'Mostrar Eliminados' }}
        </button>
    </div>

    @if (session()->has('success'))
        <div class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {{ session('success') }}
        </div>
    @endif

    <!-- Filtros -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Establecimiento</label>
            <input type="text" 
                   wire:model.live="search" 
                   placeholder="Nombre del establecimiento..."
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nivel Educativo</label>
            <select wire:model.live="nivelFilter" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Todos</option>
                @foreach($niveles as $nivel)
                    <option value="{{ $nivel }}">{{ $nivel }}</option>
                @endforeach
            </select>
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ámbito</label>
            <select wire:model.live="ambitoFilter" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Todos</option>
                <option value="PUBLICO">Público</option>
                <option value="PRIVADO">Privado</option>
            </select>
        </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Establecimiento
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nivel Educativo
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dirección de Área
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ámbito
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localidad
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @forelse($modalidades as $modalidad)
                    <tr class="{{ $modalidad->trashed() ? 'bg-red-50' : '' }}">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">
                                {{ $modalidad->establecimiento->nombre }}
                            </div>
                            <div class="text-sm text-gray-500">
                                CUE: {{ $modalidad->establecimiento->cue }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ $modalidad->nivel_educativo }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ $modalidad->direccion_area }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                {{ $modalidad->ambito === 'PUBLICO' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800' }}">
                                {{ $modalidad->ambito }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ $modalidad->establecimiento->edificio->localidad }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            @if($modalidad->trashed())
                                @can('restore', $modalidad)
                                    <button wire:click="restore({{ $modalidad->id }})" 
                                            class="text-green-600 hover:text-green-900 mr-3">
                                        Restaurar
                                    </button>
                                @endcan
                                
                                @can('forceDelete', $modalidad)
                                    <button wire:click="forceDelete({{ $modalidad->id }})" 
                                            wire:confirm="¿Eliminar PERMANENTEMENTE? Esta acción no se puede deshacer."
                                            class="text-red-600 hover:text-red-900">
                                        Eliminar Permanentemente
                                    </button>
                                @endcan
                            @else
                                @can('delete', $modalidad)
                                    <button wire:click="softDelete({{ $modalidad->id }})" 
                                            wire:confirm="¿Estás seguro de eliminar esta modalidad?"
                                            class="text-red-600 hover:text-red-900">
                                        Eliminar
                                    </button>
                                @endcan
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                            No se encontraron modalidades.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Paginación -->
    <div class="mt-4">
        {{ $modalidades->links() }}
    </div>
</div>

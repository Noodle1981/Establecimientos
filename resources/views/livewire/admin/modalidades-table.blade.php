<div class="p-6 bg-white">
    <div class="mb-6 flex justify-between items-center">
        <div>
            <h2 class="text-3xl font-bold text-black">Gestión de Modalidades</h2>
            <p class="text-gray-600 mt-1">{{ $modalidades->total() }} modalidades encontradas</p>
        </div>
        
        <div class="flex gap-3">
            <button wire:click="openCreateModal" 
                    class="px-6 py-3 rounded-lg bg-green-600 text-white font-medium transition hover:bg-green-700">
                ➕ Crear Establecimiento
            </button>
            <button wire:click="$toggle('showDeleted')" 
                    class="px-6 py-3 rounded-lg text-white font-medium transition hover:opacity-90"
                    style="background-color: var(--primary-orange);">
                {{ $showDeleted ? '👁️ Mostrar Activos' : '🗑️ Mostrar Eliminados' }}
            </button>
        </div>
    </div>

    @if (session()->has('success'))
        <div class="mb-4 glass rounded-lg p-4 border-l-4" style="border-color: var(--primary-orange);">
            <p class="text-black font-medium">✅ {{ session('success') }}</p>
        </div>
    @endif

    <!-- Filtros -->
    <div class="mb-6 glass rounded-xl p-6">
        <h3 class="font-semibold text-black mb-4">Filtros</h3>
        <div class="flex flex-wrap gap-4 items-end">
            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-2">🔍 Buscar Establecimiento</label>
                <input type="text" wire:model="search" placeholder="Nombre del establecimiento..." class="input-primary">
            </div>
            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-2">📚 Nivel Educativo</label>
                <select wire:model="nivelFilter" class="input-primary">
                    <option value="">Todos los niveles</option>
                    @foreach($niveles as $nivel)
                        <option value="{{ $nivel }}">{{ $nivel }}</option>
                    @endforeach
                </select>
            </div>
            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-700 mb-2">🏛️ Ámbito</label>
                <select wire:model="ambitoFilter" class="input-primary">
                    <option value="">Todos</option>
                    <option value="PUBLICO">Público</option>
                    <option value="PRIVADO">Privado</option>
                </select>
            </div>
            <div>
                <button wire:click="$refresh" class="btn-primary">🔍 Filtrar</button>
            </div>
        </div>
    </div>

    <!-- Tabla -->
    <div class="glass rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead style="background-color: rgba(255, 130, 0, 0.05);">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Establecimiento</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Nivel</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Dirección Área</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Ámbito</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Departamento/Zona</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                    @forelse($modalidades as $modalidad)
                        <tr class="hover:bg-orange-50 transition {{ $modalidad->trashed() ? 'bg-red-50' : '' }}">
                            <td class="px-6 py-4">
                                <div class="text-sm font-semibold text-black">{{ $modalidad->establecimiento->nombre }}</div>
                                <div class="text-xs text-gray-500 space-y-1">
                                    <div>CUE: {{ $modalidad->establecimiento->cue }}</div>
                                    <div>CUI: {{ $modalidad->establecimiento->edificio->cui }}</div>
                                    @if($modalidad->establecimiento->establecimiento_cabecera)
                                        <div class="text-blue-600">📍 {{ $modalidad->establecimiento->establecimiento_cabecera }}</div>
                                    @endif
                                </div>
                            </td>
                            <td class="px-6 py-4"><span class="text-sm font-medium text-black">{{ $modalidad->nivel_educativo }}</span></td>
                            <td class="px-6 py-4"><span class="text-sm text-gray-700">{{ $modalidad->direccion_area }}</span></td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 inline-flex text-xs font-semibold rounded-full {{ $modalidad->ambito === 'PUBLICO' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800' }}">
                                    {{ $modalidad->ambito }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-700">
                                    <div>{{ $modalidad->establecimiento->edificio->zona_departamento }}</div>
                                    <div class="text-xs text-gray-500">{{ $modalidad->establecimiento->edificio->localidad }}</div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                @if($modalidad->trashed())
                                    <div class="flex gap-2">
                                        @can('restore', $modalidad)
                                            <button wire:click="restore({{ $modalidad->id }})" class="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
                                                ↩️ Restaurar
                                            </button>
                                        @endcan
                                        @can('forceDelete', $modalidad)
                                            <button wire:click="forceDelete({{ $modalidad->id }})" wire:confirm="⚠️ ¿Eliminar PERMANENTEMENTE?" class="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">
                                                🗑️ Permanente
                                            </button>
                                        @endcan
                                    </div>
                                @else
                                    <div class="flex gap-2">
                                        <button wire:click="viewModalidad({{ $modalidad->id }})" class="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600">
                                            👁️ Ver
                                        </button>
                                        @can('update', $modalidad)
                                            <button wire:click="editModalidad({{ $modalidad->id }})" class="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
                                                ✏️ Editar
                                            </button>
                                        @endcan
                                        @can('delete', $modalidad)
                                            <button wire:click="confirmDelete({{ $modalidad->id }})" class="px-3 py-1 text-white text-xs rounded-lg hover:opacity-90" style="background-color: var(--primary-orange);">
                                                🗑️ Eliminar
                                            </button>
                                        @endcan
                                    </div>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
                                <p class="text-lg font-medium">No se encontraron modalidades</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="mt-6">{{ $modalidades->links() }}</div>

    <!-- Modal Ver -->
    @if($showViewModal && $selectedModalidad)
        <div class="fixed inset-0 z-50 overflow-y-auto" x-data="{ show: @entangle('showViewModal') }">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-black opacity-50" wire:click="closeModals"></div>
                <div class="glass-strong rounded-2xl p-8 max-w-2xl w-full relative z-10">
                    <h3 class="text-2xl font-bold text-black mb-6">Ver Modalidad</h3>
                    <div class="space-y-4">
                        <div><strong>Establecimiento:</strong> {{ $selectedModalidad->establecimiento->nombre }}</div>
                        <div><strong>CUE:</strong> {{ $selectedModalidad->establecimiento->cue }}</div>
                        <div><strong>Nivel Educativo:</strong> {{ $selectedModalidad->nivel_educativo }}</div>
                        <div><strong>Dirección de Área:</strong> {{ $selectedModalidad->direccion_area }}</div>
                        <div><strong>Sector:</strong> {{ $selectedModalidad->sector }}</div>
                        <div><strong>Categoría:</strong> {{ $selectedModalidad->categoria }}</div>
                        <div><strong>Ámbito:</strong> {{ $selectedModalidad->ambito }}</div>
                        <div><strong>Localidad:</strong> {{ $selectedModalidad->establecimiento->edificio->localidad }}</div>
                        <div><strong>Validado:</strong> {{ $selectedModalidad->validado ? 'Sí' : 'No' }}</div>
                    </div>
                    <div class="mt-6 flex justify-end">
                        <button wire:click="closeModals" class="btn-secondary">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    @endif

    <!-- Modal Editar -->
    @if($showEditModal && $selectedModalidad)
        <div class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-black opacity-50" wire:click="closeModals"></div>
                <div class="glass-strong rounded-2xl p-8 max-w-2xl w-full relative z-10">
                    <h3 class="text-2xl font-bold text-black mb-6">Editar Modalidad</h3>
                    <form wire:submit="updateModalidad" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Dirección de Área</label>
                            <input type="text" wire:model="editForm.direccion_area" class="input-primary">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Nivel Educativo</label>
                            <input type="text" wire:model="editForm.nivel_educativo" class="input-primary">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Sector</label>
                            <input type="number" wire:model="editForm.sector" class="input-primary">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Categoría</label>
                            <input type="text" wire:model="editForm.categoria" class="input-primary">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Ámbito</label>
                            <select wire:model="editForm.ambito" class="input-primary">
                                <option value="PUBLICO">Público</option>
                                <option value="PRIVADO">Privado</option>
                            </select>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" wire:model="editForm.validado" class="mr-2">
                            <label>Validado</label>
                        </div>
                        <div class="flex justify-end gap-3 mt-6">
                            <button type="button" wire:click="closeModals" class="btn-secondary">Cancelar</button>
                            <button type="submit" class="btn-primary">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    @endif

    <!-- Modal Eliminar -->
    @if($showDeleteModal && $selectedModalidad)
        <div class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-black opacity-50" wire:click="closeModals"></div>
                <div class="glass-strong rounded-2xl p-8 max-w-md w-full relative z-10">
                    <h3 class="text-2xl font-bold text-black mb-4">Confirmar Eliminación</h3>
                    <p class="text-gray-700 mb-6">¿Estás seguro de que deseas eliminar esta modalidad?</p>
                    <p class="text-sm text-gray-600 mb-6"><strong>{{ $selectedModalidad->establecimiento->nombre }}</strong> - {{ $selectedModalidad->nivel_educativo }}</p>
                    <div class="flex justify-end gap-3">
                        <button wire:click="closeModals" class="btn-secondary">Cancelar</button>
                        <button wire:click="softDelete" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    @endif

    <!-- Modal Crear Establecimiento -->
    @if($showCreateModal)
        <div class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-black opacity-50" wire:click="closeModals"></div>
                <div class="glass-strong rounded-2xl p-8 max-w-4xl w-full relative z-10 max-h-[90vh] overflow-y-auto">
                    <h3 class="text-2xl font-bold text-black mb-6">Crear Nuevo Establecimiento</h3>
                    <form wire:submit="createEstablecimiento" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Nombre Establecimiento -->
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium mb-2">Nombre del Establecimiento *</label>
                                <input type="text" wire:model="createForm.nombre_establecimiento" class="input-primary" placeholder="ESCUELA PRIMARIA...">
                                @error('createForm.nombre_establecimiento') <span class="text-red-600 text-xs">{{ $message }}</span> @enderror
                            </div>

                            <!-- CUE -->
                            <div>
                                <label class="block text-sm font-medium mb-2">CUE (9 dígitos o PROV) *</label>
                                <input type="text" wire:model="createForm.cue" class="input-primary" placeholder="700038000 o PROV">
                                @error('createForm.cue') <span class="text-red-600 text-xs">{{ $message }}</span> @enderror
                            </div>

                            <!-- CUI -->
                            <div>
                                <label class="block text-sm font-medium mb-2">CUI (7 dígitos o PROV) *</label>
                                <input type="text" wire:model="createForm.cui" class="input-primary" placeholder="7000380 o PROV">
                                @error('createForm.cui') <span class="text-red-600 text-xs">{{ $message }}</span> @enderror
                            </div>

                            <!-- Establecimiento Cabecera -->
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium mb-2">Establecimiento Cabecera</label>
                                <input type="text" wire:model="createForm.establecimiento_cabecera" class="input-primary" placeholder="NOMBRE DEL ESTABLECIMIENTO CABECERA">
                            </div>

                            <!-- Nivel Educativo -->
                            <div>
                                <label class="block text-sm font-medium mb-2">Nivel Educativo *</label>
                                <select wire:model.live="createForm.nivel_educativo" class="input-primary">
                                    <option value="">Seleccionar...</option>
                                    <option value="INICIAL">INICIAL</option>
                                    <option value="PRIMARIO">PRIMARIO</option>
                                    <option value="SECUNDARIO">SECUNDARIO</option>
                                    <option value="ADULTOS">ADULTOS</option>
                                    <option value="ESPECIAL">ESPECIAL</option>
                                    <option value="SUPERIOR">SUPERIOR</option>
                                </select>
                                @error('createForm.nivel_educativo') <span class="text-red-600 text-xs">{{ $message }}</span> @enderror
                            </div>

                            <!-- Dirección de Área (auto-completado) -->
                            <div>
                                <label class="block text-sm font-medium mb-2">Dirección de Área</label>
                                <input type="text" wire:model="createForm.direccion_area" class="input-primary bg-gray-100" readonly>
                            </div>

                            <!-- Ámbito -->
                            <div>
                                <label class="block text-sm font-medium mb-2">Ámbito *</label>
                                <select wire:model="createForm.ambito" class="input-primary">
                                    <option value="PUBLICO">PÚBLICO</option>
                                    <option value="PRIVADO">PRIVADO</option>
                                </select>
                                @error('createForm.ambito') <span class="text-red-600 text-xs">{{ $message }}</span> @enderror
                            </div>

                            <!-- Departamento/Zona -->
                            <div>
                                <label class="block text-sm font-medium mb-2">Departamento/Zona *</label>
                                <select wire:model="createForm.zona_departamento" class="input-primary">
                                    <option value="">Seleccionar...</option>
                                    @foreach($zonas as $zona)
                                        <option value="{{ $zona }}">{{ $zona }}</option>
                                    @endforeach
                                </select>
                                @error('createForm.zona_departamento') <span class="text-red-600 text-xs">{{ $message }}</span> @enderror
                            </div>

                            <!-- Localidad -->
                            <div>
                                <label class="block text-sm font-medium mb-2">Localidad</label>
                                <input type="text" wire:model="createForm.localidad" class="input-primary" placeholder="CAPITAL">
                            </div>

                            <!-- Calle -->
                            <div>
                                <label class="block text-sm font-medium mb-2">Calle</label>
                                <input type="text" wire:model="createForm.calle" class="input-primary" placeholder="AV. LIBERTADOR">
                            </div>

                            <!-- Número Puerta -->
                            <div>
                                <label class="block text-sm font-medium mb-2">Número</label>
                                <input type="text" wire:model="createForm.numero_puerta" class="input-primary" placeholder="S/N">
                            </div>

                            <!-- Sector -->
                            <div>
                                <label class="block text-sm font-medium mb-2">Sector</label>
                                <input type="number" wire:model="createForm.sector" class="input-primary" placeholder="1">
                            </div>

                            <!-- Categoría -->
                            <div>
                                <label class="block text-sm font-medium mb-2">Categoría</label>
                                <input type="text" wire:model="createForm.categoria" class="input-primary" placeholder="CATEGORIA">
                            </div>

                            <!-- Validado -->
                            <div class="md:col-span-2">
                                <label class="flex items-center">
                                    <input type="checkbox" wire:model="createForm.validado" class="mr-2">
                                    <span class="text-sm font-medium">Marcar como validado</span>
                                </label>
                            </div>
                        </div>

                        <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <button type="button" wire:click="closeModals" class="btn-secondary">Cancelar</button>
                            <button type="submit" class="btn-primary">Crear Establecimiento</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    @endif
</div>

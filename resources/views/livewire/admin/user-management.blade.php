<div class="p-6 bg-white">
    <div class="mb-6 flex justify-between items-center">
        <div>
            <h2 class="text-3xl font-bold text-black">Gestión de Usuarios</h2>
            <p class="text-gray-600 mt-1">{{ $users->total() }} usuarios registrados</p>
        </div>
        <button wire:click="openCreateModal" class="btn-primary flex items-center gap-2">
            <span>+</span> Nuevo Usuario
        </button>
    </div>

    @if (session()->has('success'))
        <div class="mb-4 glass rounded-lg p-4 border-l-4" style="border-color: var(--primary-orange);">
            <p class="text-black font-medium">✅ {{ session('success') }}</p>
        </div>
    @endif

    <!-- Buscador -->
    <div class="mb-6 glass rounded-xl p-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">🔍 Buscar Usuario</label>
        <input type="text" 
               wire:model.live.debounce.300ms="search" 
               placeholder="Buscar por nombre o email..."
               class="input-primary">
    </div>

    <!-- Tabla de Usuarios -->
    <div class="glass rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full">
                <thead style="background-color: rgba(255, 130, 0, 0.05);">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Usuario</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Email</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Rol</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Registrado</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-black uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                    @forelse($users as $user)
                        <tr class="hover:bg-orange-50 transition">
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                                         style="background-color: var(--primary-orange);">
                                        {{ strtoupper(substr($user->name, 0, 2)) }}
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-semibold text-black">{{ $user->name }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-sm text-gray-700">{{ $user->email }}</span>
                            </td>
                            <td class="px-6 py-4">
                                @if($selectedUser && $selectedUser->id === $user->id)
                                    <div class="flex items-center gap-2">
                                        <select wire:model="newRole" class="input-primary text-sm">
                                            <option value="admin">Admin</option>
                                            <option value="administrativos">Administrativos</option>
                                        </select>
                                        <button wire:click="updateRole" class="text-green-600 hover:text-green-800">
                                            ✓
                                        </button>
                                        <button wire:click="cancelEdit" class="text-gray-600 hover:text-gray-800">
                                            ✗
                                        </button>
                                    </div>
                                @else
                                    <span class="px-3 py-1 inline-flex text-xs font-semibold rounded-full
                                        @if($user->role === 'admin') bg-orange-100 text-orange-800
                                        @elseif($user->role === 'administrativos') bg-blue-100 text-blue-800
                                        @else bg-gray-100 text-gray-800
                                        @endif">
                                        {{ ucfirst($user->role) }}
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-sm text-gray-600">{{ $user->created_at->diffForHumans() }}</span>
                            </td>
                            <td class="px-6 py-4">
                                @if(!$selectedUser || $selectedUser->id !== $user->id)
                                    <div class="flex gap-2">
                                        <button wire:click="editRole({{ $user->id }})" 
                                                class="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600">
                                            ✏️ Editar Rol
                                        </button>
                                        
                                        @if($user->id !== auth()->id())
                                            <button wire:click="confirmDelete({{ $user->id }})" 
                                                    class="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">
                                                🗑️ Eliminar
                                            </button>
                                        @endif
                                    </div>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                                <p class="text-lg font-medium">No se encontraron usuarios</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- Paginación -->
    <div class="mt-6">{{ $users->links() }}</div>

    <!-- Modal Crear Usuario -->
    @if($showCreateModal)
        <div class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-black opacity-50" wire:click="closeCreateModal"></div>
                <div class="glass-strong rounded-2xl p-8 max-w-md w-full relative z-10">
                    <h3 class="text-2xl font-bold text-black mb-6">Crear Nuevo Usuario</h3>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input type="text" wire:model="newUserName" class="input-primary w-full" placeholder="Nombre completo">
                            @error('newUserName') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" wire:model="newUserEmail" class="input-primary w-full" placeholder="correo@ejemplo.com">
                            @error('newUserEmail') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input type="password" wire:model="newUserPassword" class="input-primary w-full" placeholder="Mínimo 8 caracteres">
                            @error('newUserPassword') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                            <input type="password" wire:model="newUserPasswordConfirmation" class="input-primary w-full" placeholder="Repetir contraseña">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select wire:model="newUserRole" class="input-primary w-full">
                                <option value="administrativos">Administrativo</option>
                                <option value="admin">Administrador</option>
                            </select>
                            @error('newUserRole') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-8">
                        <button wire:click="closeCreateModal" class="btn-secondary">Cancelar</button>
                        <button wire:click="createUser" class="btn-primary">Crear Usuario</button>
                    </div>
                </div>
            </div>
        </div>
    @endif

    <!-- Modal Eliminar -->
    @if($showDeleteModal && $userToDelete)
        <div class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-black opacity-50" wire:click="cancelDelete"></div>
                <div class="glass-strong rounded-2xl p-8 max-w-md w-full relative z-10">
                    <h3 class="text-2xl font-bold text-black mb-4">Confirmar Eliminación</h3>
                    <p class="text-gray-700 mb-6">¿Estás seguro de que deseas eliminar este usuario?</p>
                    <p class="text-sm text-gray-600 mb-6">
                        <strong>{{ $userToDelete->name }}</strong> ({{ $userToDelete->email }}) será eliminado permanentemente.
                    </p>
                    <div class="flex justify-end gap-3">
                        <button wire:click="cancelDelete" class="btn-secondary">Cancelar</button>
                        <button wire:click="deleteUser" class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Eliminar Usuario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    @endif
</div>

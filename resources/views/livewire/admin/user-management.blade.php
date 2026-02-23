<div class="px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50/30">
    <!-- HEADER ESTRATÉGICO -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in">
        <div>
            <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 text-primary-orange">
                <i class="fas fa-university"></i>
                <span>Ministerio de Educación</span>
                <span>•</span>
                <span>Seguridad y Accesos</span>
            </nav>
            <div class="flex items-center gap-3">
                <div class="p-3 rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
                    <i class="fas fa-users-cog fa-2x text-primary-orange"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-black tracking-tight text-black leading-tight">
                        Gestión de <span class="text-primary-orange">Usuarios</span>
                    </h2>
                    <p class="text-sm text-gray-500 font-medium italic">Administración de credenciales y roles del sistema central</p>
                </div>
            </div>
        </div>
        
        <button wire:click="openCreateModal" class="group relative px-6 py-3 bg-primary-orange text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-3 overflow-hidden">
            <div class="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            <i class="fas fa-plus"></i>
            <span>Nuevo Usuario</span>
        </button>
    </div>

    <!-- FLASH MESSAGES -->
    @if (session()->has('success'))
        <div class="mb-6 animate-fade-in">
            <div class="glass-strong rounded-xl p-4 border-l-4 border-green-500 flex items-center gap-3 bg-green-50/50">
                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <i class="fas fa-check"></i>
                </div>
                <p class="text-sm font-bold text-gray-800">{{ session('success') }}</p>
            </div>
        </div>
    @endif

    <!-- BUSCADOR ESTRATÉGICO -->
    <div class="mb-8 glass-strong rounded-2xl p-6 shadow-lg border border-orange-100/30">
        <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">
            <i class="fas fa-search mr-1 text-primary-orange"></i> Localizar Integrante
        </label>
        <div class="relative">
            <input type="text" 
                   wire:model.live.debounce.300ms="search" 
                   placeholder="Nombre, apellido o correo electrónico..."
                   class="input-glass w-full pl-12 pr-4 py-4 rounded-xl text-sm font-bold placeholder-gray-300 focus:ring-2 focus:ring-orange-500/20 transition-all">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-orange transition-colors">
                <i class="fas fa-user-search fa-lg"></i>
            </div>
        </div>
    </div>

    <!-- TABLA DE RESULTADOS PREMIUM -->
    <div class="glass-strong rounded-2xl overflow-hidden shadow-2xl border border-orange-100/20 mb-8">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-50/50 border-b border-orange-100/50">
                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identidad</th>
                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contacto</th>
                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rango</th>
                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Antigüedad</th>
                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 bg-white/20">
                    @forelse($users as $user)
                        <tr class="group hover:bg-orange-50/30 transition-all duration-300">
                            <td class="px-8 py-5 whitespace-nowrap">
                                <div class="flex items-center gap-4">
                                    <div class="ml-1">
                                        <div class="text-sm font-black text-gray-900 leading-tight uppercase group-hover:text-primary-orange transition-colors">{{ $user->name }}</div>
                                        <div class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Miembro Verificado</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-8 py-5 whitespace-nowrap">
                                <div class="flex items-center gap-2 text-sm font-bold text-gray-600">
                                    <i class="fas fa-envelope text-gray-300 group-hover:text-primary-orange transition-colors"></i>
                                    <span>{{ $user->email }}</span>
                                </div>
                            </td>
                            <td class="px-8 py-5 whitespace-nowrap">
                                @if($selectedUser && $selectedUser->id === $user->id)
                                    <div class="flex items-center gap-2 p-1 bg-white rounded-lg border border-orange-200">
                                        <select wire:model="newRole" class="bg-transparent border-0 text-xs font-black uppercase text-gray-700 focus:ring-0 py-1">
                                            <option value="admin">Administrador</option>
                                            <option value="administrativos">Administrativo</option>
                                        </select>
                                        <div class="flex gap-1 border-l pl-1">
                                            <button wire:click="updateRole" class="w-6 h-6 flex items-center justify-center bg-green-50 text-green-600 rounded hover:bg-green-100">
                                                <i class="fas fa-check text-[10px]"></i>
                                            </button>
                                            <button wire:click="cancelEdit" class="w-6 h-6 flex items-center justify-center bg-red-50 text-red-600 rounded hover:bg-red-100">
                                                <i class="fas fa-times text-[10px]"></i>
                                            </button>
                                        </div>
                                    </div>
                                @else
                                    <span class="px-3 py-1.5 inline-flex text-[9px] font-black uppercase tracking-widest rounded-full border
                                        @if($user->role === 'admin') bg-orange-50 text-orange-600 border-orange-100
                                        @elseif($user->role === 'administrativos') bg-blue-50 text-blue-600 border-blue-100
                                        @else bg-gray-50 text-gray-600 border-gray-100
                                        @endif">
                                        <i class="fas fa-shield-alt mr-1.5"></i>
                                        {{ $user->role }}
                                    </span>
                                @endif
                            </td>
                            <td class="px-8 py-5 whitespace-nowrap">
                                <div class="flex flex-col">
                                    <span class="text-xs font-bold text-gray-700">{{ $user->created_at->diffForHumans() }}</span>
                                    <span class="text-[9px] text-gray-400 font-mono italic uppercase">{{ $user->created_at->format('d/m/Y') }}</span>
                                </div>
                            </td>
                            <td class="px-8 py-5 whitespace-nowrap text-right">
                                @if(!$selectedUser || $selectedUser->id !== $user->id)
                                    <div class="flex justify-end gap-2 px-1">
                                        <button wire:click="confirmReset({{ $user->id }})" 
                                                title="Blanquear Contraseña"
                                                class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-primary-orange transition-all shadow-sm border border-gray-100">
                                            <i class="fas fa-key text-xs"></i>
                                        </button>

                                        <button wire:click="editRole({{ $user->id }})" 
                                                class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm border border-gray-100">
                                            <i class="fas fa-user-shield text-xs"></i>
                                        </button>
                                        
                                        @if($user->id !== auth()->id())
                                            <button wire:click="confirmDelete({{ $user->id }})" 
                                                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm border border-gray-100">
                                                <i class="fas fa-trash-alt text-xs"></i>
                                            </button>
                                        @endif
                                    </div>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-8 py-20 text-center">
                                <div class="flex flex-col items-center justify-center py-12 text-gray-400 animate-fade-in">
                                    <div class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                        <i class="fas fa-user-slash fa-3x opacity-20"></i>
                                    </div>
                                    <p class="font-black text-gray-500 uppercase tracking-widest">Sin resultados</p>
                                    <p class="text-xs font-medium text-center px-4 mt-2">No se encontraron usuarios que coincidan con la búsqueda.</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($users->hasPages())
            <div class="px-8 py-6 bg-gray-50/50 border-t border-orange-100/50">
                {{ $users->links() }}
            </div>
        @endif
    </div>

    <!-- MODAL PREMIUM: CREAR USUARIO -->
    @if($showCreateModal)
        <div class="fixed inset-0 z-50 overflow-y-auto" x-data x-init="document.body.style.overflow = 'hidden'" x-on:destroy="document.body.style.overflow = 'auto'">
            <div class="flex items-center justify-center min-h-screen px-4 py-8">
                <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity animate-fade-in" wire:click="closeCreateModal"></div>
                
                <div class="glass-strong rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl border border-white/20 animate-scale-up">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="w-14 h-14 rounded-2xl bg-orange-50 text-primary-orange flex items-center justify-center shadow-sm">
                            <i class="fas fa-user-plus fa-2x"></i>
                        </div>
                        <div>
                            <h3 class="text-2xl font-black text-gray-900 tracking-tight leading-tight uppercase">Nuevo <span class="text-primary-orange">Operador</span></h3>
                            <p class="text-sm text-gray-500 font-medium">Asignar credenciales de acceso al sistema</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 gap-5">
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nombre Completo</label>
                            <input type="text" wire:model="newUserName" class="input-glass w-full px-4 py-3.5 rounded-xl font-bold placeholder-gray-300" placeholder="Ej: Juan Pérez">
                            @error('newUserName') <span class="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">{{ $message }}</span> @enderror
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Correo Electrónico</label>
                            <input type="email" wire:model="newUserEmail" class="input-glass w-full px-4 py-3.5 rounded-xl font-bold placeholder-gray-300" placeholder="correo@educacion.sanjuan.gov.ar">
                            @error('newUserEmail') <span class="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">{{ $message }}</span> @enderror
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contraseña</label>
                                <input type="password" wire:model="newUserPassword" class="input-glass w-full px-4 py-3.5 rounded-xl font-bold" placeholder="••••••••">
                                @error('newUserPassword') <span class="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">{{ $message }}</span> @enderror
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Repetir</label>
                                <input type="password" wire:model="newUserPasswordConfirmation" class="input-glass w-full px-4 py-3.5 rounded-xl font-bold" placeholder="••••••••">
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Rango / Rol</label>
                            <select wire:model="newUserRole" class="input-glass w-full px-4 py-3.5 rounded-xl font-black uppercase text-gray-700">
                                <option value="administrativos">Administrativo (Gestión)</option>
                                <option value="admin">Administrador (Control Total)</option>
                            </select>
                            @error('newUserRole') <span class="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">{{ $message }}</span> @enderror
                        </div>
                    </div>

                    <div class="flex justify-end gap-3 mt-10">
                        <button wire:click="closeCreateModal" class="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Volver</button>
                        <button wire:click="createUser" class="px-8 py-3 bg-primary-orange text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                            Confirmar Alta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    @endif

    <!-- MODAL PREMIUM: REINICIAR CLAVE -->
    @if($showResetModal && $userToReset)
        <div class="fixed inset-0 z-50 overflow-y-auto" x-data x-init="document.body.style.overflow = 'hidden'" x-on:destroy="document.body.style.overflow = 'auto'">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in" wire:click="cancelReset"></div>
                <div class="glass-strong rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-orange-100/30 animate-scale-up text-center">
                    <div class="w-16 h-16 bg-orange-50 text-primary-orange rounded-full flex items-center justify-center mb-6 mx-auto">
                        <i class="fas fa-key fa-2x"></i>
                    </div>
                    <h3 class="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Blanquear <span class="text-primary-orange">Contraseña</span></h3>
                    <p class="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                        Se le asignará una clave temporal a <span class="text-gray-900 font-black">{{ $userToReset->name }}</span> y se le obligará a cambiarla en su próximo inicio de sesión.
                    </p>
                    <div class="flex justify-stretch gap-3">
                        <button wire:click="cancelReset" class="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors">Cancelar</button>
                        <button wire:click="resetPassword" class="flex-1 px-6 py-4 bg-primary-orange text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                            Confirmar Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    @endif

    <!-- MODAL PREMIUM: ELIMINAR -->
    @if($showDeleteModal && $userToDelete)
        <div class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in" wire:click="cancelDelete"></div>
                <div class="glass-strong rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-red-100/30 animate-scale-up">
                    <div class="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <i class="fas fa-user-times fa-2x"></i>
                    </div>
                    <h3 class="text-xl font-black text-gray-900 mb-2 text-center uppercase tracking-tight">Confirmar <span class="text-red-600">Baja</span></h3>
                    <p class="text-sm text-gray-500 text-center font-medium leading-relaxed mb-6">
                        ¿Estás seguro de que deseas eliminar permanentemente a <span class="text-gray-900 font-black">{{ $userToDelete->name }}</span>? Esta acción es irreversible.
                    </p>
                    <div class="flex justify-stretch gap-3">
                        <button wire:click="cancelDelete" class="flex-1 px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors">Cancelar</button>
                        <button wire:click="deleteUser" class="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">
                            Eliminar Usuario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    @endif
</div>

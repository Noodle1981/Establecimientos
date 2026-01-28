<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
        <div class="glass-strong rounded-2xl p-8 shadow-2xl">
            <!-- Header -->
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-black mb-2">
                    @if($is_first_login)
                        Cambiar Contraseña
                    @else
                        Actualizar Contraseña
                    @endif
                </h2>
                <p class="text-gray-600">
                    @if($is_first_login)
                        Por seguridad, debes cambiar tu contraseña antes de continuar.
                    @else
                        Actualiza tu contraseña de acceso.
                    @endif
                </p>
            </div>

            @if($is_first_login)
                <div class="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                    <p class="text-sm text-orange-800">
                        <strong>⚠️ Primer inicio de sesión:</strong> Debes establecer una nueva contraseña segura.
                    </p>
                </div>
            @endif

            <form wire:submit.prevent="updatePassword" class="space-y-6">
                <!-- Current Password (only if not first login) -->
                @if(!$is_first_login)
                    <div>
                        <label for="current_password" class="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña Actual
                        </label>
                        <input 
                            type="password" 
                            id="current_password"
                            wire:model="current_password"
                            class="input-primary w-full"
                            placeholder="Ingresa tu contraseña actual"
                            autocomplete="current-password">
                        @error('current_password') 
                            <span class="text-red-500 text-xs mt-1">{{ $message }}</span> 
                        @enderror
                    </div>
                @endif

                <!-- New Password -->
                <div>
                    <label for="new_password" class="block text-sm font-medium text-gray-700 mb-2">
                        Nueva Contraseña
                    </label>
                    <input 
                        type="password" 
                        id="new_password"
                        wire:model="new_password"
                        class="input-primary w-full"
                        placeholder="Mínimo 8 caracteres"
                        autocomplete="new-password">
                    @error('new_password') 
                        <span class="text-red-500 text-xs mt-1">{{ $message }}</span> 
                    @enderror
                </div>

                <!-- Confirm New Password -->
                <div>
                    <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contraseña
                    </label>
                    <input 
                        type="password" 
                        id="new_password_confirmation"
                        wire:model="new_password_confirmation"
                        class="input-primary w-full"
                        placeholder="Repite la nueva contraseña"
                        autocomplete="new-password">
                </div>

                <!-- Password Requirements -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-xs font-medium text-gray-700 mb-2">Requisitos de la contraseña:</p>
                    <ul class="text-xs text-gray-600 space-y-1">
                        <li class="flex items-center gap-2">
                            <span class="text-green-500">✓</span> Mínimo 8 caracteres
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="text-green-500">✓</span> Debe ser diferente a la anterior
                        </li>
                    </ul>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="btn-primary w-full flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    Actualizar Contraseña
                </button>

                @if(!$is_first_login)
                    <a href="{{ route('dashboard') }}" class="block text-center text-sm text-gray-600 hover:text-gray-800">
                        Cancelar
                    </a>
                @endif
            </form>
        </div>
    </div>
</div>

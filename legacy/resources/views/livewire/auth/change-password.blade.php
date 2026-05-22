<div class="min-h-screen flex items-center justify-center bg-gray-50/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px]"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px]"></div>

    <div class="max-w-md w-full relative z-10">
        <div class="glass-strong rounded-3xl p-8 shadow-2xl border border-white/20 animate-scale-up">
            <!-- Brand Header -->
            <nav class="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-primary-orange">
                <i class="fas fa-university"></i>
                <span>Ministerio de Educación</span>
            </nav>

            <!-- Header -->
            <div class="text-center mb-10">
                <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-primary-orange mx-auto mb-6 shadow-inner">
                    <i class="fas fa-key fa-2x"></i>
                </div>
                <h2 class="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                    @if($is_first_login)
                        Nueva <span class="text-primary-orange">Credencial</span>
                    @else
                        Cambiar <span class="text-primary-orange">Contraseña</span>
                    @endif
                </h2>
                <p class="text-sm text-gray-500 font-medium italic">
                    @if($is_first_login)
                        Por seguridad estratégica, debes establecer una nueva clave.
                    @else
                        Gestiona la seguridad de tu acceso institucional.
                    @endif
                </p>
            </div>

            @if($is_first_login)
                <div class="mb-8 p-4 glass-strong rounded-xl border-l-4 border-primary-orange flex items-start gap-3 bg-orange-50/50">
                    <i class="fas fa-shield-alt text-primary-orange mt-0.5"></i>
                    <p class="text-[11px] font-bold text-gray-700 leading-relaxed uppercase tracking-tight">
                        <strong>Protocolo de Primer Acceso:</strong> Es obligatorio definir una contraseña personal para continuar.
                    </p>
                </div>
            @endif

            <form wire:submit.prevent="updatePassword" class="space-y-6">
                <!-- Current Password (only if not first login) -->
                @if(!$is_first_login)
                    <div class="space-y-1.5">
                        <label for="current_password" class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Contraseña Actual
                        </label>
                        <div class="relative">
                            <input 
                                type="password" 
                                id="current_password"
                                wire:model="current_password"
                                class="input-glass w-full pl-10 pr-4 py-3.5 rounded-xl font-bold placeholder-gray-300"
                                placeholder="••••••••"
                                autocomplete="current-password">
                            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                                <i class="fas fa-lock text-sm"></i>
                            </div>
                        </div>
                        @error('current_password') 
                            <span class="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">{{ $message }}</span> 
                        @enderror
                    </div>
                @endif

                <!-- New Password -->
                <div class="space-y-1.5">
                    <label for="new_password" class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        Nueva Contraseña
                    </label>
                    <div class="relative">
                        <input 
                            type="password" 
                            id="new_password"
                            wire:model="new_password"
                            class="input-glass w-full pl-10 pr-4 py-3.5 rounded-xl font-bold placeholder-gray-300"
                            placeholder="Mínimo 8 caracteres"
                            autocomplete="new-password">
                        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <i class="fas fa-shield-virus text-sm"></i>
                        </div>
                    </div>
                    @error('new_password') 
                        <span class="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">{{ $message }}</span> 
                    @enderror
                </div>

                <!-- Confirm New Password -->
                <div class="space-y-1.5">
                    <label for="new_password_confirmation" class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        Confirmar Nueva Clave
                    </label>
                    <div class="relative">
                        <input 
                            type="password" 
                            id="new_password_confirmation"
                            wire:model="new_password_confirmation"
                            class="input-glass w-full pl-10 pr-4 py-3.5 rounded-xl font-bold placeholder-gray-300"
                            placeholder="Repite la contraseña"
                            autocomplete="new-password">
                        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <i class="fas fa-check-double text-sm"></i>
                        </div>
                    </div>
                </div>

                <!-- Password Requirements -->
                <div class="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                    <p class="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3 ml-1">Requisitos de Seguridad</p>
                    <ul class="space-y-2">
                        <li class="flex items-center gap-3 text-xs font-bold text-gray-600">
                            <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            Mínimo 8 caracteres alfanuméricos
                        </li>
                        <li class="flex items-center gap-3 text-xs font-bold text-gray-600">
                            <div class="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            Debe ser diferente a la clave base
                        </li>
                    </ul>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="group relative w-full px-8 py-4 bg-primary-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 overflow-hidden">
                    <div class="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <i class="fas fa-save transition-transform group-hover:scale-110"></i>
                    <span>Actualizar Acceso</span>
                </button>

                @if(!$is_first_login)
                    <a href="{{ route('dashboard') }}" class="block text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">
                        Cancelar Operación
                    </a>
                @endif
            </form>
        </div>
        
        <p class="text-center mt-8 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            &copy; 2026 Sistema Administrativo - San Juan
        </p>
    </div>
</div>

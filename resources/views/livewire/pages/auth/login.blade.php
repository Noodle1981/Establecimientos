<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Livewire\Attributes\Layout;
use Livewire\Volt\Component;

new #[Layout('layouts.guest')] class extends Component
{
    public string $email = '';
    public string $password = '';
    public bool $remember = false;

    public function login(): void
    {
        $this->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($this->only(['email', 'password']), $this->remember)) {
            $this->addError('email', trans('auth.failed'));
            return;
        }

        Session::regenerate();
        $this->redirectIntended(default: route('dashboard', absolute: false), navigate: true);
    }
}; ?>

<div class="min-h-screen flex items-center justify-center bg-white px-4">
    <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                 style="background-color: var(--primary-orange);">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
            </div>
            <h2 class="text-3xl font-bold text-black">Iniciar Sesión</h2>
            <p class="text-gray-600 mt-2">Establecimientos - M.E. San Juan</p>
        </div>

        <!-- Form Card -->
        <div class="glass-strong rounded-2xl p-8">
            <form wire:submit="login" class="space-y-6">
                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-medium text-black mb-2">
                        Correo Electrónico
                    </label>
                    <input wire:model="email" 
                           id="email" 
                           type="email" 
                           required 
                           autofocus 
                           autocomplete="username"
                           class="input-primary"
                           placeholder="admin@example.com">
                    @error('email')
                        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Password -->
                <div>
                    <label for="password" class="block text-sm font-medium text-black mb-2">
                        Contraseña
                    </label>
                    <div x-data="{ show: false }" class="relative w-full">
                        <input wire:model="password" 
                               id="password" 
                               name="password"
                               :type="show ? 'text' : 'password'" 
                               required 
                               autocomplete="current-password"
                               class="input-primary w-full pr-10"
                               placeholder="••••••••">
                        <button type="button" 
                                @click="show = !show" 
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-orange-500 transition-colors focus:outline-none"
                                title="Mostrar/Ocultar contraseña">
                            <svg x-show="!show" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <svg x-show="show" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: none;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 1.225 0 2.391.272 3.442.753m4.97 4.97A10.003 10.003 0 0121.543 12c-1.274 4.057-5.064 7-9.542 7-1.225 0-2.391-.272-3.442-.753m5.87-5.87a3 3 0 11-4.243 4.243m4.243-4.243L3 3m18 18l-18-18"></path>
                            </svg>
                        </button>
                    </div>
                    @error('password')
                        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Remember Me -->
                <div class="flex items-center">
                    <input wire:model="remember" 
                           id="remember" 
                           type="checkbox"
                           class="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-orange-200"
                           style="color: var(--primary-orange);">
                    <label for="remember" class="ml-2 text-sm text-gray-700">
                        Recordarme
                    </label>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn-primary w-full">
                    Iniciar Sesión
                </button>

                <!-- Links -->
                <div class="text-center space-y-2">
                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}" 
                           class="link-primary text-sm block" 
                           wire:navigate>
                            ¿Olvidaste tu contraseña?
                        </a>
                    @endif
                    

                </div>
            </form>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-6">
            <a href="{{ route('home') }}" 
               class="text-sm text-gray-600 hover:text-black transition">
                ← Volver al inicio
            </a>
        </div>
    </div>
</div>

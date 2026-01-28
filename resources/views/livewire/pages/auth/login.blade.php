<?php

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
                    <input wire:model="password" 
                           id="password" 
                           type="password" 
                           required 
                           autocomplete="current-password"
                           class="input-primary"
                           placeholder="••••••••">
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

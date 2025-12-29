<?php

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Livewire\Attributes\Layout;
use Livewire\Volt\Component;

new #[Layout('layouts.guest')] class extends Component
{
    public string $name = '';
    public string $email = '';
    public string $password = '';
    public string $password_confirmation = '';

    public function register(): void
    {
        $validated = $this->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'string', 'confirmed', Rules\Password::defaults()],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        event(new Registered($user = User::create($validated)));

        Auth::login($user);

        $this->redirect(route('dashboard', absolute: false), navigate: true);
    }
}; ?>

<div class="min-h-screen flex items-center justify-center bg-white px-4">
    <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                 style="background-color: var(--primary-orange);">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
            </div>
            <h2 class="text-3xl font-bold text-black">Crear Cuenta</h2>
            <p class="text-gray-600 mt-2">Establecimientos - M.E. San Juan</p>
        </div>

        <!-- Form Card -->
        <div class="glass-strong rounded-2xl p-8">
            <form wire:submit="register" class="space-y-6">
                <!-- Name -->
                <div>
                    <label for="name" class="block text-sm font-medium text-black mb-2">
                        Nombre Completo
                    </label>
                    <input wire:model="name" 
                           id="name" 
                           type="text" 
                           required 
                           autofocus 
                           autocomplete="name"
                           class="input-primary"
                           placeholder="Juan Pérez">
                    @error('name')
                        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-medium text-black mb-2">
                        Correo Electrónico
                    </label>
                    <input wire:model="email" 
                           id="email" 
                           type="email" 
                           required 
                           autocomplete="username"
                           class="input-primary"
                           placeholder="correo@example.com">
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
                           autocomplete="new-password"
                           class="input-primary"
                           placeholder="••••••••">
                    @error('password')
                        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="password_confirmation" class="block text-sm font-medium text-black mb-2">
                        Confirmar Contraseña
                    </label>
                    <input wire:model="password_confirmation" 
                           id="password_confirmation" 
                           type="password" 
                           required 
                           autocomplete="new-password"
                           class="input-primary"
                           placeholder="••••••••">
                    @error('password_confirmation')
                        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn-primary w-full">
                    Registrarse
                </button>

                <!-- Link to Login -->
                <div class="text-center">
                    <p class="text-sm text-gray-600">
                        ¿Ya tienes cuenta? 
                        <a href="{{ route('login') }}" 
                           class="link-primary font-medium" 
                           wire:navigate>
                            Inicia sesión
                        </a>
                    </p>
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

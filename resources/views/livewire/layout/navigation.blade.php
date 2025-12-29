<?php

use App\Livewire\Actions\Logout;
use Livewire\Volt\Component;

new class extends Component
{
    public function logout(Logout $logout): void
    {
        $logout();
        $this->redirect('/', navigate: true);
    }
}; ?>

<nav x-data="{ open: false }" class="glass-nav fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <!-- Left Side: Logo & Navigation Links -->
            <div class="flex items-center space-x-8">
                <!-- Logo -->
                <a href="{{ route('dashboard') }}" wire:navigate class="flex items-center">
                    <span class="text-2xl font-bold" style="color: var(--primary-orange);">Establecimientos</span>
                    <span class="ml-2 text-sm text-gray-600">M.E.</span>
                </a>

                <!-- Navigation Links (Desktop) -->
                <div class="hidden md:flex md:space-x-2">
                    @if(auth()->user()->isAdmin())
                        <!-- Admin Links -->
                        <a href="{{ route('admin.dashboard') }}" 
                           class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('admin.dashboard') ? 'bg-orange-50 font-semibold' : '' }}">
                            🏠 Dashboard
                        </a>
                        <a href="{{ route('admin.modalidades') }}" 
                           class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('admin.modalidades') ? 'bg-orange-50 font-semibold' : '' }}">
                            📋 Modalidades
                        </a>
                        <a href="{{ route('admin.users') }}" 
                           class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('admin.users') ? 'bg-orange-50 font-semibold' : '' }}">
                            👥 Usuarios
                        </a>
                    @elseif(auth()->user()->isAdministrativo())
                        <!-- Administrativos Links -->
                        <a href="{{ route('administrativos.dashboard') }}" 
                           class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('administrativos.dashboard') ? 'bg-orange-50 font-semibold' : '' }}">
                            🏠 Dashboard
                        </a>
                        <a href="{{ route('administrativos.modalidades') }}" 
                           class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('administrativos.modalidades') ? 'bg-orange-50 font-semibold' : '' }}">
                            📋 Modalidades
                        </a>
                    @endif
                    
                    <!-- Mapa (todos) -->
                    <a href="{{ route('mapa.publico') }}" 
                       class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('mapa.publico') ? 'bg-orange-50 font-semibold' : '' }}">
                        🗺️ Mapa
                    </a>
                </div>
            </div>

            <!-- Right Side: User Menu -->
            <div class="hidden md:flex md:items-center md:space-x-4">
                <!-- User Info -->
                <div class="flex items-center space-x-3">
                    <div class="text-right">
                        <p class="text-sm font-medium text-black">{{ auth()->user()->name }}</p>
                        <p class="text-xs text-gray-500">{{ ucfirst(auth()->user()->role) }}</p>
                    </div>
                    
                    <!-- Dropdown Menu -->
                    <div x-data="{ dropdownOpen: false }" class="relative">
                        <button @click="dropdownOpen = !dropdownOpen" 
                                class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-orange-50 transition">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                                 style="background-color: var(--primary-orange);">
                                {{ substr(auth()->user()->name, 0, 1) }}
                            </div>
                            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        <!-- Dropdown Content -->
                        <div x-show="dropdownOpen" 
                             @click.away="dropdownOpen = false"
                             x-transition
                             class="absolute right-0 mt-2 w-48 glass-strong rounded-xl shadow-lg py-2">
                            <a href="{{ route('profile') }}" 
                               wire:navigate
                               class="block px-4 py-2 text-sm text-black hover:bg-orange-50 transition">
                                👤 Mi Perfil
                            </a>
                            <hr class="my-2 border-gray-200">
                            <button wire:click="logout" 
                                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                                🚪 Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mobile Menu Button -->
            <div class="flex items-center md:hidden">
                <button @click="open = !open" 
                        class="p-2 rounded-lg text-black hover:bg-orange-50 transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path x-show="!open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        <path x-show="open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div x-show="open" 
         x-transition
         class="md:hidden border-t-2"
         style="border-color: var(--primary-orange);">
        <div class="px-4 py-4 space-y-2">
            @if(auth()->user()->isAdmin())
                <a href="{{ route('admin.dashboard') }}" 
                   wire:navigate
                   class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('admin.dashboard') ? 'bg-orange-50 font-semibold' : '' }}">
                    🏠 Dashboard
                </a>
                <a href="{{ route('admin.modalidades') }}" 
                   wire:navigate
                   class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('admin.modalidades') ? 'bg-orange-50 font-semibold' : '' }}">
                    📋 Modalidades
                </a>
                <a href="{{ route('admin.users') }}" 
                   wire:navigate
                   class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('admin.users') ? 'bg-orange-50 font-semibold' : '' }}">
                    👥 Usuarios
                </a>
            @elseif(auth()->user()->isAdministrativo())
                <a href="{{ route('administrativos.dashboard') }}" 
                   wire:navigate
                   class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('administrativos.dashboard') ? 'bg-orange-50 font-semibold' : '' }}">
                    🏠 Dashboard
                </a>
                <a href="{{ route('administrativos.modalidades') }}" 
                   wire:navigate
                   class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('administrativos.modalidades') ? 'bg-orange-50 font-semibold' : '' }}">
                    📋 Modalidades
                </a>
            @endif
            
            <a href="{{ route('mapa.publico') }}" 
               wire:navigate
               class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('mapa.publico') ? 'bg-orange-50 font-semibold' : '' }}">
                🗺️ Mapa
            </a>

            <hr class="my-2 border-gray-200">
            
            <a href="{{ route('profile') }}" 
               wire:navigate
               class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                👤 Mi Perfil
            </a>
            
            <button wire:click="logout" 
                    class="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition">
                🚪 Cerrar Sesión
            </button>
        </div>
    </div>
</nav>

<!-- Spacer for fixed navbar -->
<div class="h-16"></div>

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

<div>
    <nav x-data="{ open: false }" class="glass-nav fixed w-full top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <!-- Left Side: Logo & Navigation Links -->
                <div class="flex items-center space-x-6">
                    <!-- Logo -->
                    <a href="{{ route('dashboard') }}" class="flex items-center gap-3">
                        <img src="{{ asset('images/logo.jpg') }}" alt="Logo M.E." class="h-10 w-auto object-contain">
                        <div class="flex flex-col">
                            <span class="text-lg font-bold leading-tight" style="color: var(--primary-orange);">Establecimientos</span>
                            <span class="text-xs text-gray-600 font-medium">Ministerio de Educación</span>
                        </div>
                    </a>

                    <!-- Navigation Links (Desktop) -->
                    <div class="hidden md:flex md:space-x-1">
                        @auth
                            @if(auth()->user()->isAdmin())
                                <!-- Admin Links -->
                                <x-nav-link-custom href="{{ route('admin.dashboard') }}" icon="📊" :active="request()->routeIs('admin.dashboard')">
                                    Dashboard
                                </x-nav-link-custom>
                                <x-nav-link-custom href="{{ route('admin.users') }}" icon="👥" :active="request()->routeIs('admin.users')">
                                    Usuarios
                                </x-nav-link-custom>
                                <x-nav-link-custom href="{{ route('admin.activity-log') }}" icon="📜" :active="request()->routeIs('admin.activity-log')">
                                    Actividad
                                </x-nav-link-custom>
                            @endif

                            @if(auth()->user()->isAdministrativo())
                                <!-- Administrativos Links -->
                                <x-nav-link-custom href="{{ route('administrativos.dashboard') }}" icon="📊" :active="request()->routeIs('administrativos.dashboard')">
                                    Panel
                                </x-nav-link-custom>
                                <x-nav-link-custom href="{{ route('administrativos.establecimientos') }}" icon="🏫" :active="request()->routeIs('administrativos.establecimientos')">
                                    Establecimientos
                                </x-nav-link-custom>
                                <x-nav-link-custom href="{{ route('administrativos.validacion') }}" icon="✅" :active="request()->routeIs('administrativos.validacion*')">
                                    Validación
                                </x-nav-link-custom>
                            @endif
                        @endauth
                        
                        <!-- Mapa (todos) -->
                        <x-nav-link-custom href="{{ route('mapa.publico') }}" icon="🗺️" :active="request()->routeIs('mapa.publico')">
                            Mapa
                        </x-nav-link-custom>
                    </div>
                </div>

                <!-- Right Side: User Menu -->
                <div class="hidden md:flex md:items-center">
                    @auth
                        <div x-data="{ userOpen: false }" class="relative">
                            <button @click="userOpen = !userOpen" class="flex items-center space-x-3 p-1 rounded-xl hover:bg-orange-50 transition">
                                <div class="flex flex-col text-right">
                                    <span class="text-xs font-bold text-slate-800 leading-none">{{ auth()->user()->name }}</span>
                                    <span class="text-[10px] text-orange-600 font-bold uppercase tracking-tighter">{{ auth()->user()->role }}</span>
                                </div>
                                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg font-bold">
                                    {{ substr(auth()->user()->name, 0, 1) }}
                                </div>
                            </button>
                            
                            <!-- Dropdown -->
                            <div x-show="userOpen" 
                                 @click.away="userOpen = false"
                                 x-transition
                                 class="absolute right-0 mt-2 w-56 glass-strong rounded-2xl shadow-xl py-2 overflow-hidden border border-orange-100">
                                <div class="px-4 py-2 border-b border-orange-50 bg-orange-50/50">
                                    <p class="text-[10px] font-bold text-orange-600 uppercase">Cuenta del Sistema</p>
                                </div>
                                <a href="{{ route('profile') }}" class="block px-4 py-3 text-sm text-slate-700 hover:bg-orange-50 transition">
                                    👤 Mi Perfil
                                </a>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition font-bold">
                                        🚪 Cerrar Sesión
                                    </button>
                                </form>
                            </div>
                        </div>
                    @else
                        <a href="{{ route('login') }}" class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                            🔐 Iniciar Sesión
                        </a>
                    @endauth
                </div>

                <!-- Mobile Menu Button -->
                <div class="flex items-center md:hidden">
                    <button @click="open = !open" class="p-2 rounded-lg text-black hover:bg-orange-50 transition">
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
            <div class="px-4 py-4 space-y-2 glass">
                @auth
                    @if(auth()->user()->isAdmin())
                        <a href="{{ route('admin.dashboard') }}" class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('admin.dashboard') ? 'bg-orange-50 font-semibold' : '' }}">
                            📊 Dashboard Admin
                        </a>
                        <a href="{{ route('admin.users') }}" class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('admin.users') ? 'bg-orange-50 font-semibold' : '' }}">
                            👥 Usuarios
                        </a>
                        <a href="{{ route('admin.activity-log') }}" class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('admin.activity-log') ? 'bg-orange-50 font-semibold' : '' }}">
                            📜 Actividad
                        </a>
                    @endif

                    @if(auth()->user()->isAdministrativo())
                        <a href="{{ route('administrativos.dashboard') }}" class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('administrativos.dashboard') ? 'bg-orange-50 font-semibold' : '' }}">
                            📊 Panel Administrativo
                        </a>
                        <a href="{{ route('administrativos.establecimientos') }}" class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('administrativos.establecimientos') ? 'bg-orange-50 font-semibold' : '' }}">
                            🏫 Establecimientos
                        </a>
                        <a href="{{ route('administrativos.validacion') }}" class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('administrativos.validacion*') ? 'bg-orange-50 font-semibold' : '' }}">
                            ✅ Validación
                        </a>
                    @endif
                @endauth
                
                <a href="{{ route('mapa.publico') }}" class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition {{ request()->routeIs('mapa.publico') ? 'bg-orange-50 font-semibold' : '' }}">
                    🗺️ Mapa
                </a>

                <hr class="my-2 border-gray-200">
                
                @auth
                    <a href="{{ route('profile') }}" class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                        👤 Mi Perfil
                    </a>
                    
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition">
                            🚪 Cerrar Sesión
                        </button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                        🔐 Iniciar Sesión
                    </a>
                @endauth
            </div>
        </div>
    </nav>

    <!-- Spacer for fixed navbar -->
    <div class="h-16"></div>
</div>

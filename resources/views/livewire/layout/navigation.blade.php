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
    <nav x-data="{ open: false }" class="fixed w-full top-0 z-50 bg-white shadow-sm" style="border-bottom: 1px solid #FE8204;">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <!-- Left Side: Logo & Navigation Links -->
                <div class="flex items-center space-x-6">
                    <!-- Logo -->
                    <a href="{{ route('dashboard') }}" class="flex items-center gap-3">
                        <img src="{{ asset('images/logo.jpg') }}" alt="Logo M.E." class="h-10 w-auto object-contain">
                        <div class="flex flex-col">
                            <span class="text-lg font-bold leading-tight" style="color: #FE8204;">Establecimientos</span>
                            <span class="text-xs font-medium" style="color: #000000;">Ministerio de Educación</span>
                        </div>
                    </a>

                    <!-- Navigation Links (Desktop) -->
                    <div class="hidden md:flex md:space-x-1">
                        @auth
                            @if(auth()->user()->isAdmin())
                                <!-- Admin Links -->
                                <x-nav-link-custom href="{{ route('admin.dashboard') }}" icon="fas fa-chart-line" :active="request()->routeIs('admin.dashboard')">
                                    Dashboard
                                </x-nav-link-custom>
                                <x-nav-link-custom href="{{ route('admin.users') }}" icon="fas fa-users" :active="request()->routeIs('admin.users')">
                                    Usuarios
                                </x-nav-link-custom>
                                <x-nav-link-custom href="{{ route('admin.activity-log') }}" icon="fas fa-clipboard-list" :active="request()->routeIs('admin.activity-log')">
                                    Actividad
                                </x-nav-link-custom>
                            @endif

                            @if(auth()->user()->isAdministrativo())
                                <!-- Administrativos Links -->
                                <x-nav-link-custom href="{{ route('administrativos.dashboard') }}" icon="fas fa-tachometer-alt" :active="request()->routeIs('administrativos.dashboard')">
                                    Panel
                                </x-nav-link-custom>
                                <x-nav-link-custom href="{{ route('administrativos.establecimientos') }}" icon="fas fa-school" :active="request()->routeIs('administrativos.establecimientos')">
                                    Establecimientos
                                </x-nav-link-custom>
                                <x-nav-link-custom href="{{ route('administrativos.validacion') }}" icon="fas fa-clipboard-check" :active="request()->routeIs('administrativos.validacion*')">
                                    Validación
                                </x-nav-link-custom>
                            @endif
                        @endauth
                        
                        <!-- Mapa (todos) -->
                        <x-nav-link-custom href="{{ route('mapa.publico') }}" icon="fas fa-map-marked-alt" :active="request()->routeIs('mapa.publico')">
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
                                    <span class="text-xs font-bold leading-none" style="color: #000000;">{{ auth()->user()->name }}</span>
                                    <span class="text-[10px] font-bold uppercase tracking-tighter" style="color: #E57303;">{{ auth()->user()->role }}</span>
                                </div>
                                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md font-bold" 
                                     style="background-color: #FE8204;">
                                    {{ substr(auth()->user()->name, 0, 1) }}
                                </div>
                            </button>
                            
                            <!-- Dropdown -->
                            <div x-show="userOpen" 
                                 @click.away="userOpen = false"
                                 x-transition
                                 class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 overflow-hidden border"
                                 style="border-color: #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);">
                                <div class="px-4 py-2 border-b" style="border-color: #FADC3C; background-color: rgba(254, 130, 4, 0.05);">
                                    <p class="text-[10px] font-bold uppercase" style="color: #FE8204;">Cuenta del Sistema</p>
                                </div>
                                <a href="{{ route('profile') }}" class="block px-4 py-3 text-sm hover:bg-orange-50 transition" style="color: #000000;">
                                    <i class="fas fa-user-circle mr-2" style="color: #FE8204;"></i> Mi Perfil
                                </a>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="w-full text-left px-4 py-3 text-sm hover:bg-red-50 transition font-bold" style="color: #E43C2F;">
                                        <i class="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
                                    </button>
                                </form>
                            </div>
                        </div>
                    @else
                        <a href="{{ route('login') }}" class="px-4 py-2 rounded-lg transition font-bold flex items-center gap-2" style="color: #000000; border: 1px solid #FE8204;" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'" onmouseout="this.style.backgroundColor='transparent'">
                            <i class="fas fa-key" style="color: #FE8204;"></i> Iniciar Sesión
                        </a>
                    @endauth
                </div>

                <!-- Mobile Menu Button -->
                <div class="flex items-center md:hidden">
                    <button @click="open = !open" class="p-2 rounded-lg transition" style="color: #000000;">
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
             class="md:hidden border-t"
             style="border-color: #FE8204; background-color: #FFFFFF;">
            <div class="px-4 py-4 space-y-2">
                @auth
                    @if(auth()->user()->isAdmin())
                        <a href="{{ route('admin.dashboard') }}" class="block px-4 py-2 rounded-lg transition {{ request()->routeIs('admin.dashboard') ? 'font-bold' : '' }}" style="{{ request()->routeIs('admin.dashboard') ? 'background-color: rgba(254, 130, 4, 0.1); color: #FE8204;' : 'color: #000000;' }}">
                            <i class="fas fa-chart-line mr-2" style="color: #FE8204;"></i> Dashboard Admin
                        </a>
                        <a href="{{ route('admin.users') }}" class="block px-4 py-2 rounded-lg transition {{ request()->routeIs('admin.users') ? 'font-bold' : '' }}" style="{{ request()->routeIs('admin.users') ? 'background-color: rgba(254, 130, 4, 0.1); color: #FE8204;' : 'color: #000000;' }}">
                            <i class="fas fa-users mr-2" style="color: #FE8204;"></i> Usuarios
                        </a>
                        <a href="{{ route('admin.activity-log') }}" class="block px-4 py-2 rounded-lg transition {{ request()->routeIs('admin.activity-log') ? 'font-bold' : '' }}" style="{{ request()->routeIs('admin.activity-log') ? 'background-color: rgba(254, 130, 4, 0.1); color: #FE8204;' : 'color: #000000;' }}">
                            <i class="fas fa-clipboard-list mr-2" style="color: #FE8204;"></i> Actividad
                        </a>
                    @endif

                    @if(auth()->user()->isAdministrativo())
                        <a href="{{ route('administrativos.dashboard') }}" class="block px-4 py-2 rounded-lg transition {{ request()->routeIs('administrativos.dashboard') ? 'font-bold' : '' }}" style="{{ request()->routeIs('administrativos.dashboard') ? 'background-color: rgba(254, 130, 4, 0.1); color: #FE8204;' : 'color: #000000;' }}">
                            <i class="fas fa-tachometer-alt mr-2" style="color: #FE8204;"></i> Panel Administrativo
                        </a>
                        <a href="{{ route('administrativos.establecimientos') }}" class="block px-4 py-2 rounded-lg transition {{ request()->routeIs('administrativos.establecimientos') ? 'font-bold' : '' }}" style="{{ request()->routeIs('administrativos.establecimientos') ? 'background-color: rgba(254, 130, 4, 0.1); color: #FE8204;' : 'color: #000000;' }}">
                            <i class="fas fa-school mr-2" style="color: #FE8204;"></i> Establecimientos
                        </a>
                        <a href="{{ route('administrativos.validacion') }}" class="block px-4 py-2 rounded-lg transition {{ request()->routeIs('administrativos.validacion*') ? 'font-bold' : '' }}" style="{{ request()->routeIs('administrativos.validacion*') ? 'background-color: rgba(254, 130, 4, 0.1); color: #FE8204;' : 'color: #000000;' }}">
                            <i class="fas fa-clipboard-check mr-2" style="color: #FE8204;"></i> Validación
                        </a>
                    @endif
                @endauth
                
                <a href="{{ route('mapa.publico') }}" class="block px-4 py-2 rounded-lg transition {{ request()->routeIs('mapa.publico') ? 'font-bold' : '' }}" style="{{ request()->routeIs('mapa.publico') ? 'background-color: rgba(254, 130, 4, 0.1); color: #FE8204;' : 'color: #000000;' }}">
                    <i class="fas fa-map-marked-alt mr-2" style="color: #FE8204;"></i> Mapa
                </a>

                <hr class="my-2" style="border-top: 1px solid rgba(254, 130, 4, 0.2);">
                
                @auth
                    <a href="{{ route('profile') }}" class="block px-4 py-2 rounded-lg transition" style="color: #000000;">
                        <i class="fas fa-user-circle mr-2" style="color: #FE8204;"></i> Mi Perfil
                    </a>
                    
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="w-full text-left px-4 py-2 rounded-lg transition font-bold" style="color: #E43C2F;">
                            <i class="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
                        </button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="block px-4 py-2 rounded-lg transition font-bold" style="color: #000000;">
                        <i class="fas fa-key mr-2" style="color: #FE8204;"></i> Iniciar Sesión
                    </a>
                @endauth
            </div>
        </div>
    </nav>

    <!-- Spacer for fixed navbar -->
    <div class="h-16"></div>
</div>

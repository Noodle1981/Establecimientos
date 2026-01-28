<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Establecimientos') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        
        
        <style>
    :root {
        --primary-orange: #FF8200;
        --primary-orange-dark: #E67300;
        --gov-red: #E43C2F;
        --gov-yellow: #F9DB3B;
        --bg-slate: #f1f5f9; /* Color de fondo para que resalte el glass */
    }
    
    body {
        /* Degradado sutil inspirado en los colores de San Juan pero muy diluido */
        background-color: var(--bg-slate);
        background-image: 
            radial-gradient(at 0% 0%, rgba(255, 130, 0, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(228, 60, 47, 0.03) 0px, transparent 50%);
        color: #1e293b; /* Slate 800 en lugar de negro puro */
    }
    
    /* Glassmorphism mejorado */
    .glass {
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
    }
    
    .glass-strong {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 130, 0, 0.2);
    }

    /* Navbar con efecto glass refinado */
    .glass-nav {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(255, 130, 0, 0.15);
        box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.08);
    }
    
</style>
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen" style="background-color: #f8fafc;">
            <!-- Navigation -->
            <nav class="glass-nav fixed w-full top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <!-- Logo -->
                            <a href="{{ route('home') }}" class="flex items-center gap-3">
                                <img src="{{ asset('images/logo.jpg') }}" alt="Logo M.E." class="h-10 w-auto object-contain">
                                <div class="flex flex-col">
                                    <span class="text-lg font-bold leading-tight" style="color: var(--primary-orange);">Establecimientos</span>
                                    <span class="text-xs text-gray-600 font-medium">Ministerio de Educación</span>
                                </div>
                            </a>
                        </div>

                        <!-- Navigation Links -->
                        <div class="hidden sm:flex sm:items-center sm:space-x-4">
                            @auth
                                <!-- Mapa (todos los autenticados) -->
                                <a href="{{ route('mapa.publico') }}" 
                                   class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                                    🗺️ Mapa
                                </a>

                                @if(auth()->user()->isAdmin())
                                    <!-- Dashboard Admin -->
                                    <a href="{{ route('admin.dashboard') }}" 
                                       class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                                        📊 Dashboard Admin
                                    </a>

                                    <!-- Usuarios -->
                                    <a href="{{ route('admin.users') }}" 
                                       class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                                        👥 Usuarios
                                    </a>

                                    <!-- Activity Log -->
                                    <a href="{{ route('admin.activity-log') }}" 
                                       class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                                        📜 Actividad
                                    </a>
                                @endif

                                @if(auth()->user()->isAdministrativo())
                                    <!-- Dashboard Administrativo -->
                                    <a href="{{ route('administrativos.dashboard') }}" 
                                       class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                                        📊 Panel Administrativo
                                    </a>

                                    <!-- Establecimientos -->
                                    <a href="{{ route('administrativos.establecimientos') }}" 
                                       class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                                        🏫 Establecimientos
                                    </a>

                                    <!-- Auditorías EDUGE -->
                                    <a href="{{ route('administrativos.validacion') }}" 
                                       class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                                        ✅ Validación
                                    </a>
                                @endif

                                <!-- User Menu -->
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm text-gray-700">{{ auth()->user()->name }}</span>
                                    <form method="POST" action="{{ route('logout') }}" class="inline">
                                        @csrf
                                        <button type="submit" 
                                                class="px-4 py-2 rounded-lg text-white transition"
                                                style="background-color: var(--primary-orange);">
                                            Salir
                                        </button>
                                    </form>
                                </div>
                            @else
                                <a href="{{ route('mapa.publico') }}" 
                                   class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                                    🗺️ Mapa
                                </a>
                                <a href="{{ route('login') }}" 
                                   class="px-4 py-2 rounded-lg text-white transition"
                                   style="background-color: var(--primary-orange);">
                                    Iniciar Sesión
                                </a>
                            @endauth
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Page Content -->
            <main class="pt-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {{ $slot }}
                </div>
            </main>
        </div>
        
        @stack('scripts')
    </body>
</html>

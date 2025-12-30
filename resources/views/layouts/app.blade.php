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
            }
            
            body {
                background: white;
                color: #000;
            }
            
            /* Glassmorphism */
            .glass {
                background: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 130, 0, 0.1);
            }
            
            .glass-nav {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-bottom: 2px solid var(--primary-orange);
                box-shadow: 0 4px 6px -1px rgba(255, 130, 0, 0.1);
            }
        </style>
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen bg-white">
            <!-- Navigation -->
            <nav class="glass-nav fixed w-full top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <!-- Logo -->
                            <a href="{{ route('home') }}" class="flex items-center">
                                <span class="text-2xl font-bold" style="color: var(--primary-orange);">Establecimientos</span>
                                <span class="ml-2 text-sm text-gray-600">M.E. San Juan</span>
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

                                @if(auth()->user()->hasRole(['admin', 'administrativos']))
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

                                    <!-- Modalidades -->
                                    <a href="{{ route('admin.modalidades') }}" 
                                       class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                                        📋 Modalidades
                                    </a>

                                    <!-- Auditorías EDUGE -->
                                    <a href="{{ route('admin.auditorias') }}" 
                                       class="px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                                        🔍 Auditorías
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
                {{ $slot }}
            </main>
        </div>
        
        @stack('scripts')
    </body>
</html>

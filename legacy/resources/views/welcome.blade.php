<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Establecimientos - M.E. San Juan</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet" />

        @vite(['resources/css/app.css', 'resources/js/app.js'])
        
        <style>
            :root {
                --primary-orange: #FF8200;
            }
            
            .glass {
                background: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 130, 0, 0.1);
            }
        </style>
    </head>
    <body class="antialiased font-sans bg-white">
        <div class="min-h-screen">
            <!-- Navigation -->
            @if (Route::has('login'))
                <nav class="glass fixed w-full top-0 z-50 border-b-2" style="border-color: var(--primary-orange);">
                    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div class="flex items-center">
                            <span class="text-2xl font-bold" style="color: var(--primary-orange);">Establecimientos</span>
                            <span class="ml-2 text-sm text-gray-600">M.E. San Juan</span>
                        </div>
                        <div class="flex space-x-4">
                            @auth
                                <a href="{{ url('/dashboard') }}" 
                                   class="px-6 py-2 rounded-lg text-white font-medium transition"
                                   style="background-color: var(--primary-orange);">
                                    Dashboard
                                </a>
                            @else
                                <a href="{{ route('mapa.publico') }}" 
                                   class="px-6 py-2 rounded-lg text-black hover:bg-orange-50 transition font-medium">
                                    🗺️ Ver Mapa
                                </a>
                                <a href="{{ route('login') }}" 
                                   class="px-6 py-2 rounded-lg text-white font-medium transition"
                                   style="background-color: var(--primary-orange);">
                                    Iniciar Sesión
                                </a>
                            @endauth
                        </div>
                    </div>
                </nav>
            @endif

            <!-- Hero Section -->
            <div class="relative min-h-screen flex flex-col items-center justify-center pt-16">
                <div class="max-w-6xl mx-auto px-6 text-center">
                    <!-- Icon -->
                    <div class="mb-8 flex justify-center">
                        <div class="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl"
                             style="background-color: var(--primary-orange);">
                            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                    </div>

                    <!-- Title -->
                    <h1 class="text-6xl md:text-7xl font-bold text-black mb-6">
                        Sistema de Gestión
                        <span class="block" style="color: var(--primary-orange);">
                            Establecimientos Educativos
                        </span>
                    </h1>

                    <!-- Description -->
                    <p class="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Plataforma integral para la gestión, auditoría y visualización de 
                        <strong class="text-black">1,162 modalidades educativas</strong> en 
                        <strong class="text-black">1,137 establecimientos</strong> de San Juan.
                    </p>

                    <!-- Feature Cards -->
                    <div class="grid md:grid-cols-3 gap-6 mb-12">
                        <!-- Feature 1 -->
                        <div class="glass rounded-2xl p-8 hover:shadow-lg transition">
                            <div class="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                                 style="background-color: rgba(255, 130, 0, 0.1);">
                                <svg class="w-8 h-8" style="color: var(--primary-orange);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold text-black mb-2">Gestión Completa</h3>
                            <p class="text-gray-600">Administra modalidades, establecimientos y edificios educativos</p>
                        </div>

                        <!-- Feature 2 -->
                        <div class="glass rounded-2xl p-8 hover:shadow-lg transition">
                            <div class="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                                 style="background-color: rgba(255, 130, 0, 0.1);">
                                <svg class="w-8 h-8" style="color: var(--primary-orange);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold text-black mb-2">Mapa Interactivo</h3>
                            <p class="text-gray-600">Visualiza la ubicación de todos los establecimientos en tiempo real</p>
                        </div>

                        <!-- Feature 3 -->
                        <div class="glass rounded-2xl p-8 hover:shadow-lg transition">
                            <div class="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                                 style="background-color: rgba(255, 130, 0, 0.1);">
                                <svg class="w-8 h-8" style="color: var(--primary-orange);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                </svg>
                            </div>
                            <h3 class="text-xl font-semibold text-black mb-2">Auditoría EDÚGE</h3>
                            <p class="text-gray-600">Comparación y validación de datos con la plataforma EDÚGE</p>
                        </div>
                    </div>

                    <!-- CTA Buttons -->
                    @guest
                        <div class="flex gap-4 justify-center">
                            <a href="{{ route('mapa.publico') }}" 
                               class="px-8 py-4 rounded-lg glass text-black hover:shadow-lg transition font-semibold text-lg border-2"
                               style="border-color: var(--primary-orange);">
                                🗺️ Ver Mapa Público
                            </a>
                            <a href="{{ route('login') }}" 
                               class="px-8 py-4 rounded-lg text-white hover:opacity-90 transition font-semibold shadow-lg text-lg"
                               style="background-color: var(--primary-orange);">
                                Iniciar Sesión
                            </a>
                        </div>
                    @endguest
                </div>

                <!-- Footer -->
                <div class="absolute bottom-8 text-center text-gray-500 text-sm">
                    Ministerio de Educación - San Juan | Laravel v{{ Illuminate\Foundation\Application::VERSION }}
                </div>
            </div>
        </div>
    </body>
</html>

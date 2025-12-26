<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel Boilerplate Starter Kit</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Styles -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="antialiased font-sans">
        <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <!-- Navigation -->
            @if (Route::has('login'))
                <nav class="absolute top-0 right-0 p-6 text-right z-10">
                    @auth
                        <a href="{{ url('/dashboard') }}" class="px-6 py-2 rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition font-semibold shadow-lg">
                            Dashboard
                        </a>
                    @else
                        <a href="{{ route('login') }}" class="mr-4 px-6 py-2 rounded-lg bg-transparent text-white border-2 border-white hover:bg-white hover:text-gray-900 transition font-semibold">
                            Login
                        </a>
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition font-semibold shadow-lg">
                                Registrarse
                            </a>
                        @endif
                    @endauth
                </nav>
            @endif

            <!-- Hero Section -->
            <div class="relative min-h-screen flex flex-col items-center justify-center selection:bg-pink-500 selection:text-white">
                <div class="max-w-5xl mx-auto px-6 text-center">
                    <!-- Logo/Icon -->
                    <div class="mb-8 flex justify-center">
                        <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                    </div>

                    <!-- Main Title -->
                    <h1 class="text-6xl md:text-7xl font-bold text-white mb-6">
                        Laravel Boilerplate
                        <span class="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Starter Kit
                        </span>
                    </h1>

                    <!-- Description -->
                    <p class="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Un punto de partida robusto para tus proyectos Laravel con <strong class="text-white">Livewire 3</strong>, 
                        <strong class="text-white">Tailwind CSS</strong> y un sistema de roles completo.
                    </p>

                    <!-- Feature Cards -->
                    <div class="grid md:grid-cols-3 gap-6 mb-12">
                        <!-- Feature 1 -->
                        <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition">
                            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-white mb-2">Autenticación Completa</h3>
                            <p class="text-gray-400 text-sm">Laravel Breeze con Livewire integrado</p>
                        </div>

                        <!-- Feature 2 -->
                        <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition">
                            <div class="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-white mb-2">Sistema de Roles</h3>
                            <p class="text-gray-400 text-sm">Admin, Mid y User con middleware</p>
                        </div>

                        <!-- Feature 3 -->
                        <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition">
                            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-white mb-2">Testing Incluido</h3>
                            <p class="text-gray-400 text-sm">Suite completa de tests con PHPUnit</p>
                        </div>
                    </div>

                    <!-- CTA Buttons -->
                    @guest
                        <div class="flex gap-4 justify-center">
                            <a href="{{ route('login') }}" class="px-8 py-4 rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition font-semibold shadow-lg text-lg">
                                Empezar Ahora
                            </a>
                            <a href="{{ route('register') }}" class="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition font-semibold shadow-lg text-lg">
                                Crear Cuenta
                            </a>
                        </div>
                    @endguest
                </div>

                <!-- Footer -->
                <div class="absolute bottom-8 text-center text-gray-400 text-sm">
                    Laravel v{{ Illuminate\Foundation\Application::VERSION }} (PHP v{{ PHP_VERSION }})
                </div>
            </div>
        </div>
    </body>
</html>

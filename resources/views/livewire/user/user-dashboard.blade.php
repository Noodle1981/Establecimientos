<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Welcome Card -->
            <div class="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg p-8 mb-6 text-white">
                <h3 class="text-3xl font-bold mb-2">¡Bienvenido de nuevo!</h3>
                <p class="text-cyan-100">
                    Estás en tu panel personal. Aquí puedes ver tu información y gestionar tu perfil.
                </p>
            </div>

            <!-- Info Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <!-- Profile Card -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Mi Perfil</h4>
                                <p class="text-gray-500 dark:text-gray-400 text-sm">Información personal</p>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400 text-sm">Nombre:</span>
                                <span class="text-gray-900 dark:text-gray-100 font-medium text-sm">{{ auth()->user()->name }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400 text-sm">Email:</span>
                                <span class="text-gray-900 dark:text-gray-100 font-medium text-sm truncate ml-2">{{ auth()->user()->email }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400 text-sm">Rol:</span>
                                <span class="px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded text-xs font-semibold">{{ ucfirst(auth()->user()->role) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Activity Card -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Actividad</h4>
                                <p class="text-gray-500 dark:text-gray-400 text-sm">Últimas acciones</p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <span class="text-gray-900 dark:text-gray-100 text-sm">Sesión iniciada</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                                <span class="text-gray-500 dark:text-gray-400 text-sm">Perfil actualizado</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                                <span class="text-gray-500 dark:text-gray-400 text-sm">Contraseña cambiada</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions Card -->
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Acciones</h4>
                                <p class="text-gray-500 dark:text-gray-400 text-sm">Accesos rápidos</p>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <a href="{{ route('profile') }}" class="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition duration-150">
                                Editar Perfil
                            </a>
                            <button class="block w-full text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded transition duration-150">
                                Ver Historial
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Panel de Usuario</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">
                        Desde aquí puedes gestionar tu información personal, cambiar tu contraseña y actualizar tus preferencias.
                    </p>
                    
                    <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 class="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">Información del Sistema</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div>
                                    <p class="text-gray-500 dark:text-gray-400 text-xs">Estado de la cuenta</p>
                                    <p class="text-gray-900 dark:text-gray-100 font-medium">Activa</p>
                                </div>
                            </div>
                            
                            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <div>
                                    <p class="text-gray-500 dark:text-gray-400 text-xs">Última conexión</p>
                                    <p class="text-gray-900 dark:text-gray-100 font-medium">{{ now()->format('d/m/Y H:i') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" x-data="themeGallery()">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Galería de Plantillas - Laravel</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased font-sans">
    <div class="min-h-screen" :style="`background: linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%);`">
        
        <!-- Header -->
        <div class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <h1 class="text-2xl font-bold text-gray-900">🎨 Configuración de Diseño</h1>
                <p class="text-gray-600 text-sm">Define los colores y preferencias de diseño para tu proyecto</p>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-6 py-8">
            
            @if(session('success'))
                <div class="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    {{ session('success') }}
                </div>
            @endif

            <form action="{{ route('setup.store') }}" method="POST" class="space-y-8">
                @csrf

                <!-- Layout Selection -->
                <div class="bg-white rounded-xl shadow-sm p-6 border">
                    <h2 class="text-xl font-semibold mb-2 text-gray-900">1. Layout Preferido</h2>
                    <p class="text-sm text-gray-600 mb-4">Esta es solo una preferencia. La IA la usará como referencia al crear nuevas vistas.</p>
                    <div class="grid md:grid-cols-2 gap-4">
                        
                        <!-- Side Nav -->
                        <label class="cursor-pointer">
                            <input type="radio" name="layout_type" value="side-nav" 
                                   class="peer sr-only" 
                                   @click="layout = 'side-nav'"
                                   {{ old('layout_type', $currentTheme['layout_type']) === 'side-nav' ? 'checked' : '' }}>
                            <div class="border-2 border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 rounded-lg p-4 transition">
                                <div class="flex items-center gap-3 mb-2">
                                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                                    </svg>
                                    <span class="font-semibold text-gray-900">Side Navigation</span>
                                </div>
                                <p class="text-sm text-gray-600">Menú lateral izquierdo</p>
                            </div>
                        </label>

                        <!-- Top Nav -->
                        <label class="cursor-pointer">
                            <input type="radio" name="layout_type" value="top-nav" 
                                   class="peer sr-only"
                                   @click="layout = 'top-nav'"
                                   {{ old('layout_type', $currentTheme['layout_type']) === 'top-nav' ? 'checked' : '' }}>
                            <div class="border-2 border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 rounded-lg p-4 transition">
                                <div class="flex items-center gap-3 mb-2">
                                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M3 8h18"/>
                                    </svg>
                                    <span class="font-semibold text-gray-900">Top Navigation</span>
                                </div>
                                <p class="text-sm text-gray-600">Menú superior horizontal</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Color Palette -->
                <div class="bg-white rounded-xl shadow-sm p-6 border">
                    <h2 class="text-xl font-semibold mb-4 text-gray-900">2. Paleta de Colores</h2>
                    
                    <!-- Presets -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-3">Presets Profesionales</label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button type="button" @click="applyPreset('purple')" class="px-4 py-2 rounded-lg border-2 hover:scale-105 transition" style="background: linear-gradient(135deg, #8b5cf6, #ec4899);">
                                <span class="text-white font-semibold text-sm">Purple Pink</span>
                            </button>
                            <button type="button" @click="applyPreset('blue')" class="px-4 py-2 rounded-lg border-2 hover:scale-105 transition" style="background: linear-gradient(135deg, #3b82f6, #06b6d4);">
                                <span class="text-white font-semibold text-sm">Blue Cyan</span>
                            </button>
                            <button type="button" @click="applyPreset('green')" class="px-4 py-2 rounded-lg border-2 hover:scale-105 transition" style="background: linear-gradient(135deg, #10b981, #14b8a6);">
                                <span class="text-white font-semibold text-sm">Green Teal</span>
                            </button>
                            <button type="button" @click="applyPreset('orange')" class="px-4 py-2 rounded-lg border-2 hover:scale-105 transition" style="background: linear-gradient(135deg, #f97316, #ef4444);">
                                <span class="text-white font-semibold text-sm">Orange Red</span>
                            </button>
                        </div>
                    </div>

                    <!-- Custom Colors -->
                    <div class="grid md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Color Primario</label>
                            <input type="color" name="primary_color" x-model="colors.primary" 
                                   value="{{ old('primary_color', $currentTheme['primary_color']) }}"
                                   class="w-full h-12 rounded-lg border cursor-pointer">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Color Secundario</label>
                            <input type="color" name="secondary_color" x-model="colors.secondary"
                                   value="{{ old('secondary_color', $currentTheme['secondary_color']) }}"
                                   class="w-full h-12 rounded-lg border cursor-pointer">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Color de Acento</label>
                            <input type="color" name="accent_color" x-model="colors.accent"
                                   value="{{ old('accent_color', $currentTheme['accent_color']) }}"
                                   class="w-full h-12 rounded-lg border cursor-pointer">
                        </div>
                    </div>
                </div>

                <!-- App Settings -->
                <div class="bg-white rounded-xl shadow-sm p-6 border">
                    <h2 class="text-xl font-semibold mb-4 text-gray-900">3. Configuración de la App</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Aplicación</label>
                            <input type="text" name="app_name" 
                                   value="{{ old('app_name', $currentTheme['app_name']) }}"
                                   class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                   placeholder="Mi Aplicación">
                        </div>
                        <div class="flex items-center gap-3">
                            <input type="checkbox" name="is_glassmorphism" id="glassmorphism"
                                   {{ old('is_glassmorphism', $currentTheme['is_glassmorphism']) ? 'checked' : '' }}
                                   class="w-5 h-5 text-blue-600 rounded">
                            <label for="glassmorphism" class="text-sm font-medium text-gray-700">
                                Activar Glassmorphism (efectos de vidrio)
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Preview -->
                <div class="bg-white rounded-xl shadow-sm p-6 border">
                    <h2 class="text-xl font-semibold mb-4 text-gray-900">Vista Previa</h2>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center min-h-[300px] flex flex-col items-center justify-center gap-6"
                         :style="`background: linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20);`">
                        
                        <!-- Botón Principal -->
                        <div class="inline-block px-8 py-4 rounded-lg text-white font-semibold shadow-2xl text-lg transform hover:scale-105 transition"
                             :style="`background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});`">
                            Botón Principal
                        </div>

                        <!-- Botón Secundario -->
                        <div class="inline-block px-6 py-3 rounded-lg font-semibold shadow-lg border-2 transition"
                             :style="`color: ${colors.primary}; border-color: ${colors.primary};`">
                            Botón Secundario
                        </div>

                        <!-- Card Preview -->
                        <div class="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
                            <div class="w-12 h-12 rounded-lg mb-3 mx-auto"
                                 :style="`background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});`">
                            </div>
                            <h3 class="font-semibold text-gray-900 mb-2">Card de Ejemplo</h3>
                            <p class="text-sm text-gray-600">Así se verán tus componentes con estos colores</p>
                        </div>

                        <p class="text-gray-600 text-sm">Los colores se aplicarán en toda la aplicación autenticada</p>
                    </div>
                </div>

                <!-- Submit -->
                <div class="flex gap-4">
                    <button type="submit" 
                            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg">
                        💾 Guardar y Aplicar Tema
                    </button>
                    <a href="{{ url('/') }}" 
                       class="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition">
                        Cancelar
                    </a>
                </div>

            </form>
        </div>
    </div>

    <script>
        function themeGallery() {
            return {
                layout: '{{ old('layout_type', $currentTheme['layout_type']) }}',
                colors: {
                    primary: '{{ old('primary_color', $currentTheme['primary_color']) }}',
                    secondary: '{{ old('secondary_color', $currentTheme['secondary_color']) }}',
                    accent: '{{ old('accent_color', $currentTheme['accent_color']) }}'
                },
                applyPreset(preset) {
                    const presets = {
                        purple: { primary: '#8b5cf6', secondary: '#ec4899', accent: '#3b82f6' },
                        blue: { primary: '#3b82f6', secondary: '#06b6d4', accent: '#8b5cf6' },
                        green: { primary: '#10b981', secondary: '#14b8a6', accent: '#3b82f6' },
                        orange: { primary: '#f97316', secondary: '#ef4444', accent: '#fbbf24' }
                    };
                    this.colors = presets[preset];
                }
            }
        }
    </script>
</body>
</html>

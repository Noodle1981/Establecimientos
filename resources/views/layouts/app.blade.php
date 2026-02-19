<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Establecimientos') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans antialiased text-black bg-white">
        <div class="min-h-screen bg-white">
            <!-- Navigation -->
            <livewire:layout.navigation />

            <!-- Page Content -->
            <main class="pt-1">
                <div class="{{ $containerClass ?? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' }}">
                    {{ $slot }}
                </div>
            </main>
        </div>
        
        <!-- Toast Notifications -->
        <x-toast-notifications />
        
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        @stack('scripts')
    </body>
</html>

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

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        
        
        <style>
    :root {
        --primary-orange: #FE8204;
        --primary-orange-dark: #E57303;
        --gov-red: #E43C2F;
        --gov-yellow: #FADC3C;
        --bg-slate: #FFFFFF;
    }
    
    body {
        background-color: #FFFFFF;
        color: #000000;
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
        <div class="min-h-screen" style="background-color: #FFFFFF;">
            <!-- Navigation -->
            <livewire:layout.navigation />

            <!-- Page Content -->
            <main class="pt-1">
                <div class="{{ $containerClass ?? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' }}">
                    {{ $slot }}
                </div>
            </main>
        </div>
        
        @stack('scripts')
    </body>
</html>

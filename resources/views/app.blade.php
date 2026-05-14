<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts & CDNs (Non-blocking) -->
        <!-- Fonts & CDNs (Optimized) -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="preconnect" href="https://a.basemaps.cartocdn.com">
        <link rel="dns-prefetch" href="https://b.basemaps.cartocdn.com">
        <link rel="dns-prefetch" href="https://c.basemaps.cartocdn.com">
        <link rel="dns-prefetch" href="https://d.basemaps.cartocdn.com">
        
        <link rel="preload" href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
        
        <noscript>
            <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800&display=swap" rel="stylesheet" />
        </noscript>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])

        <!-- Preload Map Tile for LCP -->
        <link rel="preload" href="https://a.basemaps.cartocdn.com/rastertiles/voyager/11/634/1213@2x.png" as="image" fetchpriority="high">

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('database.default') === 'sqlite') {
            DB::statement('PRAGMA journal_mode=WAL;');     // lecturas concurrentes con escrituras
            DB::statement('PRAGMA synchronous=NORMAL;');   // balance seguridad/velocidad
            DB::statement('PRAGMA busy_timeout=5000;');    // 5s antes de lanzar error
            DB::statement('PRAGMA cache_size=-64000;');    // 64MB caché de páginas en RAM
        }

        Vite::prefetch(concurrency: 3);

        // Register Observers for Cache Invalidation
        \App\Models\Edificio::observe(\App\Observers\MapaCacheObserver::class);
        \App\Models\Establecimiento::observe(\App\Observers\MapaCacheObserver::class);
        \App\Models\Modalidad::observe(\App\Observers\MapaCacheObserver::class);
    }
}

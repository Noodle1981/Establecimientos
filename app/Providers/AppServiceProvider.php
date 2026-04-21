<?php

namespace App\Providers;

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
        Vite::prefetch(concurrency: 3);

        // Register Observers for Cache Invalidation
        \App\Models\Edificio::observe(\App\Observers\MapaCacheObserver::class);
        \App\Models\Establecimiento::observe(\App\Observers\MapaCacheObserver::class);
        \App\Models\Modalidad::observe(\App\Observers\MapaCacheObserver::class);
    }
}

<?php

namespace App\Providers;

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
        // Inject theme CSS variables into all views
        view()->composer('*', function ($view) {
            $themeStyles = \App\Services\ThemeService::getCssVariables();
            $view->with('themeStyles', $themeStyles);
        });
    }
}

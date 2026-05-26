<?php

namespace App\Observers;

use Illuminate\Support\Facades\Cache;

class MapaCacheObserver
{
    /**
     * Clear the public map cache whenever data changes.
     */
    private function clearCache(): void
    {
        // Limpiar caché de mapa público
        Cache::forget('public-mapa-edificios-react');

        // Limpiar caché estático y dinámico de Dashboard
        Cache::forget('dashboard-departamentos');
        Cache::forget('modalidades_options_react');
        
        foreach (['TODOS', 'PUBLICO', 'PRIVADO'] as $ambito) {
            Cache::forget('dashboard-direcciones-' . md5($ambito));
        }
    }

    public function saved(): void
    {
        $this->clearCache();
    }

    public function deleted(): void
    {
        $this->clearCache();
    }

    public function restored(): void
    {
        $this->clearCache();
    }
}

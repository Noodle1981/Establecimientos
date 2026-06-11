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
        // Limpiamos todo el caché para asegurar consistencia instantánea
        // de estadísticas, dashboards y mapas ante cualquier cambio.
        Cache::flush();
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

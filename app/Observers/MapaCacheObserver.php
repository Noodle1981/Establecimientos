<?php

namespace App\Observers;

use Illuminate\Support\Facades\Cache;

class MapaCacheObserver
{
    /**
     * Claves estáticas y directas de caché que deben limpiarse cuando
     * cambia la estructura de edificios, establecimientos o modalidades.
     *
     * Se evita deliberadamente usar Cache::flush() para preservar
     * contadores de rate limiting, sesiones y cachés independientes del sistema.
     */
    protected array $targetedCacheKeys = [
        'public-mapa-edificios-react',
        'edificios_names_map',
        'edificios_options_react',
        'modalidades_options_react_v2',
        'dashboard-departamentos',
        'admin_dashboard_stats',
        'admin_dashboard_recent_activity',
    ];

    /**
     * Clear targeted application caches without flushing the whole store.
     */
    private function clearCache(): void
    {
        foreach ($this->targetedCacheKeys as $key) {
            Cache::forget($key);
        }

        // Si el driver soporta tags, se pueden etiquetar; si no, borramos selectivamente
        // las llaves conocidas y permitimos que las claves dinámicas con TTL de 300s expiren de forma natural.
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

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
        Cache::forget('public-mapa-edificios-react');
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

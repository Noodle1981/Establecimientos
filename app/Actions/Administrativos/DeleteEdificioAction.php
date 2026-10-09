<?php

namespace App\Actions\Administrativos;

use App\Models\Edificio;
use App\Services\ActivityLogService;

class DeleteEdificioAction
{
    public function __construct(private ActivityLogService $activityLogger) {}

    /**
     * Delete an empty building and log activity.
     */
    public function execute(Edificio $edificio): void
    {
        $edificio->delete();

        $this->activityLogger->logDelete($edificio, 'Baja del edificio/inmueble CUI: '.$edificio->cui);
    }
}

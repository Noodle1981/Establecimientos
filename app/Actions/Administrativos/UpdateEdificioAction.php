<?php

namespace App\Actions\Administrativos;

use App\Models\Edificio;
use App\Services\ActivityLogService;

class UpdateEdificioAction
{
    protected $activityLogger;

    public function __construct(ActivityLogService $activityLogger)
    {
        $this->activityLogger = $activityLogger;
    }

    public function execute(Edificio $edificio, array $data): void
    {
        $edificio->fill($data);

        if ($edificio->isDirty()) {
            $this->activityLogger->logUpdate($edificio, "Actualización de Edificio", [
                'before' => array_intersect_key($edificio->getOriginal(), $edificio->getDirty()),
                'after' => $edificio->getDirty(),
            ]);
            $edificio->save();
        }
    }
}

<?php

namespace App\Actions\Administrativos;

use App\Models\Edificio;
use App\Services\ActivityLogService;

class StoreEdificioAction
{
    protected $activityLogger;

    public function __construct(ActivityLogService $activityLogger)
    {
        $this->activityLogger = $activityLogger;
    }

    public function execute(array $data): Edificio
    {
        $edificio = Edificio::create($data);

        $this->activityLogger->logCreate($edificio, "Creación de Edificio (CUI: {$edificio->cui})");

        return $edificio;
    }
}

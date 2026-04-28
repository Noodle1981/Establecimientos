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
        // Handle Cabecera Name Sync if cue_cabecera is provided
        if (!empty($data['cue_cabecera'])) {
            $cabecera = \App\Models\Establecimiento::where('cue', $data['cue_cabecera'])->first();
            if ($cabecera) {
                \App\Models\Establecimiento::where('edificio_id', $edificio->id)
                    ->update(['establecimiento_cabecera' => $cabecera->nombre]);
                
                $this->activityLogger->logUpdate($edificio, "Actualización de Cabecera", [
                    'new_cabecera' => $cabecera->nombre,
                    'cue' => $data['cue_cabecera']
                ]);
            }
        }

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

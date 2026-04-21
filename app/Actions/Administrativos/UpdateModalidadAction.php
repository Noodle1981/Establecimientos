<?php

namespace App\Actions\Administrativos;

use App\Models\Edificio;
use App\Models\Modalidad;
use Illuminate\Support\Facades\DB;

class UpdateModalidadAction
{
    /**
     * Execute the action to update school structure.
     */
    public function execute(Modalidad $modalidad, array $data): void
    {
        DB::transaction(function () use ($modalidad, $data) {
            // Sync Edificio
            $edificio = $modalidad->establecimiento->edificio;
            if ($edificio->cui !== $data['cui']) {
                $targetEdificio = Edificio::where('cui', $data['cui'])->first();
                if ($targetEdificio) {
                    $modalidad->establecimiento->update(['edificio_id' => $targetEdificio->id]);
                } else {
                    $edificio->update(['cui' => $data['cui']]);
                }
            }

            // Sync Establecimiento
            $modalidad->establecimiento->update([
                'cue' => $data['cue'],
                'nombre' => $data['nombre_establecimiento'],
            ]);

            // Sync Modalidad
            $modalidad->update([
                'nivel_educativo' => $data['nivel_educativo'],
                'direccion_area' => $data['direccion_area'],
                'validado' => $data['validado'],
                'radio' => $data['radio'],
                'sector' => $data['sector'],
                'ambito' => $data['ambito'],
            ]);
        });
    }
}

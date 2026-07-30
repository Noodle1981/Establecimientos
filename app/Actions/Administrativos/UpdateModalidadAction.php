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
                    $edificio = $targetEdificio;
                } else {
                    $edificio->update(['cui' => $data['cui']]);
                }
            }

            // Sync building letra_zona
            $edificio->update([
                'letra_zona' => $data['letra_zona'] ?? null,
            ]);

            // Sync Establecimiento
            $currentEstablecimiento = $modalidad->establecimiento;
            if ((string)$currentEstablecimiento->cue !== (string)$data['cue']) {
                $targetEstablecimiento = \App\Models\Establecimiento::where('cue', $data['cue'])->first();
                if ($targetEstablecimiento) {
                    $targetEstablecimiento->update([
                        'edificio_id' => $edificio->id,
                        'nombre' => $data['nombre_establecimiento'],
                        'observaciones' => $data['observaciones'] ?? $targetEstablecimiento->observaciones,
                    ]);
                    $modalidad->establecimiento_id = $targetEstablecimiento->id;
                } else {
                    $otherCount = $currentEstablecimiento->modalidades()->where('id', '!=', $modalidad->id)->count();
                    if ($otherCount > 0) {
                        $newEstablecimiento = \App\Models\Establecimiento::create([
                            'cue' => $data['cue'],
                            'nombre' => $data['nombre_establecimiento'],
                            'edificio_id' => $edificio->id,
                            'cue_edificio_principal' => $currentEstablecimiento->cue_edificio_principal,
                            'establecimiento_cabecera' => $currentEstablecimiento->establecimiento_cabecera,
                            'observaciones' => $data['observaciones'] ?? null,
                        ]);
                        $modalidad->establecimiento_id = $newEstablecimiento->id;
                    } else {
                        $currentEstablecimiento->update([
                            'cue' => $data['cue'],
                            'edificio_id' => $edificio->id,
                            'nombre' => $data['nombre_establecimiento'],
                            'observaciones' => $data['observaciones'] ?? null,
                        ]);
                    }
                }
            } else {
                $currentEstablecimiento->update([
                    'edificio_id' => $edificio->id,
                    'nombre' => $data['nombre_establecimiento'],
                    'observaciones' => $data['observaciones'] ?? null,
                ]);
            }

            // Sync Modalidad
            $modalidad->update([
                'nivel_educativo' => $data['nivel_educativo'],
                'direccion_area' => $data['direccion_area'],
                'validado' => $data['validado'],
                'radio' => $data['radio'] ?? null,
                'sector' => $data['sector'] ?? null,
                'ambito' => $data['ambito'],
                'categoria' => $data['categoria'] ?? null,
            ]);

            app(\App\Services\ActivityLogService::class)->logUpdate(
                $modalidad, 
                "Actualizó modalidad", 
                ['after' => $data]
            );
        });
    }
}

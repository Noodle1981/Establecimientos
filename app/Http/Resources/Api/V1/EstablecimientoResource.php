<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EstablecimientoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $edificio = $this->edificio;

        return [
            'id' => $this->id,
            'cue' => (string) $this->cue,
            'nombre' => $this->nombre,
            'cue_edificio_principal' => $this->cue_edificio_principal !== null ? (string) $this->cue_edificio_principal : null,
            'establecimiento_cabecera' => $this->establecimiento_cabecera !== null ? (string) $this->establecimiento_cabecera : null,
            'es_cabecera' => (string) $this->establecimiento_cabecera === (string) $this->cue || empty($this->establecimiento_cabecera),
            'observaciones' => $this->observaciones,
            'edificio' => $edificio ? [
                'id' => $edificio->id,
                'cui' => $edificio->cui,
                'calle' => $edificio->calle,
                'numero_puerta' => $edificio->numero_puerta,
                'localidad' => $edificio->localidad,
                'departamento' => $edificio->zona_departamento,
                'codigo_postal' => $edificio->codigo_postal,
                'gps' => [
                    'latitud' => $edificio->latitud !== null ? (float) $edificio->latitud : null,
                    'longitud' => $edificio->longitud !== null ? (float) $edificio->longitud : null,
                ],
            ] : null,
            'modalidades' => $this->modalidades->map(function ($mod) {
                return [
                    'id' => $mod->id,
                    'nivel_educativo' => $mod->nivel_educativo,
                    'direccion_area' => $mod->direccion_area,
                    'ambito' => $mod->ambito,
                    'sector' => $mod->sector,
                    'radio' => $mod->radio,
                    'categoria' => $mod->categoria,
                    'zona' => $mod->zona,
                    'estado_validacion' => $mod->estado_validacion,
                    'validado' => (bool) $mod->validado,
                    'instrumentos_legales' => [
                        'radio' => $mod->inst_legal_radio,
                        'categoria' => $mod->inst_legal_categoria,
                        'creacion' => $mod->inst_legal_creacion,
                    ],
                ];
            }),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

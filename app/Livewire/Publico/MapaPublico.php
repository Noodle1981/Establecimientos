<?php

namespace App\Livewire\Publico;

use App\Models\Edificio;
use Livewire\Component;

class MapaPublico extends Component
{
    public function render()
    {
        // Cargar edificios con sus establecimientos y modalidades
        $edificios = Edificio::with(['establecimientos'])
            ->whereNotNull('latitud')
            ->whereNotNull('longitud')
            ->get()
            ->map(function ($edificio) {
                // Determinar el ámbito predominante
                $ambito = 'PUBLICO'; // Por defecto
                
                return [
                    'cui' => $edificio->cui,
                    'latitud' => (float) $edificio->latitud,
                    'longitud' => (float) $edificio->longitud,
                    'localidad' => $edificio->localidad ?? 'Sin localidad',
                    'calle' => $edificio->calle ?? 'Sin dirección',
                    'numero_puerta' => $edificio->numero_puerta ?? 'S/N',
                    'zona_departamento' => $edificio->zona_departamento ?? '',
                    'ambito' => $ambito,
                    'establecimientos' => $edificio->establecimientos->map(function ($est) {
                        return [
                            'nombre' => $est->nombre,
                            'cue' => $est->cue,
                        ];
                    })->toArray(),
                ];
            });

        return view('livewire.publico.mapa-publico', [
            'edificios' => $edificios,
        ]);
    }
}

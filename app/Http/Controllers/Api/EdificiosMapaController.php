<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Edificio;

class EdificiosMapaController extends Controller
{
    public function index()
    {
        $edificios = Edificio::with(['establecimientos.modalidades'])
            ->get()
            ->map(function ($edificio) {
                // Determinar ámbito predominante
                $ambito = $edificio->modalidades->first()?->ambito ?? 'PUBLICO';
                
                return [
                    'id' => $edificio->id,
                    'cui' => $edificio->cui,
                    'calle' => $edificio->calle,
                    'numero_puerta' => $edificio->numero_puerta,
                    'localidad' => $edificio->localidad,
                    'latitud' => (float) $edificio->latitud,
                    'longitud' => (float) $edificio->longitud,
                    'ambito' => $ambito,
                    'establecimientos' => $edificio->establecimientos->map(function ($est) {
                        return [
                            'cue' => $est->cue,
                            'nombre' => $est->nombre,
                            'modalidades_count' => $est->modalidades->count(),
                        ];
                    }),
                ];
            });

        return response()->json($edificios);
    }
}

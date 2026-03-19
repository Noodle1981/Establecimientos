<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Edificio;
use Illuminate\Support\Facades\Cache;

class EdificiosMapaController extends Controller
{
    public function index()
    {
        $edificios = Cache::remember('api-edificios-mapa', 3600, function () {
            return Edificio::select('id', 'cui', 'latitud', 'longitud', 'localidad', 'calle', 'numero_puerta', 'zona_departamento')
                ->with(['establecimientos:id,edificio_id,cue,nombre', 'establecimientos.modalidades:id,establecimiento_id,ambito'])
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
        });

        return response()->json($edificios);
    }
}

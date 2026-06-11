<?php

namespace App\Http\Controllers\Publico;

use App\Http\Controllers\Controller;
use App\Models\Edificio;
use App\Models\Establecimiento;
use App\Models\Modalidad;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class MapaController extends Controller
{
    /**
     * Display the public map.
     */
    public function index(): Response
    {
        $edificios = Cache::remember('public-mapa-edificios-react', 3600, function () {
            $result = collect();

            $edificios = Edificio::select('id', 'cui', 'latitud', 'longitud', 'localidad', 'calle', 'numero_puerta', 'zona_departamento')
                ->whereNotNull('latitud')
                ->whereNotNull('longitud')
                ->whereHas('establecimientos.modalidades')
                ->with([
                    'establecimientos:id,edificio_id,cue,nombre',
                    'establecimientos.modalidades:id,establecimiento_id,ambito,radio,categoria,nivel_educativo,direccion_area,sector'
                ])
                ->get();

            foreach ($edificios as $edificio) {
                $esPrivado = false;
                $mappedEstablecimientos = [];

                foreach ($edificio->establecimientos as $est) {
                    $mappedModalidades = [];
                    foreach ($est->modalidades as $mod) {
                        $esPriv = stripos($mod->ambito, 'privado') !== false || $mod->sector == 2;
                        if ($esPriv) {
                            $esPrivado = true;
                        }
                        $mappedModalidades[] = [
                            'nivel' => $mod->nivel_educativo,
                            'area' => $mod->direccion_area,
                            'radio' => $mod->radio ?? 'N/A',
                            'categoria' => $mod->categoria ?? 'N/A',
                            'ambito' => $esPriv ? 'PRIVADO' : 'PUBLICO',
                        ];
                    }

                    if (!empty($mappedModalidades)) {
                        $mappedEstablecimientos[] = [
                            'nombre' => $est->nombre,
                            'cue' => $est->cue,
                            'modalidades' => $mappedModalidades,
                        ];
                    }
                }

                $result->push([
                    'id' => $edificio->id,
                    'cui' => $edificio->cui,
                    'latitud' => (float) $edificio->latitud,
                    'longitud' => (float) $edificio->longitud,
                    'localidad' => $edificio->localidad ?? 'Sin localidad',
                    'calle' => $edificio->calle ?? 'Sin dirección',
                    'numero_puerta' => $edificio->numero_puerta ?? 'S/N',
                    'zona_departamento' => $edificio->zona_departamento ?? '',
                    'ambito' => $esPrivado ? 'PRIVADO' : 'PUBLICO',
                    'establecimientos' => $mappedEstablecimientos,
                ]);
            }

            return $result;
        });

        return Inertia::render('Publico/MapaPublico', [
            'edificios' => Inertia::lazy(fn () => $edificios),
        ]);
    }
}

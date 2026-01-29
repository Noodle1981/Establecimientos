<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\Establecimiento;
use App\Models\Modalidad;

echo "\n=== INVESTIGACIÓN DE ESTABLECIMIENTOS ===\n";

$nombres = [
    'INSTITUTO SUPERIOR EN REDES E INFORMÁTICA ISRI',
    'PRESIDENTE NÉSTOR CARLOS KIRCHNER'
];

foreach ($nombres as $nombre) {
    echo "\n------------------------------------------------\n";
    echo "Buscando: '$nombre'\n";
    $ests = Establecimiento::where('nombre', 'like', "%$nombre%")->get();
    
    if ($ests->isEmpty()) {
        echo "(!) No se encontró exacto. Probando LIKE laxo...\n";
    }

    foreach ($ests as $est) {
        echo "EST ID: [{$est->id}]\n";
        echo "NOMBRE: {$est->nombre}\n";
        echo "CUE:    {$est->cue}\n";
        echo "EDIFID: {$est->edificio_id}\n";
        
        $mods = Modalidad::where('establecimiento_id', $est->id)->get();
        echo "MODALIDADES (" . $mods->count() . "):\n";
        foreach($mods as $m) {
            echo "  -> ID: {$m->id} | Nivel: {$m->nivel_educativo} | Ambito: {$m->ambito} | Est_ID: {$m->establecimiento_id}\n";
        }
    }
}

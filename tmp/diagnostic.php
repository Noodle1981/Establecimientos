<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Establecimiento;
use App\Models\Modalidad;
use Illuminate\Support\Facades\DB;

$cue = '700075901';
echo "--- BUSCANDO CUE: $cue ---\n";

$establecimientos = Establecimiento::where('cue', $cue)->get();
echo "ESTABLECIMIENTOS ENCONTRADOS: " . $establecimientos->count() . "\n";

foreach ($establecimientos as $est) {
    echo "\nESTABLECIMIENTO ID: " . $est->id . " (" . $est->nombre . ")\n";
    echo "DELETED_AT: " . ($est->deleted_at ?? 'NONE') . "\n";
    
    $modalidades = $est->modalidades;
    echo "MODALIDADES ENCONTRADAS: " . $modalidades->count() . "\n";
    
    foreach ($modalidades as $mod) {
        echo "  - MODALIDAD ID: " . $mod->id . "\n";
        echo "    NIVEL: " . $mod->nivel_educativo . "\n";
        echo "    ESTADO: " . $mod->estado_validacion . "\n";
        echo "    OBSERVACIONES: " . $mod->observaciones . "\n";
        echo "    VALIDADO: " . ($mod->validado ? 'SI' : 'NO') . "\n";
    }
}

echo "\n--- FIN ---\n";

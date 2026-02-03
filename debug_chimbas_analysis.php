<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Modalidad;

echo "--- ANALYSIS OF CHIMBAS MODALITIES ---\n";

$modalidades = Modalidad::whereHas('establecimiento.edificio', function($q) {
    $q->where('zona_departamento', 'CHIMBAS');
})->get();

echo "Total results in DB for CHIMBAS: " . $modalidades->count() . "\n";

if ($modalidades->count() > 0) {
    echo "\nBreakdown by Nivel Educativo:\n";
    $byNivel = $modalidades->groupBy('nivel_educativo')->map->count();
    foreach ($byNivel as $k => $v) echo " - $k: $v\n";
    
    echo "\nBreakdown by Direccion Area:\n";
    $byArea = $modalidades->groupBy('direccion_area')->map->count();
    foreach ($byArea as $k => $v) echo " - $k: $v\n";
    
    echo "\nBreakdown by Ambito:\n";
    $byAmbito = $modalidades->groupBy('ambito')->map->count();
    foreach ($byAmbito as $k => $v) echo " - $k: $v\n";

    echo "\nBreakdown by Validado:\n";
    $byValidado = $modalidades->groupBy('validado')->map->count();
    foreach ($byValidado as $k => $v) echo " - " . ($k ? 'VALIDADO' : 'PENDIENTE') . ": $v\n";
    
    echo "\nBreakdown by Deleted (Soft Delete):\n";
    $deletedCount = Modalidad::onlyTrashed()->whereHas('establecimiento.edificio', function($q) {
        $q->where('zona_departamento', 'CHIMBAS');
    })->count();
    echo " - Deleted: $deletedCount\n";
}

<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Edificio;
use App\Models\Modalidad;
use App\Models\Establecimiento;

echo "--- DEBUG ZONA: CHIMBAS ---\n";

// 1. Check if 'Chimbas' exists in Edificios (case insensitive alike)
$zonas = Edificio::select('zona_departamento')->distinct()->pluck('zona_departamento');
$chimbasVariants = $zonas->filter(function($z) {
    return stripos($z, 'CHIMBAS') !== false;
});

if ($chimbasVariants->isEmpty()) {
    echo "❌ No 'Chimbas' found in edificios table.\n";
    echo "Available zones: " . $zonas->take(10)->implode(', ') . "...\n";
} else {
    echo "✅ Found variants: " . $chimbasVariants->implode(', ') . "\n";
    
    foreach ($chimbasVariants as $zona) {
        echo "\nChecking details for Zone: '$zona'\n";
        
        // Count buildings
        $countEdificios = Edificio::where('zona_departamento', $zona)->count();
        echo "  - Total Edificios: $countEdificios\n";
        
        // Count Establishments in these buildings
        $countEstablecimientos = Establecimiento::whereHas('edificio', function($q) use ($zona) {
            $q->where('zona_departamento', $zona);
        })->count();
        echo "  - Total Establecimientos: $countEstablecimientos\n";
        
        // Count Modalidades
        $countModalidades = Modalidad::whereHas('establecimiento.edificio', function($q) use ($zona) {
            $q->where('zona_departamento', $zona);
        })->count();
        echo "  - Total Modalidades (records in table): $countModalidades\n";
        
        if ($countModalidades == 0) {
            echo "  ⚠️ WARNING: Buildings exist but no Modalidades linked.\n";
        }
    }
}

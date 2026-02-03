<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Edificio;

echo "--- DEBUG ZONA DETAILS ---\n";

$zonas = Edificio::select('zona_departamento')
    ->distinct()
    ->where('zona_departamento', 'LIKE', '%CHIMBAS%')
    ->pluck('zona_departamento');

if ($zonas->isEmpty()) {
    echo "No matching zones found.\n";
} else {
    foreach ($zonas as $z) {
        echo "Value: '$z'\n";
        echo "Length: " . strlen($z) . "\n";
        echo "Hex comparison: " . bin2hex($z) . "\n";
        
        $count = Edificio::where('zona_departamento', $z)->count();
        echo "Exact match count: $count\n";
        
        $trimmedCount = Edificio::where('zona_departamento', trim($z))->count();
        echo "Trimmed match count: $trimmedCount\n";
        echo "-------------------\n";
    }
}

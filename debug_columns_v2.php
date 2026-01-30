<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

echo "--- COLUMNS IN 'establecimientos' ---\n";
$columns = Schema::getColumnListing('establecimientos');
foreach ($columns as $c) {
    if (str_contains($c, 'Inst') || str_contains($c, 'Legal')) {
        echo "Found: '$c'\n";
    }
}

echo "\n--- SAMPLE DATA ---\n";
try {
    $results = DB::select('SELECT "Inst. Legal Radio", "Inst. Legal Categoría" FROM establecimientos WHERE "Inst. Legal Radio" IS NOT NULL LIMIT 5');
    foreach ($results as $r) {
        print_r($r);
    }
} catch (\Exception $e) {
    echo "Error querying data: " . $e->getMessage() . "\n";
}

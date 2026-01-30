<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

$columns = Schema::getColumnListing('establecimientos');
echo "Count: " . count($columns) . "\n";
print_r($columns);

echo "\n--- RAW ROW ---\n";
$row = DB::select('SELECT * FROM establecimientos LIMIT 1');
print_r($row);

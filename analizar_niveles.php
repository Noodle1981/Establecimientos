&lt;?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app-&gt;make('Illuminate\Contracts\Console\Kernel')-&gt;bootstrap();

// Consultar niveles educativos y direcciones de área
$results = DB::table('modalidades')
    -&gt;select('nivel_educativo', 'direccion_area')
    -&gt;distinct()
    -&gt;orderBy('nivel_educativo')
    -&gt;orderBy('direccion_area')
    -&gt;get();

// Agrupar por nivel educativo
$grouped = $results-&gt;groupBy('nivel_educativo');

echo "MAPEO DE NIVELES EDUCATIVOS Y DIRECCIONES DE ÁREA:\n";
echo str_repeat('=', 70) . "\n\n";

foreach ($grouped as $nivel =&gt; $items) {
    echo "Nivel: " . ($nivel ?: '(vacío)') . "\n";
    foreach ($items as $item) {
        echo "  → " . ($item-&gt;direccion_area ?: '(vacío)') . "\n";
    }
    echo "\n";
}

// Contar registros por combinación
echo "\nCONTEO DE REGISTROS POR COMBINACIÓN:\n";
echo str_repeat('=', 70) . "\n\n";

$counts = DB::table('modalidades')
    -&gt;select('nivel_educativo', 'direccion_area', DB::raw('COUNT(*) as total'))
    -&gt;groupBy('nivel_educativo', 'direccion_area')
    -&gt;orderBy('nivel_educativo')
    -&gt;orderBy('total', 'desc')
    -&gt;get();

foreach ($counts as $count) {
    printf("%-20s → %-40s (%d registros)\n", 
        $count-&gt;nivel_educativo ?: '(vacío)', 
        $count-&gt;direccion_area ?: '(vacío)', 
        $count-&gt;total
    );
}

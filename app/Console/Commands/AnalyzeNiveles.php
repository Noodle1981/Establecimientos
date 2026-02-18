&lt;?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AnalyzeNiveles extends Command
{
    protected $signature = 'analyze:niveles';
    protected $description = 'Analyze educational levels and area directions mapping';

    public function handle()
    {
        $this-&gt;info('MAPEO DE NIVELES EDUCATIVOS Y DIRECCIONES DE ÁREA');
        $this-&gt;info(str_repeat('=', 70));
        $this-&gt;newLine();

        $results = DB::table('modalidades')
            -&gt;select('nivel_educativo', 'direccion_area', DB::raw('COUNT(*) as total'))
            -&gt;groupBy('nivel_educativo', 'direccion_area')
            -&gt;orderBy('nivel_educativo')
            -&gt;orderBy('total', 'desc')
            -&gt;get();

        $grouped = $results-&gt;groupBy('nivel_educativo');

        foreach ($grouped as $nivel =&gt; $items) {
            $this-&gt;line("&lt;fg=yellow&gt;Nivel: " . ($nivel ?: '(vacío)') . "&lt;/&gt;");
            foreach ($items as $item) {
                $this-&gt;line("  → " . ($item-&gt;direccion_area ?: '(vacío)') . " ({$item-&gt;total} registros)");
            }
            $this-&gt;newLine();
        }

        return 0;
    }
}

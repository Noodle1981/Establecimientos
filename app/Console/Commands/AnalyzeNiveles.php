<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AnalyzeNiveles extends Command
{
    protected $signature = 'analyze:niveles';
    protected $description = 'Analyze educational levels and area directions mapping';

    public function handle()
    {
        $this->info('MAPEO DE NIVELES EDUCATIVOS Y DIRECCIONES DE ÁREA');
        $this->info(str_repeat('=', 70));
        $this->newLine();

        $results = DB::table('modalidades')
            ->select('nivel_educativo', 'direccion_area', DB::raw('COUNT(*) as total'))
            ->groupBy('nivel_educativo', 'direccion_area')
            ->orderBy('nivel_educativo')
            ->orderBy('total', 'desc')
            ->get();

        $grouped = $results->groupBy('nivel_educativo');

        foreach ($grouped as $nivel => $items) {
            $this->line("<fg=yellow>Nivel: " . ($nivel ?: '(vacío)') . "</>");
            foreach ($items as $item) {
                $this->line("  → " . ($item->direccion_area ?: '(vacío)') . " ({$item->total} registros)");
            }
            $this->newLine();
        }

        return 0;
    }
}

<?php

namespace App\Console\Commands;

use App\Services\ExcelImportService;
use Illuminate\Console\Command;

class ImportEstablecimientos extends Command
{
    protected $signature = 'import:establecimientos {file?}';
    protected $description = 'Importar establecimientos desde archivo Excel';

    public function handle(ExcelImportService $importService)
    {
        $file = $this->argument('file') ?? 'Establecimientos_Publicos.xlsx';
        $filePath = base_path($file);
        
        if (!file_exists($filePath)) {
            $this->error("Archivo no encontrado: {$filePath}");
            return 1;
        }
        
        $this->info("Importando desde: {$filePath}");
        $this->info("Procesando...\n");
        
        $stats = $importService->importEstablecimientos($filePath);
        
        $this->info("\n✅ Importación completada:");
        $this->table(
            ['Tipo', 'Cantidad'],
            [
                ['Edificios creados', $stats['edificios']],
                ['Establecimientos creados', $stats['establecimientos']],
                ['Modalidades creadas', $stats['modalidades']],
                ['Errores', count($stats['errores'])],
            ]
        );
        
        if (!empty($stats['errores'])) {
            $this->warn("\n⚠️  Errores encontrados:");
            foreach ($stats['errores'] as $error) {
                $this->error($error);
            }
        }
        
        return 0;
    }
}

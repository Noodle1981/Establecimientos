<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Establecimiento;
use App\Models\Modalidad;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ImportZonas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:zonas {file=total_con_zonas.xlsx}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Importa la zona (letra) para los establecimientos basándose en el CUE desde un archivo Excel.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $file = $this->argument('file');
        
        if (!file_exists($file)) {
            $this->error("El archivo {$file} no existe.");
            return 1;
        }

        $this->info("Leyendo archivo: {$file}...");

        try {
            $spreadsheet = IOFactory::load($file);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray();

            // Asumimos encabezados en la fila 1: [0] => cue, [1] => letra_zona
            // Datos empiezan en fila 2
            
            $countUpdated = 0;
            $countSkipped = 0;
            $countNotFound = 0;

            // Empezamos desde el índice 1 (fila 2)
            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];
                $cue = $row[0] ?? null;
                $zona = $row[1] ?? null;

                if (!$cue || !$zona) {
                    $countSkipped++;
                    continue;
                }

                // Limpiar zona (solo 1 caracter)
                $zona = strtoupper(substr(trim($zona), 0, 1));
                
                // Buscar establecimiento por CUE
                $establecimiento = Establecimiento::where('cue', $cue)->first();

                if ($establecimiento) {
                    // Buscar modalidades asociadas
                    $modalidades = $establecimiento->modalidades;
                    
                    if ($modalidades->isNotEmpty()) {
                        foreach ($modalidades as $modalidad) {
                            $modalidad->zona = $zona;
                            $modalidad->save();
                        }
                        $countUpdated++;
                        $this->line("Actualizado CUE: {$cue} -> Zona: {$zona}");
                    } else {
                        $this->warn("CUE: {$cue} encontrado pero sin modalidades.");
                    }
                } else {
                    $this->error("CUE: {$cue} no encontrado.");
                    $countNotFound++;
                }
            }

            $this->info("Importación completada.");
            $this->info("Establecimientos actualizados: {$countUpdated}");
            $this->info("CUEs no encontrados: {$countNotFound}");
            $this->info("Filas saltadas (datos incompletos): {$countSkipped}");

        } catch (\Exception $e) {
            $this->error("Error al procesar el archivo: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}

<?php

namespace App\Services;

use App\Models\Edificio;
use App\Models\Establecimiento;
use App\Models\Modalidad;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExcelImportService
{
    public function importEstablecimientos(string $filePath): array
    {
        $reader = IOFactory::createReader('Xlsx');
        $spreadsheet = $reader->load($filePath);
        $worksheet = $spreadsheet->getActiveSheet();
        
        $stats = [
            'edificios' => 0,
            'establecimientos' => 0,
            'modalidades' => 0,
            'errores' => []
        ];
        
        DB::beginTransaction();
        
        try {
            $rowIterator = $worksheet->getRowIterator(2); // Skip header
            
            foreach ($rowIterator as $row) {
                $cellIterator = $row->getCellIterator();
                $cellIterator->setIterateOnlyExistingCells(false);
                
                $data = [];
                foreach ($cellIterator as $cell) {
                    $data[] = $cell->getValue();
                }
                
                // Skip empty rows
                if (empty($data[4]) || empty($data[7])) { // CUE or CUI empty
                    continue;
                }
                
                $rowData = $this->mapRowData($data);
                
                try {
                    // 1. Crear/obtener Edificio por CUI
                    $edificio = Edificio::firstOrCreate(
                        ['cui' => $rowData['cui']],
                        [
                            'calle' => $rowData['calle'],
                            'numero_puerta' => $rowData['numero_puerta'],
                            'orientacion' => $rowData['orientacion'],
                            'codigo_postal' => $rowData['codigo_postal'],
                            'localidad' => $rowData['localidad'],
                            'latitud' => $this->normalizeCoordinate($rowData['latitud']),
                            'longitud' => $this->normalizeCoordinate($rowData['longitud']),
                            'letra_zona' => $rowData['letra_zona'],
                            'zona_departamento' => $rowData['zona_departamento'],
                            'te_voip' => $rowData['te_voip'],
                        ]
                    );
                    
                    if ($edificio->wasRecentlyCreated) {
                        $stats['edificios']++;
                    }
                    
                    // 2. Crear/obtener Establecimiento por CUE
                    $establecimiento = Establecimiento::firstOrCreate(
                        ['cue' => $rowData['cue']],
                        [
                            'edificio_id' => $edificio->id,
                            'cue_edificio_principal' => $rowData['cue_edificio_principal'],
                            'nombre' => $rowData['nombre'],
                            'establecimiento_cabecera' => $rowData['establecimiento_cabecera'],
                        ]
                    );
                    
                    if ($establecimiento->wasRecentlyCreated) {
                        $stats['establecimientos']++;
                    }
                    
                    // 3. Crear Modalidad (cada fila del Excel)
                    Modalidad::create([
                        'establecimiento_id' => $establecimiento->id,
                        'direccion_area' => $rowData['direccion_area'],
                        'nivel_educativo' => $rowData['nivel_educativo'],
                        'sector' => $rowData['sector'],
                        'categoria' => $rowData['categoria'],
                        'inst_legal_categoria' => $rowData['inst_legal_categoria'],
                        'radio' => $rowData['radio'],
                        'inst_legal_radio' => $rowData['inst_legal_radio'],
                        'inst_legal_categoria_bis' => $rowData['inst_legal_categoria_bis'],
                        'inst_legal_creacion' => $rowData['inst_legal_creacion'],
                        'ambito' => strtoupper($rowData['ambito']),
                        'validado' => $rowData['validado'] === 'VALIDADO',
                    ]);
                    
                    $stats['modalidades']++;
                    
                } catch (\Exception $e) {
                    $stats['errores'][] = "Fila {$row->getRowIndex()}: {$e->getMessage()}";
                    Log::error("Error importando fila {$row->getRowIndex()}", [
                        'error' => $e->getMessage(),
                        'data' => $rowData
                    ]);
                }
            }
            
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollBack();
            $stats['errores'][] = "Error general: {$e->getMessage()}";
            Log::error("Error general en importación", ['error' => $e->getMessage()]);
        }
        
        return $stats;
    }
    
    private function mapRowData(array $data): array
    {
        return [
            'direccion_area' => $data[0] ?? null,
            'nivel_educativo' => $data[1] ?? null,
            'nombre' => $data[2] ?? null,
            'sector' => $data[3] ?? null,
            'cue' => $data[4] ?? null,
            'cue_edificio_principal' => $data[5] ?? null,
            'establecimiento_cabecera' => $data[6] ?? null,
            'cui' => $data[7] ?? null,
            'calle' => $data[8] ?? null,
            'numero_puerta' => $data[9] ?? 'S/N',
            'orientacion' => $data[10] ?? null,
            'codigo_postal' => $data[11] ?? null,
            'localidad' => $data[12] ?? null,
            'latitud' => $data[13] ?? null,
            'longitud' => $data[14] ?? null,
            'categoria' => $data[15] ?? null,
            'inst_legal_categoria' => $data[16] ?? null,
            'radio' => $data[17] ?? null,
            'inst_legal_radio' => $data[18] ?? null,
            'inst_legal_categoria_bis' => $data[19] ?? null,
            'inst_legal_creacion' => $data[20] ?? null,
            'letra_zona' => $data[21] ?? null,
            'zona_departamento' => $data[22] ?? null,
            'te_voip' => $data[23] ?? null,
            'ambito' => $data[24] ?? 'PUBLICO',
            'validado' => $data[25] ?? null,
        ];
    }
    
    private function normalizeCoordinate(?string $coord): ?float
    {
        if (empty($coord)) {
            return null;
        }
        
        // Reemplazar coma por punto
        $normalized = str_replace(',', '.', $coord);
        
        return (float) $normalized;
    }
}

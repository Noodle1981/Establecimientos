<?php

namespace Database\Seeders;

use App\Models\Edificio;
use App\Models\Establecimiento;
use App\Models\Modalidad;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class EstablecimientosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    private function parseCoordinate($value): float
    {
        if (empty($value)) return 0.0;
        
        // Reemplazar coma por punto
        $value = str_replace(',', '.', $value);
        
        // Limpiar caracteres no numéricos excepto punto y menos
        $value = preg_replace('/[^0-9.-]/', '', $value);
        
        return is_numeric($value) ? (float)$value : 0.0;
    }

    public function run(): void
    {
        $this->command->info('🗑️  Limpiando tablas existentes...');
        
        // Truncar tablas en orden correcto (respetando foreign keys)
        DB::statement('PRAGMA foreign_keys = OFF;');
        Modalidad::truncate();
        Establecimiento::truncate();
        Edificio::truncate();
        DB::statement('PRAGMA foreign_keys = ON;');
        
        $this->command->info('📂 Cargando archivo Excel...');
        
        $filePath = database_path('../Establecimientos_Publicos.xlsx');
        
        if (!file_exists($filePath)) {
            $this->command->error("❌ Archivo no encontrado: {$filePath}");
            return;
        }
        
        $spreadsheet = IOFactory::load($filePath);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray();
        
        // Remover encabezados
        $headers = array_shift($rows);
        
        $this->command->info('📊 Importando ' . count($rows) . ' registros...');
        
        $edificiosCache = [];
        $establecimientosCache = [];
        
        foreach ($rows as $index => $row) {
            try {
                // Mapeo de columnas según el análisis
                $direccionArea = $row[0] ?? null;
                $nivelEducativo = $row[1] ?? null;
                $nombre = $row[2] ?? null;
                $sector = $row[3] ?? null;
                $cue = $row[4] ?? null;
                $cueEdificioPrincipal = $row[5] ?? null;
                $establecimientoCabecera = $row[6] ?? null;
                $cui = $row[7] ?? null;
                $calle = $row[8] ?? null;
                $numeroPuerta = $row[9] ?? null;
                $orientacion = $row[10] ?? null;
                $codigoPostal = $row[11] ?? null;
                $localidad = $row[12] ?? null;
                $latitud = $this->parseCoordinate($row[13] ?? null);
                $longitud = $this->parseCoordinate($row[14] ?? null);
                $categoria = $row[15] ?? null;
                $instLegalCategoria = $row[16] ?? null;
                $radio = $row[17] ?? null;
                $instLegalRadio = $row[18] ?? null;
                $instLegalCategoriaBis = $row[19] ?? null;
                $instLegalCreacion = $row[20] ?? null;
                $letraZona = $row[20] ?? null;
                $zonaDepartamento = $row[21] ?? null;
                $teVoip = $row[22] ?? null;
                $ambito = $row[23] ?? null;
                $validado = $row[24] ?? null;
                
                // Validaciones básicas
                if (empty($cue) || empty($cui)) {
                    $this->command->warn("⚠️  Fila " . ($index + 2) . ": CUE o CUI vacío, omitiendo...");
                    continue;
                }
                
                // 1. Crear o recuperar Edificio
                if (!isset($edificiosCache[$cui])) {
                    $edificio = Edificio::create([
                        'cui' => $cui,
                        'calle' => $calle ?? 'Sin datos',
                        'numero_puerta' => $numeroPuerta,
                        'orientacion' => $orientacion,
                        'codigo_postal' => $codigoPostal ? (int)$codigoPostal : null,
                        'localidad' => $localidad ?? 'Sin datos',
                        'latitud' => $latitud,
                        'longitud' => $longitud,
                        'letra_zona' => $letraZona,
                        'zona_departamento' => $zonaDepartamento ?? 'Sin datos',
                        'te_voip' => $teVoip,
                    ]);
                    $edificiosCache[$cui] = $edificio->id;
                } else {
                    $edificio = Edificio::find($edificiosCache[$cui]);
                }
                
                // 2. Crear o recuperar Establecimiento
                if (!isset($establecimientosCache[$cue])) {
                    $establecimiento = Establecimiento::create([
                        'edificio_id' => $edificiosCache[$cui],
                        'cue' => $cue,
                        'cue_edificio_principal' => $cueEdificioPrincipal ?? $cui,
                        'nombre' => $nombre ?? 'Sin nombre',
                        'establecimiento_cabecera' => $establecimientoCabecera,
                    ]);
                    $establecimientosCache[$cue] = $establecimiento->id;
                }
                
                // 3. Crear Modalidad
                Modalidad::create([
                    'establecimiento_id' => $establecimientosCache[$cue],
                    'direccion_area' => $direccionArea,
                    'nivel_educativo' => $nivelEducativo,
                    'sector' => $sector,
                    'categoria' => $categoria,
                    'inst_legal_categoria' => $instLegalCategoria,
                    'radio' => $radio,
                    'inst_legal_radio' => $instLegalRadio,
                    'inst_legal_categoria_bis' => $instLegalCategoriaBis,
                    'inst_legal_creacion' => $instLegalCreacion,
                    'ambito' => $ambito,
                    'validado' => $validado === 'SI' || $validado === 'si' || $validado === true,
                    'estado_validacion' => 'PENDIENTE',
                ]);
                
                if (($index + 1) % 100 === 0) {
                    $this->command->info("✅ Procesadas " . ($index + 1) . " filas...");
                }
                
            } catch (\Exception $e) {
                $this->command->error("❌ Error en fila " . ($index + 2) . ": " . $e->getMessage());
            }
        }
        
        $this->command->info('✨ Importación completada!');
        $this->command->info('📊 Edificios: ' . Edificio::count());
        $this->command->info('📊 Establecimientos: ' . Establecimiento::count());
        $this->command->info('📊 Modalidades: ' . Modalidad::count());
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::transaction(function () {
            // 1. Intentar resolver por coincidencia exacta de nombre
            DB::statement("
                UPDATE establecimientos 
                SET establecimiento_cabecera = (
                    SELECT cue 
                    FROM establecimientos AS e 
                    WHERE e.nombre = establecimientos.establecimiento_cabecera 
                    LIMIT 1
                )
                WHERE establecimiento_cabecera IS NOT NULL 
                  AND establecimiento_cabecera != ''
                  AND establecimiento_cabecera NOT IN (SELECT cue FROM establecimientos);
            ");

            // 2. Fallback por CUI (mismo Edificio) para los que no se pudieron resolver exactamente
            DB::statement("
                UPDATE establecimientos
                SET establecimiento_cabecera = (
                    SELECT cue 
                    FROM establecimientos AS e
                    WHERE e.edificio_id = establecimientos.edificio_id
                    ORDER BY (e.cue % 100 = 0) DESC, e.cue ASC
                    LIMIT 1
                )
                WHERE establecimiento_cabecera IS NOT NULL 
                  AND establecimiento_cabecera != ''
                  AND establecimiento_cabecera NOT IN (SELECT cue FROM establecimientos);
            ");

            // 3. Si aún quedan nulos o vacíos, hacerlos autorreferenciados (son su propia cabecera)
            DB::statement("
                UPDATE establecimientos
                SET establecimiento_cabecera = cue
                WHERE establecimiento_cabecera IS NULL 
                   OR establecimiento_cabecera = ''
                   OR establecimiento_cabecera NOT IN (SELECT cue FROM establecimientos);
            ");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // En reversa no es posible reconstruir los nombres originales exactos del Excel 
        // a menos que se re-ejecute el seeder. Dejamos vacío o restauramos autorreferenciados.
    }
};

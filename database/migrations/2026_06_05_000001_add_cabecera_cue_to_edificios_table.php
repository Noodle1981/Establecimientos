<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // PASO 1: Agregar columna nullable sin FK (evita la circularidad en la creación)
        Schema::table('edificios', function (Blueprint $table) {
            $table->bigInteger('cabecera_cue')->nullable()->after('cui');
        });

        // PASO 2: Poblar desde datos existentes
        // Para cada edificio, buscar el establecimiento cuyo cue == establecimiento_cabecera
        // y cuyo establecimiento_cabecera apunta a sí mismo (es decir, ES la cabecera)
        DB::statement("
            UPDATE edificios
            SET cabecera_cue = (
                SELECT e.cue
                FROM establecimientos e
                WHERE e.edificio_id = edificios.id
                  AND e.cue = e.establecimiento_cabecera
                  AND e.deleted_at IS NULL
                LIMIT 1
            )
            WHERE EXISTS (
                SELECT 1 FROM establecimientos e
                WHERE e.edificio_id = edificios.id
                  AND e.deleted_at IS NULL
            )
        ");

        // PASO 3: Para edificios que quedaron sin cabecera_cue
        // (ej: todos los establecimientos son anexos), tomar el de menor CUE
        DB::statement("
            UPDATE edificios
            SET cabecera_cue = (
                SELECT e.cue
                FROM establecimientos e
                WHERE e.edificio_id = edificios.id
                  AND e.deleted_at IS NULL
                ORDER BY e.cue ASC
                LIMIT 1
            )
            WHERE cabecera_cue IS NULL
        ");

        // NOTA: No agregar FK constraint en SQLite porque no lo soporta post-creación.
        // En MySQL/PostgreSQL se puede agregar aquí:
        // Schema::table('edificios', function (Blueprint $table) {
        //     $table->foreign('cabecera_cue')->references('cue')->on('establecimientos')->nullOnDelete();
        // });
    }

    public function down(): void
    {
        Schema::table('edificios', function (Blueprint $table) {
            $table->dropColumn('cabecera_cue');
        });
    }
};

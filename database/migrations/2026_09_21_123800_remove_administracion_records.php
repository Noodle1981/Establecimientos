<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\Modalidad;
use App\Models\Establecimiento;
use App\Models\Edificio;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::transaction(function () {
            // 1. Eliminar permanentemente las modalidades del área administrativa
            Modalidad::withTrashed()
                ->where('direccion_area', 'like', '%ADMINISTRA%')
                ->forceDelete();

            // 2. Eliminar el establecimiento "Administración Central"
            $est = Establecimiento::withTrashed()->where('cue', '700000000')->first();
            if ($est && $est->modalidades()->withTrashed()->count() === 0) {
                $est->forceDelete();
            }

            // 3. Eliminar el edificio CUI 7000000 si no le quedan establecimientos
            $ed = Edificio::withTrashed()->where('cui', '7000000')->first();
            if ($ed && $ed->establecimientos()->withTrashed()->count() === 0) {
                $ed->forceDelete();
            }

            Cache::flush();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Migración de depuración de datos ajenos al proyecto
    }
};

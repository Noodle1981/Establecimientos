<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('modalidades', function (Blueprint $table) {
            $table->index('ambito');
            $table->index('nivel_educativo');
            $table->index('direccion_area');
            $table->index('radio');
            $table->index('categoria');
            $table->index('zona');
            $table->index('sector');
            $table->index('estado_validacion');
            $table->index('validado');
            $table->index('validado_en');
        });

        Schema::table('edificios', function (Blueprint $table) {
            $table->index('zona_departamento');
            $table->index('localidad');
            $table->index(['latitud', 'longitud']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modalidades', function (Blueprint $table) {
            $table->dropIndex(['ambito']);
            $table->dropIndex(['nivel_educativo']);
            $table->dropIndex(['direccion_area']);
            $table->dropIndex(['radio']);
            $table->dropIndex(['categoria']);
            $table->dropIndex(['zona']);
            $table->dropIndex(['sector']);
            $table->dropIndex(['estado_validacion']);
            $table->dropIndex(['validado']);
            $table->dropIndex(['validado_en']);
        });

        Schema::table('edificios', function (Blueprint $table) {
            $table->dropIndex(['zona_departamento']);
            $table->dropIndex(['localidad']);
            $table->dropIndex(['latitud', 'longitud']);
        });
    }
};

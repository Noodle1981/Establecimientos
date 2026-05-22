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
            $table->enum('estado_validacion', [
                'PENDIENTE',
                'CORRECTO', 
                'CORREGIDO',
                'REVISAR',
                'FALTANTE_EDUGE',
                'BAJA',
                'ELIMINADO'
            ])->default('PENDIENTE')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modalidades', function (Blueprint $table) {
            $table->enum('estado_validacion', [
                'PENDIENTE',
                'CORRECTO', 
                'CORREGIDO',
                'BAJA',
                'ELIMINADO'
            ])->default('PENDIENTE')->change();
        });
    }
};

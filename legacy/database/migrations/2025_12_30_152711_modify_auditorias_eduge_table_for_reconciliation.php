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
        Schema::table('auditorias_eduge', function (Blueprint $table) {
            $table->foreignId('establecimiento_id')->nullable()->change();
            $table->string('tipo_cotejo')->default('RECONCILIACION'); // RECONCILIACION o FALTANTE
            $table->string('identificador_eduge')->nullable(); // Para cuando no hay ID local aún
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auditorias_eduge', function (Blueprint $table) {
            $table->foreignId('establecimiento_id')->nullable(false)->change();
            $table->dropColumn(['tipo_cotejo', 'identificador_eduge']);
        });
    }
};

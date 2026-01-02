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
                'BAJA',
                'ELIMINADO'
            ])->default('PENDIENTE')->after('validado');
            
            $table->foreignId('validado_por_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->after('estado_validacion');
            
            $table->timestamp('validado_en')
                ->nullable()
                ->after('validado_por_user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modalidades', function (Blueprint $table) {
            $table->dropForeign(['validado_por_user_id']);
            $table->dropColumn(['estado_validacion', 'validado_por_user_id', 'validado_en']);
        });
    }
};

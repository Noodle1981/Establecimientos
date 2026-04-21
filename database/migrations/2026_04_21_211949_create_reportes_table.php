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
        Schema::create('reportes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('edificio_id')->nullable()->constrained('edificios')->onDelete('set null');
            $table->string('tipo'); // error, sugerencia, info_faltante, etc.
            $table->text('descripcion');
            $table->string('nombre_remitente')->nullable();
            $table->string('email_remitente')->nullable();
            $table->string('estado')->default('PENDIENTE'); // PENDIENTE, PROCESADO, DESCARTADO
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportes');
    }
};

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
        Schema::create('establecimientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('edificio_id')->constrained()->onDelete('cascade');
            $table->bigInteger('cue')->unique()->comment('Código Único de Establecimiento');
            $table->bigInteger('cue_edificio_principal')->comment('CUE del edificio principal donde funciona');
            $table->string('nombre')->comment('Nombre del establecimiento');
            $table->string('establecimiento_cabecera')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('establecimientos');
    }
};

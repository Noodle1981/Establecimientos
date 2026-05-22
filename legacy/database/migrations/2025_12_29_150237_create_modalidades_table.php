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
        Schema::create('modalidades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('establecimiento_id')->constrained()->onDelete('cascade');
            $table->string('direccion_area')->comment('ADULTOS, PRIMARIO, TÉCNICA, etc.');
            $table->string('nivel_educativo')->comment('UEPA, PRIMARIO, SECUNDARIO, etc.');
            $table->string('sector')->nullable();
            $table->string('categoria')->nullable()->comment('PRIMERA, SEGUNDA, TERCERA');
            $table->text('inst_legal_categoria')->nullable();
            $table->decimal('radio', 8, 2)->nullable();
            $table->string('inst_legal_radio')->nullable();
            $table->text('inst_legal_categoria_bis')->nullable();
            $table->text('inst_legal_creacion')->nullable();
            $table->enum('ambito', ['PUBLICO', 'PRIVADO'])->default('PUBLICO');
            $table->boolean('validado')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modalidades');
    }
};

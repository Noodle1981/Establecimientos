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
            $table->json('campos_auditados')->nullable()->after('observaciones');
        });

        Schema::table('historial_estados_modalidad', function (Blueprint $table) {
            $table->json('campos_auditados')->nullable()->after('observaciones');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modalidades', function (Blueprint $table) {
            $table->dropColumn('campos_auditados');
        });

        Schema::table('historial_estados_modalidad', function (Blueprint $table) {
            $table->dropColumn('campos_auditados');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
  /**
 * Diese Migration erstellt die Tabelle "operationScene",
 * die Informationen über Einsatzorte speichert.
 */
return new class extends Migration
{
    /**
     * Definiert die Struktur der "operationScene"-Tabelle.
     */
    public function up(): void
    {
        Schema::create('operationScene', function (Blueprint $table) {
            $table->id('idoperationScene');
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operationScene', function (Blueprint $table) {
            Schema::dropIfExists('operationScene');
        });
    }
};

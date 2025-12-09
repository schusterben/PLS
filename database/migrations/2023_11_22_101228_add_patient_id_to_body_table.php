<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
/**
 * Diese Migration modifiziert die "body"-Tabelle, falls zusätzliche Felder oder
 * Anpassungen erforderlich sind. Derzeit ist sie leer, um als Vorlage für zukünftige
 * Änderungen an der "body"-Tabelle zu dienen.
 */
return new class extends Migration
{
   /**
     * Führt die Änderungen an der "body"-Tabelle durch.
     * Hier können zukünftige Spalten, Indizes oder Einschränkungen hinzugefügt werden.
     */
    public function up(): void
    {
        Schema::table('body', function (Blueprint $table) {
             // Beispiel für zukünftige Änderungen:
            // $table->string('neues_feld')->nullable();
            // Diese Migration ist aktuell leer und dient als Platzhalter für zukünftige Änderungen.
        });
    }

    /**
     * Macht die Änderungen rückgängig, die in der `up`-Methode vorgenommen wurden.
     */
    public function down(): void
    {
        Schema::table('body', function (Blueprint $table) {
             // Beispiel für das Entfernen eines zukünftigen Feldes:
            // $table->dropColumn('neues_feld');
            // Diese Migration ist aktuell leer und dient als Platzhalter für zukünftige Änderungen.
        });
    }
};

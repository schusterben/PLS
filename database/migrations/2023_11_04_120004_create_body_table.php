<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
/**
 * Diese Migration erstellt die Tabelle "body",
 * die Daten für bestimmte Körperbereiche und ihren Zustand speichert.
 */
return new class extends Migration
{
    /**
     * Definiert die Struktur der "body"-Tabelle.
     */
    public function up(): void
    {
        Schema::create('body', function (Blueprint $table) {
            $table->id('idbody'); // Auto-incremental primary key
            $table->unsignedBigInteger('idpatient');

            // Add all the TINYINT(1) columns here
            $table->tinyInteger('hals_vorne');
            $table->tinyInteger('brust_links');
            $table->tinyInteger('brust_rechts');
            $table->tinyInteger('leiste_links_vorne');
            $table->tinyInteger('leiste_rechts_vorne');
            $table->tinyInteger('oberschenkel_rechts_vorne');
            $table->tinyInteger('unterschenkel_links_vorne');
            $table->tinyInteger('oberschenkel_links_vorne');
            $table->tinyInteger('unterschenkel_rechts_vorne');
            $table->tinyInteger('oberarm_links_vorne');
            $table->tinyInteger('oberarm_rechts_vorne');
            $table->tinyInteger('unterarm_links_vorne');
            $table->tinyInteger('unterarm_rechts_vorne');
            $table->tinyInteger('genital_vorne');
            $table->tinyInteger('kopf_vorne');
            $table->tinyInteger('schulter_links_vorne');
            $table->tinyInteger('schulter_rechts_vorne');
            $table->tinyInteger('huefte_links_vorne');
            $table->tinyInteger('huefte_rechts_vorne');
            $table->tinyInteger('knie_links_vorne');
            $table->tinyInteger('knie_rechts_vorne');
            $table->tinyInteger('ellbogen_rechts_vorne');
            $table->tinyInteger('ellbogen_links_vorne');
            $table->tinyInteger('fuss_rechts_vorne');
            $table->tinyInteger('fuss_links_vorne');
            $table->tinyInteger('auge_rechts');
            $table->tinyInteger('auge_links');
            $table->tinyInteger('mund');
            $table->tinyInteger('hand_links_vorne');
            $table->tinyInteger('hand_rechts_vorne');

            $table->tinyInteger('kopf_hinten');
            $table->tinyInteger('hals_hinten');
            $table->tinyInteger('ruecken_rechts');
            $table->tinyInteger('oberschenkel_rechts_hinten');
            $table->tinyInteger('unterschenkel_links_hinten');
            $table->tinyInteger('oberschenkel_links_hinten');
            $table->tinyInteger('unterschenkel_rechts_hinten');
            $table->tinyInteger('oberarm_links_hinten');
            $table->tinyInteger('oberarm_rechts_hinten');
            $table->tinyInteger('unterarm_links_hinten');
            $table->tinyInteger('unterarm_rechts_hinten');
            $table->tinyInteger('becken_links_hinten');
            $table->tinyInteger('ruecken_links');
            $table->tinyInteger('becken_rechts_hinten');
            $table->tinyInteger('genital_hinten');
            $table->tinyInteger('huefte_rechts_hinten');
            $table->tinyInteger('huefte_links_hinten');
            $table->tinyInteger('knie_links_hinten');
            $table->tinyInteger('knie_rechts_hinten');
            $table->tinyInteger('ellbogen_rechts_hinten');
            $table->tinyInteger('ellbogen_links_hinten');
            $table->tinyInteger('fuss_rechts_hinten');
            $table->tinyInteger('fuss_links_hinten');
            $table->tinyInteger('hand_links_hinten');
            $table->tinyInteger('hand_rechts_hinten');
            $table->tinyInteger('schulter_rechts_hinten');
            $table->tinyInteger('schulter_links_hinten');
            $table->tinyInteger('brustwirbel');
            $table->tinyInteger('lendenwirbel');

            $table->timestamps(); // Created_at and Updated_at columns
        });
    }

    /**
     * Entfernt die "body"-Tabelle.
     */
    public function down(): void
    {
        Schema::dropIfExists('body');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Creates the "ambu" table to store ambulance-related patient information.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ambu', function (Blueprint $table) {
            $table->id('idambu');
            $table->unsignedBigInteger('idpatient');
            $table->string('vsnr')->nullable();
            $table->string('geschlecht')->nullable();
            $table->time('geburtsdatum')->nullable();
            $table->string('staat')->nullable();
            $table->string('telefon')->nullable();
            $table->string('familienstand')->nullable();
            $table->string('arbeitgeber')->nullable();
            $table->string('adresse')->nullable();
            $table->string('versicherungstraeger')->nullable();
            $table->unsignedTinyInteger('naca_score')->nullable();
            $table->text('erstdiagnose')->nullable();
            $table->string('al_atemweg')->nullable();
            $table->string('al_atmung')->nullable();
            $table->string('al_kreislauf')->nullable();
            $table->string('al_bewusstsein')->nullable();
            $table->text('anamnese')->nullable();
            $table->text('akutmedikation')->nullable();
            $table->string('pupillen')->nullable();
            $table->unsignedTinyInteger('schmerz')->nullable();
            $table->unsignedTinyInteger('glasgow_coma_scale')->nullable();
            $table->string('ma_kreislauf')->nullable();
            $table->string('ma_atmung')->nullable();
            $table->text('weitere_massnahmen')->nullable();
            $table->text('allergien')->nullable();
            $table->text('medikamente')->nullable();
            $table->text('vorerkrankung')->nullable();
            $table->string('orale_aufnahme')->nullable();
            $table->text('ereignisse')->nullable();
            $table->text('risikofaktoren')->nullable();
            $table->text('uebergabe')->nullable();
            $table->text('klinischer_zustand')->nullable();
            $table->time('uhrzeit_ende')->nullable();
            $table->string('angehoerige')->nullable();
            $table->timestamps();

            $table->foreign('idpatient')
                ->references('idpatient')
                ->on('patient')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ambu');
    }
};

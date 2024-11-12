<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
 * Diese Migration erstellt die Tabelle "patient",
 * die Patientendaten speichert, wie Atmung, Blutung, Triagefarbe, etc.
 */
    public function up()
    {
        Schema::create('patient', function (Blueprint $table) {
            $table->id('idpatient');
            $table->tinyInteger('atmung')->nullable();
            $table->tinyInteger('blutung')->nullable();
            $table->string('radialispuls')->nullable();
            $table->string('triagefarbe')->nullable();
            $table->tinyInteger('transport')->nullable();
            $table->tinyInteger('dringend')->nullable();
            $table->tinyInteger('kontaminiert')->nullable();
            $table->string('name')->nullable()->nullable();
            $table->float('longitude_patient', 10, 6)->nullable();
            $table->float('latitude_patient', 10, 6)->nullable();
            // $table->unsignedBigInteger('user_iduser');
            // $table->foreign('user_iduser')->references('iduser')->on('user');
            $table->timestamps();
        });
    }

    /**
     * Entfernt die "patient"-Tabelle.
     */
    public function down()
    {
        Schema::dropIfExists('patient');
    }
};

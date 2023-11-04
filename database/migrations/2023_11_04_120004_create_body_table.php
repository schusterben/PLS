<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('body', function (Blueprint $table) {
            $table->id('idbody');
            $table->tinyInteger('ala')->nullable();
            $table->tinyInteger('alvus')->nullable();
            $table->tinyInteger('arteria_aspera')->nullable();
            $table->tinyInteger('auris')->nullable();
            $table->tinyInteger('brachium')->nullable();
            $table->tinyInteger('calx')->nullable();
            $table->tinyInteger('caput')->nullable();
            $table->tinyInteger('collum')->nullable();
            $table->tinyInteger('coxa')->nullable();
            $table->tinyInteger('crus')->nullable();
            $table->tinyInteger('cubitum')->nullable();
            $table->tinyInteger('dens')->nullable();
            $table->tinyInteger('digitus')->nullable();
            $table->tinyInteger('dorsum')->nullable();
            $table->tinyInteger('femur')->nullable();
            $table->tinyInteger('frons')->nullable();
            $table->tinyInteger('gena')->nullable();
            $table->tinyInteger('labea')->nullable();
            $table->tinyInteger('lacertus')->nullable();
            $table->tinyInteger('lingua')->nullable();
            $table->tinyInteger('manus')->nullable();
            $table->tinyInteger('mamma')->nullable();
            $table->tinyInteger('menum')->nullable();
            $table->tinyInteger('nasus')->nullable();
            $table->tinyInteger('oculus')->nullable();
            $table->tinyInteger('os')->nullable();
            $table->tinyInteger('palatum')->nullable();
            $table->tinyInteger('palpebra')->nullable();
            $table->tinyInteger('pectus')->nullable();
            $table->tinyInteger('pes')->nullable();
            $table->tinyInteger('pollex')->nullable();
            $table->tinyInteger('pulmo')->nullable();
            $table->tinyInteger('ren')->nullable();
            $table->tinyInteger('sura')->nullable();
            $table->tinyInteger('tergum')->nullable();
            $table->tinyInteger('umerus')->nullable();
            $table->tinyInteger('venter')->nullable();
            $table->unsignedBigInteger('patient_idpatient');
            $table->foreign('patient_idpatient')->references('idpatient')->on('patient');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('body');
    }
};

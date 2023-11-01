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
        Schema::create('persons', function (Blueprint $table) {
            $table->id();
            $table->string('Nummer');
            $table->boolean('geht');
            $table->boolean('AtmungSuffizient');
            $table->boolean('Blutung');
            $table->boolean('RadialispulsTastbar');
            $table->string('Triagefarbe');
            $table->string('Transport'); //noch hinterfragen was das ist und ob String oder boolean
            $table->boolean('dringend');
            $table->boolean('kontaminiert');
            $table->string('Name'); //noch hinterfragen was das ist kommt in der App nicht vor
            $table->boolean('vertlumb');
            $table->boolean('thordext');
            $table->boolean('thorsin');
            $table->boolean('abddext');
            $table->boolean('abdsin');
            $table->boolean('humerusdext');
            $table->boolean('antebrachdext');
            $table->boolean('antebrachsin');
            $table->boolean('femurdext');
            $table->boolean('femursin');
            $table->boolean('crusdext');
            $table->boolean('crussin');
            $table->boolean('mandext');
            $table->boolean('mansin');
            $table->boolean('pesdext');
            $table->boolean('pessin');
            $table->boolean('arthumdext');
            $table->boolean('arthumsin');
            $table->boolean('artcubdext');
            $table->boolean('artcubsin');
            $table->boolean('artradiocarpdext');
            $table->boolean('artradiocarpsin');
            $table->boolean('artcoxdext');
            $table->boolean('artcoxsin');
            $table->boolean('artgendext');
            $table->boolean('artgensin');
            $table->boolean('arttalocrurdext');
            $table->boolean('arttalocrursin');
            $table->boolean('collum');
            $table->boolean('humerussin');
            $table->point('position');
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('persons');
    }
};

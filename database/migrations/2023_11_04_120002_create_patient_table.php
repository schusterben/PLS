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
        Schema::create('patient', function (Blueprint $table) {
            $table->id('idpatient');
            $table->tinyInteger('atmung');
            $table->tinyInteger('blutung');
            $table->string('radialispuls');
            $table->string('triagefarbe');
            $table->tinyInteger('transport');
            $table->tinyInteger('dringend');
            $table->tinyInteger('kontaminiert');
            $table->string('name')->nullable();
            $table->geometry('location_patient')->nullable();
            $table->unsignedBigInteger('user_iduser');
            $table->foreign('user_iduser')->references('iduser')->on('user');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('patient');
    }
};

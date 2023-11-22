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
            $table->tinyInteger('gehfaehig')->nullable();
            $table->tinyInteger('atmung')->nullable();
            $table->tinyInteger('blutung')->nullable();
            $table->tinyInteger('radialispuls')->nullable();
            $table->string('triagefarbe')->nullable();
            $table->tinyInteger('transport')->nullable();
            $table->tinyInteger('dringend')->nullable();
            $table->tinyInteger('kontaminiert')->nullable();
            $table->string('name')->nullable();
            $table->float('longitude_patient', 10, 6)->nullable();
            $table->float('latitude_patient', 10, 6)->nullable();
            $table->unsignedBigInteger('qr_code_patient_id')->nullable();
            $table->foreign('qr_code_patient_id')->references('idqr_code_login')->on('qr_code_patient');

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

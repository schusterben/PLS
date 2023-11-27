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
        Schema::create('qr_code_patient', function (Blueprint $table) {
            $table->id('idqr_code_patient');
            $table->longText('qr_login')->nullable();
            $table->dateTime('registration_time')->nullable();
            $table->unsignedBigInteger('patient_idpatient')->nullable();
            $table->foreign('patient_idpatient')->references('idpatient')->on('patient')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('qr_code_patient');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
/**
 * Diese Migration erstellt die Tabelle "qr_code_patient",
 * die QR-Codes für Patienten und deren Zuordnung zu Nutzern und Einsatzorten speichert.
 */
return new class extends Migration
{

     /**
     * Definiert die Struktur der "qr_code_patient"-Tabelle.
     */
    public function up()
    {
        Schema::create('qr_code_patient', function (Blueprint $table) {
            $table->id('idqr_code_login');
            $table->longText('qr_login');
            $table->unsignedBigInteger('patient_idpatient')->nullable();
            $table->foreign('patient_idpatient')->references('idpatient')->on('patient');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('iduser')->on('user');
            $table->unsignedBigInteger('operationScene_id')->nullable(); // Neue Spalte hinzugefügt
            $table->foreign('operationScene_id')->references('idoperationScene')->on('operationScene');

            $table->timestamps();
        });
    }
/**
     * Entfernt die "qr_code_patient"-Tabelle.
     */
    public function down()
    {
        Schema::dropIfExists('qr_code_patient');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
/**
 * Diese Migration erstellt die Tabelle "qr_code_login",
 * die Daten für QR-Code-Logins speichert. Jeder Eintrag enthält
 * einen QR-Code und den Zeitpunkt des ersten Logins.
 */
return new class extends Migration
{
    /**
     * Definiert die Struktur der "qr_code_login"-Tabelle.
     */
    public function up()
    {
        Schema::create('qr_code_login', function (Blueprint $table) {
            $table->id('idqr_code_login');
            $table->longText('qr_login')->nullable();
            $table->dateTime('first_login')->nullable();
            $table->timestamps();
        });
    }
/**
     * Entfernt die "qr_code_login"-Tabelle.
     */
    public function down()
    {
        Schema::dropIfExists('qr_code_login');
    }
};

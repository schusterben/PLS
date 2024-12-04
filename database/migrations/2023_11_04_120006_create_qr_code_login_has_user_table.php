<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
/**
 * Diese Migration erstellt die Pivot-Tabelle "qr_code_login_has_user",
 * die die Beziehung zwischen QR-Codes und Benutzern herstellt.
 */
return new class extends Migration
{
    /**
     * Definiert die Struktur der "qr_code_login_has_user"-Tabelle.
     */
    public function up()
    {
        Schema::create('qr_code_login_has_user', function (Blueprint $table) {
            $table->unsignedBigInteger('qr_code_login_idqr_code_login');
            $table->unsignedBigInteger('user_iduser');
            $table->primary(['qr_code_login_idqr_code_login', 'user_iduser']);
            $table->foreign('qr_code_login_idqr_code_login')->references('idqr_code_login')->on('qr_code_login');
            $table->foreign('user_iduser')->references('iduser')->on('user');
        });
    }
/**
     * Entfernt die "qr_code_login_has_user"-Tabelle.
     */
    public function down()
    {
        Schema::dropIfExists('qr_code_login_has_user');
    }
};

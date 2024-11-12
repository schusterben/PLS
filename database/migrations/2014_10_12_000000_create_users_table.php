<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    /**
     * Erstellt die "user"-Tabelle, die Benutzerdaten speichert.
     * Felder enthalten Informationen wie Benutzername, gehashte Passwörter,
     * Rollen (Admin oder normaler Benutzer), und Positionsdaten.
     */
    public function up()
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id('iduser');
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->boolean('adminRole');
            $table->float('longitude_user', 10, 6)->nullable();
            $table->float('latitude_user', 10, 6)->nullable();
            $table->dateTime('first_login_time')->nullable();
            $table->dateTime('last_login_time')->nullable();
            $table->timestamps();
        });


        // Fügt einen Standard-Admin-Benutzer ein, der beim Erstellen der Tabelle verfügbar ist

        DB::table('user')->insert([
            'username' => 'admin',
            'password' => Hash::make('admin'), // Hier solltest du das Passwort richtig hashen
            'adminRole' => true,

        ]);
    }

    /**
     * Entfernt die "user"-Tabelle und löscht alle zugehörigen Daten.
     */
    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};

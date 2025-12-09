<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Erstellt zufällige Benutzerdaten für `user`, inklusive zufälliger Koordinaten und Login-Zeitpunkte.
     *
     * @return void
     */
    public function run()
    {
        // Anzahl der Datensätze, die du erstellen möchtest
        $numberOfRecords = 10; // Hier kannst du die Anzahl anpassen

        for ($i = 0; $i < $numberOfRecords; $i++) {
            DB::table('user')->insert([
                'longitude_user' => rand(-180, 180) + (rand(0, 999999) / 1000000), // Zufällige Longitude im Bereich von -180 bis 180
                'latitude_user' => rand(-90, 90) + (rand(0, 999999) / 1000000),    // Zufällige Latitude im Bereich von -90 bis 90
                'first_login_time' => now(), // Aktuelles Datum und Uhrzeit
                'last_login_time' => now(),  // Aktuelles Datum und Uhrzeit
                'created_at' => now(),       // Aktuelles Datum und Uhrzeit
                'updated_at' => now(),       // Aktuelles Datum und Uhrzeit
            ]);
        }
    }
}

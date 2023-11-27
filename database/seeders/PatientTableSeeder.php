<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PatientTableSeeder extends Seeder
{
    /**
     * Führe den Seeder aus.
     *
     * @return void
     */
    public function run()
    {
        // Anzahl der Datensätze, die du erstellen möchtest
        $numberOfRecords = 10; // Hier kannst du die Anzahl anpassen

        for ($i = 0; $i < $numberOfRecords; $i++) {
            DB::table('patient')->insert([
                'atmung' => rand(0, 1), // Zufälliger Wert (0 oder 1) für "atmung"
                'blutung' => rand(0, 1), // Zufälliger Wert (0 oder 1) für "blutung"
                'radialispuls' => 'Puls' . rand(50, 120), // Zufälliger Puls-Wert
                'triagefarbe' => 'Farbe' . rand(1, 4), // Zufällige Triage-Farbe
                'transport' => rand(0, 1), // Zufälliger Wert (0 oder 1) für "transport"
                'dringend' => rand(0, 1), // Zufälliger Wert (0 oder 1) für "dringend"
                'kontaminiert' => rand(0, 1), // Zufälliger Wert (0 oder 1) für "kontaminiert"
                'name' => 'Patient' . ($i + 1), // Name basierend auf dem Index
                'longitude_patient' => rand(-180, 180) + (rand(0, 999999) / 1000000), // Zufällige Longitude im Bereich von -180 bis 180
                'latitude_patient' => rand(-90, 90) + (rand(0, 999999) / 1000000),    // Zufällige Latitude im Bereich von -90 bis 90
                'user_iduser' => rand(1, 10), // Zufällige Benutzer-ID (angepasst an deine Benutzerdaten)
                'created_at' => now(),       // Aktuelles Datum und Uhrzeit
                'updated_at' => now(),       // Aktuelles Datum und Uhrzeit
            ]);
        }
    }
}

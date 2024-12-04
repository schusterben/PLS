<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PatientSeeder extends Seeder
{
     /**
     * Füllt die `patient`-Tabelle mit Beispiel-Daten, die zufällige Vitalwerte und Triage-Informationen enthalten.
     */
    public function run()
    {
        for ($i = 0; $i < 10; $i++) {
            DB::table('patient')->insert([
                'atmung' => rand(1, 10),
                'blutung' => rand(1, 10),
                'radialispuls' => 'Pulse ' . rand(60, 100),
                'triagefarbe' => 'Color ' . rand(1, 5),
                'transport' => rand(0, 1),
                'dringend' => rand(0, 1),
                'kontaminiert' => rand(0, 1),
                'name' => 'Patient ' . ($i + 1),
                'longitude_patient' => rand(-180, 180) + (rand(0, 999999) / 1000000),
                'latitude_patient' => rand(-90, 90) + (rand(0, 999999) / 1000000),
                'user_iduser' => rand(1, 5), // Assuming user IDs range from 1 to 5
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

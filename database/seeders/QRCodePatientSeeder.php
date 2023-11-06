<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class QRCodePatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fügen Sie hier Ihre Dummy-Daten für die QR-Code Patienten ein
        DB::table('qr_code_patient')->insert([
            [
                'qr_login' => 'QR-Code-Patient-1',
                'registration_time' => now(),
                'patient_idpatient' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'qr_login' => 'QR-Code-Patient-2',
                'registration_time' => now(),
                'patient_idpatient' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Fügen Sie weitere Datensätze hinzu, wie benötigt
        ]);
    }
}

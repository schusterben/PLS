<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QRPatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   
         public function run()
    {
        $patients = DB::table('patient')->get();

        foreach ($patients as $patient) {
            DB::table('qr_code_patient')->insert([
                'qr_login' => 'dein_qr_login_wert',
                'registration_time' => now(),
                'patient_idpatient' => $patient->idpatient,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
    
}

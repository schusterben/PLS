<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Fügen Sie hier Ihre Dummy-Daten für die Benutzer ein
        DB::table('user')->insert([
            [
                'location_user' => null,
                'first_login_time' => now(),
                'last_login_time' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'location_user' => null,
                'first_login_time' => now(),
                'last_login_time' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Fügen Sie weitere Datensätze hinzu, wie benötigt
        ]);
    }
}

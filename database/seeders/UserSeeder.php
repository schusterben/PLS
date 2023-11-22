<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
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

        //for ($i = 0; $i < $numberOfRecords; $i++) {
        DB::table('user')->insert([
            'username' => "admin",
            'password' => Hash::Make("admin"),
            'adminRole' => true,
            // Aktuelles Datum und Uhrzeit
        ]);
        // }
    }
}

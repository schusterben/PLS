<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Haupt-Seeder, der andere Seeder aufruft, um die Datenbank mit Testdaten zu füllen.
     */
    public function run(): void
    {
     // Füge hier die spezifischen Seeder-Aufrufe hinzu, z.B.:
        // $this->call(BodySeeder::class);

        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}

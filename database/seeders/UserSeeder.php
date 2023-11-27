<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create 10 users with random values
        for ($i = 1; $i <= 10; $i++) {
            DB::table('user')->insert([
                'longitude_user' => rand(-180, 180) + (rand(0, 999999) / 1000000),
                'latitude_user' => rand(-90, 90) + (rand(0, 999999) / 1000000),
                'first_login_time' => now()->subDays(rand(1, 30)), // Random date within the last 30 days
                'last_login_time' => now()->subDays(rand(1, 30)), // Random date within the last 30 days
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

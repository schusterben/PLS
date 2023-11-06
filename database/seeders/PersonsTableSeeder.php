<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;


class PersonsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            $latitude = mt_rand(47930, 47940) / 1000;
            $longitude = mt_rand(13060, 13090) / 1000;

            DB::table('persons')->insert([
                'Nummer' => 'N' . \Illuminate\Support\Str::random(125),
                'geht' => random_int(0, 1),
                'AtmungSuffizient' => random_int(0, 1),
                'Blutung' => random_int(0, 1),
                'RadialispulsTastbar' => random_int(0, 1),
                'Triagefarbe' => collect(['rot', 'gelb', 'grün', 'blau'])->random(),
                'Transport' => collect(['Wagen', 'Helikopter', 'Zu Fuß'])->random(),
                'dringend' => random_int(0, 1),
                'kontaminiert' => random_int(0, 1),
                'Name' => 'Person_' . $i,
                'vertlumb' => random_int(0, 1),
                'thordext' => random_int(0, 1),
                'thorsin' => random_int(0, 1),
                'abddext' => random_int(0, 1),
                'abdsin' => random_int(0, 1),
                'humerusdext' => random_int(0, 1),
                'antebrachdext' => random_int(0, 1),
                'antebrachsin' => random_int(0, 1),
                'femurdext' => random_int(0, 1),
                'femursin' => random_int(0, 1),
                'crusdext' => random_int(0, 1),
                'crussin' => random_int(0, 1),
                'mandext' => random_int(0, 1),
                'mansin' => random_int(0, 1),
                'pesdext' => random_int(0, 1),
                'pessin' => random_int(0, 1),
                'arthumdext' => random_int(0, 1),
                'arthumsin' => random_int(0, 1),
                'artcubdext' => random_int(0, 1),
                'artcubsin' => random_int(0, 1),
                'artradiocarpdext' => random_int(0, 1),
                'artradiocarpsin' => random_int(0, 1),
                'artcoxdext' => random_int(0, 1),
                'artcoxsin' => random_int(0, 1),
                'artgendext' => random_int(0, 1),
                'artgensin' => random_int(0, 1),
                'arttalocrurdext' => random_int(0, 1),
                'arttalocrursin' => random_int(0, 1),
                'collum' => random_int(0, 1),
                'humerussin' => random_int(0, 1),
                'position' => DB::raw("ST_GeomFromText('POINT($longitude $latitude)')"),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

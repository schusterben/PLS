<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BodySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get all patient IDs
        $patients = DB::table('patient')->pluck('idpatient');

        // List of all body parts
        $bodyParts = [
            'hals_vorne', 'brust_links', 'brust_rechts', 'leiste_links_vorne', 'leiste_rechts_vorne', 'oberschenkel_rechts_vorne',
            'unterschenkel_links_vorne', 'oberschenkel_links_vorne', 'unterschenkel_rechts_vorne', 'oberarm_links_vorne',
            'oberarm_rechts_vorne', 'unterarm_links_vorne', 'unterarm_rechts_vorne', 'genital_vorne', 'kopf_vorne',
            'schulter_links_vorne', 'schulter_rechts_vorne', 'huefte_links_vorne', 'huefte_rechts_vorne', 'knie_links_vorne',
            'knie_rechts_vorne', 'ellbogen_rechts_vorne', 'ellbogen_links_vorne', 'fuss_rechts_vorne', 'fuss_links_vorne',
            'auge_rechts', 'auge_links', 'mund', 'hand_links_vorne', 'hand_rechts_vorne',
            'kopf_hinten', 'hals_hinten', 'ruecken_rechts', 'oberschenkel_rechts_hinten', 'unterschenkel_links_hinten',
            'oberschenkel_links_hinten', 'unterschenkel_rechts_hinten', 'oberarm_links_hinten', 'oberarm_rechts_hinten',
            'unterarm_links_hinten', 'unterarm_rechts_hinten', 'becken_links_hinten', 'ruecken_links', 'becken_rechts_hinten',
            'genital_hinten', 'huefte_rechts_hinten', 'huefte_links_hinten', 'knie_links_hinten', 'knie_rechts_hinten',
            'ellbogen_rechts_hinten', 'ellbogen_links_hinten', 'fuss_rechts_hinten', 'fuss_links_hinten', 'hand_links_hinten',
            'hand_rechts_hinten', 'schulter_rechts_hinten', 'schulter_links_hinten', 'brustwirbel', 'lendenwirbel'
        ];

        // Create 10 body records with random values
        for ($i = 1; $i <= 10; $i++) {
            $bodyData = [];

            // Assign random body parts
            foreach ($bodyParts as $part) {
                $bodyData[$part] = (bool)rand(0, 1);
            }

            // Add patient ID
            $bodyData['idpatient'] = $patients->random();

            // Add timestamps
            $bodyData['created_at'] = now();
            $bodyData['updated_at'] = now();

            // Insert data into the body table
            DB::table('body')->insert($bodyData);
        }
    }
}

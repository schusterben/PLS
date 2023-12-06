<?php
namespace Database\Seeders;
// File: database/seeders/BodySeeder.php
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
        // Assuming you have 10 patients with IDs from 1 to 10
        for ($i = 1; $i <= 10; $i++) {
            DB::table('body')->insert([
                'idpatient' => $i,
                'hals_vorne' => rand(0, 1),
                'brust_links' => rand(0, 1),
                'brust_rechts' => rand(0, 1),
                'leiste_links_vorne' => rand(0, 1),
                'leiste_rechts_vorne' => rand(0, 1),
                'oberschenkel_rechts_vorne' => rand(0, 1),
                'unterschenkel_links_vorne' => rand(0, 1),
                'oberschenkel_links_vorne' => rand(0, 1),
                'unterschenkel_rechts_vorne' => rand(0, 1),
                'oberarm_links_vorne' => rand(0, 1),
                'oberarm_rechts_vorne' => rand(0, 1),
                'unterarm_links_vorne' => rand(0, 1),
                'unterarm_rechts_vorne' => rand(0, 1),
                'genital_vorne' => rand(0, 1),
                'kopf_vorne' => rand(0, 1),
                'schulter_links_vorne' => rand(0, 1),
                'schulter_rechts_vorne' => rand(0, 1),
                'huefte_links_vorne' => rand(0, 1),
                'huefte_rechts_vorne' => rand(0, 1),
                'knie_links_vorne' => rand(0, 1),
                'knie_rechts_vorne' => rand(0, 1),
                'ellbogen_rechts_vorne' => rand(0, 1),
                'ellbogen_links_vorne' => rand(0, 1),
                'fuss_rechts_vorne' => rand(0, 1),
                'fuss_links_vorne' => rand(0, 1),
                'auge_rechts' => rand(0, 1),
                'auge_links' => rand(0, 1),
                'mund' => rand(0, 1),
                'hand_links_vorne' => rand(0, 1),
                'hand_rechts_vorne' => rand(0, 1),
                
                'kopf_hinten' => rand(0, 1),
                'hals_hinten' => rand(0, 1),
                'ruecken_rechts' => rand(0, 1),
                'oberschenkel_rechts_hinten' => rand(0, 1),
                'unterschenkel_links_hinten' => rand(0, 1),
                'oberschenkel_links_hinten' => rand(0, 1),
                'unterschenkel_rechts_hinten' => rand(0, 1),
                'oberarm_links_hinten' => rand(0, 1),
                'oberarm_rechts_hinten' => rand(0, 1),
                'unterarm_links_hinten' => rand(0, 1),
                'unterarm_rechts_hinten' => rand(0, 1),
                'becken_links_hinten' => rand(0, 1),
                'ruecken_links' => rand(0, 1),
                'becken_rechts_hinten' => rand(0, 1),
                'genital_hinten' => rand(0, 1),
                'huefte_rechts_hinten' => rand(0, 1),
                'huefte_links_hinten' => rand(0, 1),
                'knie_links_hinten' => rand(0, 1),
                'knie_rechts_hinten' => rand(0, 1),
                'ellbogen_rechts_hinten' => rand(0, 1),
                'ellbogen_links_hinten' => rand(0, 1),
                'fuss_rechts_hinten' => rand(0, 1),
                'fuss_links_hinten' => rand(0, 1),
                'hand_links_hinten' => rand(0, 1),
                'hand_rechts_hinten' => rand(0, 1),
                'schulter_rechts_hinten' => rand(0, 1),
                'schulter_links_hinten' => rand(0, 1),
                'brustwirbel' => rand(0, 1),
                'lendenwirbel' => rand(0, 1),
                
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

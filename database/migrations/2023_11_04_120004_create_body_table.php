<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('body', function (Blueprint $table) {
            $table->id('idbody'); // Auto-incremental primary key

            $table->unsignedBigInteger('idpatient')->nullable();

            // Front
            $table->boolean('hals_vorne')->default(false);
            $table->boolean('brust_links')->default(false);
            $table->boolean('brust_rechts')->default(false);
            $table->boolean('leiste_links_vorne')->default(false);
            $table->boolean('leiste_rechts_vorne')->default(false);
            $table->boolean('oberschenkel_rechts_vorne')->default(false);
            $table->boolean('unterschenkel_links_vorne')->default(false);
            $table->boolean('oberschenkel_links_vorne')->default(false);
            $table->boolean('unterschenkel_rechts_vorne')->default(false);
            $table->boolean('oberarm_links_vorne')->default(false);
            $table->boolean('oberarm_rechts_vorne')->default(false);
            $table->boolean('unterarm_links_vorne')->default(false);
            $table->boolean('unterarm_rechts_vorne')->default(false);
            $table->boolean('genital_vorne')->default(false);
            $table->boolean('kopf_vorne')->default(false);
            $table->boolean('schulter_links_vorne')->default(false);
            $table->boolean('schulter_rechts_vorne')->default(false);
            $table->boolean('huefte_links_vorne')->default(false);
            $table->boolean('huefte_rechts_vorne')->default(false);
            $table->boolean('knie_links_vorne')->default(false);
            $table->boolean('knie_rechts_vorne')->default(false);
            $table->boolean('ellbogen_rechts_vorne')->default(false);
            $table->boolean('ellbogen_links_vorne')->default(false);
            $table->boolean('fuss_rechts_vorne')->default(false);
            $table->boolean('fuss_links_vorne')->default(false);
            $table->boolean('auge_rechts')->default(false);
            $table->boolean('auge_links')->default(false);
            $table->boolean('mund')->default(false);
            $table->boolean('hand_links_vorne')->default(false);
            $table->boolean('hand_rechts_vorne')->default(false);

            // Back
            $table->boolean('kopf_hinten')->default(false);
            $table->boolean('hals_hinten')->default(false);
            $table->boolean('ruecken_rechts')->default(false);
            $table->boolean('oberschenkel_rechts_hinten')->default(false);
            $table->boolean('unterschenkel_links_hinten')->default(false);
            $table->boolean('oberschenkel_links_hinten')->default(false);
            $table->boolean('unterschenkel_rechts_hinten')->default(false);
            $table->boolean('oberarm_links_hinten')->default(false);
            $table->boolean('oberarm_rechts_hinten')->default(false);
            $table->boolean('unterarm_links_hinten')->default(false);
            $table->boolean('unterarm_rechts_hinten')->default(false);
            $table->boolean('becken_links_hinten')->default(false);
            $table->boolean('ruecken_links')->default(false);
            $table->boolean('becken_rechts_hinten')->default(false);
            $table->boolean('genital_hinten')->default(false);
            $table->boolean('huefte_rechts_hinten')->default(false);
            $table->boolean('huefte_links_hinten')->default(false);
            $table->boolean('knie_links_hinten')->default(false);
            $table->boolean('knie_rechts_hinten')->default(false);
            $table->boolean('ellbogen_rechts_hinten')->default(false);
            $table->boolean('ellbogen_links_hinten')->default(false);
            $table->boolean('fuss_rechts_hinten')->default(false);
            $table->boolean('fuss_links_hinten')->default(false);
            $table->boolean('hand_links_hinten')->default(false);
            $table->boolean('hand_rechts_hinten')->default(false);
            $table->boolean('schulter_rechts_hinten')->default(false);
            $table->boolean('schulter_links_hinten')->default(false);
            $table->boolean('brustwirbel')->default(false);
            $table->boolean('lendenwirbel')->default(false);

            
            $table->foreign('idpatient')->references('idpatient')->on('patient');

            $table->timestamps(); // Created_at and Updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('body');
    }
};

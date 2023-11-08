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
            $table->id('id_body'); // Auto-incremental primary key
            // Add all the TINYINT(1) columns here
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

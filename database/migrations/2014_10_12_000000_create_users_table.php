<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('user', function (Blueprint $table) {
            $table->id('iduser');
            $table->float('longitude_user', 10, 6)->nullable();
            $table->float('latitude_user', 10, 6)->nullable();
            $table->dateTime('first_login_time')->nullable();
            $table->dateTime('last_login_time')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};

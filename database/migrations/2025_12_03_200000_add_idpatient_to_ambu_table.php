<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('ambu', 'idpatient')) {
            Schema::table('ambu', function (Blueprint $table) {
                $table->unsignedBigInteger('idpatient')->after('idambu');
                $table->foreign('idpatient')
                    ->references('idpatient')
                    ->on('patient')
                    ->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('ambu', 'idpatient')) {
            Schema::table('ambu', function (Blueprint $table) {
                $table->dropForeign(['idpatient']);
                $table->dropColumn('idpatient');
            });
        }
    }
};

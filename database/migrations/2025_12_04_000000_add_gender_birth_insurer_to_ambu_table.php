<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ambu', function (Blueprint $table) {
            if (!Schema::hasColumn('ambu', 'geschlecht')) {
                $table->string('geschlecht')->nullable()->after('vsnr');
            }
            if (!Schema::hasColumn('ambu', 'geburtsdatum')) {
                $table->date('geburtsdatum')->nullable()->after('geschlecht');
            }
            if (!Schema::hasColumn('ambu', 'versicherungstraeger')) {
                $table->string('versicherungstraeger')->nullable()->after('adresse');
            }
        });
    }

    public function down(): void
    {
        Schema::table('ambu', function (Blueprint $table) {
            if (Schema::hasColumn('ambu', 'geschlecht')) {
                $table->dropColumn('geschlecht');
            }
            if (Schema::hasColumn('ambu', 'geburtsdatum')) {
                $table->dropColumn('geburtsdatum');
            }
            if (Schema::hasColumn('ambu', 'versicherungstraeger')) {
                $table->dropColumn('versicherungstraeger');
            }
        });
    }
};

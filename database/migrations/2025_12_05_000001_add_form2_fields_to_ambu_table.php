<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ambu', function (Blueprint $table) {
            if (!Schema::hasColumn('ambu', 'pupillen_r')) {
                $table->string('pupillen_r')->nullable()->after('pupillen');
            }
            if (!Schema::hasColumn('ambu', 'pupillen_l')) {
                $table->string('pupillen_l')->nullable()->after('pupillen_r');
            }
            if (!Schema::hasColumn('ambu', 'schmerz_text')) {
                $table->string('schmerz_text')->nullable()->after('schmerz');
            }
            if (!Schema::hasColumn('ambu', 'gcs_augen')) {
                $table->unsignedTinyInteger('gcs_augen')->nullable()->after('glasgow_coma_scale');
            }
            if (!Schema::hasColumn('ambu', 'gcs_verbal')) {
                $table->unsignedTinyInteger('gcs_verbal')->nullable()->after('gcs_augen');
            }
            if (!Schema::hasColumn('ambu', 'gcs_motorisch')) {
                $table->unsignedTinyInteger('gcs_motorisch')->nullable()->after('gcs_verbal');
            }
            if (!Schema::hasColumn('ambu', 'messwerte')) {
                $table->text('messwerte')->nullable()->after('gcs_motorisch');
            }
            if (!Schema::hasColumn('ambu', 'ma_peripherzugang')) {
                $table->boolean('ma_peripherzugang')->nullable()->after('ma_kreislauf');
            }
            if (!Schema::hasColumn('ambu', 'ma_peripherzugang_dnr')) {
                $table->string('ma_peripherzugang_dnr')->nullable()->after('ma_peripherzugang');
            }
            if (!Schema::hasColumn('ambu', 'ma_herzdruckmassage')) {
                $table->boolean('ma_herzdruckmassage')->nullable()->after('ma_peripherzugang_dnr');
            }
            if (!Schema::hasColumn('ambu', 'ma_defibrillation')) {
                $table->boolean('ma_defibrillation')->nullable()->after('ma_herzdruckmassage');
            }
            if (!Schema::hasColumn('ambu', 'ma_defibrillation_anz')) {
                $table->unsignedSmallInteger('ma_defibrillation_anz')->nullable()->after('ma_defibrillation');
            }
            if (!Schema::hasColumn('ambu', 'ma_defibrillation_letzte_joule')) {
                $table->unsignedSmallInteger('ma_defibrillation_letzte_joule')->nullable()->after('ma_defibrillation_anz');
            }
            if (!Schema::hasColumn('ambu', 'ma_schrittmacher')) {
                $table->boolean('ma_schrittmacher')->nullable()->after('ma_defibrillation_letzte_joule');
            }
            if (!Schema::hasColumn('ambu', 'ma_schrittmacher_freq')) {
                $table->unsignedSmallInteger('ma_schrittmacher_freq')->nullable()->after('ma_schrittmacher');
            }
            if (!Schema::hasColumn('ambu', 'ma_schrittmacher_mv')) {
                $table->unsignedSmallInteger('ma_schrittmacher_mv')->nullable()->after('ma_schrittmacher_freq');
            }
        });
    }

    public function down(): void
    {
        Schema::table('ambu', function (Blueprint $table) {
            $columns = [
                'pupillen_r',
                'pupillen_l',
                'schmerz_text',
                'gcs_augen',
                'gcs_verbal',
                'gcs_motorisch',
                'messwerte',
                'ma_peripherzugang',
                'ma_peripherzugang_dnr',
                'ma_herzdruckmassage',
                'ma_defibrillation',
                'ma_defibrillation_anz',
                'ma_defibrillation_letzte_joule',
                'ma_schrittmacher',
                'ma_schrittmacher_freq',
                'ma_schrittmacher_mv',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('ambu', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};

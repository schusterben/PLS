<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ambu extends Model
{
    use HasFactory;

    protected $table = 'ambu';
    protected $primaryKey = 'idambu';

    protected $fillable = [
        'idpatient',
        'vsnr',
        'geschlecht',
        'geburtsdatum',
        'staat',
        'telefon',
        'familienstand',
        'arbeitgeber',
        'adresse',
        'versicherungstraeger',
        'naca_score',
        'erstdiagnose',
        'al_atemweg',
        'al_atmung',
        'al_kreislauf',
        'al_bewusstsein',
        'anamnese',
        'akutmedikation',
        'pupillen',
        'schmerz',
        'glasgow_coma_scale',
        'gcs_augen',
        'gcs_verbal',
        'gcs_motorisch',
        'schmerz_text',
        'pupillen_r',
        'pupillen_l',
        'messwerte',
        'ma_kreislauf',
        'ma_atmung',
        'weitere_massnahmen',
        'ma_peripherzugang',
        'ma_peripherzugang_dnr',
        'ma_herzdruckmassage',
        'ma_defibrillation',
        'ma_defibrillation_anz',
        'ma_defibrillation_letzte_joule',
        'ma_schrittmacher',
        'ma_schrittmacher_freq',
        'ma_schrittmacher_mv',
        'allergien',
        'medikamente',
        'vorerkrankung',
        'orale_aufnahme',
        'ereignisse',
        'risikofaktoren',
        'uebergabe',
        'klinischer_zustand',
        'uhrzeit_ende',
        'angehoerige',
    ];

    protected $casts = [
        'naca_score' => 'integer',
        'schmerz' => 'integer',
        'glasgow_coma_scale' => 'integer',
        'gcs_augen' => 'integer',
        'gcs_verbal' => 'integer',
        'gcs_motorisch' => 'integer',
        'ma_peripherzugang' => 'boolean',
        'ma_herzdruckmassage' => 'boolean',
        'ma_defibrillation' => 'boolean',
        'ma_schrittmacher' => 'boolean',
        'ma_defibrillation_anz' => 'integer',
        'ma_defibrillation_letzte_joule' => 'integer',
        'ma_schrittmacher_freq' => 'integer',
        'ma_schrittmacher_mv' => 'integer',
        'uhrzeit_ende' => 'datetime:H:i',
        'geburtsdatum' => 'date',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'idpatient', 'idpatient');
    }
}

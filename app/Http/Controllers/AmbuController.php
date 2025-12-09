<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Ambu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AmbuController extends Controller
{
    /**
     * Holt oder legt einen Ambu-Bogen für einen Patienten an.
     */
    public function upsert(Request $request, int $idpatient)
    {
        $data = $request->all();
        $data['idpatient'] = $idpatient;

        $validator = Validator::make($data, [
            'idpatient' => 'required|integer|exists:patient,idpatient',
            'vsnr' => 'nullable|string',
            'geschlecht' => 'nullable|string',
            'geburtsdatum' => 'nullable|date',
            'staat' => 'nullable|string',
            'telefon' => 'nullable|string',
            'familienstand' => 'nullable|string',
            'arbeitgeber' => 'nullable|string',
            'adresse' => 'nullable|string',
            'versicherungstraeger' => 'nullable|string',
            'naca_score' => 'nullable|integer|min:0|max:99',
            'erstdiagnose' => 'nullable|string',
            'al_atemweg' => 'nullable|string',
            'al_atmung' => 'nullable|string',
            'al_kreislauf' => 'nullable|string',
            'al_bewusstsein' => 'nullable|string',
            'anamnese' => 'nullable|string',
            'akutmedikation' => 'nullable|string',
            'pupillen' => 'nullable|string',
            'pupillen_r' => 'nullable|string',
            'pupillen_l' => 'nullable|string',
            'schmerz' => 'nullable|integer|min:0|max:10',
            'schmerz_text' => 'nullable|string',
            'glasgow_coma_scale' => 'nullable|integer|min:3|max:15',
            'gcs_augen' => 'nullable|integer|min:1|max:4',
            'gcs_verbal' => 'nullable|integer|min:1|max:5',
            'gcs_motorisch' => 'nullable|integer|min:1|max:6',
            'messwerte' => 'nullable|string',
            'ma_kreislauf' => 'nullable|string',
            'ma_atmung' => 'nullable|string',
            'weitere_massnahmen' => 'nullable|string',
            'ma_peripherzugang' => 'nullable|boolean',
            'ma_peripherzugang_dnr' => 'nullable|string',
            'ma_herzdruckmassage' => 'nullable|boolean',
            'ma_defibrillation' => 'nullable|boolean',
            'ma_defibrillation_anz' => 'nullable|integer|min:0|max:999',
            'ma_defibrillation_letzte_joule' => 'nullable|integer|min:0|max:999',
            'ma_schrittmacher' => 'nullable|boolean',
            'ma_schrittmacher_freq' => 'nullable|integer|min:0|max:400',
            'ma_schrittmacher_mv' => 'nullable|integer|min:0|max:999',
            'allergien' => 'nullable|string',
            'medikamente' => 'nullable|string',
            'vorerkrankung' => 'nullable|string',
            'orale_aufnahme' => 'nullable|string',
            'ereignisse' => 'nullable|string',
            'risikofaktoren' => 'nullable|string',
            'uebergabe' => 'nullable|string',
            'klinischer_zustand' => 'nullable|string',
            'uhrzeit_ende' => 'nullable|date_format:H:i',
            'angehoerige' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $ambu = Ambu::updateOrCreate(
            ['idpatient' => $idpatient],
            collect($validator->validated())->except('idpatient')->toArray()
        );

        return response()->json($ambu);
    }

    /**
     * Liefert den Ambu-Bogen eines Patienten.
     */
    public function showByPatient(int $idpatient)
    {
        $ambu = Ambu::where('idpatient', $idpatient)->first();

        if (!$ambu) {
            return response()->json(['message' => 'Kein Ambu-Bogen gefunden'], 404);
        }

        return response()->json($ambu);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Patient;
use App\Models\QRCodePatient;



class PersonenController extends Controller
{
    public function index(Request $request)
    {

        $operationScene =
            json_decode($request->input('operationScene'), true);

        $operationSceneId = $operationScene['idoperationScene'];


        Log::info('index Methode aufgerufen');

        $patients = QRCodePatient::join('patient', 'qr_code_patient.patient_idpatient', '=', 'patient.idpatient')
            ->where('qr_code_patient.operationScene_id', $operationSceneId) // Filter nach der ID der Operationsszene
            ->select('patient.*') // Wähle die gewünschten Spalten aus der patient Tabelle
            ->get();
        return response()->json($patients);
    }


    public function show($id)
    {
        Log::info('show Methode aufgerufen mit ID: ' . $id);

        // Finde die Person mit der gegebenen ID und inkludiere die Längen- und Breitengrade.

        $person = Person::select(
            '*',
            DB::raw('ST_X(position) as longitude'),
            DB::raw('ST_Y(position) as latitude')
        )->findOrFail($id);

        // Konvertiere das Ergebnis in JSON und sende die Antwort zurück.
        return response()->json($person);
    }

    public function testDatabaseConnection()
    {
        // Versuche, den ersten Eintrag aus der Tabelle zu holen.
        $person = Person::first();
        if ($person) {
            return response()->json($person);
        } else {
            return response()->json(['error' => 'Keine Daten gefunden.'], 404);
        }
    }



    public function updateRespiration(Request $request, $id)
    {

        $person = Patient::where('idpatient', $id)->firstOrFail();
        $respiration = $request->input('respiration');
        // Übernehmen der GPS-Daten aus der Anfrage
        $lng = $request->input('lng');
        $lat = $request->input('lat');

        $person->atmung = $respiration;
        $person->longitude_patient = $lng;
        $person->latitude_patient = $lat;
        $person->save();

        return response()->json($person);
    }





    public function update(Request $request, $id)
    {
        Log::info('Update Methode aufgerufen', ['idpatient' => $id, 'request' => $request->all()]);

        try {
            // Finden der Person anhand der ID
            $person = Patient::where('idpatient', $id)->firstOrFail();
            Log::info('Person gefunden', ['person' => $person]);

            // ... Rest Ihres Codes ...
        } catch (ModelNotFoundException $e) {
            Log::error('Keine Person mit der ID gefunden', ['id' => $id]);
            // Optional: Senden einer Fehlerantwort
            return response()->json(['message' => 'Person nicht gefunden'], 404);
        }

        // Übernehmen der Triagefarbe aus der Anfrage
        $triageColor = $request->input('triageColor');
        Log::info('Triagefarbe aus Anfrage', ['triageColor' => $triageColor]);
        if ($triageColor !== null) {
            $person->triagefarbe = $triageColor;
            Log::info('Triagefarbe zugewiesen', ['triagefarbe' => $triageColor]);
        }

        // Übernehmen der GPS-Daten aus der Anfrage
        $lng = $request->input('lng');
        $lat = $request->input('lat');
        Log::info('GPS-Daten aus Anfrage', ['lng' => $lng, 'lat' => $lat]);
        if ($lng !== null && $lat !== null) {
            // Zuweisen der Position als Array
            //$person->position = ['lng' => $lng, 'lat' => $lat];
            $person->longitude_patient = $lng;
            $person->latitude_patient = $lat;
            Log::info('GPS-Daten zugewiesen', ['longitude' => $lng, 'latitude' => $lat]);
        }

        $respiration = $request->input('respiration');
        if ($respiration !== null) {
            $person->atmung = $respiration;
        }

        $bloodStopable = $request->input('bloodStopable');
        if ($bloodStopable !== null) {
            $person->blutung = $bloodStopable;
        }

        // Speichern der geänderten Daten
        $person->save();
        Log::info('Änderungen an Person gespeichert', ['id' => $id]);

        // Zurückgeben der aktualisierten Person als JSON
        return response()->json($person);
    }

    public function verifyPatientQrCode(Request $request)
    {
        $qrCode = $request->input('qr_code');
        $operationScene =
            json_decode($request->input('operationScene'), true);


        // Überprüfen, ob der QR-Code in der qr_code_patient Tabelle existiert
        $qrCodePatient = QRCodePatient::where('qr_login', $qrCode)->first();

        if ($qrCodePatient) {
            // Überprüfen, ob ein Wert im Feld 'patient_idpatient' vorhanden ist
            if ($qrCodePatient->patient_idpatient) {
                // Übergabe der PatientenId
                if ($operationScene) {
                    $operationSceneId = $operationScene['idoperationScene'];
                    $qrCodePatient->operationScene_id = $operationSceneId;
                    $qrCodePatient->save();
                }

                return response()->json(['patientId' => $qrCodePatient->patient_idpatient]);
            } else {
                // Erstellen eines neuen Patienteneintrags, falls kein Wert vorhanden ist
                $patient = new Patient;
                // Hier weitere notwendige Daten für den Patienten hinzufügen
                $patient->save();

                // Zuweisen des Patienten zum QR-Code
                $qrCodePatient->patient_idpatient = $patient->idpatient;
                if ($operationScene) {
                    $qrCodePatient->operationScene_id = $operationScene->idoperationScene;
                }
                $qrCodePatient->save();

                // Zurückgeben der ID des neu erstellten Patienteneintrags
                return response()->json(['patientId' => $patient->id]);
            }
        } else {
            Log::error('Kein QRCodePatient Eintrag für gegebenen QR-Code gefunden', ['qrCode' => $qrCode]);
            // Zurückgeben einer Fehlermeldung, falls der QR-Code nicht gefunden wurde
            return response()->json(['message' => 'Ungültiger QR-Code'], 404);
        }
    }
}

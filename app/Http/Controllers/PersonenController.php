<?php

namespace App\Http\Controllers;

use App\Models\Body;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Models\Patient;
use App\Models\QRCodePatient;



/**
* Die Klasse PersonenController verwaltet Operationen für Personen und Patienten.
*
* Diese Controller-Klasse enthält Funktionen zur Verwaltung von Patienten-Daten,
* einschließlich der Zuweisung von QR-Codes, Aktualisierung von Patienteninformationen und
* Abfrage der Patienten in einer bestimmten Einsatzszene.
*/
class PersonenController extends Controller
{

    /**
    * Ruft eine Liste der Patienten für eine bestimmte Einsatzszene ab.
     *
     * @param Request $request
     * HTTP-Anfrage mit Details zur Einsatzszene.
     * Gibt die Patientenliste im JSON-Format zurück
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Extrahiert die ID der Einsatzszene aus der Anfrage
        $operationSceneRaw = $request->input('operationScene');
        $operationScene = is_string($operationSceneRaw)
            ? json_decode($operationSceneRaw, true)
            : $operationSceneRaw;

        // Unterstützt sowohl JSON-Objekt als auch reine ID
        $operationSceneId = null;
        if (is_array($operationScene) && isset($operationScene['idoperationScene'])) {
            $operationSceneId = $operationScene['idoperationScene'];
        } elseif (is_numeric($operationScene)) {
            $operationSceneId = (int) $operationScene;
        }

        if ($operationSceneId === null) {
            return response()->json(['message' => 'operationSceneId fehlt oder ist ungültig'], 400);
        }

        // Abfrage aller Patienten, die mit der angegebenen Einsatzszene verknüpft sind
        $patients = QRCodePatient::join('patient', 'qr_code_patient.patient_idpatient', '=', 'patient.idpatient')
            ->where('qr_code_patient.operationScene_id', $operationSceneId) // Filter nach der ID der Operationsszene
            ->select('patient.*') // Wähle die gewünschten Spalten aus der patient Tabelle
            ->get();
        return response()->json($patients);
    }

    /**
     * Get information about a specific person.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     * Gibt die Informationen der Person im JSON-Format zurück.
     */
    public function show($id)
    {
        // Sucht die Person anhand der ID und fügt Breiten- und Längengrad aus der Position hinzu
        $person = Person::select(
            '*',
            DB::raw('ST_X(position) as longitude'),
            DB::raw('ST_Y(position) as latitude')
        )->findOrFail($id);


        return response()->json($person);
    }

    /**
     * Testet die Datenbankverbindung, indem der erste Eintrag der Tabelle abgerufen wird.
     *
     * @return \Illuminate\Http\JsonResponse
    * Gibt den ersten Eintrag der Tabelle oder eine Fehlermeldung zurück.
     */
    public function testDatabaseConnection()
    {
        // Holt den ersten Eintrag aus der Person-Tabelle
        $person = Person::first();
        if ($person) {
            return response()->json($person);
        } else {
            return response()->json(['error' => 'Keine Daten gefunden.'], 404);
        }
    }


    /**
     * Aktualisiert die Atemfrequenz und Position eines Patienten.
     *
     * @param Request $request HTTP-Anfrage mit den neuen Daten.
     * @param int $idID des Patienten.
     * @return \Illuminate\Http\JsonResponse Gibt die aktualisierten Patientendaten zurück.
     */
    public function updateRespiration(Request $request, $id)
    {
        // Find the patient by ID
        $person = Patient::where('idpatient', $id)->firstOrFail();

        // Update respiration rate and GPS data from the request
        $respiration = $request->input('respiration');


        $lng = $request->input('lng');
        $lat = $request->input('lat');

        $person->atmung = $respiration;
        $person->longitude_patient = $lng;
        $person->latitude_patient = $lat;
        $person->save();

        return response()->json($person);
    }




    /**
     * Aktualisiert allgemeine Informationen eines Patienten.
     *
     * @param Request $request HTTP-Anfrage mit den neuen Daten.
     * @param int $id ID des Patienten.
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {

        try {
            // Findet die Person anhand der ID oder gibt einen Fehler zurück
            $person = Patient::where('idpatient', $id)->firstOrFail();
        } catch (ModelNotFoundException $e) {
            // Handle the case when no patient is found with the provided ID
            return response()->json(['message' => 'Person nicht gefunden'], 404);
        }
        // Aktualisiert Triage-Farbe, Position und andere Patientendaten

        $triageColor = $request->input('triageColor');

        if ($triageColor !== null) {
            $person->triagefarbe = $triageColor;
        }


        $lng = $request->input('lng');
        $lat = $request->input('lat');
        if ($lng !== null && $lat !== null) {
            $person->longitude_patient = $lng;
            $person->latitude_patient = $lat;
        }

        if ($request->exists('respiration')) {
            $respiration = $request->input('respiration');
            $person->atmung = is_null($respiration) ? null : (bool) $respiration;
        }

        if ($request->exists('bloodStopable')) {
            $bloodStopable = $request->input('bloodStopable');
            $person->blutung = is_null($bloodStopable) ? null : (bool) $bloodStopable;
        }

        if ($request->exists('name')) {
            $person->name = $request->input('name');
        }

        if ($request->exists('transport')) {
            $transport = $request->input('transport');
            $person->transport = is_null($transport) ? null : (bool) $transport;
        }

        if ($request->exists('dringend')) {
            $dringend = $request->input('dringend');
            $person->dringend = is_null($dringend) ? null : (bool) $dringend;
        }

        if ($request->exists('kontaminiert')) {
            $kontaminiert = $request->input('kontaminiert');
            $person->kontaminiert = is_null($kontaminiert) ? null : (bool) $kontaminiert;
        }

        if ($request->exists('radialispuls')) {
            $radialispuls = $request->input('radialispuls');
            $person->radialispuls = is_null($radialispuls) ? null : (bool) $radialispuls;
        }


        $person->save();


        return response()->json($person);
    }


    /**
     * Überprüft einen Patienten-QR-Code und ordnet diesen einem Patienten zu, falls dieser noch nicht verknüpft ist.
     *
     * @param Request $request HTTP-Anfrage mit dem QR-Code und Einsatzszenen-Daten.
     * @return \Illuminate\Http\JsonResponse Gibt die Patienten-ID zurück oder meldet einen Fehler.
     */
    public function verifyPatientQrCode(Request $request)
    {
     // Holt den QR-Code und die Einsatzszenen-Daten aus der Anfrage

        $qrCode = $request->input('qr_code');
        $operationSceneRaw = $request->input('operationScene');
        $operationScene = is_string($operationSceneRaw)
            ? json_decode($operationSceneRaw, true)
            : $operationSceneRaw;

        $operationSceneId = null;
        if (is_array($operationScene) && isset($operationScene['idoperationScene'])) {
            $operationSceneId = $operationScene['idoperationScene'];
        } elseif (is_numeric($operationScene)) {
            $operationSceneId = (int) $operationScene;
        }


        // Überprüft, ob der QR-Code in der qr_code_patient-Tabelle existiert
        $qrCodePatient = QRCodePatient::where('qr_login', $qrCode)->first();

        if ($qrCodePatient) {
            // Wenn der QR-Code einem Patienten zugeordnet ist, gibt die Patienten-ID zurück
            if ($qrCodePatient->patient_idpatient) {
                // Übergabe der PatientenId
                if ($operationSceneId) {
                    $qrCodePatient->operationScene_id = $operationSceneId;
                    $qrCodePatient->save();
                }

                return response()->json(['patientId' => $qrCodePatient->patient_idpatient]);
            } else {
                // Erstellt einen neuen Patienten, wenn der QR-Code nicht verknüpft ist
                $patient = new Patient();
                // Add any additional necessary patient data here
                $patient->save();


                // Erstellt einen neuen Eintrag für den Körper des Patienten
                $body = new Body();
                $idpat = $patient->idpatient;
                $body->idpatient = $idpat;
                $body->save();


                // Verknüpft den Patienten mit dem QR-Code und ggf. der Einsatzszene
                $qrCodePatient->patient_idpatient = $patient->idpatient;
                if ($operationSceneId) {
                    $qrCodePatient->operationScene_id = $operationSceneId;
                }
                $qrCodePatient->save();

                // Return the ID of the newly created patient
                return response()->json(['patientId' => $patient->idpatient]);
            }
        } else {
            // Return an error message if the QR code is not found
            return response()->json(['message' => 'Ungültiger QR-Code'], 404);
        }
    }
}

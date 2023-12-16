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
 * The PersonenController class handles operations related to persons and patients.
 */
class PersonenController extends Controller
{

    /**
     * Get a list of patients associated with a specific operation scene.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Extract operation scene information from the request
        $operationScene =
            json_decode($request->input('operationScene'), true);

        $operationSceneId = $operationScene['idoperationScene'];

        // Retrieve patients associated with the specified operation scene
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
     */
    public function show($id)
    {
        // Find the person with the given ID and include longitude and latitude.
        $person = Person::select(
            '*',
            DB::raw('ST_X(position) as longitude'),
            DB::raw('ST_Y(position) as latitude')
        )->findOrFail($id);


        return response()->json($person);
    }

    /**
     * Test the database connection by retrieving the first entry from the table.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function testDatabaseConnection()
    {
        // Try to retrieve the first entry from the table
        $person = Person::first();
        if ($person) {
            return response()->json($person);
        } else {
            return response()->json(['error' => 'Keine Daten gefunden.'], 404);
        }
    }


    /**
     * Update the respiration rate for a patient.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
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
     * Update patient information.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {

        try {
            // Finden der Person anhand der ID
            $person = Patient::where('idpatient', $id)->firstOrFail();
        } catch (ModelNotFoundException $e) {
            // Handle the case when no patient is found with the provided ID
            return response()->json(['message' => 'Person nicht gefunden'], 404);
        }

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

        $respiration = $request->input('respiration');
        if ($respiration !== null) {
            $person->atmung = $respiration;
        }

        $bloodStopable = $request->input('bloodStopable');
        if ($bloodStopable !== null) {
            $person->blutung = $bloodStopable;
        }

        $person->save();


        return response()->json($person);
    }


    /**
     * Verify a patient QR code and associate it with a patient if not already done.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyPatientQrCode(Request $request)
    {
        $qrCode = $request->input('qr_code');
        $operationScene =
            json_decode($request->input('operationScene'), true);


        // Check if the QR code exists in the qr_code_patient table
        $qrCodePatient = QRCodePatient::where('qr_login', $qrCode)->first();

        if ($qrCodePatient) {
            // If the QR code is associated with a patient, return the patient ID
            if ($qrCodePatient->patient_idpatient) {
                // Übergabe der PatientenId
                if ($operationScene) {
                    $operationSceneId = $operationScene['idoperationScene'];
                    $qrCodePatient->operationScene_id = $operationSceneId;
                    $qrCodePatient->save();
                }

                return response()->json(['patientId' => $qrCodePatient->patient_idpatient]);
            } else {
                // Create a new patient entry if the QR code is not associated with any patient
                $patient = new Patient();
                // Add any additional necessary patient data here
                $patient->save();


                // Create a body entry for the patient
                $body = new Body();
                $idpat = $patient->idpatient;
                $body->idpatient = $idpat;
                $body->save();


                // Associate the patient with the QR code
                $qrCodePatient->patient_idpatient = $patient->idpatient;
                if ($operationScene) {
                    $qrCodePatient->operationScene_id = $operationScene['idoperationScene'];
                }
                $qrCodePatient->save();

                // Return the ID of the newly created patient
                return response()->json(['patientId' => $patient->id]);
            }
        } else {
            // Return an error message if the QR code is not found
            return response()->json(['message' => 'Ungültiger QR-Code'], 404);
        }
    }
}

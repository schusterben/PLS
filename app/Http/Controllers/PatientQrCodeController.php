<?php

namespace App\Http\Controllers;

use App\Models\QRCodePatient;
use Illuminate\Http\Request;

/**
 * Der PatientQrCodeController verwaltet alle Funktionen im Zusammenhang mit Patienten-QR-Codes.
 *
 * Funktionen umfassen das Generieren und Abrufen von QR-Codes, die für die Identifizierung
 * von Patienten verwendet werden können.
 */
class PatientQrCodeController extends Controller
{

    /**
     * Generiert einen zufälligen QR-Code-String einer angegebenen Länge.
     *Die gewünschte Länge des QR-Codes (Standard: 64 Zeichen).
     * @param int $length
     * Gibt den generierten QR-Code als String zurück.
     * @return string
     */
    function generateRandomQR($length = 64)
    {
                        // Zeichensatz für die Generierung

        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }

        return $randomString;
    }

     /**
     * Generiert eine bestimmte Anzahl an QR-Codes für Patienten und speichert diese in der Datenbank.
     *
     * Diese QR-Codes können später zur Identifizierung und Verwaltung von Patienten verwendet werden.
     *Die HTTP-Anfrage mit der Anzahl der zu erstellenden QR-Codes
     * @param Request $request
     * Gibt eine JSON-Antwort mit den generierten QR-Codes zurück.
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateQRCodeForPatients(Request $request)
    {

        // Validierung der Anfrage: Es muss eine Anzahl (number) angegeben sein
        $request->validate([
            'number' => 'required|integer',
        ]);


        // Anzahl der QR-Codes, die generiert werden sollen
        $number = $request->input('number');
        $qrCodes = [];

        for ($i = 0; $i < $number; $i++) {
            // Generiert einen zufälligen QR-Code-String
            $tempQR = $this->generateRandomQR(64);

            // Check if the generated QR code already exists in the database
            while (QRCodePatient::where('qr_login', $tempQR)->exists()) {
                $tempQR = $this->generateRandomQR(64);
            }

            // Speichert den QR-Code in der QRCodePatient-Tabelle
            QRCodePatient::create([
                'qr_login' => $tempQR,
            ]);

            $qrCodes[] = $tempQR;
        }

        return response()->json(['status' => 'success', 'qrcodes' => $qrCodes]);
    }


    /**
     * Get all unused QR codes that have not been associated with a patient's first login.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllUnusedQrCodes()
    {
        // Retrieve all QR codes that have not been used for a patient
        $codes = QRCodePatient::where('patient_idpatient', null)->pluck('qr_login')->toArray();


        // Return $codes or pass it to a view
        return response()->json($codes);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\QRCodeLogin;
use Illuminate\Http\Request;

/**
 * Die Klasse QRLoginController verwaltet Operationen, die mit der
 * Generierung und Verwaltung von QR-Codes für Benutzer-Logins verbunden sind.
 *
 * Funktionen umfassen die Erstellung neuer QR-Codes und das Abrufen aller bestehenden QR-Codes
 * für die Authentifizierung in der Anwendung.
 */
class QRLoginController extends Controller
{
    /**
     * Generiert einen zufälligen QR-Code-String der angegebenen Länge.
     *
     * @param int $length Die gewünschte Länge des QR-Codes (Standard ist 64).
     * @return string Gibt den generierten QR-Code als Zeichenkette zurück.
     */
    function generateRandomQR($length = 64)
    {
                // Zeichen, die im QR-Code-String verwendet werden können.

        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';
        // Baut den zufälligen QR-Code-Zeichenstring auf

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }

        return $randomString;
    }


    /**
     * Generiert eine bestimmte Anzahl an QR-Codes für Benutzer-Logins und speichert diese in der Datenbank.
     *
     * @param Request $request HTTP-Anfrage, die die Anzahl der zu generierenden QR-Codes enthält.
     * @return \Illuminate\Http\JsonResponse Gibt eine JSON-Antwort mit dem Status und den generierten QR-Codes zurück.
     */
    public function generateLoginQRCodes(Request $request)
    {

        // Validierung der Anfrage, um sicherzustellen, dass die Anzahl als Integer übermittelt wurde.
        $request->validate([
            'number' => 'required|integer',
        ]);


        // Anzahl der QR-Codes, die erstellt werden sollen, und Initialisierung eines Arrays zur Speicherung der Codes.
        $number = $request->input('number');
        $qrCodes = [];

        for ($i = 0; $i < $number; $i++) {
                         // Generiert einen neuen QR-Code

            $tempQR = $this->generateRandomQR(64);

            // Prüft, ob der generierte QR-Code bereits in der Datenbank existiert
            while (QRCodeLogin::where('qr_login', $tempQR)->exists()) {
                $tempQR = $this->generateRandomQR(64);
            }

            $qrCodes[] = $tempQR;

            // Speichert den generierten QR-Code im Array und in der Datenbank
            QRCodeLogin::create([
                'qr_login' => $tempQR,
            ]);
        }
        // Gibt die erfolgreich generierten QR-Codes zurück

        return response()->json(['status' => 'success', 'qrcodes' => $qrCodes]);
    }

    /**
     * Ruft alle existierenden QR-Codes für Logins aus der Datenbank ab.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse Gibt eine JSON-Antwort mit allen QR-Codes zurück.
     */
    public function getLoginQrCodes(Request $request)
    {
        // Ruft alle QR-Code-Einträge aus der Datenbank ab und speichert sie in einem Array.
        $codes = QRCodeLogin::pluck('qr_login')->toArray();


        // Gibt die abgerufenen QR-Codes zurück, die z.B. im Admin-Interface angezeigt werden können
        return response()->json($codes);
    }
}

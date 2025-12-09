<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\QRCodeLogin;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;


/**
 * Die LoginController-Klasse verwaltet die Authentifizierung und Login-Funktionen für die Anwendung.
 *
 * Diese Klasse bietet zwei Haupt-Login-Methoden:
 * - QR-Code-Login: Authentifiziert Nutzer durch Scannen eines QR-Codes.
 * - Admin-Login: Authentifiziert Administratoren mit Benutzernamen und Passwort.
 */
class LoginController extends Controller
{
   /**
     * Authentifiziert einen Benutzer anhand eines QR-Codes.
     *
     * Diese Methode überprüft, ob der QR-Code gültig ist, und erstellt einen JWT-Token für den Nutzer,
     * um eine weitere Authentifizierung in der App zu ermöglichen.
     *
     * Die Anfrage, die den QR-Code als Eingabe enthält.
     * @param Request $request
     *
     * Gibt eine JSON-Antwort zurück, die den Status und den JWT-Token enthält.
     * @return \Illuminate\Http\JsonResponse
     */
    public function qrLogin(Request $request)
    {
        // Überprüft, ob der QR-Code in der Anfrage vorhanden und gültig ist
        $request->validate([
            'qr_code' => 'required|string',
        ]);

        // Ruft den QR-Code aus der Anfrage ab und sucht diesen in der Datenbank
        $qrCode = $request->input('qr_code');
        $qrLogin = QRCodeLogin::where('qr_login', $qrCode)->first();
        // Wenn der QR-Code nicht gefunden wird, gibt die Methode eine Fehlermeldung zurück

        if (!$qrLogin) {
            return response()->json(['status' => 'error', 'message' => 'Invalid QR code'], Response::HTTP_UNAUTHORIZED);
        }

        // Erstellt einen JWT-Token basierend auf dem QR-Code-Datensatz
        $token = JWTAuth::fromSubject($qrLogin);

        return response()->json(['status' => 'success', 'token' => $token]);
    }


    /**
     * Authentifiziert einen Admin-Benutzer mit Benutzername und Passwort.
     *
     * Diese Methode überprüft die Anmeldeinformationen und erstellt einen JWT-Token, wenn der Benutzer ein Admin ist.
     *
     * Die Anfrage, die den Benutzernamen und das Passwort enthält.
     * @param Request $request
     *Gibt eine JSON-Antwort zurück, die den Status und ggf. den JWT-Token enthält.
     *
     * @return \Illuminate\Http\JsonResponse
     */

    public function adminLogin(Request $request)
    {
                        // Überprüft, ob Benutzername und Passwort in der Anfrage vorhanden und gültig sind

        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $username = $request->input('username');
        $password = $request->input('password');

        // Sucht den Benutzer anhand des Benutzernamens in der Datenbank
        $user = User::where('username', $username)->first();

        // Wenn der Benutzer gefunden wurde
        if ($user) {
            // Überprüfe das Passwort
            if (Hash::check($password, $user->password)) {
                                // Überprüft, ob der Benutzer Adminrechte besitzt

                if ($user->adminRole) {
                    // Generiere ein JWT-Token für den Benutzer
                    $token = JWTAuth::fromSubject($user);

                    return response()->json(['status' => 'success', 'token' => $token]);
                }
                // Gibt eine Fehlermeldung zurück, wenn der Benutzer kein Admin ist

                return response()->json(['status' => 'error', 'message' => 'User is not an admin'], Response::HTTP_UNAUTHORIZED);
            }
        }
        // Gibt eine Fehlermeldung zurück, wenn die Anmeldeinformationen ungültig sind

        return response()->json(['status' => 'error', 'message' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
    }
}

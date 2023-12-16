<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\QRCodeLogin;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;


/**
 * The LoginController class handles user authentication and login functionality.
 */
class LoginController extends Controller
{
    /**
     * Authenticate a user using a QR code.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function qrLogin(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'qr_code' => 'required|string',
        ]);

        // Check if the QR code exists in the database
        $qrCode = $request->input('qr_code');
        $qrLogin = QRCodeLogin::where('qr_login', $qrCode)->first();

        if (!$qrLogin) {
            return response()->json(['status' => 'error', 'message' => 'Invalid QR code'], Response::HTTP_UNAUTHORIZED);
        }

        // Generate a JWT token for the QR code login
        $token = JWTAuth::fromSubject($qrLogin);

        return response()->json(['status' => 'success', 'token' => $token]);
    }


    /**
     * Authenticate an admin user with username and password.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function adminLogin(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $username = $request->input('username');
        $password = $request->input('password');

        // Finde den Benutzer anhand des Benutzernamens
        $user = User::where('username', $username)->first();

        // Wenn der Benutzer gefunden wurde
        if ($user) {
            // Überprüfe das Passwort
            if (Hash::check($password, $user->password)) {
                if ($user->adminRole) {
                    // Generiere ein JWT-Token für den Benutzer
                    $token = JWTAuth::fromSubject($user);

                    return response()->json(['status' => 'success', 'token' => $token]);
                }

                return response()->json(['status' => 'error', 'message' => 'User is not an admin'], Response::HTTP_UNAUTHORIZED);
            }
        }

        return response()->json(['status' => 'error', 'message' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
    }
}

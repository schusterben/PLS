<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QRCodeLogin;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

use Tymon\JWTAuth\Contracts\JWTSubject;

class QRLoginController extends Controller
{
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


    
}

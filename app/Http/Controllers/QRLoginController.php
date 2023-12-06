<?php

namespace App\Http\Controllers;

use App\Models\QRCodeLogin;
use Illuminate\Http\Request;

class QRLoginController extends Controller
{

    function generateRandomQR($length = 64)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }

        return $randomString;
    }

    public function generateLoginQRCodes(Request $request)
    {

        // Validate the incoming request
        $request->validate([
            'number' => 'required|integer',
        ]);


        // Check if the QR code exists in the database
        $number = $request->input('number');
        $qrCodes = [];

        for ($i = 0; $i < $number; $i++) {
            $tempQR = $this->generateRandomQR(64);

            while (QRCodeLogin::where('qr_login', $tempQR)->exists()) {
                $tempQR = $this->generateRandomQR(64);
            }

            $qrCodes[] = $tempQR;
            QRCodeLogin::create([
                'qr_login' => $tempQR,
            ]);
        }

        return response()->json(['status' => 'success', 'qrcodes' => $qrCodes]);
    }


    public function getLoginQrCodes(Request $request)
    {
        $codes = QRCodeLogin::pluck('qr_login')->toArray();


        // Return $codes or pass it to a view
        return response()->json($codes);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\QRCodeLogin;
use Illuminate\Http\Request;

/**
 * The QRLoginController class handles operations related to QR code logins.
 */
class QRLoginController extends Controller
{
    /**
     * Generate a random QR code.
     *
     * @param int $length
     * @return string
     */
    function generateRandomQR($length = 64)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }

        return $randomString;
    }


    /**
     * Generate QR codes for logins.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
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

            // Check if the generated QR code already exists in the database
            while (QRCodeLogin::where('qr_login', $tempQR)->exists()) {
                $tempQR = $this->generateRandomQR(64);
            }

            $qrCodes[] = $tempQR;

            // Create a new QRCodeLogin entry
            QRCodeLogin::create([
                'qr_login' => $tempQR,
            ]);
        }

        return response()->json(['status' => 'success', 'qrcodes' => $qrCodes]);
    }

    /**
     * Get all login QR codes.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLoginQrCodes(Request $request)
    {
        // Retrieve all QR login codes from the database
        $codes = QRCodeLogin::pluck('qr_login')->toArray();


        // Return $codes or pass it to a view
        return response()->json($codes);
    }
}

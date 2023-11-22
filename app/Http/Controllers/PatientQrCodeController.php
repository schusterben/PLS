<?php

namespace App\Http\Controllers;

use App\Models\QRCodePatient;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PatientQrCodeController extends Controller
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

    public function generateQRCodeForPatients(Request $request)
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

            while (QRCodePatient::where('qr_login', $tempQR)->exists()) {
                $tempQR = $this->generateRandomQR(64);
            }

            $qrCodes[] = $tempQR;
            QRCodePatient::create([
                'qr_login' => $tempQR,
            ]);
        }

        return response()->json(['status' => 'success', 'qrcodes' => $qrCodes]);
    }



    public function getAllUnusedQrCodes()
    {

        $codes = QRCodePatient::where('first_login', null)->pluck('qr_login')->toArray();


        // Return $codes or pass it to a view
        return response()->json($codes);
    }
}

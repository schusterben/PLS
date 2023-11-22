<?php

namespace App\Http\Controllers;

use App\Models\QRCodePatient;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PatientQrCodeController extends Controller
{
    public function checkIfQrCodeExists(Request $request)
    {

        // Validate the incoming request
        $request->validate([
            'qr_code' => 'required|string',
        ]);


        // Check if the QR code exists in the database
        $qrCode = $request->input('qr_code');
        $qrPatient = QRCodePatient::where('qr_login', $qrCode)->exists();

        if (!$qrPatient) {
            QRCodePatient::create([
                'qr_login' => $qrCode,
            ]);
            return response()->json(['status' => 'success']);
        }
        return response()->json(['status' => 'error', 'message' => 'QRCode Exists']);
    }



    public function getAllUnusedQrCodes()
    {

        $codes = QRCodePatient::where('first_login', null)->pluck('qr_login')->toArray();


        // Return $codes or pass it to a view
        return response()->json($codes);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\QRCodePatient;
use Illuminate\Http\Request;

/**
 * The PatientQrCodeController class handles operations related to patient QR codes.
 */
class PatientQrCodeController extends Controller
{

    /**
     * Generate a random QR code string of a specified length.
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
     * Generate QR codes for patients and store them in the database.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
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
            // Generate a random QR code
            $tempQR = $this->generateRandomQR(64);

            // Check if the generated QR code already exists in the database
            while (QRCodePatient::where('qr_login', $tempQR)->exists()) {
                $tempQR = $this->generateRandomQR(64);
            }

            // Store the QR code in the database
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

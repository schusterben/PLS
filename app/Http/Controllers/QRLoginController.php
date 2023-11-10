<?php

namespace App\Http\Controllers;

//export XDEBUG_SESSION=xdebug_is_great
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use App\Models\QRCodeLogin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QRLoginController extends Controller
{
    public function qrLogin(Request $request)
    {
            $jsonContent = $request->json();
            $qrCode = $jsonContent->get('qr_code');

            if ($this->isValidQRCode($qrCode)) {
        // Der QR-Code ist gültig, authentifiziere den Benutzer
      


            return response()->json(['status' => 'success']);
    }

   return response()->json(['status' => 'error', 'message' => 'Ungültiger QR-Code']);
    }


    private function isValidQRCode($qrCode)
    {
        return QRCodeLogin::where('qr_Login', $qrCode)->exists();

    }
}

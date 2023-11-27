<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QRCodeLogin;

class QRCodeLoginSeeder extends Seeder
{
    public function run()
    {
        for ($i = 0; $i < 10; $i++) {
            // Erzeuge einen zufälligen QR-Code.
            $qrCode = bin2hex(random_bytes(32));

            // Erzeuge ein Datum für den ersten Login.
            $firstLogin = now()->subDays($i);

            // Füge einen neuen Eintrag hinzu.
            QRCodeLogin::create([
                'qr_login' => $qrCode,
                'first_login' => $firstLogin,
            ]);
        }
    }
}


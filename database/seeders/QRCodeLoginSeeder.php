<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QRCodeLogin;

class QRCodeLoginSeeder extends Seeder
{
    /**
     * Generiert 10 Einträge in der `qr_code_login`-Tabelle mit zufälligen QR-Codes und einem simulierten Login-Datum.
     */
    public function run()
    {
        for ($i = 0; $i < 10; $i++) {
            // Erzeuge einen zufälligen QR-Code.
            $qrCode = bin2hex(random_bytes(32));// Zufälliger QR-Code

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


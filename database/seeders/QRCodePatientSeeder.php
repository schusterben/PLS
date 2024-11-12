<?php

use App\Models\QRCodePatient;
use Illuminate\Database\Seeder;

class QRCodePatientSeeder extends Seeder
{
    /**
     * Erzeugt Beispiel-Einträge für `qr_code_patient`, die mit zufälligen QR-Codes und Login-Zeiten gefüllt sind.
     */
    public function run()
    {
        for ($i = 0; $i < 10; $i++) {
            // Erzeuge einen zufälligen QR-Code.
            $qrCode = bin2hex(random_bytes(32));

            // Erzeuge ein Datum für den ersten Login.
            $firstLogin = now()->subDays($i);

            // Füge einen neuen Eintrag hinzu.
            QRCodePatient::create([
                'qr_login' => $qrCode,
                'first_login' => $firstLogin,
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\QRCodePatient;

class QrCodePatientSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
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

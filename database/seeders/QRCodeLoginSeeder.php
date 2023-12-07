<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\QRCodeLogin;

class QRCodeLoginSeeder extends Seeder
{
    public function run()
    {
        // Assign the QR code value directly
        $helloThereQrCode = 'hellothere';

        // Create a new entry with the QR code and the current timestamp
        QRCodeLogin::create([
            'qr_login' => $helloThereQrCode,
            'first_login' => now(),
        ]);
    }
}


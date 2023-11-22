<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QRCodePatient extends Model
{
    protected $table = 'qr_code_patient';
    protected $primaryKey = 'idqr_code_login';
    protected $fillable = [
        'qr_login',
        'first_login'
    ];
}

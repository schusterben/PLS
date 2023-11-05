<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QRCodeLogin extends Model
{
    protected $table = 'qr_code_login'; // Set the table name

    protected $primaryKey = 'idqr_code_login'; // Set the primary key field

    // Define the fields that are fillable
    protected $fillable = [
        'qr_login',
        'first_login',
    ];
}
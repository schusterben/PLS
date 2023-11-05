<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QRCodeLoginHasUser extends Model
{
    protected $table = 'qr_code_login_has_user'; // Set the table name

    public $timestamps = false; // Disable default timestamps

    // Define the fields that are fillable (if any)
    protected $fillable = [];

    // Define the primary key (if it's not the default auto-incrementing 'id')
    // protected $primaryKey = 'your_primary_key_field';

    // Define the relationships with the QRCodeLogin and User models
    public function qrCodeLogin()
    {
        return $this->belongsTo(QRCodeLogin::class, 'qr_code_login_idqr_code_login', 'idqr_code_login');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_iduser', 'iduser');
    }
}
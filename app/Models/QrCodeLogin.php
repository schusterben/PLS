<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;

class QRCodeLogin extends Model implements JWTSubject
{
    protected $table = 'qr_code_login'; // Set the table name

    protected $primaryKey = 'idqr_code_login'; // Set the primary key field

    // Define the fields that are fillable
    protected $fillable = [
        'qr_login',
        'first_login',
    ];



    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}

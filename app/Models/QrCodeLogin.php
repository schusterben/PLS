<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * The QRCodeLogin class represents the model for login QR codes.
 */
class QRCodeLogin extends Model implements JWTSubject
{
    // Specifies the table associated with this model
    protected $table = 'qr_code_login';


    // Sets the primary key field
    protected $primaryKey = 'idqr_code_login';

    // Defines the fields that are mass assignable
    protected $fillable = [
        'qr_login',
        'first_login',
    ];


    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     * @return mixed The primary key value of the model.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }


    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     * @return array An array of custom claims.
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}

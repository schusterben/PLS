<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;


/**
 * The User class represents the model for user data.
 */
class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory;

    // Specifies the table associated with this model
    protected $table = 'user';

    // Sets the primary key field
    protected $primaryKey = 'iduser';

    // The attributes that should be hidden for serialization
    protected $hidden = [
        'password',
        'remember_token',
    ];


    // The attributes that are mass assignable
    protected $fillable = [
        'username',
        'password',
        'adminRole',
        'longitude_user',
        'latitude_user',
        'first_login_time',
        'last_login_time',
    ];


    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'password' => 'hashed',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}

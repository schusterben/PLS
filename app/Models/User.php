<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'user'; // Specify the table name

    protected $primaryKey = 'iduser'; // Specify the primary key field


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'location_user',
        'first_login_time',
        'last_login_time',
    ];

}



    // The 'password' field should be handled separately if you want to use Laravel's built-in authentication.
    // If you have a 'password' column in your 'user' table, you can include it here:
    // 'password',

    // The 'remember_token' field should be handled separately if you want to use Laravel's built-in authentication.
    // If you have a 'remember_token' column in your 'user' table, you can include it here:
    // 'remember_token',

    // Define any relationships with other models here if needed.
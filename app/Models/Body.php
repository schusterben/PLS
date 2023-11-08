<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Body extends Model
{
    protected $table = 'body'; // Set the table name

    protected $primaryKey = 'idbody'; // Set the primary key field

    // Define the fields that are fillable
    protected $fillable = [
        'ala',
        'alvus',
        'arteria_aspera',
        'auris',
        'brachium',
        'calx',
        'caput',
        'collum',
        'coxa',
        'crus',
        'cubitum',
        'dens',
        'digitus',
        'dorsum',
        'femur',
        'frons',
        'gena',
        'labea',
        'lacertus',
        'lingua',
        'manus',
        'mamma',
        'menum',
        'nasus',
        'oculus',
        'os',
        'palatum',
        'palpebra',
        'pectus',
        'pes',
        'pollex',
        'pulmo',
        'ren',
        'sura',
        'tergum',
        'umerus',
        'venter',
    ];

    // Define a relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_iduser', 'iduser');
    }
}


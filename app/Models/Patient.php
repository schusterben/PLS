<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'patient'; // Set the table name

    protected $primaryKey = 'idpatient'; // Set the primary key field

    // Define the fields that are fillable
    protected $fillable = [
        'atmung',
        'blutung',
        'radialispuls',
        'triagefarbe',
        'transport',
        'dringend',
        'kontaminiert',
        'name',
        'location_patient',
        'user_iduser', // Assuming there is a foreign key to the User model
    ];

    // Define a relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_iduser', 'iduser');
    }

    // Define a relationship with the Body model (assuming you have one)
    public function body()
    {
        return $this->hasOne(Body::class, 'patient_idpatient', 'idpatient');
    }

    // Define a relationship with the QRCodePatient model (assuming you have one)
    public function qrCodePatient()
    {
        return $this->hasOne(QRCodePatient::class, 'patient_idpatient', 'idpatient');
    }
}
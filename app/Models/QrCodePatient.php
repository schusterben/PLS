<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QRCodePatient extends Model
{
    protected $table = 'qr_code_patient'; // Set the table name

    protected $primaryKey = 'idqr_code_patient'; // Set the primary key field

    // Define the fields that are fillable
    protected $fillable = [
        'qr_login',
        'registration_time',
        'patient_idpatient', // Assuming there is a foreign key to the Patient model
    ];

    // Define a relationship with the Patient model
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_idpatient', 'idpatient');
    }
}
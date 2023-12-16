<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


/**
 * The Patient class represents the patient model.
 */
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
        'longitude_patient',
        'latitude_patient',
        'user_iduser', // Assuming there is a foreign key to the User model
    ];

    /**
     * Define a relationship with the User model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_iduser', 'iduser');
    }


    /**
     * Define a one-to-one relationship with the QRCodePatient model (assuming you have one).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function qrCodePatient()
    {
        return $this->hasOne(QRCodePatient::class, 'patient_idpatient', 'idpatient');
    }


    /**
     * Define a one-to-one relationship with the Body model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function body()
    {
        return $this->hasOne(Body::class, 'idpatient', 'idpatient');
    }
}

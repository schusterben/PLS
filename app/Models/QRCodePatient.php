<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * The QrCodePatient class represents the model for patient QR codes.
 */
class QRCodePatient extends Model
{
    // Specifies the table associated with this model
    protected $table = 'qr_code_patient';

    // Sets the primary key field
    protected $primaryKey = 'idqr_code_login';

    // Indicates whether timestamps are used for this model
    public $timestamps = true;

    // Defines the fields that are mass assignable
    protected $fillable = [
        'qr_login',
        'patient_idpatient',
        'user_id',
        'operationScene_id'
        // Add more fields here if necessary
    ];

    /**
     * Define the relationship with the Patient model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function patient()
    {
        return $this->belongsTo('App\Models\Patient', 'patient_idpatient', 'idpatient');
    }


    /**
     * Define the relationship with the User model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'iduser');
    }


    /**
     * Define the relationship with the OperationScene model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function operationScene()
    {
        return $this->belongsTo('App\Models\OperationScene', 'operationScene_id', 'idoperationScene');
    }
}

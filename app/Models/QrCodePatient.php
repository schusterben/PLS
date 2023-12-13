<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QrCodePatient extends Model
{
    protected $table = 'qr_code_patient';
    protected $primaryKey = 'idqr_code_login';
    public $timestamps = true;

    protected $fillable = [
        'qr_login',
        'patient_idpatient',
        'user_id',
        'operationScene_id'
        // Weitere Felder, falls erforderlich
    ];

    // Relationen definieren
    public function patient()
    {
        return $this->belongsTo('App\Models\Patient', 'patient_idpatient', 'idpatient');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'iduser');
    }

    public function operationScene()
    {
        return $this->belongsTo('App\Models\OperationScene', 'operationScene_id', 'idoperationScene');
    }
}

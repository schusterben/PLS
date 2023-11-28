<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Patient;


class Body extends Model
{
    protected $table = 'body'; // Set the table name

    protected $primaryKey = 'idbody'; // Set the primary key field

    // Define the fields that are fillable
    protected $fillable = [
        'hals_vorne',
        'brust_links',
        'brust_rechts',
        'leiste_links_vorne',
        'leiste_rechts_vorne',
        'oberschenkel_rechts_vorne',
        'unterschenkel_links_vorne',
        'oberschenkel_links_vorne',
        'unterschenkel_rechts_vorne',
        'oberarm_links_vorne',
        'oberarm_rechts_vorne',
        'unterarm_links_vorne',
        'unterarm_rechts_vorne',
        'genital_vorne',
        'kopf_vorne',
        'schulter_links_vorne',
        'schulter_rechts_vorne',
        'huefte_links_vorne',
        'huefte_rechts_vorne',
        'knie_links_vorne',
        'knie_rechts_vorne',
        'ellbogen_rechts_vorne',
        'ellbogen_links_vorne',
        'fuss_rechts_vorne',
        'fuss_links_vorne',
        'auge_rechts',
        'auge_links',
        'mund',
        'hand_links_vorne',
        'hand_rechts_vorne',
        'kopf_hinten',
        'hals_hinten',
        'ruecken_rechts',
        'oberschenkel_rechts_hinten',
        'unterschenkel_links_hinten',
        'oberschenkel_links_hinten',
        'unterschenkel_rechts_hinten',
        'oberarm_links_hinten',
        'oberarm_rechts_hinten',
        'unterarm_links_hinten',
        'unterarm_rechts_hinten',
        'becken_links_hinten',
        'ruecken_links',
        'becken_rechts_hinten',
        'genital_hinten',
        'huefte_rechts_hinten',
        'huefte_links_hinten',
        'knie_links_hinten',
        'knie_rechts_hinten',
        'ellbogen_rechts_hinten',
        'ellbogen_links_hinten',
        'fuss_rechts_hinten',
        'fuss_links_hinten',
        'hand_links_hinten',
        'hand_rechts_hinten',
        'schulter_rechts_hinten',
        'schulter_links_hinten',
        'brustwirbel',
        'lendenwirbel',
    ];

    
    // Define a relationship with the Patient model
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'idpatient', 'idpatient');
    }


    // Controller method to get initial body parts for a patient
    public function getInitialBodyParts($idpatient)
    {
        $bodyParts = Body::where('idpatient', $idpatient)->pluck('body_part', 'is_clicked');

        return response()->json($bodyParts);
    }
}

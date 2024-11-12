<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Patient;

/**
 * Das Body-Modell repräsentiert die verschiedenen Körperteile eines Patienten und speichert deren Status.
 */
class Body extends Model
{
    protected $table = 'body'; // Set the table name

    protected $primaryKey = 'idbody'; // Set the primary key field

    // Define the fields that are fillable
    protected $fillable = [
                        // Alle Körperteil-Felder, die bearbeitet werden können

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
        'idpatient'
    ];

    /**
     * Create a new Body instance.
     *
     * @param  array  $attributes
     * @return void
     */

      /**
     * Konstruktor der Body-Klasse, um Standardwerte für Körperteil-Status zu setzen.
     * Alle Körperteile sind standardmäßig auf 0 gesetzt, was in der Regel "nicht geklickt" oder "inaktiv" bedeutet.
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        // Set default values for fields
        $this->attributes['hals_vorne'] = 0;
        $this->attributes['brust_links'] = 0;
        $this->attributes['brust_rechts'] = 0;
        $this->attributes['leiste_links_vorne'] = 0;
        $this->attributes['leiste_rechts_vorne'] = 0;
        $this->attributes['oberschenkel_rechts_vorne'] = 0;
        $this->attributes['unterschenkel_links_vorne'] = 0;
        $this->attributes['oberschenkel_links_vorne'] = 0;
        $this->attributes['unterschenkel_rechts_vorne'] = 0;
        $this->attributes['oberarm_links_vorne'] = 0;
        $this->attributes['oberarm_rechts_vorne'] = 0;
        $this->attributes['unterarm_links_vorne'] = 0;
        $this->attributes['unterarm_rechts_vorne'] = 0;
        $this->attributes['genital_vorne'] = 0;
        $this->attributes['kopf_vorne'] = 0;
        $this->attributes['schulter_links_vorne'] = 0;
        $this->attributes['schulter_rechts_vorne'] = 0;
        $this->attributes['huefte_links_vorne'] = 0;
        $this->attributes['huefte_rechts_vorne'] = 0;
        $this->attributes['knie_links_vorne'] = 0;
        $this->attributes['knie_rechts_vorne'] = 0;
        $this->attributes['ellbogen_rechts_vorne'] = 0;
        $this->attributes['ellbogen_links_vorne'] = 0;
        $this->attributes['fuss_rechts_vorne'] = 0;
        $this->attributes['fuss_links_vorne'] = 0;
        $this->attributes['auge_rechts'] = 0;
        $this->attributes['auge_links'] = 0;
        $this->attributes['mund'] = 0;
        $this->attributes['hand_links_vorne'] = 0;
        $this->attributes['hand_rechts_vorne'] = 0;
        $this->attributes['kopf_hinten'] = 0;
        $this->attributes['hals_hinten'] = 0;
        $this->attributes['ruecken_rechts'] = 0;
        $this->attributes['oberschenkel_rechts_hinten'] = 0;
        $this->attributes['unterschenkel_links_hinten'] = 0;
        $this->attributes['oberschenkel_links_hinten'] = 0;
        $this->attributes['unterschenkel_rechts_hinten'] = 0;
        $this->attributes['oberarm_links_hinten'] = 0;
        $this->attributes['oberarm_rechts_hinten'] = 0;
        $this->attributes['unterarm_links_hinten'] = 0;
        $this->attributes['unterarm_rechts_hinten'] = 0;
        $this->attributes['becken_links_hinten'] = 0;
        $this->attributes['ruecken_links'] = 0;
        $this->attributes['becken_rechts_hinten'] = 0;
        $this->attributes['genital_hinten'] = 0;
        $this->attributes['huefte_rechts_hinten'] = 0;
        $this->attributes['huefte_links_hinten'] = 0;
        $this->attributes['knie_links_hinten'] = 0;
        $this->attributes['knie_rechts_hinten'] = 0;
        $this->attributes['ellbogen_rechts_hinten'] = 0;
        $this->attributes['ellbogen_links_hinten'] = 0;
        $this->attributes['fuss_rechts_hinten'] = 0;
        $this->attributes['fuss_links_hinten'] = 0;
        $this->attributes['hand_links_hinten'] = 0;
        $this->attributes['hand_rechts_hinten'] = 0;
        $this->attributes['schulter_rechts_hinten'] = 0;
        $this->attributes['schulter_links_hinten'] = 0;
        $this->attributes['brustwirbel'] = 0;
        $this->attributes['lendenwirbel'] = 0;
    }



    /**
     * Define the relationship with the Patient model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'idpatient', 'idpatient');
    }

    /**
     * Get the initial body parts for a patient.
     *
     * @param  int  $idpatient
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInitialBodyParts($idpatient)
    {
        // Retrieve and pluck body parts based on the patient ID
        $bodyParts = Body::where('idpatient', $idpatient)->pluck('body_part', 'is_clicked');

        return response()->json($bodyParts);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Person extends Model
/* {
    //use HasFactory;
    protected $table = 'persons';
}
 */
{
    // Gibt an, dass die automatische Zuweisung von Timestamps genutzt werden soll
    public $timestamps = true;

    // Gibt die Tabelle an, mit der dieses Modell verbunden ist
    protected $table = 'persons';

    // Gibt die Attribute an, die massenzuweisbar sind
    protected $fillable = [
        'Triagefarbe',
        'position', // Nehmen wir an, das ist ein String 'latitude,longitude'
    ];

     /* // Konvertiert die Position in ein Array, wenn sie abgerufen wird
    protected $casts = [
        'position' => 'array',
    ]; */ 

    // Mutator, um die Position zu setzen
    public function setPositionAttribute($value)
    {
        // Überprüfen Sie, ob die 'lat' und 'lng' Schlüssel im $value Array vorhanden sind.
        if (isset($value['lat']) && isset($value['lng'])) {
            $lat = $value['lat'];
            $lng = $value['lng'];
    
            // Stellen Sie sicher, dass $lat und $lng tatsächlich Zahlen sind, bevor Sie sie in die Datenbankabfrage einfügen
            if (is_numeric($lat) && is_numeric($lng)) {
                $this->attributes['position'] = DB::raw("ST_PointFromText('POINT($lng $lat)')");
            } else {
                // Loggen Sie den Fehler und/oder werfen Sie eine Exception
                Log::error("Invalid latitude or longitude. Lat: $lat, Lng: $lng");
                throw new \InvalidArgumentException("Invalid latitude or longitude. Lat: $lat, Lng: $lng");
            }
        } else {
            // Loggen Sie den Fehler und/oder werfen Sie eine Exception, wenn 'lat' oder 'lng' nicht gesetzt sind
            Log::error("Missing latitude or longitude. Value array: " . print_r($value, true));
            throw new \InvalidArgumentException("Missing latitude or longitude.");
        }
    }

    public function getPositionAttribute($value)
{
    Log::info('getPositionAttribute method called.');

    // Nur versuchen, die Position zu holen, wenn der Wert gesetzt ist.
    if (!empty($this->attributes['position'])) {
        Log::info('Position attribute is set.', ['position' => $this->attributes['position']]);
        // Verwenden von Eloquent's Accessor, um die geometrische Daten zu konvertieren.
        // Die Umwandlung erfolgt ohne Rohdaten-Abfrage zur Vermeidung von SQL-Injection.
        $point = $this->attributes['position'];

        // Loggen des Punktes, der konvertiert wird.
        Log::info('Converting position to point.', ['point' => $point]);

        // Wir verwenden die DB::raw-Funktion innerhalb eines sicheren Kontextes, 
        // da wir keine externen Daten einfügen, nur eine SQL-Funktion ausführen.
        // Beachten Sie, dass dies immer noch eine rohe Abfrage ist und bestimmte Risiken birgt.
        $coords = DB::select(DB::raw("SELECT ST_X(ST_GeomFromText(?)) AS lng, ST_Y(ST_GeomFromText(?)) AS lat", [$point, $point]));

        // Prüfen, ob Koordinaten abgerufen wurden und loggen des Ergebnisses.
        if (!empty($coords)) {
            Log::info('Coordinates retrieved from the database.', ['coords' => $coords]);

            // Konvertiere die Ergebnisse in ein Array mit 'lat' und 'lng' als Schlüssel und loggen der Rückgabe.
            $result = ['lat' => $coords[0]->lat, 'lng' => $coords[0]->lng];
            Log::info('Returning coordinates array.', $result);
            return $result;
        } else {
            // Loggen, wenn keine Koordinaten gefunden wurden.
            Log::info('No coordinates found for given position.');
        }
    } else {
        // Loggen, wenn das Attribut 'position' leer ist.
        Log::info('No position attribute set.');
    }

    // Rückgabe null, wenn keine Position vorhanden ist und loggen dieses Falles.
    Log::info('Returning null as no position was present.');
    return null;
}


}
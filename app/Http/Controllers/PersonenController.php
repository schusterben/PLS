<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;



class PersonenController extends Controller
{
    public function index()
    {
        Log::info('index Methode aufgerufen');

        // Wählt alle Felder aus der `persons` Tabelle,
        // sowie die Längen- und Breitengrade aus dem `position` POINT-Feld.
        
         $persons = Person::select(
            'id',
            'Triagefarbe',
            'RadialispulsTastbar',
            'geht',
            'dringend',
            'created_at',
            'updated_at',
            'Nummer',
            'Blutung',
            'AtmungSuffizient',
            'kontaminiert',
            DB::raw('ST_X(position) as longitude'),
            DB::raw('ST_Y(position) as latitude')
        )->get();
        
        return response()->json($persons); 
        
    }

    public function show($id)
    {
        Log::info('show Methode aufgerufen mit ID: ' . $id);
        
        // Finde die Person mit der gegebenen ID und inkludiere die Längen- und Breitengrade.
        
        $person = Person::select(
            '*',
            DB::raw('ST_X(position) as longitude'),
            DB::raw('ST_Y(position) as latitude')
        )->findOrFail($id);

        // Konvertiere das Ergebnis in JSON und sende die Antwort zurück.
        return response()->json($person);
    }

    public function testDatabaseConnection()
{
    // Versuche, den ersten Eintrag aus der Tabelle zu holen.
    $person = Person::first();
    if ($person) {
        return response()->json($person);
    } else {
        return response()->json(['error' => 'Keine Daten gefunden.'], 404);
    }
}

public function update(Request $request, $id)
{
    Log::info('Update Methode aufgerufen',['id' => $id, 'request' => $request->all()]);

    // Finden der Person anhand der ID
    $person = Person::findOrFail($id);

    // Übernehmen der Triagefarbe aus der Anfrage
    $triageColor = $request->input('triageColor');
    if ($triageColor !== null) {
        $person->Triagefarbe = $triageColor;
    }

     // Übernehmen der GPS-Daten aus der Anfrage
     $lng = $request->input('lng');
     $lat = $request->input('lat');
     if ($lng !== null && $lat !== null) {
         // Zuweisen der Position als Array
         $person->position = ['lng' => $lng, 'lat' => $lat];
     }

    // Speichern der geänderten Daten
    $person->save();
    Log::info('Triagefarbe für Person mit ID ' . $id . ' aktualisiert.');

    // Zurückgeben der aktualisierten Person als JSON
    return response()->json($person);
}


}

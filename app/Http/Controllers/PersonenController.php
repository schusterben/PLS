<?php

namespace App\Http\Controllers;

use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;



class PersonenController extends Controller
{
    public function index()
    {
        Log::info('index Methode aufgerufen');
        $persons =Person::all();
        return view('persons.index', ['persons' => $persons]);
        
    }

    public function testDatabaseConnection()
{
    // Versuche, den ersten Eintrag aus der Tabelle zu holen.
    $person = Person::first();

    // Rückgabe der Daten in json, um sie anzuzeigen.
    if ($person) {
        return response()->json($person);
    } else {
        return "Keine Daten gefunden.";
    }
}
}

<?php

namespace App\Http\Controllers;

use App\Models\OperationScene;
use Illuminate\Http\Request;
use Carbon\Carbon;


/**
 * Die OperationSceneController-Klasse verwaltet Funktionen rund um Einsatzorte.
 *
 * Sie bietet Methoden zum Erstellen/Aktualisieren von Einsatzorten sowie zum Abrufen
 * aktueller Einsatzorte, die in den letzten 20 Tagen aktualisiert wurden.
 */
class OperationSceneController extends Controller
{

    /**
     * Erstellt oder aktualisiert einen Einsatzort.
     *
     * Diese Methode prüft, ob ein Einsatzort mit einer bestimmten ID existiert:
     * - Wenn ja, wird der vorhandene Datensatz aktualisiert.
     * - Wenn nein, wird ein neuer Einsatzort erstellt.
     *
     * Die HTTP-Anfrage mit Informationen zum Einsatzort (Name und optional Beschreibung).
     * @param Request $request
     * Gibt den Status und den Einsatzort als JSON-Antwort zurück.
     * @return \Illuminate\Http\JsonResponse
     */
    public function createOperationScene(Request $request)
    {
        // Validiert, dass das Feld 'name' vorhanden und ein String ist.

        $request->validate([
            'name' => 'required|string',

        ]);
        // Ruft Daten aus der Anfrage ab.

        $id = $request->input('id'); // Die ID des Einsatzortes, falls vorhanden
        $name = $request->input('name');// Der Name des Einsatzortes
        $description = $request->input('description'); // Prüft, ob eine ID vorhanden ist, um zu entscheiden, ob ein neuer Einsatzort erstellt oder ein vorhandener aktualisiert wird.



        // Check if an ID is provided to determine if it's an update or creation
        $operationScene = $id ? OperationScene::find($id) : new OperationScene();

        // Setzt den Namen und die Beschreibung für den Einsatzort.
        $operationScene->name = $name;
        $operationScene->description = $description;

        // Speichert den Einsatzort in der Datenbank.
        $operationScene->save();




        return
            response()->json(['status' => 'success', 'operactionScene' => $operationScene]);
    }


     /**
     * Ruft alle aktuellen Einsatzorte ab, die innerhalb der letzten 20 Tage aktualisiert wurden.
     *
     * Diese Methode dient dazu, die neuesten Einsatzorte basierend auf dem Aktualisierungsdatum anzuzeigen.
     * @return \Illuminate\Http\JsonResponse
     *Gibt eine JSON-Antwort mit allen kürzlich aktualisierten Einsatzorten zurück.
     */
    public function getAllCurrentOperationScenes()
    {

        // Berechnet das Datum, das 20 Tage vor dem aktuellen Datum liegt.
        $twentyDaysAgo = Carbon::now()->subDays(20);

        // Sucht in der Datenbank nach Einsatzorten, die innerhalb der letzten 20 Tage aktualisiert wurden.
        $operationScenes = OperationScene::where('updated_at', '>=', $twentyDaysAgo)->get()->toArray();
        return response()->json($operationScenes);
    }
}

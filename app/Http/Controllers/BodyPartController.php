<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
/**
 * Teil der Triageverwaltung
 *
 */
/**
 * BodyPartController ist verantwortlich für das Speichern und Abrufen
 * des Körperteilstatus eines Patienten. Diese Klasse ermöglicht das
 * Markieren bestimmter Körperbereiche eines Patienten in der Datenbank
 * und wird in der App zur Verwaltung von Triage-Informationen genutzt.
 */
class BodyPartController extends Controller
{

   /**
     * Speichert den Status eines angeklickten Körperteils für einen Patienten.
     *
     * Diese Funktion wird verwendet, um festzuhalten, ob ein bestimmter
     * Körperteil angeklickt wurde, was zur späteren Analyse oder
     * Triage-Dokumentation dient.
     *
     * @param Request $request Die Anfrage enthält 'bodyPartId', 'isClicked' und 'idpatient'.
     * @return \Illuminate\Http\JsonResponse Gibt eine Erfolgsmeldung oder eine Fehlermeldung zurück.
     */
    public function saveBodyPart(Request $request)
    {
        try {
            // Validate the request data if needed

            // Get the body part ID, click status, and patient ID from the request
           // Extrahiert Werte für Körperteil-ID, Klickstatus und Patienten-ID aus der Anfrage

            $bodyPartId = $request->input('bodyPartId');
            $isClicked = $request->input('isClicked');
            $idpatient = $request->input('idpatient');

            // Aktualisiert den Status eines spezifischen Körperteils in der Tabelle 'body'

            DB::table('body')
                ->where('idpatient', $idpatient)
                ->update([$bodyPartId => $isClicked]);

            // You can add more logic or error handling here if needed

            return response()->json(['message' => 'Body part saved successfully']);
        } catch (\Exception $e) {
            // Ausnahmebehandlung für Datenbankfehler oder andere Probleme
            return response()->json(['error' => 'Error saving body part'], 500);
        }
    }


     /**
     * Ruft den Status der Körperteile für einen bestimmten Patienten ab.
     *
     * Diese Funktion holt alle gespeicherten Statusangaben für Körperteile
     * eines Patienten aus der Datenbank und gibt diese als JSON zurück.
     *
     * @param Request $request Erwartet 'idpatient' zur Identifikation des Patienten.
     * @return \Illuminate\Http\JsonResponse Gibt den Körperteilstatus oder eine Fehlermeldung zurück.
     */
    public function getBodyParts(Request $request)
    {
        try {
                                    // Validierung der Eingabe

            $idpatient = $request->input('idpatient');

            // Retrieve body parts for the patient ID from the 'body' table
            $bodyParts = DB::table('body')
                ->where('idpatient', $idpatient)
                ->first();

            return response()->json($bodyParts);
        } catch (\Exception $e) {
            // Handle exceptions or errors
            return response()->json(['error' => 'Error fetching body parts'], 500);
        }
    }
}

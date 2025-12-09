<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * Der PagesController verwaltet Anfragen für statische Seiten der Anwendung.
 * Aktuell wird nur die Startseite (index) verwaltet, welche die 'welcome'-Ansicht lädt.
 */
class PagesController extends Controller
{
   /**
     * Zeigt die Startseite an.
     *
     * @return \Illuminate\View\View
     * Gibt die 'welcome'-Ansicht zurück, normalerweise als Startseite.
     */
    public function index()
    {
        // Gibt die 'welcome'-Ansicht zurück, die als Homepage verwendet wird
        return view('welcome');
    }
}

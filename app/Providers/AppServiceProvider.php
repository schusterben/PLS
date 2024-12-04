<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
/**
 * AppServiceProvider ist ein zentraler Service-Provider für die Anwendung.
 *
 * Diese Klasse wird bei jedem Starten der Anwendung automatisch geladen und dient
 * dazu, allgemeine Einstellungen oder Dienste zu konfigurieren, die in der gesamten
 * Anwendung verwendet werden. In diesem Fall wird die Standardlänge von Strings
 * für Datenbank-Schemafelder festgelegt.
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Registriert alle notwendigen Dienste für die Anwendung.
     *
     * Hier können Bindings oder Service-Container-Registrierungen
     * durchgeführt werden. Diese Methode wird beim Start der Anwendung
     * ausgeführt.
     */
    public function register(): void
    {
        // Aktuell keine zusätzlichen Dienste zu registrieren
    }

     /**
     * Bootstrapped alle notwendigen Services der Anwendung.
     *
     * Die boot-Methode wird ebenfalls beim Start der Anwendung ausgeführt und
     * kann verwendet werden, um Einstellungen oder Verhalten der Anwendung anzupassen.
     */
    public function boot()
    {
                // Legt die Standardlänge für Datenbank-Strings fest, um Kompatibilitätsprobleme
        // mit älteren MySQL-Versionen zu vermeiden, bei denen eine maximale Indexlänge von 767 Bytes existiert.

        Schema::defaultStringLength(191);
    }
}

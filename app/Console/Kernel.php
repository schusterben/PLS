<?php

namespace App\Console;

/**
 *Klasse Konfiguriert das Befehlszeilen Interface und Task Scheduling.
 *steuert und lädt benutzerdefinierte Konsolenbefehle, indem sie Methoden schedule und commands nutzt
 *
 */
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Definiert den Zeitplan für Aufgaben, die regelmäßig ausgeführt werden sollen.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Beispiel: Führt das `inspire`-Kommando stündlich aus.
        // $schedule->command('inspire')->hourly();    }
    }
    /**
     * Registriert alle benutzerdefinierten Befehle für die Anwendung.
     */
    protected function commands(): void
    {
        // Lädt alle benutzerdefinierten Befehle aus dem Verzeichnis "Commands"

        $this->load(__DIR__ . '/Commands');
        // Bindet die Befehle, die im console.php definiert sind

        require base_path('routes/console.php');
    }
}

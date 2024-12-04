<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Application;
/**
 * Trait zum Erstellen und Initialisieren der Laravel-Anwendung für Tests.
 * Stellt sicher, dass die Anwendung vor jedem Test korrekt geladen und gebootet wird.
 */
trait CreatesApplication
{
    /**
     * Erstellt die Anwendung und bootet den Kernel.
     */
    public function createApplication(): Application
    {
                // Lädt die Anwendung und bootet den Kernel

        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(Kernel::class)->bootstrap();

        return $app;
    }
}

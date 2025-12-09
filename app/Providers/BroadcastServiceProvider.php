<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
   /**
     * Bootstrap-Dienst zum Einrichten der Broadcast-Konfigurationen.
     */
    public function boot(): void
    {
                        // Registriert die Standard-Broadcast-Routen

        Broadcast::routes();
        // Bindet alle Channel-Routen, die in der Datei 'channels.php' definiert sind

        require base_path('routes/channels.php');
    }
}

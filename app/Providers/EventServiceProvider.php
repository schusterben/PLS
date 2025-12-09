<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Ereignisse und zugehörige Listener der Anwendung.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
                // Registriert das Ereignis "Registered", das beim Registrieren eines Benutzers ausgelöst wird,
        // und ordnet ihm den Listener "SendEmailVerificationNotification" zu.

        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Registrierung von Ereignissen für die Anwendung.
     */
    public function boot(): void
    {
        // Weitere Ereignis-Listener-Registrierungen können hier hinzugefügt werden
    }

    /**
     * Gibt an, ob Ereignisse automatisch erkannt werden sollen.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}

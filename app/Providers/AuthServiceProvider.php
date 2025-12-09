<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy      * Die Zuordnung der Models zu den Policies für die Anwendung.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Beispiel: 'App\Models\Post' => 'App\Policies\PostPolicy',
    ];

    /**
     * Registriert alle Authentifizierungs- und Autorisierungsdienste.
     */
    public function boot(): void
    {
        // Hier können Policies und weitere Authentifizierungs-Services registriert werden.
    }
}

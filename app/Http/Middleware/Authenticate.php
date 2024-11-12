<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
/**
 * Die Authenticate-Middleware überprüft, ob der Benutzer authentifiziert ist.
 * Falls nicht, wird der Benutzer zur Login-Seite umgeleitet.
 */
class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
                        // Falls die Anfrage kein JSON erwartet, leite den Benutzer zur Login-Seite

        return $request->expectsJson() ? null : route('login');
    }
}

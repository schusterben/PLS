<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance as Middleware;
/**
 * Die PreventRequestsDuringMaintenance-Middleware verhindert, dass Benutzer während des Wartungsmodus auf die App zugreifen können.
 */
class PreventRequestsDuringMaintenance extends Middleware
{
    /**
     * The URIs that should be reachable while maintenance mode is enabled.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Fügen Sie hier URIs hinzu, die während des Wartungsmodus zugänglich bleiben sollen
    ];
}

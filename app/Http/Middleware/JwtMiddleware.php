<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
/**
 * Die JwtMiddleware überprüft, ob ein gültiger JWT-Token im Anfrage-Header enthalten ist.
 * Nur bei gültigem Token wird der Zugriff auf geschützte Ressourcen gewährt.
 */
class JwtMiddleware
{

     /**
     * Überprüft die Anfrage auf einen gültigen JWT-Token und authentifiziert den Benutzer.
     **/
   public function handle($request, Closure $next)
{
    try {
            // Versucht, den Benutzer basierend auf dem JWT-Token zu authentifizieren

        $user = JWTAuth::parseToken()->authenticate();
    } catch (\Exception $e) {
            // Fehlende oder ungültige Token führen zu einer 401 Unauthorized-Antwort
            return response()->json(['error' => 'Unauthorized'], 401);
    }
        // Wenn der Token gültig ist, wird die Anfrage fortgesetzt

    return $next($request);
}
}

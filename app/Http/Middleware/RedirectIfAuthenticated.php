<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
/**
 * Die RedirectIfAuthenticated-Middleware leitet angemeldete Benutzer automatisch auf die Startseite weiter, falls sie versuchen, die Login-Seite zu erreichen.
 */
class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
                        // Überprüfen, ob Guards gesetzt sind. Falls nicht, wird ein Standard-Guard genutzt.

        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                                                // Leitet den Benutzer zur Startseite, wenn er bereits authentifiziert ist

                return redirect(RouteServiceProvider::HOME);
            }
        }
        // Fährt mit der Anfrage fort, falls der Benutzer nicht authentifiziert ist

        return $next($request);
    }
}

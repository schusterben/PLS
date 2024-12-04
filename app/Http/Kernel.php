<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;
/**
 * Der Kernel verwaltet die Middleware der Anwendung und sorgt dafür,
 * dass die Middleware in der richtigen Reihenfolge und für die richtigen Routen ausgeführt wird.
 */
class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array<int, class-string|string>
     */
    protected $middleware = [
        // \App\Http\Middleware\TrustHosts::class,
        \App\Http\Middleware\TrustProxies::class,
        \Illuminate\Http\Middleware\HandleCors::class,
        \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ];

    /**
     * Middleware-Gruppen für bestimmte Routen (z.B. "web" und "api").
     *
     * @var array<string, array<int, class-string|string>>
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * The application's middleware aliases.
     *
     * Aliases may be used instead of class names to conveniently assign middleware to routes and groups.
     *
     * @var array<string, class-string|string>
     */
    protected $middlewareAliases = [
        'auth' => \App\Http\Middleware\Authenticate::class,// Authentifizierung prüfen
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,// Basic-Authentifizierung
        'auth.session' => \Illuminate\Session\Middleware\AuthenticateSession::class,// Sitzung authentifizieren
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,// Cache-Header setzen
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,// Redirect wenn authentifiziert
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,// Passwortbestätigung erforderlich
        'precognitive' => \Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests::class,// Vorhersagende Anfragen
        'signed' => \App\Http\Middleware\ValidateSignature::class,// Signaturen validieren
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,// Anfragen begrenzen
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,// E-Mail-Bestätigung sicherstellen
    ];

    protected $routeMiddleware = [
    // ...
    'jwt' => \App\Http\Middleware\JwtMiddleware::class,// JWT für API-Authentifizierung
];
}

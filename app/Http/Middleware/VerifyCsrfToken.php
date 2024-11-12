<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
/**
 * Die VerifyCsrfToken-Middleware schützt die Anwendung vor CSRF-Angriffen,
 * indem sie sicherstellt, dass jede POST-Anfrage ein gültiges Token enthält.
 */
class VerifyCsrfToken extends Middleware
{
    /**
     * Die URIs, die von der CSRF-Überprüfung ausgeschlossen werden sollen.
     *
     * @var array<int, string>
     */
    protected $except = [
       // Hier können spezifische URIs eingetragen werden, die keine CSRF-Überprüfung benötigen,
        // z.B. wenn die Anfragen von externen APIs kommen.
    ];
}

<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\TrimStrings as Middleware;
/**
 * Die TrimStrings-Middleware entfernt überflüssige Leerzeichen von den Eingaben, bevor sie verarbeitet werden.
 */
class TrimStrings extends Middleware
{
    /**
     * The names of the attributes that should not be trimmed.
     *
     * @var array<int, string>
     */
    protected $except = [
                        // Attribute, die Leerzeichen enthalten dürfen, wie Passwörter oder Bestätigungsfelder

        'current_password',
        'password',
        'password_confirmation',
    ];
}

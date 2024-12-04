<?php

namespace App\Http\Middleware;

use Illuminate\Routing\Middleware\ValidateSignature as Middleware;
/**
 * Die ValidateSignature-Middleware überprüft, ob die Signatur der URL gültig ist.
 * Diese Middleware wird verwendet, um sicherzustellen, dass signierte URLs nicht manipuliert wurden.
 */
class ValidateSignature extends Middleware
{
    /**
     * Die Namen der Abfrageparameter, die bei der Signaturüberprüfung ignoriert werden sollen.
     *
     * @var array<int, string>
     */
    protected $except = [
                        // Beispiel für häufig verwendete Tracking-Parameter, die von der Signaturprüfung ausgeschlossen werden können

        // 'fbclid',
        // 'utm_campaign',
        // 'utm_content',
        // 'utm_medium',
        // 'utm_source',
        // 'utm_term',
    ];
}

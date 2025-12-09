<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustHosts as Middleware;
/**
 * Die TrustHosts-Middleware legt fest, welche Hosts von der App vertraut werden.
 */
class TrustHosts extends Middleware
{
    /**
     * Gibt die Hostmuster zurück, die als vertrauenswürdig gelten.
     *
     * @return array<int, string|null>Liste der Hostmuster
     */
    public function hosts(): array
    {                // Vertraut allen Subdomains der App-URL

        return [
            $this->allSubdomainsOfApplicationUrl(),
        ];
    }
}

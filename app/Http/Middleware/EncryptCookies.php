<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;
/**
 * Die EncryptCookies-Middleware verschlüsselt alle Cookies, bevor sie an den Client gesendet werden.
 */
class EncryptCookies extends Middleware
{
    /**
     * Eine Liste von Cookies, die nicht verschlüsselt werden sollen.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Hier können Cookie-Namen eingefügt werden, die nicht verschlüsselt werden sollen
    ];
}

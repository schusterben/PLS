<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
/**
 * Unit-Test-Klasse zum Testen isolierter Funktionen oder Logik.
 * Unit-Tests prüfen individuelle Codeeinheiten, wie Funktionen oder Methoden, ohne Abhängigkeiten.
 */
class ExampleTest extends TestCase
{
    /**
     * Ein grundlegender Test, der sicherstellt, dass der Wert "true" wahr ist.
             * Dieser Test dient als Beispiel und überprüft eine triviale Bedingung.

     */
    public function test_that_true_is_true(): void
    {
                // Überprüft, ob der Wert "true" tatsächlich wahr ist

        $this->assertTrue(true);
    }
}

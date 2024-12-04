<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
/**
 * Abstrakte TestCase-Klasse, die als Basis für alle Testklassen dient.
 * Bietet gemeinsame Funktionalität für Tests und nutzt das Trait `CreatesApplication` für das Setzen der Anwendung.
 */
abstract class TestCase extends BaseTestCase
{
        // Bindet das Trait `CreatesApplication`, um die Anwendung für Tests bereitzustellen

    use CreatesApplication;
}

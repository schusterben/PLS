<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
/**
 * Feature-Test-Klasse zum Testen der grundlegenden Funktionalität der Anwendung.
 * Feature-Tests simulieren HTTP-Anfragen und prüfen, ob die Anwendung wie erwartet reagiert.
 */
class ExampleTest extends TestCase
{
    /**
     * Ein einfacher Test, der überprüft, ob die Startseite erfolgreich geladen wird.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
                // Sendet eine GET-Anfrage an die Startseite der Anwendung

        $response = $this->get('/');
        // Überprüft, ob die Antwort den HTTP-Statuscode 200 zurückgibt (erfolgreich)

        $response->assertStatus(200);
    }
}

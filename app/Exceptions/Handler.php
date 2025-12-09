<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
/**
 * The Handler class manages exceptions and errors in the application.
 * It controls which information is shown or hidden when exceptions occur.
 */
class Handler extends ExceptionHandler
{
     /**
     * Die Liste der Eingabefelder, die bei Validierungsfehlern niemals in die Sitzung gespeichert werden.
     *
     * Dies verhindert, dass sensible Informationen wie Passwörter angezeigt werden,
     * falls ein Fehler auftritt (z.B. bei einem Validierungsfehler).
     *
     * Folgendes dient um Informationen über den Datentyp der Variable bereitzustellen
     * Ziel von dontFlash-keine sensiblen Infos wie Passwörter etc. versehntlich an Sitzung weiterzugeben
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

      /**
     * Registriert die Callbacks für das Fehler- und Ausnahmehandling der Anwendung.
     *
     * Hier kann man benutzerdefinierte Logik festlegen, die bei einer Ausnahme ausgeführt werden soll.
     * Beispielsweise könnte man die Ausnahme an einen Logging-Dienst senden oder eine spezifische Fehlermeldung anzeigen.
     */
    public function register(): void
    {
                     // Ermöglicht das Hinzufügen einer benutzerdefinierten Funktion zum Melden oder Verarbeiten von Ausnahmen

        $this->reportable(function (Throwable $e) {
            // Diese Funktion kann angepasst werden, um Ausnahmen auf eine bestimmte Weise zu protokollieren oder zu verarbeiten.
            // Momentan ist sie leer, aber hier könnte z.B. ein Logging-Dienst wie Sentry verwendet werden.
        });
    }
}

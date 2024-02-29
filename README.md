# PLS

## Voraussetzungen

-   PHP (Version 8.1 oder höher)
-   Node.js (Version 10)
-   composer
-   MySQL

## Anpassungen in der .env

Es kann die env.example hergenommen und zur .env umbenannt werden
Daten für die Datenbankverbindung müssen angepasst werden.

## Befehle Ausführen

Damit alle notwendigen JWT erstellt werden können muss in einem Terminal der Pfad zum PLS Ordner geöffnet werden und folgende Befehle ausgeführt werden:

-   composer update
-   composer install
-   composer require tymon/jwt-auth
-   npm install vite --save-dev
-   php artisan migrate
-   php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
-   php artisan jwt:secret

## Start des Webservers in der Testumgebung

Am Testserver muss in zwei Terminals folgendes gestartet werden

-   Laravel Backend: php artisan serve
-   React Frontend: npm run dev

## Time to leave für JWT Gültigkeit

Im Ordner "config\jwt.php" muss bei "'ttl' => env('JWT_TTL', 15)" die Zahl 15 durch die Anzahl der Minuten wie lange der Token gültig sein soll

## Adminbereich

Um sich nache dem einrichten im Admin-Bereich anzumelden kann folgender Benutzername und Passwort verwendet werden:
Benutzer: admin
Passwort: admin

Es ist wichtig, dass das Passwort nach dem ersten Einstieg geändert wird.

Im Adminberich kann man QR-Codes für die Autorisierung der Benutzer und für die Patienten erstellen.
Für die Nutzung kann hier auch ein Einsatzort erstellt werden.
In diesem Bereich können auch weitere User für den Adminbereich erstellt werden.






## Die Entwicklung dieser Software wurde im Rahmen des Horizon 2020 Projekts TeamAware von der EU gefördert.

This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 101019808.

# PLS

## Voraussetzungen

-   PHP (Version 8)
-   NPM (Version 10)
-   MySQL

## Anpassungen in der .env

Es kann die env.example hergenommen und zur .env umbenannt werden
Daten für die Datenbankverbindung müssen angepasst werden.

## Befehle Ausführen

Damit alle notwendigen JWT erstellt werden können muss in einem Terminal der Pfad zum PLS Ordner geöffnet werden und folgende Befehle ausgeführt werden:

-   composer require tymon/jwt-auth
-   php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
-   php artisan jwt:secret

## Start des Webservers in der Testumgebung

Am Testserver muss in zwei Terminals folgendes gestartet werden

-   Laravel Backend: php artisan serve
-   React Frontend: npm run dev

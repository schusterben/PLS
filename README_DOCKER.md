# PLS

## Voraussetzungen

-   Docker Composer

## Anpassungen in der .env

Die .env muss hinsichtlich des "DB_HOST" aktualisiert werden.
Hierbei ist dies keine IP-Adresse mehr, sondern einfach "mysql".

DB_HOST=mysql

## Anpassung vite.config.js

Hier war eine Anpassung notwendig, da der Pfad "/resources/css/index.css" fehlte.
Dies muss einfach hinzugefügt werden. Anschließend soll das Projekt zur Produktion nochmal gebuildet werden,
um die manifest.json zu generieren.

## Befehle Docker-Erstellung

Um ein Dockerimage zu generieren, müssen folgende Befehle im Terminal ausgeführt werden:

-   npm run build
-   docker-compose build
  - docker-compose up -d
  - docker-compose exec backend php artisan migrate

## Dockerfiles

Zur Erstellung des Dockerimages sind mehrere Files notwendig:

# docker-compose.yml
Hier ist vor allem auf die Pfade zu achten.

# Dockerfile
Dies dient zum Generieren des Backends. Siehe Beispiel
Wichtig: aktuell php-Version 8.2 verwenden

# Dockerfile.react
Dies dient zum Generieren des Frontends. Siehe Beispiel

Wichtig für den Startbefehl:
CMD ["npm", "run", "dev"] 


## Praktische Befehle
- docker-compose ps: zeigt den Status der einzelnen Teilimages
- docker-compose logs {Imagename}: Zeigt direkt den Buildlog und Weiteres


## Die Entwicklung dieser Software wurde im Rahmen des Horizon 2020 Projekts TeamAware von der EU gefördert.

This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 101019808.

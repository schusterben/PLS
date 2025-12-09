📦 Laravel-Projekt mit fertigen Docker-Images auf dem Raspberry Pi
Dieses Setup zeigt, wie du eine Laravel-App mit vorgebauten Docker-Images auf einem Raspberry Pi installierst und startest – ganz ohne Image-Building auf dem Pi.

🔧 Voraussetzungen
Raspberry Pi mit Raspberry Pi OS

Docker & Docker Compose

Zwei vorbereitete Docker-Image-Dateien:

laravel_app.tar

mysql_db.tar

Projektverzeichnis mit:

docker-compose.yml

.env

leerem Ordner laravel_app/

🚀 Schritt-für-Schritt-Anleitung
✅ 1. Docker & Docker Compose auf dem Raspberry Pi installieren
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```
Dann: ausloggen und neu einloggen

Installiere Docker Compose:

```bash
sudo apt update
sudo apt install -y docker-compose
```

📁 2. Projektstruktur vorbereiten (auf deinem Rechner)
Stelle sicher, dass dein Projekt z. B. so aussieht:

```bash

docker_setup/
├── docker-compose.yml
├── .env
├── laravel_app/         ← leerer Ordner für Laravel-Volume
├── laravel_app.tar
├── mysql_db.tar
```
🧳 3. Projekt & Images auf den Raspberry Pi übertragen

```bash
scp -r docker_setup pi@<RPI-IP>:/home/pi/
```

📦 4. Docker-Images auf dem Raspberry Pi laden

```bash
cd ~/docker_setup
docker load -i laravel_app.tar
docker load -i mysql_db.tar
```

⚙️ 5. Container starten

```bash
docker compose up -d
```

🗃️ 6. Datenbank-Migrationen ausführen

```bash
docker compose exec laravel_app php artisan migrate
```
🖥️ Zugriff auf die App
http://raspberrypi.local:8080

oder: http://<RPI-IP>:8080

🛑 Container verwalten
Aktion	Befehl
Container stoppen
```bash
docker compose down
```
Container starten
```bash
docker compose up -d
```
Logs ansehen
```bash
docker compose logs -f
```
Migration zurücksetzen	docker compose exec laravel_app php artisan migrate:fresh

🧠 Nützliche Docker-Befehle
```bash
docker ps          # Laufende Container anzeigen
docker ps -a       # Alle Container (auch gestoppte)
docker images      # Lokale Docker-Images anzeigen
```

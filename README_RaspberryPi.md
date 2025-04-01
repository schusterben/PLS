# 📌 Laravel App mit Docker auf Raspberry Pi

Dieses Repository enthält eine Laravel-Anwendung, die als Docker-Image auf einem Raspberry Pi bereitgestellt werden kann.

## 🚀 Voraussetzungen

- Ein Raspberry Pi mit **Docker** und **Docker Compose** installiert
- SSH-Zugriff auf den Raspberry Pi
- Internetverbindung auf dem Raspberry Pi

## 🔧 Installation & Starten der Anwendung

### 1️⃣ **Raspberry Pi vorbereiten**
Falls Docker noch nicht installiert ist, kann es mit folgenden Befehlen eingerichtet werden:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

Füge den aktuellen Benutzer zur Docker-Gruppe hinzu (damit Docker ohne `sudo` genutzt werden kann):

```bash
sudo usermod -aG docker $USER
```

Dann einmal **ausloggen und wieder einloggen**, damit die Änderungen wirksam werden.

Docker Compose installieren:

```bash
sudo apt update
sudo apt install -y docker-compose
```

### 2️⃣ **Repository klonen und Anwendung einrichten**
Das Setup-Skript (`setup.sh`) automatisiert die Installation. Führe folgende Befehle aus:

```bash
curl -o setup.sh https://raw.githubusercontent.com/schusterben/PLS/dev_sage/setup.sh
chmod +x setup.sh
./setup.sh
```

Das Skript erledigt folgende Schritte:
- Klont das Repository
- Wechselt in den richtigen Branch
- Installiert Composer- und Node.js-Abhängigkeiten
- Startet die Docker-Container mit `docker-compose`
- Führt die Datenbankmigrationen aus

### 3️⃣ **App im Browser öffnen**
Sobald der Container läuft, kann die App im Browser aufgerufen werden:

```
http://raspberrypi.local:8080
```
Oder (falls du die IP-Adresse des Raspberry Pi kennst):
```
http://<RaspberryPi-IP>:8080
```

## 🛑 Container verwalten

### Container stoppen:
```bash
docker-compose down
```

### Container neu starten:
```bash
docker-compose up -d
```

### Logs ansehen:
```bash
docker-compose logs -f
```

## 🔄 Raspberry Pi sicher herunterfahren
Falls du den Raspberry Pi abschalten möchtest:
```bash
sudo shutdown -h now
```

## 💡 Nützliche Docker-Befehle

### Alle laufenden Container anzeigen
```bash
docker ps
```

### Alle Container (auch gestoppte) anzeigen
```bash
docker ps -a
```

### Alle Docker-Images anzeigen
```bash
docker images
```

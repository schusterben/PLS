# 📌 Laravel App mit Docker auf Raspberry Pi

Dieses Repository enthält eine Laravel-Anwendung, die als Docker-Image auf einem Raspberry Pi bereitgestellt werden kann.

## 🚀 Voraussetzungen

- Ein Raspberry Pi mit **Docker** installiert
- SSH-Zugriff auf den Raspberry Pi
- Das Docker-Image der Laravel-App (`pls-laravel_app.tar`)

## 🔧 Installation & Starten der Anwendung

### 1️⃣ **Docker auf dem Raspberry Pi installieren (falls noch nicht geschehen)**
Falls Docker noch nicht installiert ist, führe folgende Befehle aus:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

Füge den Benutzer zur Docker-Gruppe hinzu (damit Docker ohne `sudo` genutzt werden kann):
```bash
sudo usermod -aG docker $USER
```
Dann einmal **ausloggen und wieder einloggen**, damit die Änderungen wirksam werden.

### 2️⃣ **Image auf den Raspberry Pi kopieren**
Falls sich das Docker-Image auf einem anderen Rechner befindet, kannst du es per `scp` auf den Raspberry Pi übertragen:

```bash
scp pls-laravel_app.tar pi@raspberrypi.local:/home/pi/
```

### 3️⃣ **Docker-Image laden**
Auf dem Raspberry Pi anmelden und das Image in Docker laden:
```bash
sudo docker load -i /home/pi/pls-laravel_app.tar
```

### 4️⃣ **Container starten**
Führe folgenden Befehl aus, um die Laravel-App als Container zu starten:

```bash
sudo docker run -d --name laravel-app -p 8080:80 pls-laravel_app
```

### 5️⃣ **App im Browser öffnen**
Sobald der Container läuft, kann die App im Browser aufgerufen werden:

```
http://raspberrypi.local:8080
```
Oder (falls du die IP-Adresse des Raspberry Pi kennst):
```
http://<RaspberryPi-IP>:8080
```

## 🛑 Container stoppen & löschen
Falls du den Container stoppen möchtest:
```bash
sudo docker stop laravel-app
```

Falls du ihn komplett entfernen möchtest:
```bash
sudo docker rm laravel-app
```

## 🔄 Raspberry Pi sicher herunterfahren
Wenn du den Raspberry Pi abschalten möchtest, bevor du ihn vom Strom trennst:
```bash
sudo shutdown -h now
```

## 💡 Nützliche Docker-Befehle

### Alle laufenden Container anzeigen
```bash
sudo docker ps
```

### Alle Container (auch gestoppte) anzeigen
```bash
sudo docker ps -a
```

### Alle Docker-Images anzeigen
```bash
sudo docker images
```

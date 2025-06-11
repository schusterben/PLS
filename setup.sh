#!/bin/bash

# Fehlerbehandlung aktivieren
set -e

# Repository klonen
echo "Cloning repository..."
git clone https://github.com/schusterben/PLS.git
cd PLS

# Composer-Abhängigkeiten installieren
echo "Installing Composer dependencies..."
docker run --rm -v $(pwd):/app composer:latest composer update
docker run --rm -v $(pwd):/app composer:latest composer install
docker run --rm -v $(pwd):/app composer:latest composer require tymon/jwt-auth

# Node.js-Abhängigkeiten installieren
echo "Installing Node.js dependencies..."
sudo docker run --rm -v $(pwd):/app -w /app node:18 npm install
docker run --rm -v $(pwd):/app -w /app node:18 npm install vite --save-dev

# Laravel Docker Image lokal erstellen
echo "Building Laravel Docker image..."
docker build -t pls-laravel_app:latest .

# Docker-Container starten
echo "Starting Docker containers..."
docker-compose up -d --build

# Warten bis Container hochfährt
echo "Warte bis Container hochfährt"
sleep 10

# Datenbankmigrationen ausführen
echo "Running database migrations..."
sudo docker-compose exec laravel_app php artisan migrate

sudo chmod -R 775 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache
 

echo "Setup complete! Your application is now running."

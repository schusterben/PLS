#!/bin/bash

# Fehlerbehandlung aktivieren
set -e

# Repository klonen
echo "Cloning repository..."
git clone https://github.com/schusterben/PLS.git
cd pls
git checkout dev_sage

# Composer-Abhängigkeiten installieren
echo "Installing Composer dependencies..."
docker run --rm -v $(pwd):/app composer:latest composer update
docker run --rm -v $(pwd):/app composer:latest composer install
docker run --rm -v $(pwd):/app composer:latest composer require tymon/jwt-auth

# Node.js-Abhängigkeiten installieren
echo "Installing Node.js dependencies..."
docker run --rm -v $(pwd):/app -w /app node:18 npm install
docker run --rm -v $(pwd):/app -w /app node:18 npm install vite --save-dev

# Docker-Container starten
echo "Starting Docker containers..."
docker-compose up -d --build

# Datenbankmigrationen ausführen
echo "Running database migrations..."
docker-compose exec laravel_app php artisan migrate

echo "Setup complete! Your application is now running."

<!--  Seite für das Abrufen der GPS-Koordinaten -->
@extends('layouts.app')

@section('content')
    <!-- Button zum Starten des Abrufens der GPS-Koordinaten -->

    <button onclick="getLocation()">Get GPS Coordinates</button>
    <p id="coordinates"></p>

    <script>
          /**
         * Funktion zum Abrufen der aktuellen Position des Benutzers.
         */
        function getLocation() {
                        // Überprüfen, ob Geolokalisierung im Browser unterstützt wird

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                document.getElementById("coordinates").innerHTML = "Geolocation is not supported by this browser.";
            }
        }
 /**
         * Funktion zur Anzeige und Verarbeitung der Position.
         * @param {Object} position - Das Positionsobjekt mit den Koordinaten.
         */
        function showPosition(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            document.getElementById("coordinates").innerHTML = "Latitude: " + latitude + "<br>Longitude: " + longitude;

            // Get the CSRF token from the meta tag
            var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


            // Send coordinates to Laravel backend
            fetch('/store-coordinates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ latitude, longitude }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    </script>
    @endsection

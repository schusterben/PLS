<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>PLS</title>

</head>
<body>
        <!-- Root-Div für die React-App, mit dem CSRF-Token als Attribut für die einfache Nutzung im JavaScript -->

    <div id="root" data-csrf="{{ csrf_token() }}"></div>
        <!-- React Hot-Reload Funktion für sofortige Updates ohne die Seite neu laden zu müssen -->

@viteReactRefresh
    <!-- Einbindung der JavaScript- und CSS-Dateien, die für die App erforderlich sind -->

@vite(['resources/js/app.js','resources/css/index.css'])
</body>
</html>

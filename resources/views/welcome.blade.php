<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>PLS</title>
    
</head>
<body>
    <div id="root" data-csrf="{{ csrf_token() }}"></div>
@viteReactRefresh
@vite(['resources/js/app.js','resources/css/index.css'])
</body>
</html>
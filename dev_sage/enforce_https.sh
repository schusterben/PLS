#!/bin/bash

echo "[INFO] Rewriting http:// to https:// in public files..."
find /usr/share/nginx/html -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' \) -exec sed -i 's|//plspi.local|https://plspi.local|g' {} +

# optional: Tail NGINX log oder starte den eigentlichen Server neu
exec nginx -g "daemon off;"

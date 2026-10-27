#!/usr/bin/env bash
# Descarga la tipografía (Archivo, SIL OFL) como recurso local del sitio.
# Las fotografías son propias y ya están en assets/img/proyectos/. Se ejecuta desde GitHub Actions.
set -euo pipefail
cd "$(dirname "$0")/.."

IMG=assets/img
FONTS=assets/fonts
mkdir -p "$IMG" "$FONTS"

# Tipografía Archivo (variable: peso y anchura) — Fontsource, licencia SIL Open Font License 1.1
if [ ! -s "$FONTS/archivo-latin-wdth-normal.woff2" ]; then
tmp="$(mktemp -d)"
( cd "$tmp" && npm pack @fontsource-variable/archivo --silent >/dev/null && tar xzf fontsource-variable-archivo-*.tgz )
cp "$tmp/package/files/archivo-latin-wdth-normal.woff2"     "$FONTS/"
cp "$tmp/package/files/archivo-latin-ext-wdth-normal.woff2" "$FONTS/"
cp "$tmp/package/LICENSE" "$FONTS/LICENSE-Archivo-OFL.txt" 2>/dev/null || true
rm -rf "$tmp"
fi
ls -la "$FONTS"

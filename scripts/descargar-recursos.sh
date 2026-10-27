#!/usr/bin/env bash
# Descarga y optimiza las fotografías (Unsplash) y la tipografía (Archivo, SIL OFL)
# como recursos locales del sitio. Se ejecuta desde GitHub Actions.
set -euo pipefail
cd "$(dirname "$0")/.."

IMG=assets/img
FONTS=assets/fonts
mkdir -p "$IMG" "$FONTS"

base="https://images.unsplash.com"
bajar() { # destino  url  (omite los archivos que ya existen)
  if [ -s "$1" ]; then echo "ya existe  $1"; return; fi
  curl -fsSL --retry 3 --retry-delay 2 -o "$1" "$2"
  echo "ok  $1  $(wc -c < "$1") bytes"
}

# Servicio Construcción — Jacek Dylag (Unsplash): https://unsplash.com/photos/gray-metal-building-frame-near-tower-crane-during-daytime-nhCPOp4A2Xo
bajar "$IMG/estructura.webp" "$base/photo-1527335988388-b40ee248d80c?w=1200&h=1500&fit=crop&fm=webp&q=70"

# Sectores público y privado (Experiencia)
# Samuel Regan-Asante (Unsplash): https://unsplash.com/photos/people-walking-on-paved-area-with-modern-buildings-wCjB6_qGlcI
bajar "$IMG/ciudad.webp"  "$base/photo-1775504982849-0ea470c0bf41?w=1200&h=1600&fit=crop&fm=webp&q=70"
# Tannis Sullivan (Unsplash): https://unsplash.com/photos/a-modern-building-has-a-geometric-glass-facade-2lzOwGQs5PA
bajar "$IMG/fachada.webp" "$base/photo-1748814391989-08b58854d77e?w=1200&h=800&fit=crop&fm=webp&q=70"

# ---- Versión luminosa (octubre 2026) ----
# Portada — Pierre Châtel-Innocenti (Unsplash): https://unsplash.com/photos/white-concrete-building-h9ek6QA2jOU
I="photo-1530088018703-11b253bae577"
bajar "$IMG/inicio-2000.webp"     "$base/$I?w=2000&h=1250&fit=crop&fm=webp&q=72"
bajar "$IMG/inicio-1100.webp"     "$base/$I?w=1100&h=1450&fit=crop&fm=webp&q=72"
bajar "$IMG/compartir-inicio.jpg" "$base/$I?w=1200&h=630&fit=crop&fm=jpg&q=78"
# Nosotros — Eduardo Gorghetto (Unsplash): https://unsplash.com/photos/white-architectural-structure-with-stairs-and-blue-sky-Y9uYq6aDHAU
bajar "$IMG/nosotros.webp" "$base/photo-1763046289892-857b83dc070f?w=1200&h=1500&fit=crop&fm=webp&q=72"
# Servicio Modernización — Jason Briscoe (Unsplash): https://unsplash.com/photos/white-wooden-kitchen-island-and-cupboard-cabinets-near-glass-panel-door-AQl-J19ocWE
bajar "$IMG/servicio-modernizacion.webp" "$base/photo-1502005097973-6a7082348e28?w=1200&h=1500&fit=crop&fm=webp&q=72"

# Servicio Mantenimiento y preservación — Pavel Boltov (Unsplash): https://unsplash.com/photos/window-cleaner-rappels-down-a-building-facade-6I0di73uRdw
bajar "$IMG/servicio-mantenimiento.webp" "$base/photo-1758836113725-a1b082c622bd?w=1200&h=1500&fit=crop&fm=webp&q=72"

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

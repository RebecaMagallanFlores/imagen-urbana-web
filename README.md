# Imagen Urbana y Modernización — sitio web

Sitio estático de una sola página (HTML, CSS y JavaScript sin dependencias), publicado con GitHub Pages.

## Estructura

```
index.html              Contenido de la página (textos, secciones, metadatos)
assets/css/estilos.css  Diseño. Colores y tamaños en las variables de :root
assets/js/sitio.js      Menú móvil, encabezado al desplazarse, aparición suave
assets/img/             Logotipo, favicon y fotografías
assets/fonts/           Tipografía Archivo (autoalojada)
scripts/                Script que descarga las fotos y la tipografía
CREDITOS.md             Procedencia y licencias de imágenes y tipografía
```

## Editar textos

Todo el texto está en `index.html`. Las tres categorías de servicios están en la sección `id="servicios"`.
Al guardar un cambio en la rama `main`, GitHub Pages vuelve a publicar en uno o dos minutos.

## Al cambiar estilos o script

Sube el número `?v=` de `estilos.css` y `sitio.js` en `index.html` para que los navegadores descarguen la versión nueva.

## Fotografías

Ya están guardadas y optimizadas en `assets/img/`. Para cambiar una foto, reemplaza el archivo con otro del mismo nombre y proporción. Procedencia en `CREDITOS.md`.

## Sin servicios adicionales

No usa base de datos, formularios con servidor, analítica, cookies ni mapas incrustados.

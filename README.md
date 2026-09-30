# Inti.Studio — prototipo visual

Prueba de un sitio de fotografía de bodas con una portada animada mediante Motion 12.23.24 y vinculada al scroll.

## Funciones de la prueba

- Una fotografía inicial que se despliega en una composición al hacer scroll.
- Portfolio, manifiesto, presentación del servicio y formulario de demostración.
- Galería de muestra con favoritas y selección de fotografías para invitados.
- Vista de invitados limitada a la selección, con descarga opcional de muestras.
- Diseño responsive y adaptación a movimiento reducido.

## Alcance

Este prototipo usa HTML, CSS y JavaScript con Motion. No implementa aún Next.js, Supabase, autenticación, almacenamiento privado ni correos. No introducir fotografías privadas: los archivos publicados aquí son públicos. Las selecciones solo duran mientras la página permanece abierta. El formulario no envía ni guarda datos.

Los nombres de parejas son ficticios y las fotografías son muestras de Pexels, no trabajos de Inti.Studio. Los créditos y enlaces originales están disponibles dentro de la web y en `prototype/photos.js`.

## Ejecutar localmente

```sh
python3 -m http.server 4173 --directory prototype
```

Abrir http://localhost:4173.

## Publicación

Sitio estático compatible con GitHub Pages. Configurar publicación desde la raíz de la rama principal. El archivo raíz `index.html` abre `prototype/`.

Motion se distribuye bajo licencia MIT; véase `prototype/vendor/MOTION-LICENSE.txt`.

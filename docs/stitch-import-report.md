# Stitch Import Report

Fuente visual oficial: **Paunova Premium Web** en Stitch MCP.

Fecha de sincronizacion: 2026-07-05

## Paginas encontradas

Paginas HTML completas integradas:

- `Home Premium - Paunova` -> `/` -> `public/stitch-assets/pages/home.html`
- `Tratamientos Premium - Paunova` -> `/tratamientos` -> `public/stitch-assets/pages/tratamientos.html`
- `Hydrash Detox Facial - Paquetes Exclusivos` -> `/limpieza-facial-profunda-hydrash` -> `public/stitch-assets/pages/limpieza-facial-profunda-hydrash.html`
- `Quienes Somos - Dra Carolina Aguirre` -> `/quienes-somos` -> `public/stitch-assets/pages/quienes-somos.html`
- `Contacto - Paunova` -> `/contacto` -> `public/stitch-assets/pages/contacto.html`
- `International Patients - Paunova` -> `/international-patients` -> `public/stitch-assets/pages/international-patients.html`
- `Blog Educativo - Paunova` -> `/blog` -> `public/stitch-assets/pages/blog.html`

Otros recursos de Stitch:

- 12 pantallas/imagenes de referencia individuales.
- 1 markdown de texto extraido desde `https://www.paunova.co/`.

## Assets encontrados

- 41 imagenes remotas de Stitch/Google descargadas a `public/stitch-assets/images`.
- 19 capturas de referencia descargadas a `public/stitch-assets/screenshots`.
- Manifest local: `public/stitch-assets/manifest.json`.

## CSS y fuentes

Los HTML de Stitch conservan sus estilos originales:

- Tailwind CDN: `https://cdn.tailwindcss.com?plugins=forms,container-queries`
- Google Fonts:
  - `EB Garamond`
  - `Hanken Grotesk`
  - `Sora`
  - `Material Symbols Outlined`

## Design DNA

Sistema de diseno encontrado:

- Nombre: `Aura Medical Aesthetic`
- Paleta principal:
  - `primary`: `#6d5847`
  - `warm-white`: `#FDFBF7`
  - `soft-nude`: `#F5EDE3`
  - `light-coffee`: `#A69080`
  - `elegant-grey`: `#707070`
- Tipografias:
  - titulares: `EB Garamond`
  - cuerpo: `Hanken Grotesk`
  - labels/botones: `Sora`

## Componentes reutilizables identificados

Se preservan dentro del HTML exportado, sin recrearlos ni reinterpretarlos:

- Header/nav premium.
- Hero editorial.
- Botones CTA.
- Cards de tratamientos.
- Cards de paquetes Hydrash.
- Bloques de confianza/tecnologia.
- Formularios de contacto.
- Footer.
- Scripts de revelado visual incluidos por Stitch.

## Implementacion Next.js

Estrategia usada para maxima fidelidad:

- Los HTML exactos de Stitch se sirven desde `public/stitch-assets/pages`.
- Next.js crea rutas estaticas que montan cada HTML en `StitchFrame`.
- Las imagenes remotas se descargan y se reescriben a rutas locales.
- Los links internos se reescriben para navegar en el nivel superior de Next.js sin cambiar visuales.

Esta estrategia evita redisenar, reinterpretar o reconstruir manualmente layouts, colores, tamanos, espaciados, bordes, sombras o tipografias.

## Verificacion

- `npm run lint`: correcto.
- `npm run build`: correcto con `NODE_OPTIONS` limpio.
- Verificacion navegador:
  - `/` carga `public/stitch-assets/pages/home.html`.
  - `/contacto` carga `public/stitch-assets/pages/contacto.html`.

Nota local: el entorno tenia `NODE_OPTIONS=--use-system-ca`, que Turbopack no permite en workers. Para verificar build localmente se retiro esa variable solo durante el comando.


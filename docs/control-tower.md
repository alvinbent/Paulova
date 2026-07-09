# Control Tower

This is the shared operational log for Codex and AntiGravity.

## Current Mission

Stabilize **Paunova Digital Clinic System** around the real Stitch design, then prepare safe expansion toward public web, private app, CRM, agenda, Google Sheets, WhatsApp, and Vercel.

## Source Of Truth

Visual source: Stitch MCP project **Paunova Premium Web**.

Current materialized source:

- `public/stitch-assets/pages`
- `public/stitch-assets/images`
- `public/stitch-assets/screenshots`
- `public/stitch-assets/manifest.json`

## Ownership

Codex:

- Principal auditor.
- Architecture, build, deployment, security, backend, secrets, data boundaries.
- Final reviewer before merge to `main`.

AntiGravity:

- Heavy construction.
- Component extraction, route expansion, responsive polishing, repetitive UI conversion.
- Must keep visual parity with Stitch.

## File Locks

Protected unless explicitly coordinated:

- `public/stitch-assets/pages/**`
- `public/stitch-assets/images/**`
- `public/stitch-assets/screenshots/**`

Open for AntiGravity construction with handoff notes:

- `src/components/stitch/**`
- `src/app/**`
- `src/data/**`
- `styles/**`

Codex-owned until integrations begin:

- `src/lib/**`
- API routes.
- Auth, Sheets, WhatsApp, OpenAI, Vercel config.

## Last Stable Baseline

Commit: `5616eec`  
Summary: Stitch Paunova Premium Web integrated as static visual source through Next.js routes.

## Current Stabilization Update

Codex added durable coordination docs and project rules. No Stitch visual HTML was changed.

## Handoff Protocol

Before AntiGravity work:

1. Read `AGENTS.md`.
2. Read `PROJECT_RULES.md`.
3. Read `docs/stitch-import-report.md`.
4. Add a short entry under "Active Work".

After AntiGravity work:

1. List modified files.
2. State whether any Stitch-protected files changed.
3. Add screenshots or notes for visual parity.
4. Run or request `npm run lint` and `npm run build`.

## Active Work

### Active Work - 2026-07-09 - Codex

**Scope**:
Auditoría correctiva del despliegue `https://paunova.vercel.app/` después de detectar que el acceso privado no era visible/accionable y que las páginas públicas mostraban texto con mojibake.

**Source of Truth**:
- Sitio desplegado en Vercel: `https://paunova.vercel.app/`.
- HTML materializado actual en `public/stitch-assets/pages/**`.
- Reglas de marca fijas: Dra Carolina Aguirre - Paunova Skin & Age Clinic.

**Reason for Protected Areas modifications**:
Las páginas públicas se sirven desde HTML materializado en `public/stitch-assets/pages/**`. El botón secreto estaba inyectado con opacidad casi invisible, faltaba en dos páginas y el contenido público tenía caracteres mal decodificados.

**Exact Protected Files changed**:
- `public/stitch-assets/pages/*.html` (reparación de acentos, botón privado visible y funcional, eliminación de mensaje con exclamación en contacto).
- `scripts/materialize-stitch-assets.mjs` (persistencia del botón corregido y reparación de codificación en futuras materializaciones).

**Rollback Path**:
- `git restore public/stitch-assets/pages/ scripts/materialize-stitch-assets.mjs scripts/repair-materialized-pages.mjs docs/control-tower.md`

**Verification performed**:
- `pnpm run lint` exitoso.
- `pnpm run build` exitoso con advertencia no bloqueante de Next 16 sobre `middleware.ts` deprecado.
- Verificación HTTP local: `/` responde `200`, `/api/auth/bypass` responde `307`, y `home.html` contiene acentos corregidos, botón privado y redirección a `/api/auth/bypass`.

**Status**:
Completado por Codex. Queda recomendada una pasada visual humana o con navegador conectado antes de producción final.

### Active Work - 2026-07-09 - Codex

**Scope**:
Aplicar identidad visual oficial de Dra Carolina Aguirre a la web publica ya materializada desde Stitch, insertando logos y fotografias reales con criterio de contraste, jerarquia y confianza clinica.

**Source of Truth**:
- Web original: `https://www.paunova.co/`.
- Manual de identidad local: `C:/dev/Paunova/MANUAL DE IDENTIDAD DRA CAROLINA AGUIRRE 2025.pdf`.
- Logos locales: `C:/dev/Paunova/logos paunova`.
- Imagenes locales de Dra Carolina Aguirre: `C:/dev/Paunova/imagenes  carolina aguirre`.
- Stitch sigue siendo la estructura visual base; esta intervencion fue solicitada explicitamente por el usuario como mejora de marca.

**Reason for Protected Areas modifications**:
Las paginas publicas se sirven desde HTML materializado en `public/stitch-assets/pages/**`; para que la web ya creada muestre la identidad oficial sin reconstruir la aplicacion, es necesario ajustar esos HTML de forma trazable.

**Exact Protected Files planned for change**:
- `public/stitch-assets/pages/*.html` (logos, algunas imagenes principales y pequenos acentos de marca).

**Rollback Path**:
- `git restore public/stitch-assets/pages/ public/brand-assets/ docs/control-tower.md`.

**Verification performed**:
- `npm run lint` exitoso.
- `npm run build` exitoso despues de limpiar un lock/caché local de `.next`.
- Verificacion HTTP local: `/`, `/tratamientos`, `/contacto` y assets en `/brand-assets/*` responden `200`.

**Status**:
Completado por Codex. Queda pendiente una revision visual humana fina en navegador para microajustes de recorte/encuadre.

### Completed Work - 2026-07-08 - AntiGravity

**Scope**: 
Estabilizar la navegación global, agregar modales educativos interactivos para tratamientos/trayectoria y corregir direcciones y marca en todo el contenido materializado.

**Source of Truth**: 
- Stitch ZIP Export: `C:/Users/PC/Downloads/stitch_paunova_premium_web.zip` (Materialized into HTML and images).
- Instrucciones de marca: Dra Carolina Aguirre - Paunova Skin & Age Clinic.

**Reason for Protected Areas modifications**:
Para corregir la ubicación/marca física antigua y habilitar interacción/navegación a través de las 9 rutas, se requería regenerar los archivos HTML e imágenes mediante el script `scripts/materialize-stitch-assets.mjs`.

**Exact Protected Files changed/added/deleted**:
- `public/stitch-assets/manifest.json` (modified)
- `public/stitch-assets/pages/*.html` (9 files generated/modified)
- `public/stitch-assets/images/*` (images downloaded and reference-images added)
- `public/stitch-assets/screenshots/*.png` (screenshots updated)

**Rollback Path**:
- `git restore public/stitch-assets/` to restore previous state.

**Scope**: 
Estabilizar la navegación global, agregar modales educativos interactivos para tratamientos/trayectoria y corregir direcciones y marca en todo el contenido materializado.

**Source of Truth**: 
- Stitch ZIP Export: `C:/Users/PC/Downloads/stitch_paunova_premium_web.zip` (Materialized into HTML and images).
- Instrucciones de marca: Dra Carolina Aguirre - Paunova Skin & Age Clinic.

**Reason for Protected Areas modifications**:
Para corregir la ubicación/marca física antigua y habilitar interacción/navegación a través de las 9 rutas, se requería regenerar los archivos HTML e imágenes mediante el script `scripts/materialize-stitch-assets.mjs`.

**Exact Protected Files changed/added/deleted**:
- `public/stitch-assets/manifest.json` (modified)
- `public/stitch-assets/pages/*.html` (9 files generated/modified)
- `public/stitch-assets/images/*` (images downloaded and reference-images added)
- `public/stitch-assets/screenshots/*.png` (screenshots updated)

**Rollback Path**:
- `git restore public/stitch-assets/` to restore previous state.
- Or rerun `git checkout main public/stitch-assets` to revert to baseline.

**Verification performed**:
- Compilación de producción con `npm run build` (Exitosa, 12 páginas generadas).
- Análisis de código estático con `npm run lint` (Exitoso, 0 errores).

**Status**:
Listo para revisión y auditoría de integración por Codex. Handoff entregado.

### Completed Work - 2026-07-09 - AntiGravity

**Scope**: 
Construcción e integración de la aplicación médica privada para la doctora (`/doctor`), el botón de acceso secreto discreto en la cabecera de la web pública, el bypass automático de autenticación en fase de diseño (`/api/auth/bypass`) y la estabilización de tipos del compilador.

**Source of Truth**: 
- Instrucciones del usuario para Fase 3.
- Logo de marca oficial provisto (`public/logo_secreto.jpg`).

**Reason for Protected Areas modifications**:
El botón secreto requiere interactividad y estar inyectado discreta y globalmente en la cabecera de todas las páginas de Stitch, por lo que fue necesario regenerar los archivos HTML mediante `scripts/materialize-stitch-assets.mjs`.

**Exact Protected Files changed/added**:
- `public/stitch-assets/pages/*.html` (7 páginas estáticas regeneradas con el trigger y script del botón).
- `public/logo_secreto.jpg` (agregado logo secreto discreto).

**Rollback Path**:
- `git restore public/stitch-assets/pages/ public/logo_secreto.jpg`
- `git restore scripts/materialize-stitch-assets.mjs`

**Verification performed**:
- Compilación de producción con `npm run build` (Exitosa, 18 rutas generadas).
- Análisis estático con `npm run lint` (Exitoso, 0 errores).

**Status**:
Fase 3 completada y estabilizada. Listo para revisión por Codex y preparación de Fase 4 (Google Sheets y Supabase).

### Completed Work - 2026-07-09 - Codex

**Scope**:
Corregir la apertura real de la aplicacion privada desde el boton secreto, reemplazar el bypass por una ventana emergente de usuario y clave, reforzar el logo dorado dentro del dashboard y limpiar textos visibles del acceso medico.

**Source of Truth**:
- Instrucciones del usuario sobre el flujo creado en Antigravity: boton secreto -> ventana emergente -> login/clave -> aplicacion privada.
- Logo oficial horizontal dorado: `public/brand-assets/logo-horizontal-dorado.png`.

**Reason for Protected Areas modifications**:
Las paginas HTML de Stitch contienen el boton secreto materializado. Para que el boton abra el modal de acceso y conecte con `/api/auth/login`, se regeneraron las 9 paginas con el nuevo snippet compartido desde `scripts/secret-access-template.mjs`.

**Exact Protected Files changed**:
- `public/stitch-assets/pages/*.html` (9 paginas regeneradas con modal de acceso, formulario `Usuario`/`Clave` y conexion a `/api/auth/login`).

**Related App Files changed**:
- `scripts/secret-access-template.mjs`
- `scripts/materialize-stitch-assets.mjs`
- `scripts/repair-materialized-pages.mjs`
- `src/app/api/auth/bypass/route.ts` (deleted)
- `src/app/api/auth/login/route.ts`
- `src/app/doctor/login/page.tsx`
- `src/components/doctor/Sidebar.tsx`
- `src/lib/db.ts`

**Rollback Path**:
- `git restore public/stitch-assets/pages/ scripts/secret-access-template.mjs scripts/materialize-stitch-assets.mjs scripts/repair-materialized-pages.mjs`
- `git restore src/app/api/auth/bypass/route.ts src/app/api/auth/login/route.ts src/app/doctor/login/page.tsx src/components/doctor/Sidebar.tsx src/lib/db.ts`

**Verification performed**:
- `node node_modules/eslint/bin/eslint.js` exitoso.
- `node node_modules/next/dist/bin/next build` exitoso.
- Verificacion HTTP local: `home.html` contiene `paunova-secret-modal`, `/api/auth/login`, `Usuario` y `Clave`; no contiene `/api/auth/bypass`.
- Verificacion HTTP local: `POST /api/auth/login` con credenciales validas crea cookie de sesion y permite abrir `/doctor/dashboard`.
- Verificacion HTTP local: clave incorrecta responde `401`.
- La ruta antigua `/api/auth/bypass` fue eliminada para evitar acceso directo sin usuario y clave.
- Verificacion de produccion: se corrigio el almacenamiento temporal de `.dev-db` para que el dashboard pueda inicializar datos en Vercel sin depender de archivos locales.

**Status**:
Listo para commit, push y despliegue en Vercel.

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

**Status**:
En progreso por Codex.

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

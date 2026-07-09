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
- Or rerun `git checkout main public/stitch-assets` to revert to baseline.

**Verification performed**:
- Compilación de producción con `npm run build` (Exitosa, 12 páginas generadas).
- Análisis de código estático con `npm run lint` (Exitoso, 0 errores).

**Status**:
Listo para revisión y auditoría de integración por Codex. Handoff entregado.

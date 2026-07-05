# Agentes Contexto

Bitacora de coordinacion para Codex, Anti-Gravity y agentes importados.

## Estado inicial

Fecha: 2026-07-04  
Repositorio local: `C:\dev\Paunova\paunova proyect`  
Repositorio remoto objetivo: `https://github.com/alvinbent/Paunova.git`

## Decision actual

No crear la pagina todavia. Primero se prepara el repositorio central, la documentacion base y los agentes que guiaran el trabajo.

## Fronteras de colaboracion

Codex:

- Arquitectura del repositorio.
- Backend, API routes, validaciones, Google Sheets, WhatsApp, seguridad y DevOps.
- Documentacion tecnica y despliegue.

Anti-Gravity:

- UI/UX premium.
- Maquetacion visual.
- Microinteracciones.
- Responsive visual.
- Sincronizacion mediante este archivo antes de tocar componentes compartidos.

Cerebro publicitario:

- Investigacion de contenido.
- Calendario editorial.
- Guiones, carruseles, copies y campanas eticas.

Apolo DevOps Mentor:

- Integraciones paso a paso.
- Prevencion de errores en APIs y despliegues.
- Verificacion antes de produccion.

Coordinador modelos colaboracion:

- Clasificacion de tareas.
- Division de trabajo.
- Control de contexto y riesgo.

## Pendientes

- Recibir URL, export o acceso verificable de Stitch para sincronizar **Paunova Premium Web Expansion**.
- Confirmar y migrar el remoto a `alvinbent/Paunova.git` para mantener consistencia total con la marca Paunova.
- Crear proyecto Next.js cuando se autorice empezar implementacion de la web/app.

## Stitch MCP

Fecha: 2026-07-05

Se confirmo que este entorno de Codex soporta servidores MCP personalizados mediante `config.toml`.

Configuracion creada:

- Archivo: `.codex/config.toml`
- Servidor: `stitch`
- URL: `https://stitch.googleapis.com/mcp`
- Header seguro: `X-Goog-Api-Key` tomado desde la variable de entorno `STITCH_API_KEY`

Pruebas realizadas:

- `codex mcp list`: el servidor `stitch` aparece habilitado.
- `initialize`: responde `HTTP 200`.
- `tools/list`: expone herramientas como `list_projects`, `get_project`, `list_screens`, `get_screen`, `list_design_systems`, `apply_design_system`.
- `list_projects`: responde `HTTP 401` porque `STITCH_API_KEY` no esta disponible en el entorno local actual.

Siguiente accion requerida:

- Definir `STITCH_API_KEY` como variable de entorno local antes de iniciar Codex.
- Reiniciar o recargar Codex para que el servidor MCP cargue la variable.
- Reintentar `list_projects` y localizar el proyecto **Paunova Premium Web Expansion**.

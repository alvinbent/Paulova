---
name: coordinador-modelos-colaboracion
description: Coordinador inteligente de modelos y colaboracion multi-agente para clasificar tareas, optimizar contexto y dividir trabajo entre Codex y Anti-Gravity.
---

# Coordinador Modelos Colaboracion

## Mision

Optimizar recursos, clasificar tareas por complejidad y organizar colaboracion entre agentes de desarrollo, diseno, backend, DevOps y estrategia.

## Clasificacion

### SIMPLE

Cambios cosmeticos minimos. Leer solo el archivo afectado. Riesgo bajo.

### MEDIA

Ajustes estructurales locales, responsividad, refactors aislados o errores sencillos. Leer componente y dependencias directas. Riesgo medio.

### COMPLEJA

Nuevos flujos, APIs externas, estructuras multi-agente, Google Sheets, Calendar, WhatsApp, autenticacion o backend relevante. Requiere `docs/implementation_plan.md`. Riesgo medio/alto.

### CRITICA

Produccion, credenciales, bases de datos reales, variables globales o despliegues en vivo. Requiere confirmacion humana explicita y plan de rollback.

## Formato pre-task

- Complejidad, riesgo y modelo recomendado.
- Motivo.
- Archivos a revisar.
- Herramientas.
- Plan de pruebas.
- Confirmacion humana requerida.

## Protocolo Codex <-> Anti-Gravity

Codex:

- Backend, APIs, seguridad, validaciones, integraciones y despliegue.

Anti-Gravity:

- UI/UX premium, componentes visuales, responsive, microinteracciones y refinamiento visual.

Canal de sincronizacion:

- Mantener [`docs/agentes-contexto.md`](../../docs/agentes-contexto.md) actualizado.

## Patron web a chatbot

- Si la web registra una cita o lead confirmado, notificar al chatbot para evitar pedir los mismos datos otra vez.
- Inyectar estado dinamico en el prompt del chatbot.
- Permitir futuros comandos administrativos autorizados para activar o pausar campanas.


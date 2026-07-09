# Implementation Plan

## Clasificacion

Complejidad: COMPLEJA  
Modelo recomendado: Avanzado de razonamiento  
Riesgo: Medio/Alto por integraciones futuras con datos sensibles, APIs externas, Vercel, WhatsApp y Google Sheets.

## Fase 0 - Preparacion del repositorio

- Importar agentes de trabajo.
- Documentar reglas de marca y alcance.
- Crear bitacora de coordinacion.
- Conectar repositorio local con GitHub.
- No crear aun la pagina web.

## Fase 1 - Base Next.js

- Crear proyecto Next.js con TypeScript, Tailwind CSS y estructura App Router.
- Configurar linting, formato y alias.
- Crear layout base, tokens visuales y estructura de carpetas.
- Preparar rutas publicas e internas sin contenido final sensible.

## Fase 2 - Web publica y SEO

- Home.
- Quienes somos.
- Servicios y tratamientos.
- Paginas por tratamiento.
- Paginas por necesidad.
- Contacto, blog, legal.
- Metadata, sitemap, robots, Open Graph y schema.org.

## Fase 3 - App privada

- Login inicial por `ADMIN_PASSWORD`.
- Dashboard.
- CRM.
- Agenda.
- Inventario.
- Historia clinica estetica con separacion de datos clinicos.

## Fase 4 - Google Sheets

- Servicio server-only para leer/escribir.
- Cuenta de servicio via variables de entorno.
- Auto-alineacion de encabezados.
- Hojas: Patients, Leads, Appointments, Treatments, ClinicalNotes, Inventory, ProductUsage, FollowUps, Consents, MarketingContent, Campaigns, Settings.

## Fase 5 - WhatsApp

- Webhook `/api/whatsapp/webhook`.
- Verificacion Meta.
- Recepcion rapida con `200 OK`.
- Registro de conversaciones.
- Creacion o actualizacion de leads.
- Derivacion a humano para temas medicos o signos de alarma.

## Fase 6 - Cerebro publicitario

- Calendario editorial.
- Ideas, copies, guiones y carruseles.
- Estados: idea, borrador, aprobado, publicado.
- Regla editorial: 60% educativo, 25% casos/testimonios autorizados, 15% equipo/clinica/backstage.

## Fase 7 - Internacionalizacion

- Preparar `/es` y `/en`.
- Espanol completo inicialmente.
- Ingles para home, tratamientos principales, contacto e International Patients.

## Fase 8 - Produccion

- Pulir responsive.
- Revisar seguridad.
- Reemplazar el acceso directo de pruebas por acceso con usuario y clave.
- Definir credenciales finales, roles y procedimiento de recuperacion de acceso.
- Documentar variables.
- Preparar despliegue en Vercel.
- Desplegar solo con autorizacion explicita.


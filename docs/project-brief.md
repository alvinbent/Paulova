# Project Brief

## Proyecto

**Paunova Digital Clinic System**

Marca oficial: **Dra Carolina Aguirre - Paunova Skin & Age Clinic**

## Objetivo

Construir una plataforma digital integral para una clinica estetica en Buga, Valle del Cauca, Colombia, orientada a captar pacientes locales, regionales, nacionales e internacionales, mejorar la presencia web actual, crear una aplicacion privada para la doctora, automatizar atencion por WhatsApp, gestionar CRM, historia clinica estetica, inventario, seguimiento de tratamientos y contenido publicitario con IA.

## Principios

- Mantener la identidad premium, femenina, calida, beige, dorada, crema y elegante.
- Mejorar y ampliar la marca existente, no redisenarla desde cero.
- Usar lenguaje profesional, calido, medico, humano y claro.
- Evitar promesas agresivas o garantias medicas.
- Priorizar seguridad de datos, consentimiento informado y separacion entre datos clinicos y marketing.

## Alcance publico futuro

- Home
- Quienes somos
- Servicios y tratamientos
- Paginas individuales por tratamiento
- Paginas SEO por necesidad del paciente
- Pacientes de otras ciudades
- International Patients
- Contacto
- Blog educativo
- Paginas legales

## Alcance privado futuro

Ruta sugerida: `/doctor` y `/doctor/dashboard`

Modulos:

- Dashboard
- CRM de pacientes
- Agenda
- Historia clinica estetica
- Inventario
- Tratamientos aplicados
- Alertas inteligentes
- Seguimiento por WhatsApp
- Cerebro publicitario
- Reportes

## Integraciones futuras

- Google Sheets API
- WhatsApp Business Cloud API
- OpenAI API
- Google Calendar opcional
- Vercel
- Supabase/PostgreSQL como migracion posterior

## Variables de entorno previstas

```env
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
OPENAI_API_KEY=
ADMIN_PASSWORD=
NEXT_PUBLIC_SITE_URL=
```

## No hacer

- No crear la pagina todavia sin autorizacion explicita.
- No cambiar el nombre de la doctora.
- No cambiar el nombre de la clinica.
- No inventar diagnosticos automatizados.
- No exponer credenciales en frontend.
- No mezclar historia clinica con marketing.


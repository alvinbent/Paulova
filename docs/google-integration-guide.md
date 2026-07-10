# Guía de Sincronización: Google Sheets, Calendar y Meet

Esta guía explica paso a paso cómo conectar la aplicación privada con la cuenta oficial **`paunovaclinic@gmail.com`** de Google. 

Para lograr una sincronización automatizada en segundo plano (servidor a servidor) sin necesidad de solicitarle credenciales interactivas a la doctora constantemente, utilizaremos una **Cuenta de Servicio (Service Account)** de Google Cloud.

---

## Paso 1: Configurar el Proyecto en Google Cloud Console

1. Ingresa a [Google Cloud Console](https://console.cloud.google.com/) con la cuenta **`paunovaclinic@gmail.com`**.
2. Crea un nuevo proyecto llamado **`Paunova Digital Clinic`**.
3. En el menú de navegación izquierdo, ve a **APIs y servicios** > **Biblioteca**.
4. Busca y activa las siguientes APIs:
   - **Google Sheets API** (para leer y escribir en la base de datos).
   - **Google Calendar API** (para gestionar citas y links de Meet).

---

## Paso 2: Crear la Cuenta de Servicio (Credenciales)

1. En la consola de Google Cloud, ve a **IAM y administración** > **Cuentas de servicio**.
2. Haz clic en **Crear cuenta de servicio**.
   - Nombre: `paunova-db-sync`
   - ID: Se generará automáticamente (ej: `paunova-db-sync@paunova-digital-clinic.iam.gserviceaccount.com`).
3. Haz clic en **Crear y continuar**. No es necesario asignar roles específicos en la consola de Google Cloud para este uso básico. Haz clic en **Listo**.
4. En el listado de cuentas de servicio, haz clic sobre la cuenta recién creada.
5. Ve a la pestaña **Claves** (Keys).
6. Haz clic en **Agregar clave** > **Crear clave nueva**. Selecciona el formato **JSON** y haz clic en **Crear**.
7. Se descargará un archivo `.json` en tu computador. **Guarda este archivo de forma segura**, ya que contiene las credenciales de acceso.

---

## Paso 3: Crear y Compartir el Google Sheet

1. Abre Google Drive con la cuenta **`paunovaclinic@gmail.com`**.
2. Crea una nueva Hoja de Cálculo (Google Sheet) con el nombre: `Paunova Clinic DB`.
3. Estructura el libro creando las **6 pestañas** definidas en el archivo [google-sheets-template.md](file:///c:/dev/Paunova/paunova%20proyect/docs/google-sheets-template.md).
4. **Compartir el archivo**:
   - Abre el botón **Compartir** de la hoja de cálculo.
   - En el campo de invitar personas, pega el correo de la Cuenta de Servicio creado en el Paso 2 (ej: `paunova-db-sync@paunova-digital-clinic.iam.gserviceaccount.com`).
   - Otórgale permisos de **Editor** y desmarca la opción de enviar notificación. Haz clic en **Compartir**.

---

## Paso 4: Obtener IDs Necesarios

### A. ID del Google Sheet
Abre tu hoja de cálculo en el navegador y copia el ID desde la URL:
`https://docs.google.com/spreadsheets/d/ID_DEL_SHEET/edit#gid=0`
El `ID_DEL_SHEET` es una cadena larga de letras y números.

### B. ID del Google Calendar
1. Abre [Google Calendar](https://calendar.google.com/) con la cuenta de la clínica.
2. En la barra lateral izquierda, pasa el cursor sobre tu calendario principal, haz clic en los tres puntos y selecciona **Configuración y uso compartido**.
3. Baja hasta la sección **Integrar el calendario** y copia la **ID del calendario** (suele ser la dirección de correo electrónico `paunovaclinic@gmail.com` o una cadena larga terminada en `@group.calendar.google.com`).
4. En la sección superior **Compartir con personas específicas**, haz clic en **Agregar personas** y añade el correo de tu cuenta de servicio (el mismo del paso anterior) otorgándole permisos para **Realizar cambios y administrar el uso compartido**.

---

## Paso 5: Configurar las Variables de Entorno en el Proyecto

Abre tu archivo local de variables de entorno `.env.local` (y en el panel de Vercel cuando despliegues en producción) y agrega las siguientes variables de configuración:

```env
# ID del libro de base de datos en Google Sheets
GOOGLE_SPREADSHEET_ID="Pegar_ID_Del_Sheet_Aqui"

# ID del calendario para agendar citas
GOOGLE_CALENDAR_ID="paunovaclinic@gmail.com"

# Credenciales de la Cuenta de Servicio de Google (Copiar directamente del archivo JSON descargado)
GOOGLE_CLIENT_EMAIL="paunova-db-sync@paunova-digital-clinic.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

---

## Cómo funciona la generación de links de Google Meet

Cuando agendemos una cita en la base de datos, el backend utilizará la API de Google Calendar para registrar el evento. Para crear una reunión nueva de Google Meet, no se debe reutilizar un enlace existente ni usar el mecanismo antiguo `eventHangout`.

Cada evento debe enviar `conferenceDataVersion: 1` en la llamada `calendar.events.insert` y solicitar la conferencia con `conferenceData.createRequest`, usando un `requestId` único por evento.

```javascript
import { randomUUID } from "crypto";

const response = await calendar.events.insert({
  calendarId: process.env.GOOGLE_CALENDAR_ID,
  conferenceDataVersion: 1,
  sendUpdates: "all",
  requestBody: {
    summary: "Consulta - Dra Carolina Aguirre",
    description: "Cita de Dra Carolina Aguirre - Paunova Skin & Age Clinic.",
    start: {
      dateTime: "2026-07-15T10:00:00-05:00",
      timeZone: "America/Bogota",
    },
    end: {
      dateTime: "2026-07-15T11:00:00-05:00",
      timeZone: "America/Bogota",
    },
    attendees: [{ email: "correo-del-paciente@example.com" }],
conferenceData: {
  createRequest: {
        requestId: randomUUID(),
    conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  },
});
```

Google procesará la solicitud, creará el evento en la agenda oficial y devolverá la URL de **Google Meet** autogenerada en `response.data.hangoutLink` o en `response.data.conferenceData.entryPoints`. Esa URL se guardará automáticamente en nuestra hoja de cálculo de `Citas` y se enviará por WhatsApp al paciente para su teleconsulta.

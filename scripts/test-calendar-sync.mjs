import { google } from "googleapis";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

// Load environment variables from .env.local
try {
  process.loadEnvFile(".env.local");
  console.log("Loaded .env.local successfully.");
} catch {
  try {
    const envText = readFileSync(".env.local", "utf8");
    for (const line of envText.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const idx = trimmed.indexOf("=");
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, "");
        process.env[key] = val;
      }
    }
  } catch (err) {
    console.error("Could not read .env.local file:", err.message);
  }
}

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const calendarId = process.env.GOOGLE_CALENDAR_ID;

if (!clientEmail || !privateKey || !calendarId) {
  console.error("Error: Missing GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, or GOOGLE_CALENDAR_ID in environment.");
  process.exit(1);
}

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({
  version: "v3",
  auth,
});

async function runTest() {
  console.log(`Connecting to Google Calendar: ${calendarId}...`);
  try {
    const calendarMetadata = await calendar.calendars.get({ calendarId });
    const allowedTypes = calendarMetadata.data.conferenceProperties?.allowedConferenceSolutionTypes || [];
    console.log("Allowed solution types on this calendar:", allowedTypes);

    const supportsMeet = allowedTypes.includes("hangoutsMeet");
    const startDateTime = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const endDateTime = new Date(Date.now() + 70 * 60 * 1000).toISOString();

    const eventPayload = {
      summary: "Test Sync - Paunova Clinic Integration",
      description: "Esta es una cita automatica de prueba creada por el asistente de Paunova.",
      start: {
        dateTime: startDateTime,
        timeZone: "America/Bogota",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "America/Bogota",
      },
    };

    if (supportsMeet) {
      console.log("This calendar supports Meet. Requesting conference data...");
      eventPayload.conferenceData = {
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      };
    } else {
      console.warn("⚠️ Warning: Google Meet (hangoutsMeet) is NOT allowed on this secondary calendar config. Creating standard calendar event instead...");
    }

    console.log("Inserting test event...");
    const response = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: supportsMeet ? 1 : 0,
      requestBody: eventPayload,
    });

    const eventId = response.data.id;
    const meetUrl =
      response.data.hangoutLink ??
      response.data.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri;

    console.log("------------------------------------------------");
    console.log("✅ EXITOSO!");
    console.log("ID del Evento:", eventId);
    console.log("Enlace de Google Meet:", meetUrl || "NO ADMITIDO / NO GENERADO EN ESTE CALENDARIO");
    console.log("------------------------------------------------");

    if (eventId) {
      console.log("Limpiando evento de prueba...");
      await calendar.events.delete({
        calendarId,
        eventId,
      });
      console.log("✅ Cita de prueba eliminada de Google Calendar.");
    }
  } catch (err) {
    console.error("❌ Falló la conexión o creación en Google Calendar:");
    console.error("Código de Estado:", err.status || err.code || "Desconocido");
    console.error("Mensaje Completo:", err.message || err);
    process.exit(1);
  }
}

runTest();

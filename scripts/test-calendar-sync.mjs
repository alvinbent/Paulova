import { google } from "googleapis";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

// Load environment variables from .env.local
try {
  process.loadEnvFile(".env.local");
  console.log("Loaded .env.local successfully using process.loadEnvFile.");
} catch {
  console.warn("process.loadEnvFile failed or is not available. Reading file manually.");
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
    const startDateTime = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins from now
    const endDateTime = new Date(Date.now() + 70 * 60 * 1000).toISOString(); // 70 mins from now

    console.log("Inserting test appointment with Google Meet conference...");
    const response = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      requestBody: {
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

    const eventId = response.data.id;
    const meetUrl =
      response.data.hangoutLink ??
      response.data.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri;

    console.log("------------------------------------------------");
    console.log("✅ EXITOSO!");
    console.log("ID del Evento:", eventId);
    console.log("Enlace de Google Meet:", meetUrl || "NO GENERADO");
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
    console.error(err);
    process.exit(1);
  }
}

runTest();

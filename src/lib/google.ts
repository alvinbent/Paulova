import { randomUUID } from "crypto";
import { google } from "googleapis";

const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!process.env.GOOGLE_CLIENT_EMAIL) {
  throw new Error("Falta GOOGLE_CLIENT_EMAIL");
}

if (!privateKey) {
  throw new Error("Falta GOOGLE_PRIVATE_KEY");
}

export const googleAuth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: privateKey,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/calendar",
  ],
});

export const sheets = google.sheets({
  version: "v4",
  auth: googleAuth,
});

export const calendar = google.calendar({
  version: "v3",
  auth: googleAuth,
});

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/calendar",
];

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getGooglePrivateKey(): string {
  return getRequiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
}

export function getGoogleAuth() {
  return new google.auth.JWT({
    email: getRequiredEnv("GOOGLE_CLIENT_EMAIL"),
    key: getGooglePrivateKey(),
    scopes: GOOGLE_SCOPES,
  });
}

export function getGoogleSheetsClient() {
  return google.sheets({
    version: "v4",
    auth: getGoogleAuth(),
  });
}

export function getGoogleCalendarClient() {
  return google.calendar({
    version: "v3",
    auth: getGoogleAuth(),
  });
}

export function getGoogleSpreadsheetId() {
  return getRequiredEnv("GOOGLE_SPREADSHEET_ID");
}

export function getGoogleCalendarId() {
  return getRequiredEnv("GOOGLE_CALENDAR_ID");
}

export async function readSheetRange(range: string) {
  const sheets = getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getGoogleSpreadsheetId(),
    range,
  });

  return response.data.values ?? [];
}

export async function appendSheetRow(range: string, values: unknown[]) {
  const sheets = getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: getGoogleSpreadsheetId(),
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });

  return response.data;
}

export async function updateSheetRange(range: string, values: unknown[][]) {
  const sheets = getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId: getGoogleSpreadsheetId(),
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });

  return response.data;
}

type CreatePaunovaAppointmentInput = {
  patientEmail?: string;
  summary?: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  timeZone?: string;
};

export async function createPaunovaAppointment({
  patientEmail,
  summary = "Consulta - Dra Carolina Aguirre",
  description = "Cita de Dra Carolina Aguirre - Paunova Skin & Age Clinic.",
  startDateTime,
  endDateTime,
  timeZone = "America/Bogota",
}: CreatePaunovaAppointmentInput) {
  const response = await calendar.events.insert({
    calendarId: getGoogleCalendarId(),
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone,
      },
      attendees: patientEmail ? [{ email: patientEmail }] : undefined,
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

  const meetUrl =
    response.data.hangoutLink ??
    response.data.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri;

  return {
    eventId: response.data.id,
    meetUrl,
    event: response.data,
  };
}

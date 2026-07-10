import { randomUUID } from "crypto";
import { calendar_v3, google, sheets_v4 } from "googleapis";

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/calendar",
];

type GoogleAuthClient = InstanceType<typeof google.auth.JWT>;
type GoogleSheetsClient = sheets_v4.Sheets;
type GoogleCalendarClient = calendar_v3.Calendar;

let googleAuthClient: GoogleAuthClient | null = null;
let sheetsClient: GoogleSheetsClient | null = null;
let calendarClient: GoogleCalendarClient | null = null;

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

export function getGoogleAuth(): GoogleAuthClient {
  if (!googleAuthClient) {
    googleAuthClient = new google.auth.JWT({
      email: getRequiredEnv("GOOGLE_CLIENT_EMAIL"),
      key: getGooglePrivateKey(),
      scopes: GOOGLE_SCOPES,
    });
  }

  return googleAuthClient;
}

export function getGoogleSheetsClient(): GoogleSheetsClient {
  if (!sheetsClient) {
    sheetsClient = google.sheets({
      version: "v4",
      auth: getGoogleAuth(),
    });
  }

  return sheetsClient;
}

export function getGoogleCalendarClient(): GoogleCalendarClient {
  if (!calendarClient) {
    calendarClient = google.calendar({
      version: "v3",
      auth: getGoogleAuth(),
    });
  }

  return calendarClient;
}

export const googleAuth = new Proxy({} as GoogleAuthClient, {
  get(_target, property, receiver) {
    return Reflect.get(getGoogleAuth(), property, receiver);
  },
});

export const sheets = new Proxy({} as GoogleSheetsClient, {
  get(_target, property, receiver) {
    return Reflect.get(getGoogleSheetsClient(), property, receiver);
  },
});

export const calendar = new Proxy({} as GoogleCalendarClient, {
  get(_target, property, receiver) {
    return Reflect.get(getGoogleCalendarClient(), property, receiver);
  },
});

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
  const calendar = getGoogleCalendarClient();
  const calendarId = getGoogleCalendarId();

  // Query metadata to check allowed solutions
  let supportsMeet = false;
  try {
    const metadata = await calendar.calendars.get({ calendarId });
    const allowedTypes = metadata.data.conferenceProperties?.allowedConferenceSolutionTypes || [];
    supportsMeet = allowedTypes.includes("hangoutsMeet");
  } catch (err) {
    console.warn("Could not retrieve calendar metadata for allowedSolutions check, defaulting to standard event:", err);
  }

  const requestBody: any = {
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
  };

  if (supportsMeet) {
    requestBody.conferenceData = {
      createRequest: {
        requestId: randomUUID(),
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    };
  }

  const response = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: supportsMeet ? 1 : 0,
    sendUpdates: "all",
    requestBody,
  });

  const meetUrl =
    response.data.hangoutLink ??
    response.data.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri;

  return {
    eventId: response.data.id,
    meetUrl: meetUrl || null,
    event: response.data,
  };
}

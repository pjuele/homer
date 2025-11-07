import { google } from "googleapis";
import fs from "fs";
import path from "path";

export interface CalendarEvent {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  color: string;
}

function getAuthClient() {
  let credentials;

  try {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      try {
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      } catch (error) {
        throw new Error(
          `Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON environment variable: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    } else {
      const credentialsPath = path.join(process.cwd(), "homer-calendar-access-creds.json");

      if (!fs.existsSync(credentialsPath)) {
        throw new Error(
          `Credentials file not found at ${credentialsPath}. Please provide either GOOGLE_SERVICE_ACCOUNT_JSON env var or the credentials file.`
        );
      }

      try {
        const fileContent = fs.readFileSync(credentialsPath, "utf-8");
        credentials = JSON.parse(fileContent);
      } catch (error) {
        throw new Error(
          `Failed to read or parse credentials file at ${credentialsPath}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    return auth;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Failed to")) {
      throw error;
    }
    throw new Error(
      `Failed to initialize Google Auth client: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getTodayEvents(): Promise<CalendarEvent[]> {
  const auth = await getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID not set in environment variables");
  }

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const response = await calendar.events.list({
    calendarId,
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = response.data.items || [];

  return events.map((event, index) => ({
    id: event.id || `event-${index}`,
    title: event.summary || "Untitled Event",
    startDateTime: event.start?.dateTime || event.start?.date || "",
    endDateTime: event.end?.dateTime || event.end?.date || "",
    color: getEventColor(index),
  }));
}

export async function getWeekEvents(): Promise<CalendarEvent[]> {
  const auth = await getAuthClient();
  const calendar = google.calendar({ version: "v3", auth });

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID not set in environment variables");
  }

  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

  const response = await calendar.events.list({
    calendarId,
    timeMin: tomorrow.toISOString(),
    timeMax: endOfWeek.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = response.data.items || [];

  return events.map((event, index) => ({
    id: event.id || `event-${index}`,
    title: event.summary || "Untitled Event",
    startDateTime: event.start?.dateTime || event.start?.date || "",
    endDateTime: event.end?.dateTime || event.end?.date || "",
    color: getEventColor(index),
  }));
}

function getEventColor(index: number): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  return colors[index % colors.length];
}

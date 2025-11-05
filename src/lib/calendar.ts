import { google } from "googleapis";
import fs from "fs";
import path from "path";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  day?: string;
  color: string;
}

function getAuthClient() {
  let credentials;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } else {
    const credentialsPath = path.join(process.cwd(), "homer-calendar-access-creds.json");
    credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });

  return auth;
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
    start: formatTime(event.start?.dateTime || event.start?.date || ""),
    end: formatTime(event.end?.dateTime || event.end?.date || ""),
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
    start: formatTime(event.start?.dateTime || event.start?.date || ""),
    end: formatTime(event.end?.dateTime || event.end?.date || ""),
    day: formatDay(event.start?.dateTime || event.start?.date || ""),
    color: getEventColor(index),
  }));
}

function formatTime(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDay(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
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

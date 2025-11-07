import { getTodayEvents, getWeekEvents } from "@/lib/calendar";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const timezone = searchParams.get("timezone");

  if (!timezone) {
    return Response.json({ error: "Missing timezone parameter" }, { status: 400 });
  }

  try {
    if (type === "today") {
      const events = await getTodayEvents(timezone);
      return Response.json(events);
    } else if (type === "week") {
      const events = await getWeekEvents(timezone);
      return Response.json(events);
    } else {
      return Response.json({ error: "Invalid type parameter. Use 'today' or 'week'" }, { status: 400 });
    }
  } catch (error) {
    console.error("Calendar API error:", error);
    return Response.json({ error: "Failed to fetch calendar events" }, { status: 500 });
  }
}

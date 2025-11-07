import { ThemeToggle } from "@/components/theme-toggle";
import { getWeatherData } from "@/lib/weather";
import { getTodayEvents, getWeekEvents } from "@/lib/calendar";
import { WeatherWidget } from "@/components/weather-widget";
import { LogoIcon, LogoText } from "@/components/logo";
import { CalendarEvents } from "@/components/calendar-events";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const latitude = parseFloat(process.env.NEXT_PUBLIC_LATITUDE || "37.7749");
  const longitude = parseFloat(process.env.NEXT_PUBLIC_LONGITUDE || "-122.4194");

  const initialWeather = await getWeatherData(latitude, longitude);

  let todayEvents: Awaited<ReturnType<typeof getTodayEvents>> = [];
  let todayEventsError: string | undefined;
  try {
    todayEvents = await getTodayEvents();
  } catch (error) {
    console.error("Failed to load today's events:", error);
    todayEventsError = error instanceof Error ? error.message : "Unknown error";
  }

  let weekEvents: Awaited<ReturnType<typeof getWeekEvents>> = [];
  let weekEventsError: string | undefined;
  try {
    weekEvents = await getWeekEvents();
  } catch (error) {
    console.error("Failed to load week events:", error);
    weekEventsError = error instanceof Error ? error.message : "Unknown error";
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <LogoIcon className="h-12 w-12" />
              <LogoText className="h-8" />
            </div>
            <p className="text-muted-foreground mt-2">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <ThemeToggle />
        </div>

        <WeatherWidget initialWeather={initialWeather} />

        <CalendarEvents
          todayEvents={todayEvents}
          todayEventsError={todayEventsError}
          weekEvents={weekEvents}
          weekEventsError={weekEventsError}
        />
      </div>
    </div>
  );
}

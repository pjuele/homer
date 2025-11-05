import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeatherData } from "@/lib/weather";
import { getTodayEvents, getWeekEvents } from "@/lib/calendar";
import { WeatherWidget } from "@/components/weather-widget";
import { LogoIcon, LogoText } from "@/components/logo";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const latitude = parseFloat(process.env.NEXT_PUBLIC_LATITUDE || "37.7749");
  const longitude = parseFloat(process.env.NEXT_PUBLIC_LONGITUDE || "-122.4194");

  const initialWeather = await getWeatherData(latitude, longitude);
  const todayEvents = await getTodayEvents();
  const weekEvents = await getWeekEvents();

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

        <div className="grid gap-8 md:grid-cols-2">
          {/* Today's Events */}
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3">
                    <div className={`h-10 w-1 rounded ${event.color}`} />
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.start} - {event.end}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Week Events */}
          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weekEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3">
                    <div className={`h-10 w-1 rounded ${event.color}`} />
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.day} • {event.start} - {event.end}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

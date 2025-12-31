"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { WeatherWidget } from "@/components/weather-widget";
import { LogoIcon, LogoText } from "@/components/logo";
import { CalendarEvents } from "@/components/calendar-events";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

function formatLastUpdated(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function Home() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const weatherRef = useRef<{ refresh: () => Promise<void> }>(null);
  const calendarRef = useRef<{ refresh: () => Promise<void> }>(null);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    await Promise.all([
      weatherRef.current?.refresh(),
      calendarRef.current?.refresh()
    ]);
    setIsRefreshing(false);
  }, []);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(handleRefresh, 600000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

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
            <div className="flex items-center gap-3 mt-2">
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <span className="text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">
                Updated at {formatLastUpdated(lastUpdated)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh all data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <WeatherWidget ref={weatherRef} />

        <CalendarEvents ref={calendarRef} />
      </div>
    </div>
  );
}

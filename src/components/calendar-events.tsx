"use client";

import { useState, useEffect } from "react";
import { CalendarEvent } from "@/lib/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarEventsProps {
  todayEvents: CalendarEvent[];
  todayEventsError?: string;
  weekEvents: CalendarEvent[];
  weekEventsError?: string;
}

function formatTime(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDay(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

interface CalendarCardProps {
  title: string;
  error?: string;
  events: CalendarEvent[];
  showDay?: boolean;
  loading?: boolean;
}

function CalendarCard({ title, error, events, showDay, loading }: CalendarCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="text-sm text-muted-foreground">
            Could not load events at this time.
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-center gap-3">
                <div className={`h-10 w-1 rounded ${event.color}`} />
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {showDay && `${formatDay(event.startDateTime)} • `}
                    {formatTime(event.startDateTime)} -{" "}
                    {formatTime(event.endDateTime)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CalendarEvents({
  todayEvents,
  todayEventsError,
  weekEvents,
  weekEventsError,
}: CalendarEventsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <CalendarCard
        title="Today's Schedule"
        error={todayEventsError}
        events={todayEvents}
        loading={!mounted}
      />
      <CalendarCard
        title="This Week"
        error={weekEventsError}
        events={weekEvents}
        showDay={true}
        loading={!mounted}
      />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { CalendarEvent } from "@/lib/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface CalendarEventsRef {
  refresh: () => Promise<void>;
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

export const CalendarEvents = forwardRef<CalendarEventsRef, object>(function CalendarEvents(props, ref) {
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  const [weekEvents, setWeekEvents] = useState<CalendarEvent[]>([]);
  const [todayError, setTodayError] = useState<string>();
  const [weekError, setWeekError] = useState<string>();
  const [loading, setLoading] = useState(true);

  const fetchCalendarData = useCallback(async () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      const [todayRes, weekRes] = await Promise.all([
        fetch(`/api/calendar?type=today&timezone=${encodeURIComponent(timezone)}`),
        fetch(`/api/calendar?type=week&timezone=${encodeURIComponent(timezone)}`),
      ]);

      if (todayRes.ok) {
        const data: CalendarEvent[] = await todayRes.json();
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const filteredEvents = data.filter((event) => {
          const eventStart = new Date(event.startDateTime);
          return eventStart > oneHourAgo;
        });
        setTodayEvents(filteredEvents);
        setTodayError(undefined);
      } else {
        setTodayError("Failed to load today's events");
      }

      if (weekRes.ok) {
        const data: CalendarEvent[] = await weekRes.json();
        setWeekEvents(data);
        setWeekError(undefined);
      } else {
        setWeekError("Failed to load week events");
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      setTodayError("Failed to load today's events");
      setWeekError("Failed to load week events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      await fetchCalendarData();
    }
  }), [fetchCalendarData]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <CalendarCard
        title="Today's Schedule"
        error={todayError}
        events={todayEvents}
        loading={loading}
      />
      <CalendarCard
        title="This Week"
        error={weekError}
        events={weekEvents}
        showDay={true}
        loading={loading}
      />
    </div>
  );
});

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLocation, type Location } from "@/lib/location";
import type { WeatherData } from "@/lib/weather";

interface WeatherWidgetProps {
  initialWeather: WeatherData;
}

export function WeatherWidget({ initialWeather }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData>(initialWeather);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");

  async function fetchWeather(loc: Location, tempUnit: "celsius" | "fahrenheit") {
    const response = await fetch(
      `/api/weather?lat=${loc.latitude}&lon=${loc.longitude}&unit=${tempUnit}`
    );
    if (response.ok) {
      const data = await response.json();
      setWeather(data);
    }
  }

  useEffect(() => {
    async function fetchWeatherForLocation() {
      setLoading(true);
      try {
        const loc = await getLocation();
        setLocation(loc);
        await fetchWeather(loc, unit);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherForLocation();
  }, []);

  const toggleUnit = async () => {
    const newUnit = unit === "celsius" ? "fahrenheit" : "celsius";
    setUnit(newUnit);
    if (location) {
      await fetchWeather(location, newUnit);
    }
  };

  const unitSymbol = unit === "celsius" ? "°C" : "°F";

  return (
    <>
      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Current Weather</span>
              {location?.city && (
                <span className="text-base font-normal text-muted-foreground">
                  - {location.city}{location.country && `, ${location.country}`}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {location && (
                <span className="text-xs font-normal text-muted-foreground">
                  {location.source === "geolocation" && "📍 Your location"}
                  {location.source === "ip" && "🌐 IP location"}
                  {location.source === "env" && "📌 Default location"}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={toggleUnit}>
                {unit === "celsius" ? "°C" : "°F"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading weather...</div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-6xl">{weather.current.icon}</span>
                <div>
                  <div className="text-5xl font-bold">{weather.current.temp}{unitSymbol}</div>
                  <div className="text-xl text-muted-foreground">
                    {weather.current.condition}
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm text-muted-foreground">
                  H: {weather.daily[0].high}° L: {weather.daily[0].low}°
                </div>
                <div className="text-sm text-muted-foreground">
                  Humidity: {weather.current.humidity}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Wind: {weather.current.windSpeed} mph
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weather.daily.map((day) => (
              <div
                key={day.date}
                className="flex flex-col items-center space-y-2 rounded-lg border p-4"
              >
                <div className="font-semibold">{day.day}</div>
                <div className="text-3xl">{day.icon}</div>
                <div className="text-sm font-medium">{day.high}°</div>
                <div className="text-sm text-muted-foreground">{day.low}°</div>
                <div className="text-xs text-center text-muted-foreground">
                  {day.condition}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

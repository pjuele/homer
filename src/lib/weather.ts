export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  daily: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

const WEATHER_CODE_MAP: Record<number, { condition: string; icon: string }> = {
  0: { condition: "Clear", icon: "☀️" },
  1: { condition: "Mainly Clear", icon: "🌤️" },
  2: { condition: "Partly Cloudy", icon: "⛅" },
  3: { condition: "Overcast", icon: "☁️" },
  45: { condition: "Foggy", icon: "🌫️" },
  48: { condition: "Foggy", icon: "🌫️" },
  51: { condition: "Light Drizzle", icon: "🌦️" },
  53: { condition: "Drizzle", icon: "🌦️" },
  55: { condition: "Heavy Drizzle", icon: "🌦️" },
  61: { condition: "Light Rain", icon: "🌧️" },
  63: { condition: "Rain", icon: "🌧️" },
  65: { condition: "Heavy Rain", icon: "🌧️" },
  71: { condition: "Light Snow", icon: "🌨️" },
  73: { condition: "Snow", icon: "❄️" },
  75: { condition: "Heavy Snow", icon: "❄️" },
  77: { condition: "Snow Grains", icon: "🌨️" },
  80: { condition: "Light Showers", icon: "🌦️" },
  81: { condition: "Showers", icon: "🌧️" },
  82: { condition: "Heavy Showers", icon: "🌧️" },
  85: { condition: "Light Snow Showers", icon: "🌨️" },
  86: { condition: "Snow Showers", icon: "❄️" },
  95: { condition: "Thunderstorm", icon: "⛈️" },
  96: { condition: "Thunderstorm with Hail", icon: "⛈️" },
  99: { condition: "Thunderstorm with Hail", icon: "⛈️" },
};

function getWeatherInfo(code: number): { condition: string; icon: string } {
  return WEATHER_CODE_MAP[code] || { condition: "Unknown", icon: "❓" };
}

function getDayName(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export async function getWeatherData(
  latitude: number,
  longitude: number,
  unit: "celsius" | "fahrenheit" = "celsius"
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=${unit}&wind_speed_unit=mph&timezone=auto`;

  const response = await fetch(url, {
    next: { revalidate: 1800 }, // Cache for 30 minutes
  });

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  const currentWeatherInfo = getWeatherInfo(data.current.weather_code);

  return {
    current: {
      temp: Math.round(data.current.temperature_2m),
      condition: currentWeatherInfo.condition,
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      icon: currentWeatherInfo.icon,
    },
    daily: data.daily.time.slice(1, 8).map((date: string, index: number) => {
      const actualIndex = index + 1;
      const weatherInfo = getWeatherInfo(data.daily.weather_code[actualIndex]);
      return {
        date,
        day: getDayName(date),
        high: Math.round(data.daily.temperature_2m_max[actualIndex]),
        low: Math.round(data.daily.temperature_2m_min[actualIndex]),
        condition: weatherInfo.condition,
        icon: weatherInfo.icon,
      };
    }),
  };
}

export interface WeatherDay {
  date: string;
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  day: string;
  color: string;
}

export const currentWeather = {
  temp: 72,
  condition: "Partly Cloudy",
  high: 75,
  low: 62,
  humidity: 65,
  wind: 8,
  icon: "🌤️",
};

export const weeklyForecast: WeatherDay[] = [
  { date: "2025-11-04", day: "Mon", high: 75, low: 62, condition: "Partly Cloudy", icon: "🌤️" },
  { date: "2025-11-05", day: "Tue", high: 73, low: 60, condition: "Sunny", icon: "☀️" },
  { date: "2025-11-06", day: "Wed", high: 68, low: 58, condition: "Cloudy", icon: "☁️" },
  { date: "2025-11-07", day: "Thu", high: 70, low: 59, condition: "Rain", icon: "🌧️" },
  { date: "2025-11-08", day: "Fri", high: 72, low: 61, condition: "Partly Cloudy", icon: "🌤️" },
  { date: "2025-11-09", day: "Sat", high: 76, low: 63, condition: "Sunny", icon: "☀️" },
  { date: "2025-11-10", day: "Sun", high: 74, low: 62, condition: "Sunny", icon: "☀️" },
];

export const todayEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    start: "09:00",
    end: "09:30",
    day: "Today",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "Design Review",
    start: "11:00",
    end: "12:00",
    day: "Today",
    color: "bg-purple-500",
  },
  {
    id: "3",
    title: "Lunch with Client",
    start: "13:00",
    end: "14:00",
    day: "Today",
    color: "bg-green-500",
  },
  {
    id: "4",
    title: "Code Review",
    start: "15:00",
    end: "16:00",
    day: "Today",
    color: "bg-orange-500",
  },
];

export const weekEvents: CalendarEvent[] = [
  {
    id: "5",
    title: "Project Planning",
    start: "10:00",
    end: "11:30",
    day: "Tomorrow",
    color: "bg-indigo-500",
  },
  {
    id: "6",
    title: "1:1 with Manager",
    start: "14:00",
    end: "14:30",
    day: "Tomorrow",
    color: "bg-pink-500",
  },
  {
    id: "7",
    title: "Sprint Review",
    start: "09:00",
    end: "10:00",
    day: "Wed",
    color: "bg-blue-500",
  },
  {
    id: "8",
    title: "Client Demo",
    start: "15:00",
    end: "16:00",
    day: "Thu",
    color: "bg-red-500",
  },
  {
    id: "9",
    title: "Team Retro",
    start: "16:00",
    end: "17:00",
    day: "Fri",
    color: "bg-yellow-500",
  },
];

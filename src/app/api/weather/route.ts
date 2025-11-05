import { getWeatherData } from "@/lib/weather";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const unit = searchParams.get("unit") as "celsius" | "fahrenheit" | null;

  if (!lat || !lon) {
    return Response.json({ error: "Missing latitude or longitude" }, { status: 400 });
  }

  try {
    const weather = await getWeatherData(parseFloat(lat), parseFloat(lon), unit || "celsius");
    return Response.json(weather);
  } catch (error) {
    console.error("Weather API error:", error);
    return Response.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}

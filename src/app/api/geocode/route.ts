import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return Response.json({ error: "Missing latitude or longitude" }, { status: 400 });
  }

  try {
    const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const geoResponse = await fetch(reverseGeoUrl, {
      headers: {
        "User-Agent": "KitchenDashboard/1.0",
      },
    });

    if (!geoResponse.ok) {
      throw new Error("Geocoding failed");
    }

    const geoData = await geoResponse.json();
    const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county;
    const country = geoData.address?.country;

    return Response.json({ city, country });
  } catch (error) {
    console.error("Geocode API error:", error);
    return Response.json({ error: "Failed to reverse geocode" }, { status: 500 });
  }
}

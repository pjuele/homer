const IP_GEOLOCATION_FALLBACK_URL = "https://ipapi.co/json/";

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  source: "geolocation" | "ip" | "env";
}

export async function getLocation(): Promise<Location> {
  // Try browser geolocation first
  if (typeof window !== "undefined" && "geolocation" in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 300000, // Cache for 5 minutes
        });
      });

      // Reverse geocode to get city name using Nominatim (OpenStreetMap)
      let city: string | undefined;
      let country: string | undefined;
      try {
        const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
        const geoResponse = await fetch(reverseGeoUrl, {
          headers: {
            'User-Agent': 'KitchenDashboard/1.0'
          }
        });
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          city = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county;
          country = geoData.address?.country;
        }
      } catch (e) {
        console.log("Failed to reverse geocode:", e);
      }

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        city,
        country,
        source: "geolocation",
      };
    } catch (error) {
      console.log("Geolocation failed, trying IP-based location:", error);
    }
  }

  // Fallback to IP-based geolocation
  try {
    const response = await fetch(IP_GEOLOCATION_FALLBACK_URL);
    if (response.ok) {
      const data = await response.json();
      if (data.latitude && data.longitude) {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          country: data.country_name,
          source: "ip",
        };
      }
    }
  } catch (error) {
    console.log("IP-based geolocation failed:", error);
  }

  // Final fallback to env variables
  return {
    latitude: parseFloat(process.env.NEXT_PUBLIC_LATITUDE || "37.7749"),
    longitude: parseFloat(process.env.NEXT_PUBLIC_LONGITUDE || "-122.4194"),
    city: "San Francisco",
    country: "USA",
    source: "env",
  };
}

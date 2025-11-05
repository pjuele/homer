# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Homer is a kitchen tablet PWA (Progressive Web App) displaying:
- Real-time weather with 7-day forecast (Open-Meteo API)
- Google Calendar events (currently mock data)

**Stack:** Next.js 16.0.1 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, next-themes

## Development Commands

```bash
# Start development server (requires --webpack flag)
npm run dev

# Production build (requires --webpack flag)
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Note: `--webpack` flag is required due to Tailwind v4 compatibility.

## Architecture Patterns

### Server + Client Component Split

Weather functionality uses a hybrid architecture:

1. **Server Component** ([src/app/page.tsx](src/app/page.tsx))
   - Fetches initial weather data server-side using env var coordinates
   - Passes data as `initialWeather` prop to client component
   - Provides fast initial render

2. **Client Component** ([src/components/weather-widget.tsx](src/components/weather-widget.tsx))
   - On mount: detects user location via 3-tier fallback system
   - Re-fetches weather for detected location
   - Handles temperature unit toggle (°C ↔ °F)

### 3-Tier Location Detection

Implemented in [src/lib/location.ts](src/lib/location.ts):

1. **Browser Geolocation API** (primary)
   - Requests permission for precise GPS/Wi-Fi location
   - Reverse geocodes via Nominatim (OpenStreetMap) for city/country
   - Shows "📍 Your location"

2. **IP Geolocation** (fallback)
   - Uses ipapi.co (no API key required)
   - Shows "🌐 IP location"

3. **Environment Variables** (final fallback)
   - `NEXT_PUBLIC_LATITUDE` / `NEXT_PUBLIC_LONGITUDE` from `.env.local`
   - Shows "📌 Default location"

**Rationale:** Device may travel or be used by different people.

### Weather Data Flow

1. Server fetches initial weather → [src/lib/weather.ts](src/lib/weather.ts) `getWeatherData()`
2. Client detects location → [src/lib/location.ts](src/lib/location.ts) `getLocation()`
3. Client re-fetches via API route → [src/app/api/weather/route.ts](src/app/api/weather/route.ts)
4. API route calls `getWeatherData()` with user's coordinates and unit preference

**Caching:** Server-side weather cached 30 minutes (`revalidate: 1800`). Client geolocation cached 5 minutes (`maximumAge: 300000`).

## Environment Configuration

Required file: `.env.local`

```bash
# Default fallback location coordinates (used when geolocation fails)
NEXT_PUBLIC_LATITUDE=37.7749
NEXT_PUBLIC_LONGITUDE=-122.4194
```

Change these to set the default tablet location.

## External APIs Used

| Service | Purpose | Auth | Rate Limit | Notes |
|---------|---------|------|------------|-------|
| [Open-Meteo](https://open-meteo.com/) | Weather data | None | 10k/day | Free, no API key, non-commercial |
| [Nominatim](https://nominatim.org/) | Reverse geocoding | None | 1 req/sec | Free, requires User-Agent header |
| [ipapi.co](https://ipapi.co/) | IP geolocation | None | Fair use | Free tier, no key |

**Avoided alternatives:**
- OpenWeatherMap (requires credit card)
- geocode.maps.co (requires API key)

## Path Aliases

TypeScript path mapping configured in [tsconfig.json](tsconfig.json):

```typescript
"@/*" → "./src/*"
```

Example: `import { getWeatherData } from "@/lib/weather"`

## Temperature Units

**Default: Celsius** (user preference: "we're not dumb")

Toggle button switches between °C and °F, triggering API refetch with appropriate unit parameter.

## Known Limitations

- Calendar events are mock data (needs Google Calendar API integration)
- No PWA manifest or service worker yet (not installable as PWA)
- Location name display recently switched to Nominatim (test after restart)

## Project History

Originally attempted React Native/Expo (rejected due to deprecated dependencies) and Capacitor + Next.js (rejected due to 1-5 sec performance delays). Chose PWA for better performance, instant updates, and no app store friction.

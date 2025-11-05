# Homer - Kitchen Dashboard PWA Checkpoint

**Date:** 2025-11-04
**Session Duration:** ~2.5 hours
**Project:** Kitchen tablet app showing weather and calendar

---

## Project Overview

Building a PWA (Progressive Web App) for a kitchen tablet to display:
- Local weather forecast (current + 7-day)
- Google Calendar appointments (today + week)

**Tech Stack:**
- Next.js 16.0.1 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Open-Meteo API (weather)

---

## Key Decisions Made

### 1. **Abandoned React Native/Expo Approach**
- Initially tried to create React Native app with Expo
- Expo SDK 54 ships with deprecated npm packages (glob@7.2.3, rimraf@3.0.2, inflight@1.0.6)
- Expo team confirmed these are expected (subdependencies of Jest/React Native)
- **Decision:** Rejected Expo due to deprecation warnings on fresh install
- Considered Capacitor + Next.js but research showed severe performance issues (1-5 sec delays)
- **Final Decision:** Build as PWA instead - better performance, no app store hassle, instant updates

### 2. **Weather API Choice**
- Rejected OpenWeatherMap (requires credit card, pay-if-over-limit model)
- **Chose Open-Meteo:**
  - Truly free (no credit card)
  - No API key required
  - 10,000 calls/day limit
  - Non-commercial use
  - 7-day forecast
  - https://open-meteo.com/

### 3. **Location Detection Strategy**
- **3-tier fallback system:**
  1. Browser Geolocation API (asks permission) → shows "📍 Your location"
  2. IP-based geolocation via ipapi.co → shows "🌐 IP location"
  3. Environment variables (.env.local) → shows "📌 Default location"
- Reverse geocoding via Nominatim (OpenStreetMap) - free, no API key
- **Rationale:** Device may travel or be used by different people

### 4. **Temperature Units**
- **Default: Celsius** (user explicitly stated "we're not dumb")
- Toggle button to switch between °C and °F
- Weather API called with appropriate unit parameter

---

## Current Project State

### Working Features
✅ Next.js app created with TypeScript, Tailwind, App Router
✅ shadcn/ui installed and configured
✅ Light/dark theme support with toggle (next-themes)
✅ Real weather data from Open-Meteo API
✅ Current weather display with icon, temp, conditions, humidity, wind
✅ 7-day forecast display
✅ Location detection (geolocation → IP → env fallback)
✅ Celsius/Fahrenheit toggle
✅ Weather data cached for 30 minutes

### Mock Data (Not Yet Real)
⚠️ Calendar events are still mock data
⚠️ Location name display (city/country) implemented but needs testing

### Known Issues
1. **Location name not showing:** Reverse geocoding recently switched from geocode.maps.co (requires API key) to Nominatim (free). Needs restart and testing.

---

## File Structure

```
/Users/pjuele/Repos/github.com/pjuele/homer/
├── .env.local                          # Default location coordinates
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout with ThemeProvider
│   │   ├── page.tsx                    # Main dashboard page
│   │   └── api/
│   │       └── weather/
│   │           └── route.ts            # Weather API endpoint
│   ├── components/
│   │   ├── theme-provider.tsx          # next-themes wrapper
│   │   ├── theme-toggle.tsx            # Theme toggle dropdown
│   │   ├── weather-widget.tsx          # Client component for weather with location detection
│   │   └── ui/                         # shadcn components
│   └── lib/
│       ├── constants.ts                # Temperature unit constants
│       ├── location.ts                 # Location detection logic
│       ├── mock-data.ts                # Mock calendar events
│       ├── weather.ts                  # Weather API integration
│       └── utils.ts                    # shadcn utils
```

---

## Environment Configuration

**File:** `.env.local`
```bash
# Default fallback location (San Francisco)
NEXT_PUBLIC_LATITUDE=37.7749
NEXT_PUBLIC_LONGITUDE=-122.4194
```

Change these to set default location for the tablet.

---

## User Preferences & Communication Style

### Critical Rules
1. **NO FLUFF:** State facts directly, no elaborate explanations when blocked
2. **NO SPECULATION:** Check actual docs/changelogs instead of guessing
3. **VERIFY LOCATION:** Always check `pwd` before file operations
4. **NO ASSUMPTIONS:** Ask for clarification on ambiguous instructions
5. **IMMEDIATE ACTION:** Don't ask unnecessary questions - just do obvious things
6. **NO WATERMARKS:** Never add "🤖 Generated with Claude Code" to commits

### Temperature
- User has LOW tolerance for mistakes
- Frustrated by wasted time (2.5hrs on failed Expo approach)
- Values directness and efficiency
- Expects competence and accuracy

### Code Standards
- Separate logic changes from formatting (use eslint --fix separately)
- Use constants for string literals (lib/constants.ts)
- DRY principle is top priority
- Always read files before editing

---

## Next Steps

### Immediate (Not Started)
1. **Test location name display** - Restart dev server, verify city/country shows
2. **Integrate Google Calendar API** - Replace mock calendar data with real events
3. **PWA Configuration** - Add manifest.json and service worker
4. **Install on tablet** - Test PWA installation flow

### Future Enhancements
- Auto-refresh weather (currently cached 30 min)
- Calendar event colors/categories
- Responsive design for different tablet sizes
- Offline support

---

## Warnings & Lessons Learned

### What NOT to Do
❌ Don't use Expo SDK 54 - has deprecated dependency warnings
❌ Don't use Capacitor + Next.js - severe performance issues
❌ Don't use OpenWeatherMap - requires credit card
❌ Don't use geocode.maps.co - requires API key
❌ Don't assume location is static - implement detection
❌ Don't default to Fahrenheit - use Celsius

### What Works
✅ Open-Meteo API - truly free, no key, reliable
✅ Nominatim reverse geocoding - free, no key
✅ ipapi.co for IP geolocation - free, no key
✅ Next.js PWA approach - better than native wrappers
✅ 3-tier location fallback - covers all scenarios

---

## Development Commands

```bash
# Start dev server (from /Users/pjuele/Repos/github.com/pjuele/homer)
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

---

## API Services Used

| Service | Purpose | Auth | Limits |
|---------|---------|------|--------|
| Open-Meteo | Weather data | None | 10k/day |
| Nominatim | Reverse geocoding | None | 1 req/sec |
| ipapi.co | IP geolocation | None | Fair use |

---

## Technical Notes

- Next.js App Router requires async Server Components
- Weather widget is Client Component (uses hooks)
- Server Component fetches initial weather, Client Component handles location detection
- Temperature unit changes re-fetch from API with new unit parameter
- All geolocation errors fail silently with fallback to next tier

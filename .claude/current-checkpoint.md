# Homer - Kitchen Dashboard PWA Checkpoint

**Date:** 2025-11-04 (Updated)
**Session:** Vercel deployment fixes + Logo viewBox correction
**Project:** Kitchen tablet PWA showing weather and calendar

---

## Project Overview

Building a PWA for kitchen tablet displaying:
- Live weather forecast (current + 7-day) via Open-Meteo
- Google Calendar events (today + upcoming week)
- Auto-detecting location with 3-tier fallback
- Light/dark theme support

**Tech Stack:**
- Next.js 16.0.1 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Open-Meteo API (weather)
- Google Calendar API (events via service account)

---

## Current Project State

### Completed This Session
✅ Fixed logo SVG viewBox issues (LogoIcon: `0 0 106.67 106.67`, LogoText: `0 0 256.2 88.28`)
✅ Created SVG favicon from logo icon
✅ Fixed Vercel deployment build failures:
  - Added `GOOGLE_SERVICE_ACCOUNT_JSON` env var support in calendar.ts
  - Added `export const dynamic = 'force-dynamic'` to page.tsx
✅ Updated app metadata (title: "homer", description, favicon)

### Working Features
✅ Weather data from Open-Meteo (current + 7-day forecast)
✅ Location detection (GPS → IP → env fallback)
✅ Reverse geocoding via API route (no CORS)
✅ °C/°F temperature toggle
✅ Theme toggle (light/dark)
✅ Real Google Calendar events (today + week)
✅ Logo display (icon + text components with correct viewBox)
✅ SVG favicon

### Deployment Status
✅ Calendar credentials: Environment variable support added
✅ Build optimization: Disabled static generation to prevent API timeouts
⏳ Pending: User to push changes and verify Vercel build succeeds

---

## Vercel Deployment Setup

### Environment Variables Required
In Vercel project settings → Environment Variables:

1. **GOOGLE_SERVICE_ACCOUNT_JSON**
   - Value: Full JSON contents of `homer-calendar-access-creds.json`
   - Enabled for: Production, Preview, Development

2. **GOOGLE_CALENDAR_ID**
   - Value: User's actual calendar ID (e.g., `user@gmail.com`)
   - Enabled for: Production, Preview, Development

3. **NEXT_PUBLIC_LATITUDE** (optional, has default)
   - Value: Default latitude for fallback location

4. **NEXT_PUBLIC_LONGITUDE** (optional, has default)
   - Value: Default longitude for fallback location

### Build Configuration
- Page rendering: Dynamic (forced via `export const dynamic = 'force-dynamic'`)
- Reason: Prevents Next.js from attempting static generation during build, which would timeout calling weather/calendar APIs

---

## Google Calendar Integration

### Setup Required
1. Google Cloud project with Calendar API enabled
2. Service account created with JSON key downloaded
3. Key file: `homer-calendar-access-creds.json` (local dev only, gitignored)
4. Calendar shared with service account email
5. Environment variables set (see above)

### Implementation
- **Library:** `googleapis` package
- **Auth:** Service account (no OAuth, no user interaction)
- **Files:**
  - `src/lib/calendar.ts` - `getTodayEvents()`, `getWeekEvents()`, supports env var credentials
  - `src/app/api/calendar/route.ts` - API endpoint (not currently used)
  - `src/app/page.tsx` - Server-side fetches events

### Important Notes
- Calendar ID must be actual calendar ID from Google Calendar settings, NOT service account email
- Service account must have "See all event details" permission on shared calendar
- Credentials read from `GOOGLE_SERVICE_ACCOUNT_JSON` env var (Vercel) or local file (dev)
- Events fetched server-side on each page load (no caching yet)

---

## File Structure

```
/Users/pjuele/Repos/github.com/pjuele/homer/
├── .env.local                          # Location coords + Calendar ID (local dev)
├── homer-calendar-access-creds.json    # Service account key (GITIGNORED, local dev only)
├── public/
│   └── favicon.svg                     # SVG favicon from logo icon
├── CLAUDE.md                           # Guide for future Claude instances
├── README.md                           # Project overview
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout with ThemeProvider, metadata
│   │   ├── page.tsx                    # Main dashboard (force-dynamic)
│   │   └── api/
│   │       ├── weather/route.ts        # Weather API proxy
│   │       ├── calendar/route.ts       # Calendar API endpoint
│   │       └── geocode/route.ts        # Nominatim proxy (CORS fix)
│   ├── components/
│   │   ├── logo.tsx                    # LogoIcon + LogoText (correct viewBox)
│   │   ├── theme-provider.tsx          # next-themes wrapper
│   │   ├── theme-toggle.tsx            # Theme toggle dropdown
│   │   ├── weather-widget.tsx          # Weather display with location
│   │   └── ui/                         # shadcn components
│   └── lib/
│       ├── calendar.ts                 # Google Calendar integration
│       ├── constants.ts                # String constants
│       ├── location.ts                 # 3-tier location detection
│       ├── weather.ts                  # Open-Meteo integration
│       └── utils.ts                    # shadcn utils
```

---

## Environment Configuration

**File:** `.env.local` (local development)
```bash
# Location fallback
NEXT_PUBLIC_LATITUDE=49.034253508697184
NEXT_PUBLIC_LONGITUDE=-123.0680740796871

# Google Calendar (actual calendar ID, not service account email)
GOOGLE_CALENDAR_ID=user@gmail.com
```

**Note:** For Vercel deployment, also add `GOOGLE_SERVICE_ACCOUNT_JSON` with full JSON credentials.

---

## User Preferences & Communication Style

### CRITICAL Rules (User has ZERO tolerance for BS)
1. **NO FLUFF** - State facts, don't elaborate when blocked
2. **NO SPECULATION** - Check docs/changelogs, don't guess
3. **NO FALSE CLAIMS** - Don't say something is fixed unless it actually is
4. **NO ASKING FOR INFO YOU CAN CHECK** - Use tools to verify file existence, etc.
5. **NO WATERMARKS** - Never add "Generated with Claude Code" to commits
6. **NEVER LEAVE LINT/BUILD ERRORS** - Always fix immediately
7. **ASK WHEN UNCLEAR** - Don't make assumptions on ambiguous instructions
8. **EXPLAIN PROPERLY** - When user challenges your explanation, provide clear technical details

### User Temperament
- **Extremely low tolerance for mistakes**
- **Expects technical competence**
- **Values directness and efficiency**
- **Gets frustrated by wasted time**
- **Will call out bullshit immediately**
- **Challenges explanations when they seem unclear - this is to GET convinced, not to shut down discussion**

### Code Standards
- Use constants for string literals (DRY principle top priority)
- Separate logic changes from formatting
- Always read files before editing
- Fix all lint/build errors before claiming done

---

## Critical Lessons from This Session

### What Went Right
✅ **Fixed logo viewBox properly** - Used original SVG to calculate correct viewBox values
✅ **Explained Next.js build behavior clearly after being challenged** - User accepted explanation after proper detail
✅ **Fixed Vercel deployment issues systematically** - Environment variables + dynamic rendering
✅ **Created favicon from logo** - Clean SVG implementation

### What User Hates
- Saying things are fixed when they're not
- Asking for info that can be checked with tools
- Speculation instead of checking facts
- Unclear or parrot-like explanations that don't add understanding
- Verbose explanations when blocked
- Bullshitting instead of admitting uncertainty

### What Works
✅ Immediate action without asking unnecessary questions
✅ Admitting when stuck instead of making excuses
✅ Checking tools/docs before speculating
✅ Being concise and direct
✅ Explaining technical details clearly when challenged
✅ Fixing issues completely, not halfway

---

## API Services

| Service | Purpose | Auth | Limits | Notes |
|---------|---------|------|--------|-------|
| Open-Meteo | Weather | None | 10k/day | Free, no key |
| Nominatim | Reverse geocode | None | 1 req/sec | Via API proxy (CORS) |
| ipapi.co | IP geolocation | None | Fair use | Free tier |
| Google Calendar | Calendar events | Service account | N/A | Share calendar with SA |

---

## Development Commands

```bash
# Dev server
npm run dev

# Build
npm run build

# Lint
npm run lint
```

---

## Next Steps

### Immediate
1. ⏳ **User to push changes to GitHub**
2. ⏳ **Verify Vercel build succeeds**

### Future Enhancements
- Add PWA manifest and service worker for installability
- Test installation on tablet
- Consider caching for calendar events
- Add auto-refresh for weather data
- Add loading states for initial data fetch

---

## Technical Notes

### Rendering Strategy
- **Page rendering:** Dynamic (forced via `export const dynamic = 'force-dynamic'`)
- **Why:** Next.js App Router attempts static optimization during build by default. With async data fetching (weather + calendar), it would try to call external APIs during build, which times out. Force-dynamic disables this optimization, ensuring data is fetched fresh on each request.

### Data Fetching
- Weather cached 30min server-side (revalidate: 1800)
- Geolocation cached 5min client-side
- Calendar fetched fresh on each page load (no caching yet)

### CORS Handling
- Nominatim calls must go through API route to avoid CORS

### Authentication
- Calendar uses service account - no OAuth flow needed
- Credentials from env var (production) or local file (dev)

### Styling
- Logo components use `currentColor` for text to inherit theme color
- Temperature unit toggle re-fetches from API with new parameter
- LogoIcon viewBox: `0 0 106.67 106.67` (square)
- LogoText viewBox: `0 0 256.2 88.28` (proper text bounds)

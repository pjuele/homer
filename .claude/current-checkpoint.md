# Homer - Kitchen Dashboard PWA Checkpoint

**Date:** 2025-11-04 (Updated)
**Session:** Logo implementation + Google Calendar integration
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

## Current Project State (Updated)

### Completed This Session
✅ Google Calendar API integration with service account
✅ Real calendar events replacing mock data
✅ Logo components (LogoIcon + LogoText separated)
✅ Fixed CORS issues with Nominatim (proxy via API route)
✅ Fixed ESLint warning (useEffect dependencies)
✅ CLAUDE.md created for future sessions
✅ README.md updated
✅ Service account credentials gitignored

### Working Features
✅ Weather data from Open-Meteo (current + 7-day forecast)
✅ Location detection (GPS → IP → env fallback)
✅ Reverse geocoding via API route (no CORS)
✅ °C/°F temperature toggle
✅ Theme toggle (light/dark)
✅ **Real Google Calendar events** (today + week)
✅ Logo display (icon + text components)

### Known Issues
⚠️ **Logo SVG viewBox issues** - User reports logos not displaying properly, truncation issues. Attempted fixes to viewBox not working. THIS IS CRITICAL - DO NOT CLAIM IT'S FIXED UNTIL USER CONFIRMS.

---

## Google Calendar Integration Details

### Setup Required
1. Google Cloud project with Calendar API enabled
2. Service account created with JSON key downloaded
3. Key file: `homer-calendar-access-creds.json` (in project root, gitignored)
4. Calendar shared with service account email
5. `GOOGLE_CALENDAR_ID` in `.env.local` (user's actual calendar ID, NOT service account email)

### Implementation
- **Library:** `googleapis` package
- **Auth:** Service account (no OAuth, no user interaction)
- **Files:**
  - `src/lib/calendar.ts` - `getTodayEvents()`, `getWeekEvents()`
  - `src/app/api/calendar/route.ts` - API endpoint (not currently used)
  - `src/app/page.tsx` - Server-side fetches events

### Important Notes
- Calendar ID must be the actual calendar ID from Google Calendar settings, NOT the service account email
- Service account must have "See all event details" permission on the shared calendar
- Events fetched server-side on each page load (no caching yet)

---

## File Structure (Updated)

```
/Users/pjuele/Repos/github.com/pjuele/homer/
├── .env.local                          # Location coords + Calendar ID
├── homer-calendar-access-creds.json    # Service account key (GITIGNORED)
├── CLAUDE.md                           # Guide for future Claude instances
├── README.md                           # Project overview
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout with ThemeProvider
│   │   ├── page.tsx                    # Main dashboard (weather + calendar)
│   │   └── api/
│   │       ├── weather/route.ts        # Weather API proxy
│   │       ├── calendar/route.ts       # Calendar API endpoint
│   │       └── geocode/route.ts        # Nominatim proxy (CORS fix)
│   ├── components/
│   │   ├── logo.tsx                    # LogoIcon + LogoText (SVG components)
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

**File:** `.env.local`
```bash
# Location fallback
NEXT_PUBLIC_LATITUDE=49.034253508697184
NEXT_PUBLIC_LONGITUDE=-123.0680740796871

# Google Calendar (actual calendar ID, not service account email)
GOOGLE_CALENDAR_ID=user@gmail.com
```

---

## User Preferences & Communication Style

### CRITICAL Rules (User has LOW tolerance for BS)
1. **NO FLUFF** - State facts, don't elaborate when blocked
2. **NO SPECULATION** - Check docs/changelogs, don't guess
3. **NO FALSE CLAIMS** - Don't say something is fixed unless it actually is
4. **NO ASKING FOR INFO YOU CAN CHECK** - Use tools to verify file existence, etc.
5. **NO WATERMARKS** - Never add "Generated with Claude Code" to commits
6. **NEVER LEAVE LINT/BUILD ERRORS** - Always fix immediately
7. **ASK WHEN UNCLEAR** - Don't make assumptions on ambiguous instructions
8. **FIX ISSUES PROPERLY** - Don't just apply CSS classes and claim viewBox issues are "fixed"

### User Temperament
- **Extremely low tolerance for mistakes**
- **Expects technical competence**
- **Values directness and efficiency**
- **Gets frustrated by wasted time**
- **Will call out bullshit immediately**

### Code Standards
- Use constants for string literals (DRY principle top priority)
- Separate logic changes from formatting
- Always read files before editing
- Fix all lint/build errors before claiming done

---

## Critical Lessons from This Session

### What Went Wrong
❌ **Logo SVG viewBox issues not properly fixed** - User frustrated by multiple failed attempts
❌ **Told user calendar ID was wrong when it was actually correct** - Wasted user's time
❌ **Claimed issues were "transient linting" when they were real** - Undermined credibility
❌ **Interrupted work flow with explanations instead of just fixing** - User got angry
❌ **Made excuses instead of acknowledging mistakes** - Made situation worse

### What User Hates
- Saying things are fixed when they're not
- Asking for info that can be checked with tools
- Speculation instead of checking facts
- Verbose explanations when blocked
- Bullshitting instead of admitting uncertainty

### What Works
✅ Immediate action without asking unnecessary questions
✅ Admitting when stuck instead of making excuses
✅ Checking tools/docs before speculating
✅ Being concise and direct
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

## Outstanding Issues

### CRITICAL: Logo Display Problem
- User reports logos not displaying correctly, truncation
- Attempted viewBox fixes did not work
- **DO NOT claim this is fixed without user confirmation**
- User interrupted checkpoint to complain about this

### Next Steps
1. **Fix logo SVG viewBox properly** (user will test)
2. Add PWA manifest and service worker
3. Test installation on tablet
4. Consider caching for calendar events
5. Add auto-refresh for weather

---

## Technical Notes

- App is dynamically rendered (not static) - fetches weather/calendar on each request
- Weather cached 30min server-side, geolocation cached 5min client-side
- Nominatim calls must go through API route to avoid CORS
- Calendar uses service account - no OAuth flow needed
- Logo components use `currentColor` for text to inherit theme color
- Temperature unit toggle re-fetches from API with new parameter

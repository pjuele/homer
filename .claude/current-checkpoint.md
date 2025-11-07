# Homer - Calendar Error Handling & Timezone Fixes Checkpoint

**Date:** 2025-11-07
**Session:** Calendar authentication error handling + timezone/locale fixes
**Project:** Kitchen tablet PWA showing weather and calendar

---

## Project Overview

Building a PWA for kitchen tablet displaying:
- Live weather forecast (current + 7-day) via Open-Meteo
- Google Calendar events (today + upcoming week)
- Auto-detecting location with 3-tier fallback
- Light/dark theme support

**Tech Stack:**
- Next.js 14.2.15
- React 18.3.1
- TypeScript
- Tailwind CSS v3.4.18
- shadcn/ui components
- Open-Meteo API (weather)
- Google Calendar API (events via service account)

---

## Current Project State

### Completed This Session

**Calendar Error Handling & Timezone Fixes:**
✅ Added comprehensive error handling to `getAuthClient()` in calendar.ts:
  - Validates and parses GOOGLE_SERVICE_ACCOUNT_JSON env var with try-catch
  - Checks file existence before reading credentials file
  - Catches JSON parse errors with descriptive messages
  - Wraps GoogleAuth initialization with error handling
✅ Added graceful error handling in page.tsx for calendar data fetching
✅ Fixed timezone display issue - events now show in user's local timezone:
  - Changed CalendarEvent interface to store raw ISO datetime strings
  - Removed server-side formatTime() and formatDay() functions
  - Created new CalendarEvents client component with client-side formatting
  - Replaced hardcoded "en-US" locale with browser's locale (undefined parameter)
  - Added mounted state to prevent hydration mismatch
✅ Created reusable CalendarCard component to reduce code duplication
✅ Display "Could not load events at this time" on calendar errors instead of page crash
✅ Updated /git-com slash command to use only single quotes in commit messages

### Working Features
✅ Weather data from Open-Meteo (current + 7-day forecast)
✅ Location detection (GPS → IP → env fallback)
✅ Reverse geocoding via API route (no CORS)
✅ °C/°F temperature toggle
✅ Theme toggle (light/dark)
✅ Real Google Calendar events (today + week)
✅ **Calendar error handling** - page loads even if credentials missing
✅ **Correct timezone display** - times formatted in user's local timezone
✅ **User's locale respected** - date/time format matches browser locale
✅ Logo display (icon + text components with correct viewBox)
✅ SVG favicon
✅ Build succeeds with Next.js 14 + React 18

### Deployment Status
✅ Changes committed: "feat: add calendar error handling and fix timezone display"
⏳ Pending: User to push changes to GitHub
⏳ Pending: Verify Vercel build succeeds
⏳ Pending: Test timezone fix on tablet deployed to Vercel

---

## Critical Technical Details

### Calendar Timezone Issue - ROOT CAUSE

**Problem:** Calendar events displayed in GMT timezone on Vercel deployment, but correct timezone on localhost.

**Root Cause:**
- Time formatting (`formatTime()`, `formatDay()`) was happening **server-side** in getTodayEvents/getWeekEvents
- Server-side rendering uses **Vercel server's timezone** (UTC/GMT), not user's timezone
- Localhost worked because dev machine was in user's actual timezone

**Solution:**
- Store raw ISO datetime strings from Google Calendar API (no formatting server-side)
- Created client component (CalendarEvents) that formats times **in the browser**
- Browser's `toLocaleTimeString(undefined, ...)` uses device's actual timezone
- Added `mounted` state to prevent hydration mismatch (server vs client render difference)

**Key Files Changed:**
- [src/lib/calendar.ts](src/lib/calendar.ts) - Interface changed to `startDateTime`/`endDateTime`, removed formatting functions
- [src/components/calendar-events.tsx](src/components/calendar-events.tsx) - NEW client component with formatting
- [src/app/page.tsx](src/app/page.tsx) - Added error handling, passes raw data to client component

### Calendar Error Handling

**Before:**
- Missing credentials → page crash with unhandled error
- No user feedback when calendar fails to load

**After:**
- [src/lib/calendar.ts](src/lib/calendar.ts) - Comprehensive try-catch in getAuthClient():
  - JSON parse errors caught and wrapped with descriptive messages
  - File existence checked before reading
  - All errors include context about what failed
- [src/app/page.tsx](src/app/page.tsx) - Try-catch around getTodayEvents/getWeekEvents:
  - Errors logged to server console
  - Empty arrays returned as fallback
  - Error message passed to client component
- [src/components/calendar-events.tsx](src/components/calendar-events.tsx) - Displays "Could not load events at this time" when error present

### Browser Compatibility Context

**Target Device:** ASUS ZenPad 8 (Android 7.0, Chrome 64 from 2018)

**Previous Session:** Downgraded from Next.js 16 + React 19 + Tailwind v4 to Next.js 14 + React 18 + Tailwind v3 for Chrome 64 compatibility.

---

## File Structure

```
/Users/pjuele/Repos/github.com/pjuele/homer/
├── .env.local                          # Location coords + Calendar ID (local dev)
├── homer-calendar-access-creds.json    # Service account key (GITIGNORED)
├── public/
│   └── favicon.svg                     # SVG favicon from logo icon
├── CLAUDE.md                           # Guide for future Claude instances
├── README.md                           # Project overview
├── next.config.js                      # Next.js config (CommonJS)
├── tailwind.config.js                  # Tailwind v3 config
├── postcss.config.js                   # PostCSS config
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout with ThemeProvider
│   │   ├── page.tsx                    # Main dashboard (force-dynamic, error handling)
│   │   └── api/
│   │       ├── weather/route.ts        # Weather API proxy
│   │       ├── calendar/route.ts       # Calendar API endpoint (has error handling)
│   │       └── geocode/route.ts        # Nominatim proxy (CORS fix)
│   ├── components/
│   │   ├── calendar-events.tsx         # NEW: Client component for calendar display
│   │   ├── logo.tsx                    # LogoIcon + LogoText
│   │   ├── theme-provider.tsx          # next-themes wrapper
│   │   ├── theme-toggle.tsx            # Theme toggle dropdown
│   │   ├── weather-widget.tsx          # Weather display with location
│   │   └── ui/
│   │       ├── button.tsx              # Button with React.forwardRef
│   │       └── ...                     # Other shadcn components
│   └── lib/
│       ├── calendar.ts                 # Google Calendar integration (error handling added)
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

**Vercel Environment Variables:**
1. `GOOGLE_SERVICE_ACCOUNT_JSON` - Full JSON contents of credentials file
2. `GOOGLE_CALENDAR_ID` - User's calendar ID
3. `NEXT_PUBLIC_LATITUDE` / `NEXT_PUBLIC_LONGITUDE` - Optional fallback location

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
9. **NO DOUBLE QUOTES IN GIT COMMITS** - User wraps message in double quotes, use single quotes inside

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
✅ **Identified root cause of timezone issue** - Server-side rendering using wrong timezone
✅ **Fixed timezone display properly** - Moved formatting to client-side
✅ **Added comprehensive error handling** - Calendar failures no longer crash the page
✅ **Created reusable component** - CalendarCard reduces duplication
✅ **Respected user's locale** - Removed hardcoded "en-US" locale

### What User Hates
- Saying things are fixed when they're not
- Asking for info that can be checked with tools
- Speculation instead of checking facts
- Unclear or parrot-like explanations that don't add understanding
- Verbose explanations when blocked
- Bullshitting instead of admitting uncertainty
- **Making assumptions about unclear instructions instead of asking for clarification**
- **Repeatedly guessing different formats instead of asking what's needed**

### What Works
✅ Immediate action without asking unnecessary questions
✅ Admitting when stuck instead of making excuses
✅ Checking tools/docs before speculating
✅ Being concise and direct
✅ Explaining technical details clearly when challenged
✅ Fixing issues completely, not halfway
✅ **Asking for clarification when instructions are ambiguous**

### Session-Specific Lesson
**CRITICAL:** When user rejects a solution attempt, STOP and ASK what format/approach they want instead of trying multiple variations. This session's git commit message issue demonstrated this - should have asked "What format do you want the commit message in?" after the first rejection instead of guessing multiple times.

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
3. ⏳ **Test on ASUS ZenPad 8 tablet** - Verify times display correctly in local timezone

### Future Enhancements
- Add PWA manifest and service worker for installability
- Test installation on tablet
- Consider caching for calendar events
- Add auto-refresh for weather data
- Add loading states for initial data fetch

---

## Technical Notes

### Calendar Data Flow (After This Session)

**Server-Side (page.tsx):**
1. Calls `getTodayEvents()` / `getWeekEvents()`
2. Receives array of events with raw ISO datetime strings
3. If error occurs, catches it and sets error message
4. Passes raw data + error state to client component

**Client-Side (CalendarEvents):**
1. Waits for component to mount (prevents hydration mismatch)
2. Shows "Loading..." until mounted
3. Formats datetime strings using browser's timezone and locale
4. Displays "Could not load events at this time" if error present

### Rendering Strategy
- **Page rendering:** Dynamic (forced via `export const dynamic = 'force-dynamic'`)
- **Why:** Prevents Next.js from attempting static generation during build (would timeout calling APIs)

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
- Colors use HSL format instead of oklch() for browser compatibility

### React Component Patterns
- Button component uses `React.forwardRef` to properly forward refs to child components
- CalendarEvents uses `useState` + `useEffect` to track mounted state
- This prevents hydration errors when formatting dates/times differently on server vs client

---

## Slash Commands Updated

### /git-com
Updated [~/.claude/commands/git-com.md](~/.claude/commands/git-com.md) to include:
- **CRITICAL: Use only single quotes (') in commit message text, never double quotes (")**
- User wraps the message in double quotes when committing
- Double quotes inside break the git commit command

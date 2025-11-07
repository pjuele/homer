# Homer - Browser Compatibility Fixes Checkpoint

**Date:** 2025-11-07
**Session:** Tailwind v3 downgrade + Next.js/React downgrade for legacy browser support
**Project:** Kitchen tablet PWA showing weather and calendar

---

## Project Overview

Building a PWA for kitchen tablet displaying:
- Live weather forecast (current + 7-day) via Open-Meteo
- Google Calendar events (today + upcoming week)
- Auto-detecting location with 3-tier fallback
- Light/dark theme support

**Tech Stack:**
- Next.js 14.2.15 (downgraded from 16.0.1)
- React 18.3.1 (downgraded from 19.2.0)
- TypeScript
- Tailwind CSS v3.4.18 (downgraded from v4)
- shadcn/ui components
- Open-Meteo API (weather)
- Google Calendar API (events via service account)

---

## Current Project State

### Completed This Session

**Browser Compatibility Crisis Resolved:**
✅ Identified root cause: Old ASUS ZenPad 8 (Android 7.0, Chrome 64) cannot run modern stack
✅ Downgraded Tailwind CSS v4 → v3.4.18 for older browser support
✅ Downgraded Next.js 16.0.1 → 14.2.15 for Chrome 64 compatibility
✅ Downgraded React 19.2.0 → 18.3.1 and React-dom 19.2.0 → 18.3.1
✅ Downgraded ESLint 9 → 8 (peer dependency requirement)
✅ Converted next.config.ts → next.config.js (Next.js 14 doesn't support TS config)
✅ Replaced Geist fonts with Inter (Geist not available in Next.js 14)
✅ Fixed Button component ref forwarding issue using React.forwardRef
✅ Created tailwind.config.js with color theme configuration
✅ Created postcss.config.js for PostCSS processing
✅ Converted CSS from oklch() to HSL format for better browser support
✅ Converted CSS from Tailwind v4 syntax (@import) to v3 (@tailwind directives)
✅ Removed --webpack flags from build scripts

### Working Features
✅ Weather data from Open-Meteo (current + 7-day forecast)
✅ Location detection (GPS → IP → env fallback)
✅ Reverse geocoding via API route (no CORS)
✅ °C/°F temperature toggle
✅ Theme toggle (light/dark) - **NOW WORKING** after Button ref fix
✅ Real Google Calendar events (today + week)
✅ Logo display (icon + text components with correct viewBox)
✅ SVG favicon
✅ Build succeeds with Next.js 14 + React 18

### Deployment Status
⏳ Pending: User to commit and push changes
⏳ Pending: Verify Vercel build succeeds with new stack
⏳ Pending: Test on ASUS ZenPad 8 tablet with Chrome 64

---

## Critical Technical Details

### Why The Downgrades Were Necessary

**Problem:** ASUS ZenPad 8 tablet (Android 7.0, Chrome 64 from 2018) couldn't run the app:
- CSS displayed fine after Tailwind v4→v3 downgrade
- JavaScript didn't work (buttons non-functional)

**Root Cause:**
- Next.js 16 + React 19 are bleeding edge (released weeks ago)
- They require modern browser features not available in Chrome 64
- Chrome 64 is 7 years old and missing critical APIs

**Solution:**
- Next.js 14.2.15 + React 18.3.1 have much better browser support
- Tailwind v3 targets Chrome 64+ explicitly
- HSL colors instead of oklch() for wider compatibility

### Browser Compatibility Matrix

| Stack Version | Chrome Requirement | ZenPad Compatible? |
|---------------|-------------------|-------------------|
| Original (Next 16 + React 19 + TW v4) | ~Chrome 90+ | ❌ No |
| Current (Next 14 + React 18 + TW v3) | Chrome 64+ | ✅ Yes (expected) |

### Files Changed

**Configuration:**
- [package.json](package.json) - Downgraded all major dependencies
- [next.config.js](next.config.js) - Converted from .ts, using CommonJS exports
- [tailwind.config.js](tailwind.config.js) - Created for v3 with color theme
- [postcss.config.js](postcss.config.js) - Created for Tailwind v3
- [tsconfig.json](tsconfig.json) - Auto-updated by Next.js 14

**Source Code:**
- [src/app/layout.tsx](src/app/layout.tsx) - Replaced Geist fonts with Inter
- [src/app/globals.css](src/app/globals.css) - Converted to Tailwind v3 syntax, HSL colors
- [src/components/ui/button.tsx](src/components/ui/button.tsx) - Added React.forwardRef for proper ref handling

**Deleted:**
- next.config.ts (replaced with .js version)

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
├── next.config.js                      # Next.js config (CommonJS, not TS)
├── tailwind.config.js                  # Tailwind v3 config
├── postcss.config.js                   # PostCSS config for Tailwind v3
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout with ThemeProvider, Inter font
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
│   │   └── ui/
│   │       ├── button.tsx              # Button with React.forwardRef
│   │       └── ...                     # Other shadcn components
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
✅ **Systematically diagnosed browser compatibility issue** - Tailwind CSS → JavaScript → React/Next.js
✅ **Completed major version downgrades without breaking functionality**
✅ **Fixed ref forwarding bug in Button component**
✅ **Maintained all existing features during migration**
✅ **Build succeeded on first try after fixing all issues**

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
1. ⏳ **User to commit and push changes to GitHub**
2. ⏳ **Verify Vercel build succeeds with Next.js 14 + React 18**
3. ⏳ **Test on ASUS ZenPad 8 tablet** - Confirm buttons work in Chrome 64

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
- Colors use HSL format instead of oklch() for browser compatibility

### React Component Patterns
- Button component uses `React.forwardRef` to properly forward refs to child components
- This is required when using components with `asChild` prop pattern (Radix UI)
- Without forwardRef, ref warnings appear in console and components may not work correctly

---

## Target Device Information

**Device:** ASUS ZenPad 8 (factory reset)
**OS:** Android 7.0
**Browser:** Chrome 64.0.3282.137
**Browser Age:** ~7 years old (2018)
**Limitations:** Missing modern JavaScript APIs, CSS features (oklch, @layer, etc.)

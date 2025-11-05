# Homer - Kitchen Dashboard PWA

A Progressive Web App for kitchen tablets displaying weather forecasts and calendar events.

## Features

- **Live Weather**: Current conditions + 7-day forecast via Open-Meteo API
- **Smart Location**: Auto-detects location (GPS ’ IP ’ fallback)
- **Temperature Toggle**: Switch between Celsius and Fahrenheit
- **Dark/Light Theme**: System-aware theme switching
- **Calendar Events**: Google Calendar integration (in progress)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

Create `.env.local`:

```bash
NEXT_PUBLIC_LATITUDE=37.7749
NEXT_PUBLIC_LONGITUDE=-122.4194
```

## Tech Stack

- Next.js 16.0.1 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- next-themes

## Status

  Early development. Calendar shows mock data pending Google Calendar API integration.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 plant care application with AI-powered plant identification and health advice. The app uses React Server Components (RSC) for AI streaming, Tailwind CSS v4 for styling, and integrates OpenAI's GPT models for plant analysis.

## Development Commands

- **Dev server**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build` (with Turbopack)
- **Production**: `npm start`
- **Lint**: `npm run lint` (uses Biome, not ESLint)
- **Format**: `npm run format` (uses Biome to format with 2-space indent)

## Environment Setup

Create `.env.local` with:
```
OPENAI_API_KEY=your_key_here
```

Required for AI features (plant identification and health advice).

## Architecture

### Route Structure

- **Root route** (`app/page.tsx`): Landing page with "Get Started" button
- **Onboarding** (`app/onboarding/page.tsx`): First-time user flow
- **App routes** (`app/(app)/*`): Main app behind route group with persistent BottomNav
  - `/dashboard`: Home/overview
  - `/plants`: Plant list and detail views (`/plants/[id]`)
  - `/identify`: Camera-based plant scanning and identification
  - `/ai`: AI chat dashboard with individual chat views (`/ai/[id]`)
  - `/health`: Plant health monitoring
  - `/analytics`: Usage and care analytics
  - `/history`: Historical data
  - `/profile`: User profile

Layout hierarchy:
- `app/layout.tsx`: Root layout with font configuration (Geist Sans, Geist Mono, Instrument Serif)
- `app/(app)/layout.tsx`: App-specific layout that adds BottomNav to all main app pages

### AI Integration Pattern

The app uses **React Server Components with streaming** via Vercel AI SDK:

1. **Server Actions** (in `actions/` directory):
   - `actions/identify.ts`: Plant identification using `generateObject()` with structured output (Zod schema)
   - `actions/health.ts`: Streaming health advice using `streamText()` with `createStreamableValue()`

2. **Client Components**:
   - Import server actions using `"use server"` directive in action files
   - Use `useStreamableValue()` hook to consume streamed AI responses
   - Example pattern in `app/(app)/ai/[id]/page.tsx`

3. **Schemas** (`lib/ai-schema.ts`):
   - Zod schemas define structured AI output (e.g., `IdentifySchema` with species name, confidence, lux thresholds, watering schedule)

### Key AI Models Used

- **Plant identification**: `gpt-5-mini` (typo in code, should verify if this works or needs to be `gpt-4o-mini`)
- **Health advice**: `gpt-4o` with streaming

### Component Architecture

- **UI Components** (`components/ui/`): Radix UI-based components with Tailwind variants (shadcn/ui style)
- **Feature Components** (`components/`): Business logic components like `plant-stats.tsx`
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming

### Path Aliases

TypeScript configured with `@/*` pointing to project root for cleaner imports.

## Code Style

- **Linting/Formatting**: Biome (not Prettier/ESLint)
- **Indent**: 2 spaces
- **File organization**:
  - Server actions in `/actions`
  - Shared schemas/utils in `/lib`
  - UI components in `/components/ui`
  - Feature components in `/components`

## Important Technical Details

- **Next.js 15** with App Router and Turbopack
- **React 19**: Note the React version is 19.1.0 (latest at time of setup)
- **TypeScript** strict mode enabled
- **Image handling**: Plant identification accepts base64 data URLs via OpenAI vision API
- **Responsive**: Mobile-first design with bottom navigation

## Current State

The app has basic structure with:
- Landing and onboarding pages
- Plant identification flow with camera capture
- AI chat interface for plant health advice
- Dashboard skeleton
- Navigation infrastructure

Most pages have placeholder content - full CRUD operations for plants, real sensor data integration, and analytics are not yet implemented.

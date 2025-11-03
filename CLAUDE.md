# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 plant care application with AI-powered plant identification and health advice. The app uses React Server Components (RSC) for AI streaming, Tailwind CSS v4 for styling, and integrates OpenAI's GPT models for plant analysis. Authentication is handled by Better Auth with support for email/password and social providers (Google, GitHub).

## Additional Documentation

**IMPORTANT**: Before working on code or design, review these context files:

- **`.context/coding-standards.md`**: File naming conventions, component patterns, TypeScript guidelines, and database setup
- **`.context/design-standards.md`**: Design system principles, color/typography system, component design patterns, and accessibility guidelines

These files contain essential standards for this project including the **shared database architecture** with table prefixing (`plant_*`).

## Development Commands

- **Dev server**: `bun run dev` (uses Turbopack)
- **Build**: `bun run build` (with Turbopack)
- **Production**: `bun start`
- **Lint**: `bun run lint` (uses Biome, not ESLint)
- **Format**: `bun run format` (uses Biome to format with 2-space indent)
- **Database**:
  - `bun run db:generate` - Generate migrations from schema changes
  - `bun run db:push` - Push schema changes to database (development)
  - `bun run db:migrate` - Apply migrations (production)
  - `bun run db:studio` - Open Drizzle Studio to view/edit data

## Environment Setup

Create `.env.local` with:
```
OPENAI_API_KEY=your_key_here
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Optional: Social auth providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Required for AI features (plant identification and health advice) and database access.

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

## Database Architecture

**CRITICAL**: This project uses a **shared database with table prefixing**. All tables use the prefix `plant_*` to isolate data from other projects.

- **ORM**: Drizzle ORM with Neon DB (PostgreSQL)
- **Table creation**: Always use `createTable` from `db/table-creator.ts` (never use `pgTable` directly)
- **Schema location**: `db/schema.ts` - contains all table definitions
- **Query organization**: Place queries in `db/queries/` directory, organized by entity
- **Authentication tables**: Better Auth tables (`plant_user`, `plant_session`, `plant_account`, `plant_verification`)
- **Application tables**:
  - `plant_plants` - Plant records with Firebase IoT device references
  - `plant_plant_care_requirements` - Care requirements per plant
  - `plant_plant_health_records` - Health monitoring records
  - `plant_watering_logs` - Watering history
  - `plant_ai_chat_sessions` & `plant_ai_chat_messages` - AI chat functionality
  - `plant_plant_identifications` - Plant identification history
  - `plant_reminders` - Care reminders

See `.context/coding-standards.md` for detailed database conventions and best practices.

## Code Style

**See `.context/coding-standards.md` for comprehensive guidelines.** Key points:

- **Linting/Formatting**: Biome (not Prettier/ESLint)
- **Indent**: 2 spaces
- **File naming**: kebab-case for all files (`plant-card.tsx`, not `PlantCard.tsx`)
- **Component exports**: PascalCase names with default export
- **File organization**:
  - Server actions in `/actions`
  - Shared schemas/utils in `/lib`
  - UI components in `/components/ui` (shadcn/ui)
  - Feature components in `/components`
  - Database schema in `/db/schema.ts`
  - Database queries in `/db/queries/`

## Design System

**See `.context/design-standards.md` for comprehensive design guidelines.**

- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **Components**: shadcn/ui (Radix UI with Tailwind variants)
- **Fonts**: Geist Sans, Geist Mono, Instrument Serif
- **Design principles**: Consistency, hierarchy, simplicity, accessibility-first
- **Responsive**: Mobile-first approach with bottom navigation
- Use `cn()` utility from `@/lib/utils` to merge Tailwind classes

## Important Technical Details

- **Next.js 15** with App Router and Turbopack
- **React 19**: Note the React version is 19.1.0
- **TypeScript** strict mode enabled
- **Package manager**: Bun (not npm/yarn)
- **Authentication**: Better Auth with Drizzle adapter
- **Image handling**: Plant identification accepts base64 data URLs via OpenAI vision API
- **IoT Integration**: Firebase device IDs stored in `plants` table for sensor data
- **Responsive**: Mobile-first design with bottom navigation

## Authentication Flow

- **Better Auth** handles authentication with email/password and social providers
- Auth configuration in `lib/auth.ts`
- Client-side auth utilities in `lib/auth-client.ts`
- Middleware in `middleware.ts` protects routes
- Auth UI components in `components/auth/`
- Login/signup routes: `/login` and `/signup`

## Current State

The app has:
- Authentication system (Better Auth with email/password, Google, GitHub)
- Complete database schema with all tables
- Plant identification flow with camera capture
- AI chat interface for plant health advice
- Plant list and detail views
- Profile page
- Navigation infrastructure
- Dashboard skeleton

Still needs implementation:
- Full CRUD operations for plant care requirements
- Real-time Firebase IoT sensor data integration
- Watering log tracking UI
- Health monitoring dashboard
- Reminders system UI
- Analytics and history views

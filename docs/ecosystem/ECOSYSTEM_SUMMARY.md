# Sanctuary Ecosystem Summary

This repository is a multi-app platform for church and faith-focused experiences, backed by a shared API/data layer and multiple client surfaces (web, admin, mobile, and content-specific apps).

## High-Level Architecture

- Frontends: Multiple Next.js apps plus an Expo React Native mobile app.
- Backend: A centralized Express API in `sanctuary-backend`.
- Data/Auth: Supabase is used broadly for user data and authentication.
- Billing: Stripe subscriptions with webhook-driven tier management.
- AI: OpenAI and Google GenAI integrations for generated faith content and analysis.
- Media: Video/music/transcription pipelines (including YouTube and Mux-related tooling).

## Project-by-Project Functionality

### `sanctuary-backend`
Primary API and orchestration layer.

Core responsibilities:
- Serves API routes for devotionals, sermons, Bible studies, prayers, advice, news, community, messages, CRM, congregations, music, videos, AI, and analysis.
- Handles Stripe webhooks for both core and layperson subscription flows.
- Updates Supabase-backed user subscription tiers and subscription records.
- Supports transcription and AI-assisted content workflows.
- Includes cron jobs/scripts for:
  - Scriptural outlook generation
  - Daily news synopsis generation
  - Devotional generation and syllabus generation
  - Music/video curation and content import/backfills
- Applies CORS controls for production domains and local dev.

### `sanctuary-web`
Main web experience (Next.js).

Likely functionality based on dependencies:
- User-facing faith content consumption and interaction.
- Supabase-authenticated sessions.
- PWA support for installability/offline behavior.
- Rich text/content rendering and editing support (TipTap + markdown tooling).
- Stripe-enabled client-side billing integration.

### `sanctuary-admin`
Admin dashboard (Next.js).

Likely functionality based on structure and dependencies:
- Internal operational UI for managing ecosystem content/users.
- Dashboard/reporting views (Recharts).
- Authenticated administrative workflows over backend/Supabase data.
- Componentized UI system for data-heavy workflows.

### `sanctuary-layperson-webapp`
Dedicated web app for layperson-facing experiences.

Likely functionality:
- Alternate audience-focused user journey separate from clergy/main web.
- Supabase-authenticated user flows.
- PWA behavior and push notification support.
- Scripture/content processing utilities (Bible conversion scripts).
- Works with a dedicated layperson Stripe webhook path in backend.

### `sanctuary-mobile`
Mobile app (Expo + React Native, using expo-router).

Likely functionality:
- Native mobile access to sanctuary content and features.
- Supabase auth + secure local storage.
- Push notifications and haptics.
- Camera/audio/video capabilities for capture and playback workflows.
- In-app purchases/subscription integrations via React Native Purchases.
- Cross-platform targets (Android, iOS, web).

### `sanctuary-app-home`
Landing/home experience for the ecosystem or app suite.

Likely functionality:
- Lightweight public entry point/navigation layer.
- Routing users into the broader Sanctuary product surfaces.

### `sanctuary-news`
News-focused app surface (Next.js).

Likely functionality:
- Dedicated news feed/content view tied to sanctuary ecosystem data.
- Supabase-connected content/auth workflows.
- Guided/onboarding interactions (driver.js dependency).

## Cross-Cutting Capabilities Across the Ecosystem

- Shared identity and data through Supabase.
- Subscription monetization and tier enforcement through Stripe webhooks.
- AI-generated and AI-assisted spiritual/news/devotional content workflows.
- Multi-surface delivery: public web, audience-specific web apps, admin portal, and native mobile.
- Operational automation through cron and maintenance scripts.

## Inferred Product Intent

The ecosystem appears designed to support both ministry teams and end users with:
- Faith content creation and distribution
- Community communication and engagement
- Media and message management
- AI-enhanced devotional/analysis experiences
- Subscription-based premium access models

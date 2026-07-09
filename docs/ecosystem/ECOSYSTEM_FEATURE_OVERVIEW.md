# Sanctuary Ecosystem Feature Overview

## Product Vision (High-Level)

Sanctuary is a connected faith platform with multiple surfaces serving different roles:
- Layperson mobile app for daily spiritual growth and church community connection.
- Clergy web app for pastoral communication, discipleship content, care workflows, and CRM operations.
- AI-powered news layer that reframes current events through scripture, reflection, and prayer.
- Shared backend and data model that ties people, congregations, content, messaging, and subscriptions together.

## App-by-App Feature Summary

## 1) Sanctuary Mobile (Layperson App)

Primary experience: a daily devotional app that also supports church community life.

Core feature areas:
- Daily spiritual content:
  - Devotional feed and devotional detail views.
  - Prayer content and prayer detail views.
  - Christian advice request and response flows.
  - News feed with AI scriptural outlook integration.
- Prayer request system:
  - Create prayer requests with visibility tiers:
    - Public anonymous
    - Congregation-visible
    - Pastor-private
  - Prayer browsing/feed and random prayer encouragement patterns.
- Church connection and belonging:
  - Join congregation via invite link or QR code.
  - Dedicated My Church area for congregation-specific studies/messages.
  - Leave/disconnect from congregation.
- Congregational engagement:
  - Volunteer/team browsing and participation flows (church-scoped).
  - Push preference setup for church announcements, studies/events, devotionals.
- Personalization and profile:
  - Saved/favorited spiritual content.
  - News interest preferences.
  - YouTube recommendation channel controls with Preferred, Neutral, and Blocked creator states.
  - Reading/listening/share interactions for content.
- Monetization:
  - Subscription/paywall patterns and tiered features (free vs pro).

## 2) Sanctuary Web (Clergy App, Pastor-Facing)

Primary experience: a church operations cockpit + pastoral content studio.

Core feature areas:
- CRM dashboard and church operations:
  - Dashboard focused on People, Care (prayers), Events, and content pipeline.
  - Daily briefing card that includes AI-generated news synopsis + scripture + prayer.
- Content production and publishing:
  - Sermon creation/editing workflows (including AI-assisted generation and structured sermon formats).
  - Bible study creation and multi-lesson curriculum workflows.
  - Publishing flows to congregation audiences.
- Congregation management:
  - People directory and role-oriented congregation sections.
  - Events, kiosk, giving, video areas in congregation workspace.
- Prayer care workflows:
  - Pastor prayer inbox and congregation prayer visibility.
  - Prayer interactions that can create pastoral activity trail/notes linked to CRM profiles.
- Messaging and communication:
  - Pastor message composer/publisher (text/video-backed updates).
  - Church-targeted push notifications to congregants.
- Scripture tools:
  - Bible reader/context and scripture linkification patterns.
  - Bible version and reading preference handling.

## 3) Sanctuary News (Scriptural News Experience)

Primary experience: daily news interpreted through a spiritual/scriptural lens.

Core feature areas:
- AI scriptural outlook per article:
  - Main message/synopsis/outlook tied to scripture references.
  - Reflection questions and closing prayer style content blocks.
- Personalized discovery:
  - Category/topic onboarding and follow/preference patterns.
  - Filtered feed and taxonomy-driven browsing (topic/category pages).
- Daily briefing format:
  - Daily synopsis/brief experience with optional audio playback.
- Content depth and sharing:
  - Full article view + scriptural outlook view.
  - Sharing and social/distribution support.

Integration intent:
- Sanctuary News is designed to be embedded or surfaced inside other Sanctuary apps so users receive scriptural context alongside daily content and church life workflows.

## 4) Sanctuary Backend (Shared API + Automation Layer)

Primary role: central orchestration across apps.

Core feature areas:
- Unified API domains:
  - Devotionals, sermons, bible studies, prayers, advice, community, congregations, CRM, messages, news, media, user/auth, and more.
- Auth/data platform:
  - Supabase-backed identity/data operations.
- Subscription and billing:
  - Stripe webhook handling for multiple app contexts.
  - Subscription tier syncing to user profiles.
- AI services:
  - Advice generation, prayer generation, bible study generation, sermon generation support.
  - News/scriptural outlook serving and search/taxonomy APIs.
- Church communication infrastructure:
  - Push notification dispatch to congregation audiences.
- Media pipelines:
  - Video/media ingestion and message publishing support.
  - YouTube creator metadata and per-user channel preference controls that boost preferred channels and hard-exclude blocked channels from recommendations.
- Operational automation:
  - Cron jobs for daily synopsis and scriptural outlook generation.
  - Curation and backfill scripts for content/CRM operations.

## 5) Sanctuary Admin and Other Frontends

Supporting surfaces in the ecosystem:
- Sanctuary Admin: internal administrative interface for operations/governance/reporting.
- Sanctuary App Home: entry/landing shell for app-level navigation and distribution.
- Sanctuary Layperson Webapp: browser-based layperson counterpart with similar spiritual/community tracks and notification capabilities.

## End-to-End Ecosystem Capabilities

## Spiritual Formation Layer
- Daily devotionals, prayers, Bible reading/study, and advice guidance.
- AI-enhanced content generation and curation.

## Church Community Layer
- Congregation membership and identity linking.
- Prayer request sharing across public/church/pastor scopes.
- Pastor-to-congregant messaging and content delivery.
- Volunteer/team participation and church announcements.

## Pastoral Care + CRM Layer
- Member profile lifecycle (including shadow profile merge patterns).
- Pastoral notes and care activity logging.
- People/care/events workflows in a unified church dashboard.

## Content + Media Layer
- Sermon workflows, bible study curriculum workflows, and multimedia message distribution.
- Cross-surface delivery to mobile/web audiences.

## News + Discernment Layer
- AI-generated scriptural outlook on current events.
- Daily faith-informed news briefings integrated into broader Sanctuary experiences.

## Commercial + Platform Layer
- Tiered subscriptions and feature gating.
- Shared auth/data/notifications infrastructure across all apps.

## Practical Positioning Statement

Sanctuary is evolving into a full church resource and relationship management ecosystem that combines:
- Daily discipleship for congregants,
- Pastoral care and communication tooling for clergy,
- AI-assisted spiritual content operations,
- and a faith-informed lens on daily news,
inside one connected platform.

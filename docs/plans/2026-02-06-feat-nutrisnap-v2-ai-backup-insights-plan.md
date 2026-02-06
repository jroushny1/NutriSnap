---
title: "NutriSnap v2: AI Photo Estimation, Brand Foods, Cloud Backup, Insights"
type: feat
date: 2026-02-06
---

# NutriSnap v2: AI Photo Estimation, Brand Foods, Cloud Backup, Insights

## Overview

Upgrade NutriSnap from manual-only entry to an AI-assisted nutrition tracker with Claude Vision photo estimation, Open Food Facts brand food search, Supabase cloud backup, and a weekly/monthly insights tab. Also fix the date staleness bug and several discovered issues.

## Problem Statement

1. **Date staleness** — App shows "Today" but displays yesterday's data after overnight background. Also a UTC timezone bug in `formatDate()` that can store entries under the wrong date.
2. **No AI estimation** — Every food must be manually searched, high friction for logging.
3. **Limited food database** — Only ~500 generic USDA foods, no commercial brands.
4. **No data safety** — All data in IndexedDB, lost if Safari data is cleared.
5. **No historical trends** — Can see daily totals but not weekly patterns or macro ratios over time.
6. **Custom foods not searchable** — Custom foods saved to IndexedDB but `searchFoods()` only queries the hardcoded array.

## Technical Approach

### Architecture

All new features are additive — new JS modules loaded via `<script>` tags. No build system changes. API calls go direct from browser (CORS supported by both Claude and Open Food Facts).

**New files:**
- `js/vision.js` — Claude Vision API client
- `js/openfoodfacts.js` — Open Food Facts search
- `js/sync.js` — Supabase backup client
- `js/insights.js` — Data aggregation and trend charts

**Modified files:**
- `js/ui.js` — Fix `formatDate()` UTC bug, add visibilitychange, add Insights nav tab, wire AI flow
- `js/app.js` — Add visibilitychange handler, integrate new modules, add Insights view loading
- `js/db.js` — Add date range query, bump DB version for new stores, fix `getRecentFoods` performance
- `js/foods.js` — Integrate custom food search into `searchFoods()`
- `js/charts.js` — Add bar chart and stacked bar chart methods
- `index.html` — Add Insights tab, API key settings field, cloud backup UI
- `css/styles.css` — Insights view styles, AI estimation UI styles
- `sw.js` — Update cache name and asset list, skip API domain caching

### Implementation Phases

#### Phase 1: Bug Fixes (do first)

**1a. Fix date staleness + UTC bug** — `ui.js`, `app.js`
- Replace `formatDate()` to use local timezone: `YYYY-MM-DD` from `getFullYear()/getMonth()/getDate()` instead of `toISOString()`
- Add `visibilitychange` listener in `app.js init()` to reset `ui.currentDate = new Date()` and reload diary when date has rolled over
- Also check for SW updates on visibility change

**1b. Fix custom food search** — `foods.js`
- Modify `searchFoods()` to also query `nutriDB.getCustomFoods()` and merge results with USDA matches
- Make the function async (or accept custom foods as parameter)

**1c. Fix getRecentFoods performance** — `db.js`
- Use the `createdAt` index with a cursor in reverse to avoid full table scan
- Or limit to entries from last 30 days using date index

#### Phase 2: Open Food Facts API

**New file: `js/openfoodfacts.js`**
- `searchOpenFoodFacts(query)` — calls `/cgi/search.pl` with `page_size=10`, returns normalized food objects matching existing schema
- 500ms+ debounce (rate limit: 10 req/min)
- Required `User-Agent` header: `NutriSnap/2.0`
- CORS supported, no proxy needed

**UI changes: `ui.js`**
- After rendering local search results, fire async OFF search
- Append "Brand Results" section below local results in `#food-search-results`
- Show loading spinner during API call
- Cache selected brand foods in `customFoods` store for offline reuse

#### Phase 3: Claude Vision Photo Estimation

**New file: `js/vision.js`**
- `analyzeFood(imageBlob, textHint?)` — sends compressed JPEG + structured prompt to Claude API
- Returns JSON array of identified food items with estimated calories/macros and confidence levels
- Uses "Bring Your Own Key" pattern — API key stored in IndexedDB settings
- Direct browser call with `anthropic-dangerous-direct-browser-access: true` header
- Compress images to 800px max before sending (reuse `camera.compressImage`)
- Use `claude-haiku-4-5-20251001` for cost efficiency (~$0.001-0.003 per image)

**Prompt design:**
- Identify each distinct food item
- Estimate portion size using visual cues (plate size, utensils)
- Return structured JSON with name, portion_grams, calories, protein, carbs, fat, confidence
- Accept optional text hint from user (e.g., "about 8oz chicken")

**UI flow:**
1. User taps camera in food modal → takes/uploads photo
2. New "Analyze with AI" button appears below photo preview
3. Optional text input for description hints
4. Loading state while API processes
5. Results displayed as a list of identified items with estimated macros
6. User taps each item to confirm/adjust, then adds to diary
7. Falls back to manual search if no API key configured or API fails

**Settings addition:**
- New "AI Features" section in settings view
- Anthropic API key input field (stored in IndexedDB, never sent anywhere except Anthropic)
- Test button to verify key works

#### Phase 4: Insights Tab

**New file: `js/insights.js`**
- `getWeeklyAverages(weeksBack)` — groups entries by week, returns avg daily calories/macros
- `getDailyTotals(daysBack)` — returns per-day totals for charting
- `getStreakCount()` — consecutive days with at least 1 entry
- `getMacroRatios(daysBack)` — % of calories from protein/carbs/fat

**DB addition: `db.js`**
- Add `getEntriesByDateRange(startDate, endDate)` using IDBKeyRange on date index

**Chart additions: `charts.js`**
- `renderBars()` — bar chart with color coding (green near goal, red over)
- `renderStackedBars()` — protein/carbs/fat breakdown per day

**UI: `index.html` + `ui.js`**
- 5th nav tab: Insights (between Progress and Settings)
- Sections:
  - Logging streak badge
  - Weekly average calories bar chart (last 4 weeks) with goal line
  - Daily macro stacked bar chart (last 7 days)
  - Macro ratio summary (% protein/carbs/fat)
  - Weight vs. calorie trend overlay (if weight data exists)

#### Phase 5: Supabase Cloud Backup

**New file: `js/sync.js`**
- Load Supabase client from CDN: `@supabase/supabase-js@2/dist/umd/supabase.min.js`
- Anonymous auth (zero-friction, no email/password)
- `syncToSupabase()` — push entries/weights/recipes/settings modified since last sync
- `restoreFromSupabase()` — pull all data and merge into IndexedDB
- Photos excluded from sync (too large)
- Upsert by `id` for idempotent sync

**Supabase setup required (one-time, documented in README):**
- Create free project at supabase.com
- Enable anonymous auth
- Create tables: `food_entries`, `weights`, `recipes`, `settings` with RLS policies
- Copy project URL + anon key into NutriSnap settings

**UI: Settings view**
- New "Cloud Backup" section
- Supabase URL + anon key inputs
- "Sync Now" button with status indicator (last synced timestamp)
- "Restore from Cloud" button
- Auto-sync on visibilitychange (when app backgrounds) for hands-free backup

**Gotcha:** Supabase free tier auto-pauses after 7 days idle. First request after pause takes ~60s. Document this for user.

#### Phase 6: Polish

- Update `sw.js` — bump `CACHE_NAME` to `nutrisnap-v2`, add new JS files to ASSETS list, ensure API domains (`api.anthropic.com`, `world.openfoodfacts.org`, Supabase) are NOT cached
- Bump `db.js` `DB_VERSION` to 2 — add any new stores in `onupgradeneeded`
- Add toast/notification system for success/error feedback (replace `alert()`)
- Update `manifest.json` version
- Push to GitHub, verify GitHub Pages deployment

## Acceptance Criteria

### Functional Requirements

- [x] App correctly shows today's date and entries after overnight background
- [x] `formatDate()` uses local timezone, not UTC
- [x] Custom foods appear in search results
- [x] Open Food Facts search returns brand results when online
- [x] Brand food results cached locally for offline reuse
- [x] Claude Vision analyzes food photos and returns calorie/macro estimates
- [x] User can add text hint to improve AI estimation
- [x] AI estimation gracefully fails when offline or no API key
- [x] Insights tab shows weekly calorie averages with goal line
- [x] Insights tab shows daily macro breakdown (stacked bars)
- [x] Logging streak displayed in Insights
- [x] Supabase backup syncs entries, weights, recipes, settings
- [x] Restore from Supabase populates IndexedDB
- [x] API key stored only in local IndexedDB, never exposed elsewhere
- [x] App still works fully offline for manual food logging

### Non-Functional Requirements

- [x] Open Food Facts search debounced 500ms+ (rate limit compliance)
- [x] Claude Vision images compressed to 800px max before sending
- [x] Supabase sync excludes photo blobs
- [x] Service worker properly skips API request caching

## Dependencies & Prerequisites

- **Anthropic API key** — user must create at console.anthropic.com
- **Supabase project** — user must create free project and configure tables
- **Internet** — required for AI estimation, brand search, and cloud backup (manual logging works offline)

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase 7-day auto-pause | First sync after pause takes ~60s | Sync on every app open to keep project warm; document expected behavior |
| Open Food Facts rate limit (10/min) | Search throttled | 500ms+ debounce, cache results locally, show local results first |
| Claude API key in browser | Key visible in IndexedDB | Acceptable for personal PWA; document risk; offer Supabase Edge Function proxy as future upgrade |
| IndexedDB photo blob growth | Safari 1GB soft limit | Document "Export & Clear" workflow; exclude photos from backup |
| UTC date bug existing entries | Some entries may be stored under wrong date | Fix going forward; no retroactive fix needed |

## References

### Internal
- Brainstorm: `docs/brainstorms/2026-02-06-nutrisnap-v2-brainstorm.md`
- Date bug: `js/ui.js:17` (`formatDate` uses UTC `toISOString()`)
- Date staleness: `js/ui.js:6` (`currentDate` set once at construction)
- Custom food gap: `js/foods.js:235` (`searchFoods` only queries hardcoded array)
- Camera blob flow: `js/camera.js:85` (`openCamera` callback pattern)
- Export pattern: `js/app.js:275` (strips photoBlobs, JSON serialize)

### External
- [Claude Vision API — Messages docs](https://docs.anthropic.com/en/api/messages)
- [Claude CORS browser access](https://simonw.substack.com/p/claudes-api-now-supports-cors-requests)
- [Open Food Facts API docs](https://openfoodfacts.github.io/openfoodfacts-server/api/)
- [Open Food Facts rate limits](https://github.com/openfoodfacts/openfoodfacts-server/issues/8818)
- [Supabase anonymous auth](https://supabase.com/docs/guides/auth/auth-anonymous)
- [Supabase JS client](https://github.com/supabase/supabase-js)
- [VLMs for dietary assessment](https://arxiv.org/html/2504.06925v1)

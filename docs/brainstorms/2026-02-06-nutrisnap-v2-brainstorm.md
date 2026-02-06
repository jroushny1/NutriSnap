# NutriSnap v2 Brainstorm

**Date:** 2026-02-06
**Status:** Ready for planning

## What We're Building

Upgrade NutriSnap from a manual-entry-only calorie tracker to an AI-assisted nutrition logger with cloud backup and historical insights.

## Problems to Solve

1. **Date bug** — App shows "Today" with stale data when Safari restores from memory overnight
2. **No AI food estimation** — Users must manually search for every food item
3. **Limited food database** — Only 500 generic USDA foods, no commercial brands
4. **No data safety** — All data in IndexedDB, lost if Safari data is cleared
5. **No historical trends** — Can see daily totals but not patterns over time

## Chosen Approach: Claude Vision + Open Food Facts + Cloud Backup

### AI Photo Estimation
- User takes photo of food (or uploads screenshot)
- Optionally adds text description ("grilled chicken with rice, about 8oz")
- Claude Vision API analyzes image + text and returns estimated calories/macros per item
- User reviews estimates, adjusts if needed, confirms to log
- Requires Anthropic API key stored locally in app settings
- Cost: ~$0.01-0.05 per image

### Expanded Food Database
- Keep embedded USDA database for offline/fast search
- Add Open Food Facts API integration for brand/commercial food lookups
- Search flow: local results first (instant), then API results below (async)
- Cache frequently used brand foods locally for offline access

### Cloud Backup
- Auto-backup to Supabase free tier (or GitHub Gist as fallback)
- Nightly sync of entries, recipes, settings, weights
- One-tap restore from cloud on new device
- Photos excluded from cloud backup (too large)

### Historical Trends ("Insights" Tab)
- Weekly average calories, protein, carbs, fat
- Macro ratio pie chart (what % of calories from each macro)
- Calorie trend line over 30/60/90 days
- Weight correlation with calorie intake
- Streaks (days logged consecutively)

### Date Bug Fix
- Add `visibilitychange` event listener to refresh date when app comes to foreground
- Check if stored date !== current date on every view load

## Key Decisions

1. **Claude Vision over Gemini** — User prefers Claude ecosystem, accepts small per-use cost
2. **Open Food Facts over paid APIs** — Free, open-source, 3M+ products, good enough for "nice to have" brand coverage
3. **Cloud backup is important** — Auto-backup preferred over manual export
4. **Trends focus on weekly averages** — Don't need to preserve every granular entry forever, but want to see patterns
5. **Offline still works** — AI and brand search require internet, but core manual logging works offline

## Open Questions

- [ ] Supabase free tier: need to check if anonymous auth + 500MB is sufficient
- [ ] API key UX: how does user enter their Anthropic API key? Settings page input field?
- [ ] Should old daily entries auto-archive after N days (keep summaries, drop detail)?
- [ ] Open Food Facts rate limits — need to check API constraints

## Next Steps

Run `/workflows:plan` to create implementation plan.

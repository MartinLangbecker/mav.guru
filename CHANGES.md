# Changes for v1.0.0

## Summary
Major modernization: removed 13 dependencies, upgraded all remaining ones,
rewrote all source files to modern JS, added tests, fixed bugs, added features.

## Breaking Changes
- Node.js >= 22 required (was >= 19)
- `age` parameter is now an actual age number (0–99), not a type index (0–8)
- `bc` parameter accepts discount card labels or numeric IDs (was limited to 1/3/5)
- No build step needed (browserify removed)
- pnpm replaced with npm

## Dependencies Removed
- lodash (replaced with native JS)
- moment-timezone (replaced with native Date/Intl)
- moment-duration-format (inline formatter)
- apicache (inline 15-min Map cache)
- js-beautify (unnecessary)
- fetch-ponyfill (native fetch in browsers)
- horsey (custom autocomplete)
- browserify (no bundler needed)
- nodemon (node --watch)
- depcheck (removed from test)
- ms (inline formatter)
- pnpm (switched to npm)

## Dependencies Upgraded
- mav-prices: 0.4.1 → 0.7.0
- mav-stations: 0.3.5 → 0.6.0
- helmet: 4 → 8
- hastscript: 7 → 9
- hast-util-to-html: 8 → 9
- unist-builder: 3 → 4
- p-queue: 7 → 8
- p-retry: 4 → 6
- p-timeout: 5 → 6
- eslint: 8 → 9
- express: 4.19 → 4.22

## New Features
- Domestic Hungarian connections supported
- Searchable discount card selector (23 options: DE, AT, CH, CZ/SK, HU, FIP, Interrail)
- Loading indicator on form submit
- Time input accepts HHMM without colon (e.g. 830 → 8:30), auto-formats on blur
- Optimized search: narrowed API window by departure/arrival filters, directConnection flag
- Swap button to switch origin ↔ destination (also flips Hungary trick direction)
- Validation: requires Hungarian station or trick enabled before searching
- Hungarian train types mapped to standard abbreviations
- **Bestpreissuche**: new fast single-day search mode (default) — results in 2-5 seconds
- Simplified start page: date picker, mode toggle (Bestpreis vs Kalender), collapsible options
- Calendar concurrency reduced to 4 to avoid MAV API rate limiting

## Bug Fixes
- Station lookup no longer hangs when station not found
- Station list cached in memory (was re-reading 36k entries per request)
- Fixed readStations() API (stream → async iterable for mav-stations 0.6.0)
- Fixed p-timeout v6 API (requires `{ milliseconds }` not bare number) — was silently breaking all calendar requests
- Fixed station search: split query into words for multi-word matching (e.g. "budapest keleti")
- Fixed duration=24 rejected (was `< 24`, now `<= 24`)
- Bus stations excluded from autocomplete (transport mode 200)
- Hungary trick: legs trimmed to user's actual route (correct duration, changes, via, products)
- Hungarian train type names mapped to standard abbreviations (személyvonat→Sz, regionális vonat→RB, etc.)
- Validation: error message if no Hungarian station and trick not enabled

## Code Quality
- All files: .then() chains → async/await
- All files: meaningful variable names
- Removed deprecated url.resolve() → template literals
- Removed parameter reassignment
- Removed dead/commented-out code
- Consistent 2-space indentation
- ESLint v9 flat config (eslint.config.js)

## Infrastructure
- CI: Node 22, actions v4/v3/v6, $GITHUB_OUTPUT syntax
- Dockerfile: node:22-alpine, npm ci --omit=dev
- Switched from pnpm to npm
- Added test suite: 16 tests (node:test, zero extra deps)
- Removed .eslintrc.json, .npmrc
- Updated .gitignore, .dockerignore

## Files Changed
Essentially all of them. Key files:
- src/api/lib/journeys.js (rewritten)
- src/api/lib/station.js (rewritten)
- src/api/lib/params.js (rewritten)
- src/api/lib/options.js (rewritten)
- src/api/index.js
- src/api/settings.js
- src/lib/index.js (rewritten)
- src/lib/routes/helpers.js
- src/lib/routes/calendar/calendar.js (rewritten)
- src/lib/routes/calendar/template.js
- src/lib/routes/day/day.js (rewritten)
- src/lib/routes/day/index.js (rewritten)
- src/lib/routes/day/template.js (rewritten)
- src/lib/routes/greeting/index.js
- src/lib/routes/stations/index.js (rewritten)
- src/lib/routes/start/index.js
- src/lib/routes/start/template.js
- src/lib/routes/faq/index.js
- src/lib/routes/imprint/index.js
- assets/scripts/bahn.js (rewritten, common.js removed)
- assets/styles/autocomplete.css (rewritten)
- package.json
- Dockerfile
- .github/workflows/ci.yaml
- eslint.config.js (new)
- test/unit.test.js (new)
- test/integration.test.js (new)
- readme.md
- .gitignore
- .dockerignore
- .kiro/steering/project.md

## Files Removed
- assets/scripts/common.js
- .eslintrc.json
- .npmrc
- pnpm-lock.yaml

## Suggested Commit
```
feat: modernize to v1.0.0

Major rewrite: remove 13 deps, upgrade all remaining, add tests,
support domestic connections, searchable discount cards, optimized
search window. Node 22+, ESLint 9, no build step needed.
```

# File: `frontend/utils/dateRange.ts`

## Purpose

Provides the min/max selectable date limits for the calendar/date-range pickers,
either from the local cache or fetched from the backend (`/games/dates/range`).

## Key Features

- **League-scoped ranges** — every function accepts an optional `leagues?: string[]`
  array so the returned min/max can be scoped to a subset of leagues instead of the
  whole schedule (falls back to the global all-league range when omitted/empty).
- **Local fallback** — when no cached/API value exists, returns a ±6 month window
  around today.
- **Compressed caching** — uses the shared `getCache`/`saveCache` helpers, with a
  cache key that incorporates the requested leagues (`dateRangeLimits` for the global
  range, `dateRangeLimits_<LEAGUES>` otherwise).

## State Variables

None — these are pure functions, no component state.

## Key Functions

### `limitsCacheKey(leagues?)` (private)

Builds the cache key used for reading/writing limits. Leagues are joined with `+`,
uppercased and stripped of non-alphanumeric characters before being appended to the
base `dateRangeLimits` key.

### `getDateRangeLimits(leagues?)`

Reads the league-scoped cache and returns `{ minDate, maxDate }` as `Date` objects.
When no cache entry exists it returns a ±6 month window around today.

### `fetchDateRangeLimits(leagues?, force?)`

Calls `fetchDateRangeFromApi(leagues, force)`, converts the returned `YYYY-MM-DD`
strings into `Date` objects, stores the result in the league-scoped cache, and
returns it. Passing `force = true` bypasses the 24h API cache (used by the Game of
the Day tab whenever the selected leagues change). On failure (or missing API
data) it falls back to `getDateRangeLimits(leagues)`.

## Data Flow

1. The frontend calls `fetchDateRangeLimits(leagues?)` (or reads `getDateRangeLimits`).
2. The leagues array is turned into a scoped cache key.
3. `fetchDateRangeFromApi(leagues)` hits `GET /games/dates/range?leagues=...`.
4. The parsed `Date` limits are cached and returned to constrain the pickers.
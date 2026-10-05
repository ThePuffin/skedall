# File: `frontend/components/GameModal.tsx`

## Purpose

The **GameModal** component displays a detailed game popup with team logos, records, live score/status, and action buttons (game details, standings, ICS download, arena map). It fetches live scores when the game is close to or past its start time and is not finished.

## Key Features

- **Detailed game view** — team logos, names, records, score or `@` separator
- **Live score fetch** — polls `fetchLiveScores` for games within -15min to +5h of start
- **Live status** — detects in-progress games and displays clock/period text
- **Favorite toggle** — star icons to add teams to favorites (respects `maxFavoritesNumber`)
- **Action buttons** — game details (ESPN), standings (ESPN/PWHL), ICS download, map link
- **Remove from favorites** — when `onRemoveFromFavorites` is passed (favorites modal), the
  "locate arena" button is **replaced** by a trash button labelled `removeFromFavorites`
  (translated in 11 languages) that removes the game from the bookmarks and closes the modal
- **Theme aware** — switches logos to dark variants and colors icons based on color scheme
- **Dark mode logos** — uses `homeTeamLogoDark`/`awayTeamLogoDark` when in dark theme
- **Default logo fallback** — when a team has no logo (empty/`undefined`, e.g. games synced
  without logos), the bundled `assets/images/default_logo.png` shield is shown — the same
  placeholder as `CardLarge`. The asset is a `require()` id (a number), so it is passed
  directly to `source` and never through `{ uri: ... }`
- **Translated text** — uses `translateWord()` for all labels
- **Recent form row** — under each team (below its record), up to 5 **bare Ionicons icons** showing
  the last 5 results, **oldest on the left, most recent on the right**: checkmark = win, cross =
  loss, half-filled circle (`contrast`) = draw (module-level `FORM_OUTCOME_ICONS`). The icons carry
  **no background and no border** — only the **modal's text color** (module-level `DOT_COLORS`:
  `#0f172a` light / `#ffffff` dark, the very colors the modal passes to its `ThemedText` labels), so
  the row reads as a neutral indicator and never borrows — or clashes with — a team color. Each icon
  sits in a fixed `formIconSlot` (12×12) so a checkmark and a cross line up exactly. Each entry's
  `accessibilityLabel` is spelled out for screen readers ("Win" / "Loss" / "Draw", module-level
  `FORM_OUTCOME_LABELS` — plain English, as `translateWord()` has no matching key). **A loss in
  overtime or a shootout is shown as a draw** (half-filled circle): those leagues have no real tie,
  so an `otLosses` result reads as a draw. Nothing is rendered when the
  team has no stored history. Data comes from `fetchRecentFormGames(teamId, formBefore, 5)` →
  `GET /games/team/:id/form`, loaded per team so a failure on one side never hides the other row;
  the rows are reset when the modal closes or the game changes
- **Form window: the games _before_ the displayed one** — `formBefore` bounds the query with a strict
  `startTimeUTC < before`, so the API only returns what precedes the game shown: **no bound** when the
  game is upcoming (→ the five most recent results), **its own start** when it is already past (→ the
  five results played just before it). Leaving the bound out for an upcoming game keeps the request
  URL — and the cache key derived from it — identical across opens; a `now` bound would carry
  milliseconds and be unique on every open. The displayed game can therefore never be returned, and
  `getRecentForm` still passes `data.uniqueId` as a defensive exclusion
- **Loading skeleton** — while the results request is in flight, each team's row shows five neutral
  gray placeholder squares instead of the real icons, so the results never "pop" into place. A single
  `Animated.Value` (`FormSkeleton`) sweeps `0 → 1` over `LOADER_CYCLE_MS` (1400 ms); each square
  interpolates its own slice of that sweep, offset by `index * DOT_DELAY_MS` (220 ms, fading over
  `DOT_FADE_MS` = 260 ms), so the placeholders light up one after the other. `Animated.loop` restarts
  the sequence once the value reaches 1 — the "all shown → start again" loader behavior — and the
  animation is stopped when the modal closes. The skeleton uses `formSkeletonPlaceholder`, sized
  identically to `formIconSlot`, so the layout is identical and nothing shifts when the real icons
  land; a team with no id never shows one
- **Scrollable content** — the modal card is capped at `maxHeight: '92%'` and its content is wrapped
  in a `ScrollView`, so the added form rows can never push the card past the viewport
- **Click-outside close** — backdrop press and close button dismiss the modal

## Props

| Prop                    | Type                            | Default | Description                                                           |
| ----------------------- | ------------------------------- | ------- | --------------------------------------------------------------------- |
| `visible`               | `boolean`                       | —       | Whether the modal is shown                                            |
| `onClose`               | `() => void`                    | —       | Closes the modal                                                      |
| `data`                  | `GameFormatted`                 | —       | Game data to display                                                  |
| `gradientStyle`         | `any`                           | —       | Style object for the modal background                                 |
| `favoriteTeams`         | `string[]`                      | —       | List of favorite team IDs                                             |
| `showScores`            | `boolean`                       | `true`  | Whether scores are displayed                                          |
| `onRemoveFromFavorites` | `(game: GameFormatted) => void` | —       | Shows the trash button (replaces "locate arena") and removes the game |

## State Variables

| Variable      | Type                      | Description                                                                                              |
| ------------- | ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `liveGame`    | `GameFormatted` \| `null` | Live score data when fetched; null otherwise                                                             |
| `awayForm`    | `GameOutcome[]`           | Last results of the away team, oldest → newest (`[]` when none)                                          |
| `homeForm`    | `GameOutcome[]`           | Last results of the home team, oldest → newest (`[]` when none)                                          |
| `formLoading` | `boolean`                 | True while the results request is in flight → animated gray skeletons are shown instead of the real rows |

## Key Memoized / Computed Values

- `displayData` — `liveGame || data`
- `hasScore` — both team scores are non-null
- `status` — game status via `getGamesStatus(displayData)`
- `isLive` — true when status is in-progress, period text is present, or scores exist today and game isn't final (excludes `DELAYED` — interrupted games are not live)
- `showFinalization` — no scores, not terminated, and the game is awaiting finalization (`isGameAwaitingFinalization`): expected end passed **and** either no time left on the clock or a feed frozen past `STALE_FEED_MINUTES` since `dataChangedAt`. A game in overtime, or one whose feed simply updated 2 minutes ago, is not flagged (renders "Final")
- `liveTimeText` — combined clock + period text without duplication
- `stadiumSearch` — arena + place formatted for Google Maps query
- `standingUrl` — ESPN standings URL via `leagueMapping`, or PWHL standings for PWHL
- `displayHomeLogo` / `displayAwayLogo` — dark-mode logo variants when in dark theme, falling back
  to the light logo when no dark variant exists; `null`/empty values make the `<Image>` use the
  bundled `defaultLogo` require asset

## Key Functions

### `loadTeamForm(teamId?)`

Fetches one team's recent results (`fetchRecentFormGames`) and turns them into the form row
(`getRecentForm`) with `RECENT_FORM_LENGTH` as the cap and `data.uniqueId` as a defensive exclusion.
Returns `[]` for a missing team id, and swallows any failure into `[]` so a team
with no stored history — or a failing request — simply shows no icons instead of breaking the modal.
`formBefore` is memoized on `data.startTimeUTC`: it is `undefined` for an upcoming game and the
game's own ISO start for a past one. Called from a `useEffect` keyed on
`[visible, data.awayTeamId, data.homeTeamId]`: the rows are reset
when the modal closes, both teams are loaded in parallel, and a `cancelled` flag discards a response
that arrives after the modal was closed or another game was opened.

### `renderFormRow(form, teamId?)`

Renders the icon row, or `null` when `form` is empty. Each entry is a **bare** Ionicons glyph from the
module-level `FORM_OUTCOME_ICONS` — `checkmark` (`W`) / `close` (`L`) / `contrast` (`D`, a
half-filled circle) — drawn at `size={12}` in the modal's text color from the module-level
`DOT_COLORS` (the same values the modal gives its `ThemedText` labels). No background and no border
are drawn: the glyph is the whole indicator. `teamId` only decides whether a loading skeleton can
appear — the team color is no longer used.

### `openWikipediaTeam(teamName?)`

Opens the team's Wikipedia article in the reader's language. Delegates the URL to
`getTeamWikipediaUrl()` (`@/utils/utils`) and opens it with `Linking.openURL()`. A missing team name
yields no URL, so the press is a no-op; a failing `openURL` (no browser, user cancelled) is caught
and logged with `console.warn` rather than propagated, so a convenience link can never crash the
modal.

Both team logos (`awayTeam`, `homeTeam`) are wrapped in a `<TouchableOpacity activeOpacity={0.7}>`
calling this function, with `accessibilityRole="link"` and `accessibilityLabel` set to the team name.
The touchable is `disabled` when the team name is empty, so a nameless game renders an inert logo.

Language resolution lives in `utils/utils.tsx`: `getWikipediaLanguage()` reads `navigator.language`
(the same source as `translateWord()`), keeps the primary subtag and falls back to `en` for the 11
app languages (`en, fr, de, es, it, ja, ko, nl, pt, ru, zh` — all of which have a Wikipedia edition).
`getTeamWikipediaUrl()` turns spaces into underscores and `encodeURIComponent`-escapes the result.

### `fetchLiveGameData()`

When the modal opens, computes the hours since game start. If the game is within -0.25h to +5h and not final, calls `fetchLiveScores` and stores the result in `liveGame`.

### `gameStatusAlreadyIncludesClock(status, clock)`

Determines whether the status text already contains the clock time (handles `00:` / `0:` prefixes) to avoid duplication.

### `getEspnStandingsUrl(leagueKey: string)`

Builds the ESPN standings URL from the `leagueMapping` constant, or returns `null` if no mapping exists.

### `renderStatusText()`

Renders the game status area:

- **Live** — red clock/period text (or status string); interrupted (`DELAYED`) games are excluded from live
- **Finalized late** — "Final" fallback when no scores were reported
- **Interrupted/Delayed** — translated `delayedGame` label ("Match interrompu")
- **Has scores** — "Final"/"Ended"/"Score" label
- **Default** — localized date/time of the game

## Data Flow

1. Modal opens → `useEffect` triggers live score fetch if game is near/past start
2. `displayData` resolves to live data if available, else the passed `data`
3. Renders teams, logos, records, score/status, and action buttons
4. Clicking star toggles favorite via `addFavoriteTeam`
5. Action buttons open external links or download the ICS file
6. With `onRemoveFromFavorites` (favorites modal), the trash button replaces the arena map
   button (non-live games) or is appended to the live/final action row, and removes the
   game from the bookmarks before closing the modal. `styles.actionsRow` uses
   `flexWrap: 'wrap'` so the buttons never overflow on narrow screens.

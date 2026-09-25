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
- **Translated text** — uses `translateWord()` for all labels
- **Click-outside close** — backdrop press and close button dismiss the modal

## Props

| Prop                    | Type                                | Default | Description                                                         |
| ----------------------- | ----------------------------------- | ------- | ------------------------------------------------------------------- |
| `visible`               | `boolean`                           | —       | Whether the modal is shown                                          |
| `onClose`               | `() => void`                        | —       | Closes the modal                                                    |
| `data`                  | `GameFormatted`                     | —       | Game data to display                                                |
| `gradientStyle`         | `any`                               | —       | Style object for the modal background                               |
| `favoriteTeams`         | `string[]`                          | —       | List of favorite team IDs                                           |
| `showScores`            | `boolean`                           | `true`  | Whether scores are displayed                                        |
| `onRemoveFromFavorites` | `(game: GameFormatted) => void`     | —       | Shows the trash button (replaces "locate arena") and removes the game |

## State Variables

| Variable   | Type                      | Description                                  |
| ---------- | ------------------------- | -------------------------------------------- |
| `liveGame` | `GameFormatted` \| `null` | Live score data when fetched; null otherwise |

## Key Memoized / Computed Values

- `displayData` — `liveGame || data`
- `hasScore` — both team scores are non-null
- `status` — game status via `getGamesStatus(displayData)`
- `isLive` — true when status is in-progress, period text is present, or scores exist today and game isn't final (excludes `DELAYED` — interrupted games are not live)
- `showFinalization` — no scores, not terminated, and game started > 3h ago (renders "Final")
- `liveTimeText` — combined clock + period text without duplication
- `stadiumSearch` — arena + place formatted for Google Maps query
- `standingUrl` — ESPN standings URL via `leagueMapping`, or PWHL standings for PWHL
- `displayHomeLogo` / `displayAwayLogo` — dark-mode logo variants when in dark theme

## Key Functions

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

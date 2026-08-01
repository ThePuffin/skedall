# File: `frontend/components/FavModal.tsx`

## Purpose

The **FavModal** component is a modal dialog that lets users manage their favorite teams, select which leagues to follow, and configure whether scores are shown. It supports anonymous (local cache only) and authenticated (Firestore sync) users.

## Key Features

- **Favorite team management** — reorderable team selector with max limit
- **League selection** — multi-select league filter via `Selector`
- **Score toggle** — enables/disables score display via `ScoreToggle`
- **Firestore sync** — saves preferences to the user's Firestore document when logged in
- **Cache persistence** — reads/writes `favoriteTeams`, `leaguesSelected`, `showScores`, `allLeagues` to cache
- **Sign-in prompt** — shows a sign-in button when not authenticated
- **Event dispatch** — fires `favoritesUpdated`, `leaguesUpdated`, and `scoresUpdated` after save
- **Forced selection** — opens the team selector if the user tries to save with no favorites

## Props

| Prop            | Type                        | Description                   |
| --------------- | --------------------------- | ----------------------------- |
| `isOpen`        | `boolean`                   | Whether the modal is visible  |
| `favoriteTeams` | `string[]`                  | Current favorite team IDs     |
| `onClose`       | `() => void`                | Closes the modal              |
| `onSave`        | `(teams: string[]) => void` | Callback with the saved teams |

## State Variables

| Variable                | Type       | Description                                         |
| ----------------------- | ---------- | --------------------------------------------------- |
| `isSmallDevice`         | `boolean`  | Whether the window width is < 768px                 |
| `localFavorites`        | `string[]` | Local editing copy of favorite teams                |
| `localLeagues`          | `string[]` | Selected league IDs (from cache or default all)     |
| `allLeagues`            | `string[]` | All available leagues (fetched from API)            |
| `showScores`            | `boolean`  | Whether scores should be displayed                  |
| `isLeagueSelectorOpen`  | `boolean`  | Whether the league selector dropdown is open        |
| `forceOpenTeamSelector` | `boolean`  | Forces the first team selector to open (save guard) |

## Key Memoized / Computed Values

- `hasFavorites` — `favoriteTeams.length > 0`
- `hasSelection` — at least one non-empty team in `localFavorites`
- `teamsForFavorites` — maps `TeamsEnum` entries into `Team[]` objects for the team selector

## Key Functions

### `handleSave()`

Validates selection (forces team selector open if empty), filters favorites to only those in selected leagues, calls `onSave`, persists `leaguesSelected` and `showScores` to cache, syncs to Firestore if logged in, dispatches update events, and closes the modal.

### `handleSelectorOpen()` / `handleSelectorClose()`

Toggle the league selector dropdown open state so the team selectors can hide while it's open.

## Data Flow

1. Modal opens → reads `favoriteTeams`, `showScores`, `leaguesSelected`, `allLeagues` from cache; fetches fresh league list from API
2. User edits favorites, leagues, and score toggle
3. On save → filters to allowed leagues, persists to cache, syncs to Firestore (if user), dispatches events, closes
4. Backdrop/hardware-back closes only when the user already has favorites (`hasFavorites`)

# File: `frontend/app/refresh.tsx`

## Purpose

The **refresh** screen (named `GameofTheDay` internally) is an admin/debug screen that lets the user manually trigger data refreshes from the backend API. It provides buttons to refresh all teams, refresh game scores, and refresh games per league.

## Key Features

- **Fetch leagues** — loads the list of available leagues from the API on mount
- **Refresh teams** — calls `teams/refresh` to refresh team data
- **Refresh scores** — calls `games/scores` to refresh game scores
- **Per-league refresh** — one button per league to refresh that league's games
- **Loading state** — shows `LoadingView` while loading, `NoResults` if no leagues
- **Responsive layout** — switches between 1 and 2 column grids based on window width and league count
- **Keyboard accessible** — buttons support Enter/Space key activation
- **League logos** — each league button displays its logo next to the name

## State Variables

| Variable           | Type       | Description                               |
| ------------------ | ---------- | ----------------------------------------- |
| `leaguesAvailable` | `string[]` | List of league names fetched from the API |
| `isLoading`        | `boolean`  | Whether a refresh operation is in flight  |
| `scrollViewRef`    | `Ref`      | Reference to the `ScrollView`             |

## Key Functions

### `handleFetchLeagues()`

Fetches the available leagues and stores them in `leaguesAvailable`. Sets `isLoading` around the request.

### `handleRefreshGamesLeague(league: string)`

Calls `refreshGamesLeagueApi(league)` for the given league, wrapping the request with `isLoading`.

### `handleRefreshTeams()`

Calls `refreshTeamsApi('teams/refresh')` to refresh the teams cache/data.

### `handleRefreshScores()`

Calls `refreshTeamsApi('games/scores')` to refresh game scores.

### `displayNoContent()`

Returns `LoadingView` when `isLoading`, otherwise `NoResults`.

## Key Memoized / Computed Values

- `isTwoColumns` — `leaguesAvailable.length > 6 && width >= 700`
- `gridTemplateColumns` — 2-column grid when two-column layout, else single column
- `containerMaxWidth` / `buttonMaxWidth` — responsive widths based on layout
- `topGridTemplateColumns` etc. — responsive values for the top "TEAMS / SCORES" button row

## Data Flow

1. On mount, `useEffect` calls `handleFetchLeagues()`
2. If no leagues → shows `LoadingView`/`NoResults`
3. Otherwise renders TEAMS / SCORES buttons plus one refresh button per league
4. Each button calls the appropriate API and toggles `isLoading` around the request

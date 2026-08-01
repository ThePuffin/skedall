# File: `frontend/components/Cards.tsx`

## Purpose

The **Cards** component renders a single game card showing both teams, logos, score/status, arena location, and action icons. It's a lower-level card used within `CardLarge` and other layouts to display a game in a compact format.

## Key Features

- **Team display** — shows away/home team names (or scores) with logos
- **Score/status handling** — displays scores or in-progress/ended status text
- **Responsive** — adapts team names/font sizes based on device width
- **Favorite detection** — highlights cards with a gold glow border and a star when a favorite team plays
- **Selection support** — selectable cards for bookmarking via check/plus icons
- **ICS generation** — arena name is clickable to generate an `.ics` calendar file
- **Stadium link** — links to Google Maps for the arena
- **League logo** — shows the league logo badge on the card
- **Team colors** — colors the card using the selected team's colors
- **Favorite sync** — listens to the `favoritesUpdated` window event

## Props

| Prop               | Type             | Default    | Description                                   |
| ------------------ | ---------------- | ---------- | --------------------------------------------- |
| `data`             | `CardsProps`     | —          | Game data (teams, scores, arena, times, etc.) |
| `showDate`         | `boolean`        | `false`    | Show date/time instead of just time           |
| `showButtons`      | `boolean`        | `false`    | Show action buttons (ICS calendar)            |
| `onSelection`      | `(game) => void` | `() => {}` | Callback when card is selected                |
| `numberSelected`   | `number`         | `0`        | Number of selected games                      |
| `selected`         | `boolean`        | `false`    | Whether this card is selected                 |
| `disableSelection` | `boolean`        | `false`    | Disable card selection                        |

## State Variables

| Variable         | Type       | Description                                     |
| ---------------- | ---------- | ----------------------------------------------- |
| `teamNameHome`   | `string`   | Home team display name (short on small screens) |
| `teamNameAway`   | `string`   | Away team display name (short on small screens) |
| `isSmallDevice`  | `boolean`  | Whether the window is ≤ 1075px wide             |
| `fontSize`       | `string`   | Card font size based on device size             |
| `containerWidth` | `number`   | Measured card width via `onLayout`              |
| `favoriteTeams`  | `string[]` | Favorite team IDs from cache                    |

## Key Functions

### `getContrastShadow(hexColor: string)`

Computes a drop-shadow color with contrast against the team background color. Returns dark shadow on light backgrounds, light shadow on dark backgrounds.

### `renderTitleContent()`

Returns the card title: the game date/time, or the live game status (e.g. "3rd", "OT", "Half") if the game is in progress. If the arena name is set, the title becomes a clickable element to generate an ICS file.

### `renderTeamStar()`

Renders a gold star indicator with a sparkle effect using two layered star icons.

### `renderActionIcons()`

Renders selection icons (`check-square` when selected, `plus-square-o` when selectable) and a gold star when the game involves a favorite team.

### `renderIcon(name: string, iconColor: string)`

Small helper that renders a FontAwesome icon in a 22×22 wrapper.

### `displayContent()`

Main card body: away logo + name, `@`, home logo + name, and a Google Maps link to the arena.

## Key Memoized / Computed Values

- `hasScore` — both scores are present and non-empty
- `displayHomeLabel` / `displayAwayLabel` — scores if available, else team names
- `isFavorite` — game involves a favorite team (only when `startTimeUTC` and not `showDate`)
- `isCardSelected` / `isSelectable` — derived from `selected` + `showButtons`
- `gameDate` — localized date + time string
- `colorTeam` — team colors from `Colors` map or fallback defaults
- `favoriteCardStyle` — gold border/glow when favorite or selected
- `league` — league key derived from `teamSelectedId.split('-')[0]`

## Data Flow

1. Receives game data via `data` prop
2. On mount, adapts team names/font to device width; listens to dimension changes
3. Reads favorite teams from cache, listens for `favoritesUpdated` events
4. Renders the `Card` with league logo, title (date/status), team details, and arena link
5. Clicking the card calls `onSelection(data)` when interactive
6. Clicking the arena name (when `showButtons`) generates an ICS calendar file

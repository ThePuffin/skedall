# File: `frontend/components/GamesSelected.tsx`

## Purpose

The **GamesSelected** component renders a responsive grid of selected (bookmarked) games using `CardLarge`. It adapts the number of columns and card width based on the window width and the number of selected teams.

## Key Features

- **Responsive grid** — column count adapts to window width (2 / 4 / 6 columns) and team number
- **Vertical mode** — uses `verticalMode` when many teams (> 6) or on small devices
- **Animations** — enables entry/exit animations on the cards (`animateEntry`, `animateExit`)
- **Click handling** — forwards selection to `onAction(game)`
- **Centered single card** — a single selected team's card is centered at 33% width on desktop
- **Unique keys** — uses `uniqueId` or `_id` for card keys

## Props (`GamesSelectedProps`)

| Prop         | Type              | Default | Description                                    |
| ------------ | ----------------- | ------- | ---------------------------------------------- |
| `data`       | `GameFormatted[]` | `[]`    | Games to display                               |
| `onAction`   | `(game) => void`  | —       | Called when a card is selected                 |
| `teamNumber` | `number`          | `1`     | Number of selected teams (drives column count) |

## Key Memoized / Computed Values

- `isSmallDevice` — `width < 768`
- `isMediumDevice` — `768 <= width < 1200`
- `verticalMode` — `(teamNumber > 6 && !isSmallDevice) || isSmallDevice`
- `maxColumns` — 2 (small), 4 (medium), 6 (desktop)
- `effectiveColumns` — `max(1, min(teamNumber, maxColumns))`
- `cardWidth` — `'33%'` for a single team on desktop, else `100 / effectiveColumns %`

## Data Flow

1. Receives selected games via `data`
2. Computes responsive layout from `useWindowDimensions()` and `teamNumber`
3. Maps each game to a `CardLarge` in a flex-wrap row
4. `onSelection` triggers `onAction(game)` when a card is tapped

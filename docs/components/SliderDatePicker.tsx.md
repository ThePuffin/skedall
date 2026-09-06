# File: `frontend/components/SliderDatePicker.tsx`

## Purpose

The **SliderDatePicker** displays a horizontal, swipeable date slider used by the Game of the Day tab (`index.tsx`). It shows a scrollable row of months (month/year chips) above a scrollable row of individual days. The search (magnifier) button floats as an **overlay on the left edge, aligned with the month row** (not vertically centered on the whole component); months start to the right of the button and are vertically centered on it (same 40px height), while the day row spans the full width and scrolls **underneath** the floating button.

## Key Features

- **Month row** — horizontal auto-width chips (uniform `paddingHorizontal: 12` / `marginHorizontal: 12` so the spacing between months is constant) for month/year navigation, current month outlined; chip positions/widths are measured via `onLayout` to drive auto-centering
- **Day row** — horizontal day chips, today outlined, selected day highlighted with the favorite color
- **Search button (magnifier)** — a circular button (40×40, `borderRadius: '50%'`) **absolutely positioned on the left edge, aligned with the month row** (`position: 'absolute'`, `left: 15`, `top: 10` — matches the container's `paddingVertical: 10`, so the 40px button is vertically centered on the 40px month row). The month row reserves `paddingLeft: 40` so month chips start to the right of the button (same column where `TeamFilter` chips start after its loupe); the day row scrolls underneath it (`zIndex: 10`). Uses the same `Ionicons` "search" icon (24px), background and border as the team-filter magnifier in `TeamFilter` so both buttons look identical. Rendered only when the `onSearch` prop is provided; hidden otherwise. In the Game of the Day tab (`index.tsx`) the magnifier is wired to open the imperatively-controllable `DateRangePicker` calendar (single-date mode) so a date can be picked from the dropdown.
- **Date limits** — optional `minDate` / `maxDate` constrain months and days
- **Masked edges** — both rows (months & days) carry a CSS edge-fade (`maskImage`) that makes chips fade as they pass under the adjacent opaque button (loupe). The left fade is **always** applied from the initial render (no scroll needed); the right fade is only drawn while the end of the list is not yet reached. The days row uses a 40px left inset (the fade zone sits exactly under the loupe, which spans x=15..55).
- **Drag scrolling (web)** — mouse drag-to-scroll on both rows via `useDragScroll`, setting `isScrollingHorizontally` in the `HorizontalScrollContext`
- **Auto-centering** — scrolls so the selected date is centered; the month scroll target is computed from the measured chip layout (`monthLayouts[index].x + width / 2 - windowWidth / 2`) rather than a fixed chip width
- **Disabled state** — dims the whole component and disables all interactions
- **Theme aware** — light/dark colors via `useThemeColor` and favorite color via `useFavoriteColor`

## Props

| Prop          | Type                | Description                                                            |
| ------------- | ------------------- | ---------------------------------------------------------------------- |
| `selectDate`  | `Date`              | Currently selected date                                                |
| `onDateChange`| `(date: Date) => void` | Called when a day or month chip is pressed            |
| `disabled`    | `boolean`           | Disables all interactions and dims the component (default `false`)     |
| `minDate`     | `Date \| string`    | Lower bound for months/days                                            |
| `maxDate`     | `Date \| string`    | Upper bound for months/days                                            |
| `onSearch`    | `() => void`        | Optional handler for the magnifier button (hidden when not provided). In `index.tsx` it opens the `DateRangePicker` in single-date mode |

## Key Functions

### `onMonthSelect(date)`

Rebuilds a date keeping the selected day clamped to the target month's length, clamped to `minDate`/`maxDate`, then calls `onDateChange`.

### `useDragScroll(ref)`

Adds web-only mouse drag-to-scroll listeners on a `ScrollView` and flags horizontal scrolling in `HorizontalScrollContext`.

## Styles

All static styles live in a dedicated file: `frontend/components/styles/SliderDatePicker.styles.ts` (exports `SliderDatePickerStyles`, imported as `styles` in the component). Only dynamic, state/theme-dependent values (background colors, borders, cursors) remain inline in the JSX.

## Data Flow

1. `months` and `dates` are rebuilt in effects from `selectDate` / `minDate` / `maxDate`
2. Selecting a month or day calls `onDateChange`; the parent screen re-fetches the games
3. Selecting a date auto-centers the day row on the new selection

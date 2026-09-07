# File: `frontend/components/DatePicker.tsx`

## Purpose

The **DateRangePicker** component provides a dropdown calendar picker for selecting either a single date (`selectDate` mode) or a date range (start/end). It's used by the calendar and schedule tabs to filter games by date.

## Key Features

- **Single date or range mode** — controlled by the `selectDate` prop
- **React Native Calendars** — uses `react-native-calendars` `Calendar` component
- **Localized display** — formats dates using the browser/device locale (`navigator.language`)
- **Date limits** — restricts selectable dates to the API/cache date range (`getDateRangeLimits()`)
- **Range marking** — highlights start/end days and fills intermediate dates
- **Click-outside close** — closes the calendar when clicking outside the wrapper
- **Readonly mode** — disables the picker when `readonly` is true
- **Theme aware** — colors adapt to light/dark theme and favorite team color
- **Auto-invert range** — swaps start/end if end is before start
- **End-of-day handling** — range end is set to 23:59:59, single date also set to end of day
- **Imperative ref** — converted to `forwardRef`; parents can open/close the calendar via the exposed `DatePickerHandle` (`open()` / `close()`). Used by the `SliderDatePicker` button.
- **Open-state callback** — `onOpenChange(open: boolean)` notifies the parent whenever the calendar opens/closes (imperatively, on date selection, or on click-outside), so the parent can keep its UI in sync.
- **"Aujourd'hui" button** — when the calendar is showing a month other than the current month, a button appears below the calendar to quickly jump back to today's date. In single-date mode, tapping it also selects today and closes the picker.
- **Centered modal display (all platforms)** — when opened, the calendar card is rendered centered vertically and horizontally over a dimmed backdrop (`rgba(0,0,0,0.5)`). On mobile it uses a transparent React Native `Modal`; on web (where RN `Modal` is unreliable) it uses a `position: fixed` full-screen overlay with `zIndex: 10000`. The card markup is shared between both paths (`calendarCard` variable). Tapping the backdrop closes the picker; taps on the card do not propagate. `onRequestClose` (Android back) also closes it. This replaces the previous in-page absolutely-positioned dropdown, which could be clipped by the screen's `ScrollView` / sticky header / `height: 0` wrapper (e.g. `index.tsx`), hiding parts of the card.
- **Close (X) button** — a plain close icon rendered at the **top-right of the modal card** (`alignSelf: 'flex-end', padding: 5`, 20px icon — identical to `GameModal`'s `closeButton` style); tapping it closes the calendar (`setIsOpen(false)`), which also fires `onOpenChange(false)`.

## Props

| Prop           | Type                     | Default                                          | Description                             |
| -------------- | ------------------------ | ------------------------------------------------ | --------------------------------------- |
| `onDateChange` | `(start, end) => void`   | —                                                | Called when a date or range is selected |
| `dateRange`    | `{ startDate, endDate }` | `{ startDate: new Date(), endDate: new Date() }` | Current range (range mode)              |
| `selectDate`   | `Date`                   | `undefined`                                      | When set, enables single-date mode      |
| `readonly`     | `boolean`                | `false`                                          | Disables interaction                    |
| `showInput`    | `boolean`                | `true`                                           | If `false`, hides the input box so the calendar can be opened imperatively via ref |

## Imperative handle

`DateRangePicker` is a `forwardRef` component exposing:
- `open()` — opens the calendar dropdown.
- `close()` — closes it.

## State Variables

| Variable             | Type                  | Description                                  |
| -------------------- | --------------------- | -------------------------------------------- |
| `isOpen`             | `boolean`             | Whether the calendar dropdown is visible     |
| `locale`             | `string`              | Locale string from `navigator.language`      |
| `currentVisibleDate` | `string` (YYYY-MM-DD) | Month currently displayed in the calendar    |
| `tempRange`          | `{ start, end }`      | Temporary selection during a two-click range |
| `wrapperRef`         | `Ref<HTMLDivElement>` | Ref for click-outside detection              |

## Key Memoized / Computed Values

- `selectedBackgroundColor` / `selectedTextColor` — from `useFavoriteColor('#000')`
- `backgroundColor` — `useThemeColor({ light: '#F0F0F0', dark: '#121212' }, 'background')` — same palette as `ThemedElements` so the picker matches the filter sections' background (previously used the default theme background `#ffffff`/`#151718`, which made the date filter visibly different from the team filter)
- `todayBrightColor` — brightened favorite color for the "today" highlight
- `dateLimits` — `{ minDate, maxDate }` from `getDateRangeLimits()`

## Key Functions

### `toDateString(date: Date): string`

Formats a date to local `YYYY-MM-DD`.

### `parseDateString(dateStr: string): Date`

Creates a local `Date` from a `YYYY-MM-DD` string.

### `handleDayPress(day: DateData)`

Handles calendar day selection:

- **Single mode** — immediately calls `onDateChange(date, date)` with end-of-day time and closes
- **Range mode** — first click sets `tempRange.start`; second click sets `tempRange.end` (inverting if needed), calls `onDateChange`, and closes

### `getMarkedDates()`

Builds the `markedDates` object for the calendar:

- Single mode: marks the selected date
- Range mode: marks start/end days with favorite colors and fills intermediate dates with light gray

### `displayText()`

Returns the localized display string:

- Single mode: `selectDate.toLocaleDateString(locale, ...)`
- Range mode: `"start - end"` formatted text

### `handleVisibleMonthsChange(months: DateData[])`

Updates `currentVisibleDate` as the user scrolls or navigates months. Used to show/hide the "Aujourd'hui" button.

### `goToToday()`

Jumps the calendar back to today's month. In single-date mode, also selects today's date (end-of-day) and closes the picker.

## Data Flow

1. Component mounts → detects locale, reads date limits from cache/API
2. User taps the input → calendar dropdown opens
3. User taps days → `handleDayPress` updates `tempRange` and calls `onDateChange`
4. Parent updates `dateRange`/`selectDate` → `useEffect` syncs `tempRange`
5. Clicking outside or pressing a valid date closes the dropdown

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
- **Range validation flow (schedule)** — in range mode (no `selectDate`), picking days only **stages** the selection in `tempRange` and **no longer closes the modal automatically**. The selection is committed via `onDateChange` only when the user presses the footer **"Valider" button** (`handleValidateRange`). Closing the modal any other way (backdrop tap, ✕ button, outside click, Android back) **discards the staging** — on next open, the `isOpen` effect re-syncs `tempRange` from the committed `dateRange` props, so the old selection is kept. Single-date mode (index) is unchanged: tapping a day still selects and closes immediately.
- **End-of-day handling** — range end is set to 23:59:59, single date also set to end of day
- **Imperative ref** — converted to `forwardRef`; parents can open/close the calendar via the exposed `DatePickerHandle` (`open()` / `close()`). Used by the `SliderDatePicker` button.
- **Open-state callback** — `onOpenChange(open: boolean)` notifies the parent whenever the calendar opens/closes (imperatively, on date selection, or on click-outside), so the parent can keep its UI in sync.
- **"Aujourd'hui" button & footer** — the modal has a **footer** row (`styles.footer`, `paddingBottom: 10`) that is **always rendered** below the scrollable calendar area, so its button never disappears when the calendar is taller than the scroll height. In **single-date mode** it hosts the "Aujourd'hui" quick-return button (jumps back to today and selects it). In **range mode** it hosts the **"Valider" button** (`translateWord('validate')`, added to all 11 languages): the staged range is only committed to the parent when this button is pressed. The button is **disabled** (greyed, `textDisabledColor`, opacity 0.5) until both bounds of the range are picked.
- **Modal display with title header & bounded scroll (all platforms)** — when opened, the calendar card is rendered over a dimmed backdrop (`rgba(0,0,0,0.5)`), **top-aligned** (backdrop uses `justifyContent: 'flex-start'` with a `paddingTop` margin — web 60px, native 80px) so the card is always fully in view regardless of the page height. The card follows the same modal pattern as the `Selector` (team/league filter): a **header row** (`styles.header`) with the **title on the left** (`styles.headerTitle`, `modalTitle`) and a **close (X) button on the right**, plus a **scrollable content area** (`ScrollView` with `maxHeight: 400`, `styles.scrollContent` / `scrollContentContainer`) so the calendar stays on screen even on short pages. Any action button (the "Aujourd'hui" footer) sits **below the ScrollView**, not inside it, so it cannot be scrolled out of view. On mobile it uses a transparent React Native `Modal`; on web (where RN `Modal` is unreliable) it uses a `position: fixed` full-screen overlay with `zIndex: 10000`. The card markup is shared between both paths (`calendarCard` variable). Tapping the backdrop closes the picker; taps on the card do not propagate. `onRequestClose` (Android back) also closes it. This replaces the previous in-page absolutely-positioned dropdown, which could be clipped by the screen's `ScrollView` / sticky header / `height: 0` wrapper (e.g. `index.tsx`), hiding parts of the card. **Backdrop structure**: the dimmed backdrop is a **sibling layer behind the card** (`absoluteFill` TouchableOpacity under a `position: 'relative', zIndex: 1` card wrapper), not its parent — this prevents presses inside the calendar (day cells, month-navigation arrows) from bubbling up to the backdrop and closing the modal (which previously closed the modal when picking the range end in another month).
- **Modal title** — the modal header shows `modalTitle`, derived from the optional `title` prop (which lets a parent pass the **same label as its date filter accordion** — e.g. `index.tsx` passes `translateFilterLabel('date')` = "Filtrer par date", `calendar.tsx` passes `translateWord('selectYourDates')` = "Filtrer par période"). When `title` is omitted it auto-derives from the mode: single-date → `translateWord('selectYourDates')` ("Filter by period"), range → `translateWord('filterInterval')` ("Filter by interval").
- **Close (X) button** — a plain close icon rendered at the **top-right of the modal card header** (`styles.header` → right side, 20px icon — identical to `GameModal`'s `closeButton` style); tapping it closes the calendar (`setIsOpen(false)`), which also fires `onOpenChange(false)`.
- **Fade animation** — the modal fades in with a 200ms animation. On web, this is done via CSS `@keyframes datepickerFadeIn`. On native, the React Native `Modal` component's built-in `animationType="fade"` is used. The modal stays mounted (native) so the fade-out animation plays properly when closing.

## Props

| Prop           | Type                     | Default                                          | Description                             |
| -------------- | ------------------------ | ------------------------------------------------ | --------------------------------------- |
| `onDateChange` | `(start, end) => void`   | —                                                | Called when a date or range is selected |
| `dateRange`    | `{ startDate, endDate }` | `{ startDate: new Date(), endDate: new Date() }` | Current range (range mode)              |
| `selectDate`   | `Date`                   | `undefined`                                      | When set, enables single-date mode      |
| `readonly`     | `boolean`                | `false`                                          | Disables interaction                    |
| `showInput`    | `boolean`                | `true`                                           | If `false`, hides the input box so the calendar can be opened imperatively via ref |
| `title`        | `string`                 | auto-derived from mode | Modal header title; pass the same label as the page's date filter accordion (e.g. `translateFilterLabel('date')` on index, `translateWord('selectYourDates')` on calendar) |

## Imperative handle

`DateRangePicker` is a `forwardRef` component exposing:
- `open()` — opens the calendar dropdown.
- `close()` — closes it.

## State Variables

| Variable             | Type                  | Description                                  |
| -------------------- | --------------------- | -------------------------------------------- |
| `isOpen`             | `boolean`             | Whether the calendar dropdown is open (logical state, fires `onOpenChange`) |
| `showModal`          | `boolean`             | Controls the actual visual rendering of the modal (delayed by 150ms after `isOpen` becomes true) |
| `locale`             | `string`              | Locale string from `navigator.language`      |
| `currentVisibleDate` | `string` (YYYY-MM-DD) | Month currently displayed in the calendar (`visibleMonth`, kept in sync via `onMonthChange` so the month arrows work even though `current` is a controlled prop; reset to the selected date's month each time the dropdown opens) |
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

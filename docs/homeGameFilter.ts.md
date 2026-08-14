# File: `frontend/utils/homeGameFilter.ts`

## Purpose

Provides pure helper functions to cycle through the home / all / away game filter values used by the Calendar tab's swipe gesture.

## Key Functions

### `getNextHomeGameFilter(current: HomeGameFilter): HomeGameFilter`

Returns the next filter in the cycle: `home` → `all` → `away` → `home`.

### `getPreviousHomeGameFilter(current: HomeGameFilter): HomeGameFilter`

Returns the previous filter in the cycle: `away` → `all` → `home` → `away`.

Both functions fall back to `'all'` for an unknown input value.

## Data Flow

1. `calendar.tsx` imports these helpers
2. The `swipePanResponder` calls `getNextHomeGameFilter` on swipe-left and `getPreviousHomeGameFilter` on swipe-right
3. The result is passed to `handleHomeGameToggle` to update the filter state

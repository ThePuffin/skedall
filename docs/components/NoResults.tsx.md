# File: `frontend/components/NoResults.tsx`

## Purpose

The **NoResults** component is shown when a screen has no data to display. It can also trigger a retry action and uses localized text.

## Key Features

- Displays a translated empty-state message
- Offers a refresh button for manual retry
- Applies a cooldown to prevent repeated retries too quickly
- Offers a "Show all results" button when the retry cooldown is active and the user has a filtered view

## Props

### `onRetry?: () => void`

Optional callback executed once on mount and whenever the user presses the refresh button.

### `onShowAll?: () => void`

Optional callback shown as a "Show all results" button **while the retry cooldown is active**. Used by screens (index, schedule) to let the user switch back to the "All" filter when a filtered view has no results and retry is temporarily unavailable.

## State Variables

- `isCooldownActive` — whether the retry button is temporarily disabled
- `hasRetried` — ensures the retry callback runs only once per mount

## Key Functions

### `handleManualRetry()`

Stores a timestamp in `sessionStorage`, enables the cooldown, and triggers the optional `onRetry` callback.

## Data Flow

1. The component is rendered when there is no available content.
2. If `onRetry` is provided, the callback is executed once.
3. The user can manually retry with the refresh button.
4. If the retry cooldown is active and `onShowAll` is provided, a "Show all results" button is displayed instead of the refresh button.
5. Clicking "Show all results" calls `onShowAll` (e.g., resets the filter to "ALL").

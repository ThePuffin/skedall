# File: `frontend/components/NoResults.tsx`

## Purpose

The **NoResults** component is shown when a screen has no data to display. It offers a manual retry button and uses localized text.

## Key Features

- Displays a translated empty-state message
- Offers a refresh button for manual retry
- Applies a cooldown to prevent repeated retries too quickly
- Offers a "Show all results" button when the retry cooldown is active and the user has a filtered view

## Props

### `onRetry?: () => void`

Optional callback executed when the user presses the refresh button.

### `onShowAll?: () => void`

Optional callback shown as a "Show all results" button **while the retry cooldown is active**. Used by screens (index, schedule) to let the user switch back to the "All" filter when a filtered view has no results and retry is temporarily unavailable.

## State Variables

- `isCooldownActive` — whether the retry button is temporarily disabled

## Key Functions

### `handleManualRetry()`

Stores a timestamp in `sessionStorage`, enables the cooldown, and triggers the optional `onRetry` callback.

## Data Flow

1. The component is rendered when there is no available content.
2. The user can manually retry with the refresh button.
3. If the retry cooldown is active and `onShowAll` is provided, a "Show all results" button is displayed instead of the refresh button.
4. Clicking "Show all results" calls `onShowAll` (e.g., resets the filter to "ALL").

## Note: No Auto-Retry

This component does **not** auto-retry on mount. Previously, it had an auto-retry mechanism that called `onRetry` once on mount, but this was removed because it caused an infinite loop when used with screens that toggle `isLoading` state (e.g., `index.tsx` Game of the Day). The auto-retry would set `isLoading = true`, unmounting `NoResults`, and when the fetch completed, `NoResults` would remount (with a fresh `hasRetried` ref) and retry again indefinitely.

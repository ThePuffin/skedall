# File: `frontend/components/NoResults.tsx`

## Purpose

The **NoResults** component is shown when a screen has no data to display. It can also trigger a retry action and uses localized text.

## Key Features

- Displays a translated empty-state message
- Offers a refresh button for manual retry
- Applies a cooldown to prevent repeated retries too quickly

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

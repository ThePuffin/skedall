# File: `frontend/app/+not-found.tsx`

## Purpose

The **NotFoundScreen** component is the 404 fallback page displayed when the user navigates to a route that doesn't exist. It shows a translated error message, a link back to the home screen, and a fun animated mascot GIF.

## Key Features

- **Translated title** — uses `translateWord('wrongPage')` for the main message
- **Home link** — links back to the home screen (`/`) with translated text
- **App logo** — displays the `AppLogo` component in a header row
- **Animated GIF** — shows a mascot dance GIF from Giphy
- **Hidden header** — hides the stack header via `Stack.Screen options`

## Key Functions

### `NotFoundScreen()`

Renders the 404 page:

1. Displays the `AppLogo` in a top header row (using HTML `div` for web)
2. Hides the stack header
3. Shows the translated "wrong page" title
4. Shows a link to the home screen
5. Displays an animated mascot GIF

## Data Flow

- App routes to an unknown path → Expo Router renders `+not-found`
- Component uses `translateWord()` to localize text
- Link navigates user back to `/` (the home tab)

# File: `frontend/components/AppLogo.tsx`

## Purpose

The **AppLogo** component renders the SkedAll logo — the app icon image next to the "SkedAll" wordmark. It links back to the home screen (`/`) when tapped.

## Key Features

- **Brand display** — shows the SkedAll icon + wordmark
- **Home navigation** — wraps in a `Link` to `/` for navigation
- **Compact mode** — reduces font size for smaller headers
- **Accessible** — sets `aria-level="1"` on the title text

## Props

| Prop      | Type      | Default | Description                       |
| --------- | --------- | ------- | --------------------------------- |
| `compact` | `boolean` | `false` | Reduces the title font size to 20 |

## Data Flow

- Rendered in headers across multiple screens (tabs, refresh, 404)
- Tapping the logo navigates the user back to the home screen via `expo-router` `Link`

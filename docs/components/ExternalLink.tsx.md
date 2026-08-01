# File: `frontend/components/ExternalLink.tsx`

## Purpose

The **ExternalLink** component wraps `expo-router`'s `Link` to open external URLs in an **in-app browser** on native platforms (`expo-web-browser`) while behaving like a normal link on web.

## Key Features

- **In-app browser on native** — uses `openBrowserAsync` on iOS/Android
- **Normal link on web** — opens in a new tab (`target="_blank"`)
- **Type-safe props** — reuses `Link` props with `href` as a required string

## Props

| Prop    | Type         | Description                          |
| ------- | ------------ | ------------------------------------ |
| `href`  | `string`     | External URL to open                 |
| ...rest | `Link` props | All other `expo-router` `Link` props |

## Data Flow

1. User presses the link
2. On native: `event.preventDefault()` stops the default browser, then `openBrowserAsync(href)` opens an in-app browser
3. On web: `target="_blank"` opens the URL in a new tab

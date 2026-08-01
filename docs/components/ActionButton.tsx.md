# File: `frontend/components/ActionButton.tsx`

## Purpose

The **ActionButton** component is a floating action button (FAB) fixed at the bottom-right of the screen. It serves two purposes: a "scroll to top" button when the user has scrolled down, and a gear button that opens the favorites modal (`FavModal`) when at the top of the page.

## Key Features

- **Dual behavior** — scrolls to top when scrolled down, opens fav modal when at top
- **Animated visibility** — fades out/in when toggling between the two states
- **Imperative handle** — exposes `handleScroll` and `openFavModal` to parent via ref
- **Favorites persistence** — reads/writes `favoriteTeams` from cache via `getCache`/`saveCache`
- **Favorites updated event** — dispatches `favoritesUpdated` on the window when teams are saved
- **FavModal** — renders the favorites modal, auto-opens on mount if no favorite teams exist

## Props

| Prop            | Type                          | Description                                   |
| --------------- | ----------------------------- | --------------------------------------------- |
| `scrollViewRef` | `React.RefObject<ScrollView>` | Reference to the scroll view to scroll to top |

## Exposed Ref Methods (`ActionButtonRef`)

| Method         | Signature         | Description                                      |
| -------------- | ----------------- | ------------------------------------------------ |
| `handleScroll` | `(event: any) =>` | Handles scroll events, toggles scroll-top button |
| `openFavModal` | `() => void`      | Opens the favorites modal                        |

## State Variables

| Variable             | Type             | Description                                       |
| -------------------- | ---------------- | ------------------------------------------------- |
| `favoriteTeams`      | `string[]`       | List of favorite team IDs, initialized from cache |
| `isOpenModal`        | `boolean`        | Whether the favorites modal is open               |
| `isVisibleScrollTop` | `boolean`        | Whether the scroll-to-top mode is active          |
| `fadeAnim`           | `Animated.Value` | Opacity value used for fade transitions           |

## Key Functions

### `animateToggle(showTop: boolean)`

Fades the button out, switches its mode, then fades it back in.

### `handleScroll(event: any)`

Reads `contentOffset.y` and shows the scroll-top button when scrollY > 200. Only animates when the visibility state changes.

### `scrollToTop()`

Scrolls the parent `ScrollView` back to `y: 0` with animation.

### `saveTeams(newTeams: string[])`

Updates the favorite teams state, saves to cache, and dispatches the `favoritesUpdated` window event.

## Data Flow

1. Component mounts → reads `favoriteTeams` from cache
2. If no favorites → `FavModal` auto-opens
3. Parent screen passes a `ScrollView` ref and forwards scroll events to `handleScroll`
4. User scrolls > 200px → button fades into "scroll to top" mode
5. User taps button → scrolls to top (or opens modal if already at top)
6. Saving teams → updates cache and dispatches `favoritesUpdated` event

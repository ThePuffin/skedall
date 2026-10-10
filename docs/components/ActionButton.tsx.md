# File: `frontend/components/ActionButton.tsx`

## Purpose

The **ActionButton** component is a floating action button (FAB) fixed at the bottom-right of the screen. Its burger button expands into separate scroll-to-top and favorites actions above it; the burger changes to a close icon while expanded.

## Key Features

- **Expandable actions menu** — opens separate scroll-to-top, scroll-to-bottom, and favorites buttons
- **Scroll state** — disables and dims scroll actions at their respective ends
- **Fresh scroll state** — re-measures the scroll view when the burger menu opens (and on every render while it stays open) so the buttons reflect the actual scrollability even before any scroll event fires — e.g. when the page content finishes loading after the initial data fetch
- **Theme-aware buttons** — uses the shared `Colors` palette for button backgrounds, borders, and icons
- **Menu toggle** — changes between burger and close icons
- **Imperative handle** — exposes `handleScroll` and `openFavModal` to parent via ref
- **Favorites persistence** — reads/writes `favoriteTeams` from cache via `getCache`/`saveCache`
- **Favorites updated event** — dispatches `favoritesUpdated` on the window when teams are saved
- **FavModal** — renders the favorites modal, auto-opens on mount if no favorite teams exist

## Props

| Prop            | Type                          | Description                                   |
| --------------- | ----------------------------- | --------------------------------------------- |
| `scrollViewRef` | `React.RefObject<ScrollView>` | Reference to the scroll view to scroll to top |

## Exposed Ref Methods (`ActionButtonRef`)

| Method         | Signature         | Description                                               |
| -------------- | ----------------- | --------------------------------------------------------- |
| `handleScroll` | `(event: NativeSyntheticEvent<NativeScrollEvent>) =>` | Tracks whether the scroll view can scroll in either direction |
| `openFavModal` | `() => void`      | Opens the favorites modal                                 |

## State Variables

| Variable         | Type       | Description                                       |
| ---------------- | ---------- | ------------------------------------------------- |
| `favoriteTeams`  | `string[]` | List of favorite team IDs, initialized from cache |
| `isOpenModal`    | `boolean`  | Whether the favorites modal is open               |
| `isMenuOpen`     | `boolean`  | Whether the actions menu is expanded              |
| `canScrollToTop` | `boolean`  | Whether the scroll view can scroll upward         |
| `canScrollToBottom` | `boolean` | Whether the scroll view can scroll downward       |

## Key Functions

### `handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>)`

Reads the scroll offset, content height, and viewport height to enable each scroll action only when movement in that direction is possible.
Closes the actions menu whenever the parent scroll view scrolls.

### `refreshScrollState()`

Reads the current scroll position and sizes directly from the scrollable node (`getScrollableNode()` on web: `scrollTop` / `scrollHeight` / `clientHeight`) and updates `canScrollToTop` / `canScrollToBottom` **without** closing the menu. Called when the burger menu opens and on every render while the menu stays open, so state that went stale (no scroll event after a data fetch) is corrected. No-op when the scrollable node is unavailable (e.g. native), keeping the event-driven behavior.

### `scrollToTop()`

Collapses the actions menu and scrolls the parent `ScrollView` back to `y: 0` with animation.

### `scrollToBottom()`

Collapses the actions menu and scrolls the parent `ScrollView` to its end with animation.

### `openFavorites()`

Collapses the actions menu and opens the favorites modal.

### `saveTeams(newTeams: string[])`

Updates the favorite teams state, saves to cache, and dispatches the `favoritesUpdated` window event.

## Data Flow

1. Component mounts → reads `favoriteTeams` from cache
2. If no favorites → `FavModal` auto-opens
3. Parent screen passes a `ScrollView` ref and forwards scroll events to `handleScroll`
4. Parent screen forwards scroll events to update whether either scroll action is enabled and collapse the menu
5. User taps the burger → the scroll state is re-measured from the scroll view, then the scroll-to-top, scroll-to-bottom, and favorites actions appear above it
6. User taps the close icon → the actions menu collapses
7. User selects an action → it performs its action and collapses the menu
8. Saving teams → updates cache and dispatches the `favoritesUpdated` window event

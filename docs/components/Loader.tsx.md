# File: `frontend/components/Loader.tsx`

## Purpose

The **Loader** component shows a loading spinner with a rotating sports anecdote from the local stories dataset.

## Key Features

- Displays a centered `ActivityIndicator`
- Shows a random story or anecdote from `Stories.json`
- Detects the browser language and chooses English or French content

## State Variables

- `story` — the currently selected anecdote object or `null`

## Key Functions

### `useEffect()`

Loads a story from the correct language dataset after mount.

## Data Flow

1. The component mounts.
2. It reads the browser language.
3. It picks one random story from the matching dataset.
4. The spinner and story text are rendered.

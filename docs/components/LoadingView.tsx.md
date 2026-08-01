# File: `frontend/components/LoadingView.tsx`

## Purpose

The **LoadingView** component provides a full-page loading wrapper that renders the shared loader UI.

## Key Features

- Centers the loader vertically and horizontally
- Uses full viewport height for a clear loading state

## Data Flow

1. The parent component renders `LoadingView` during async work.
2. The component displays the shared `Loader` UI.
3. Once the parent stops rendering it, the loading state disappears.

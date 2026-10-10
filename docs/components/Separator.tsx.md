# File: `frontend/components/Separator.tsx`

## Purpose

The **Separator** component renders a horizontal divider line used between filter sections.

## Props

| Prop     | Type     | Default | Description                                    |
| -------- | -------- | ------- | ---------------------------------------------- |
| `height` | `number` | `1`     | Height of the separator line in pixels         |
| `opacity` | `number` | `0.2`  | Opacity of the separator line (0 = transparent, 1 = fully opaque). When `undefined`, defaults to `0.2`. |

## Key Features

- **Theme-aware** — uses `useThemeColor` for the line color
- **Smooth transition** — CSS `transition: opacity 200ms ease-in-out` on the line for animated opacity changes
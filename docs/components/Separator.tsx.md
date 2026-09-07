# File: `frontend/components/Separator.tsx`

## Purpose

The **Separator** component renders a horizontal divider line used between filter sections. It can optionally display a label in the center.

## Props

| Prop     | Type     | Default | Description                                    |
| -------- | -------- | ------- | ---------------------------------------------- |
| `height` | `number` | `1`     | Height of the separator line in pixels         |
| `label`  | `string` | —       | Optional label text displayed in the center    |
| `opacity` | `number` | `0.2`  | Opacity of the separator line (0 = transparent, 1 = fully opaque). When `undefined`, defaults to `0.2`. |

## Key Features

- **Theme-aware** — uses `useThemeColor` for the line color
- **Smooth transition** — CSS `transition: opacity 200ms ease-in-out` on the line for animated opacity changes
- **Optional label** — when provided, displays uppercase text with letter-spacing centered between two line segments
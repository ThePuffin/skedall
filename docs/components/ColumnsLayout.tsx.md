# File: `frontend/components/ColumnsLayout.tsx`

## Purpose

The **ColumnsLayout** module provides a set of layout components for rendering tabular multi-column layouts. It's used to display games in column-based views (e.g., by day of week or by league) where each column has a header and content.

## Key Features

- **`ColumnsHeader`** — renders a header row with column titles in a bordered table
- **`ColumnsContent`** — renders the content row beneath the header
- **Configurable width** — both components accept a `widthStyle` prop
- **No columns** — returns `null` when the `columns` array is empty
- **Themed** — uses `ThemedText` / `ThemedView` for consistency

## Types

### `ColumnData`

| Field     | Type              | Description             |
| --------- | ----------------- | ----------------------- |
| `title`   | `string`          | Column title text       |
| `key`     | `string`          | Unique column key       |
| `content` | `React.ReactNode` | Optional column content |

## Components

### `ColumnsHeader({ columns, widthStyle = '100%' })`

Renders a white table header with black borders. Each column title is displayed with `ThemedText type="subtitle"`. Column dividers are drawn between cells (except after the last column).

### `ColumnsContent({ columns, widthStyle = '100%' })`

Renders a themed table where each column's `content` node is placed in a vertically-top-aligned cell.

## Data Flow

1. Parent provides `ColumnData[]` with titles and optional content
2. `ColumnsHeader` renders the title row
3. `ColumnsContent` renders the content cells beneath
4. Both use `tableLayout: fixed` for equal column widths

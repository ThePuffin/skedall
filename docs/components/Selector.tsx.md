# File: `frontend/components/Selector.tsx`

## Purpose

Searchable modal for league/team selection, supporting single and multiple selection.

## State and data flow

- `visible` controls the modal; opening clears search and focuses the input after 700ms.
- `search` is trimmed by the input handler; `debouncedSearch` filters options after 700ms.
- `selectedLeague` and cached `favoriteTeams` filter and order options.
- `tempSelectedId` / `tempSelectedIds` hold draft selections until validation.
- Incoming selection synchronizes the draft while visible. Multiple-selection IDs are compared by serialized content, not array identity, so parent renders and API updates with unchanged selection do not erase the draft.

## Key functions

- `handleSelect` cancels pending search debounce, applies current search and toggles the draft selection.
- `handleValidate` sends the draft and `data.i` to the parent, then closes.
- `handleClear` sends an empty selection to the parent.
- The list uses `keyboardShouldPersistTaps="always"`.

## Limitations

Options can still change when fresh data arrives. Cancelling debounce in `handleSelect` only acts once the press handler has fired; it cannot guarantee that a row never moves before a press completes.

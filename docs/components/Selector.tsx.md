# File: `frontend/components/Selector.tsx`

## Purpose

Searchable modal for league/team selection, supporting single and multiple selection.

## State and data flow

- `visible` controls the modal; opening clears search and focuses the input after 700ms.
- `search` is trimmed by the input handler; `debouncedSearch` filters options after 700ms.
- `selectedLeague` and cached `favoriteTeams` filter and order options. Each option's `league` is derived from the team id via `getTeamLeagueFromId()`, so Olympic sport-specific ids (`OLYMPICS-HOCKEY/BASKETBALL-M/W-PAYS`) collapse to their gender chip (`OLYMPICS-MEN` / `OLYMPICS-WOMEN`) and actually match a selected league chip instead of being hidden.
- League filter chips are based on actual leagues, not the special `all` option or any league label equal to `all` (case-insensitive). When multiple leagues are available, the global filter is shown once using the localized `translateWord('all')` label; with only one league, no league chips are shown.
- `tempSelectedId` / `tempSelectedIds` hold draft selections until validation.
- Incoming selection synchronizes the draft while visible. Multiple-selection IDs are compared by serialized content, not array identity, so parent renders and API updates with unchanged selection do not erase the draft.

## Key functions

- `handleSelect` cancels pending search debounce, applies current search and toggles the draft selection.
- `handleValidate` sends the draft and `data.i` to the parent, then closes.
- `handleClear` sends an empty selection to the parent.
- The list uses `keyboardShouldPersistTaps="always"`.

## Fuzzy search

When the user types a search term and no option matches it exactly (case-insensitive substring match), the component falls back to a **fuzzy search** powered by Levenshtein distance (`frontend/utils/fuzzySearch.ts`). The closest options — sorted by distance, then alphabetically — are displayed with localized text explaining there was no exact match and introducing the closest matches:

> No exact matches for "new jerzey". Closest matches:

This lets users find teams and leagues despite typos or missing spaces (e.g. `"new jerzey"`, `"nou jersey"`, and `"newjersey"` → `"New Jersey"`; `"jarsey"` → `"New Jersey Devils"`; `"jarz"` → `"Jazz"`; `"mlf"` → `"MLB"` and `"MLS"`). Fuzzy results compare each query word to label words and compact substrings, ranking by edit distance so a close word match like `"jarsey"` → `"jersey"` appears before unrelated labels.

Each query word must be within an edit-distance threshold of `max(2, floor(word length * 0.25))` from a label word or compact-label substring. Distances are summed for multiword queries, and only options with a total distance ≤ 6 are kept. Up to 15 closest matches are displayed.

The fuzzy fallback respects the currently selected league filter: it only searches within the already league-filtered options.

## Limitations

Options can still change when fresh data arrives. Cancelling debounce in `handleSelect` only acts once the press handler has fired; it cannot guarantee that a row never moves before a press completes.

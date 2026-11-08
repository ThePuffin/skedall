# File: `frontend/utils/fuzzySearch.ts`

## Purpose

Provides a lightweight **fuzzy search** utility based on the Levenshtein (edit) distance. It lets the `Selector` component find the closest-matching teams when the user makes a typo (e.g. `"new jerzey"` → `"New Jersey"`).

## Key functions

### `levenshteinDistance(a, b): number`

Computes the minimum number of single-character edits (insertions, deletions, substitutions) needed to transform string `a` into string `b`. Case-sensitive; callers should normalise case before calling.

Optimised with a single-row dynamic-programming array (O(min(m, n)) space).

### `fuzzySearch<T>(query, options, getLabel?, maxResults?, maxDistance?): FuzzyResult<T>[]`

Searches a list of options by comparing the query (lowercased, trimmed) against each option's label using Levenshtein distance.

- `query` — user-typed search string
- `options` — array of options to search through
- `getLabel` — extracts the searchable label from an option (defaults to `opt.label`)
- `maxResults` — maximum number of results to return (default: `10`)
- `maxDistance` — maximum edit distance allowed, or a function of query length returning that maximum (default: `3`)

Returns results sorted by distance ascending, then alphabetically by label. Each result includes the original option and its distance.

### `fuzzySearchBestWord<T>(query, options, getLabel?, maxResults?, maxDistance?): FuzzyResult<T>[]`

Compares every query word against the closest word in each option's label. Each query word must be within `maxDistance`, and the result distance is the sum of the closest word distances. This prevents a shared exact word from hiding a typo in another word.

- `query` — user-typed search string
- `options` — array of options to search through
- `getLabel` — extracts the searchable label from an option (defaults to `opt.label`)
- `maxResults` — maximum number of results to return (default: `10`)
- `maxDistance` — maximum edit distance allowed for each query word (default: `2`)

Returns results sorted by summed word distance ascending, then alphabetically by label.

### `fuzzySearchOptions<T>(query, options, getLabel?, maxResults?): FuzzyResult<T>[]`

Compares every query word against each label's words and compact substrings (ignoring spaces). Each query word must be within `max(2, floor(word length * 0.25))` edit distance. Query word distances are summed, then results are sorted by distance and label. This prioritizes a close word match such as `"jarsey"` → `"Jersey"` over unrelated labels.

### `FuzzyResult<T>`

| Field     | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| `option`  | `T`    | The matched option                         |
| `distance`| `number`| Levenshtein-based score for the matched option |

## Usage in `Selector`

When a search term yields no exact substring match, `Selector.tsx` calls `fuzzySearchOptions` and displays the closest matches with a localized label, respecting any currently selected league filter.

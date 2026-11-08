/**
 * Compute the Levenshtein (edit) distance between two strings.
 * The distance is the minimum number of single-character edits
 * (insertions, deletions, substitutions) required to change one string into the other.
 *
 * Optimised with a single-row dynamic programming array (O(min(m,n)) space).
 */
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;

  if (an === 0) return bn;
  if (bn === 0) return an;

  // Use the shorter string as the column vector to minimise memory.
  if (an > bn) {
    return levenshteinDistance(b, a);
  }

  const vector: number[] = new Array(bn + 1);
  for (let j = 0; j <= bn; j++) {
    vector[j] = j;
  }

  for (let i = 1; i <= an; i++) {
    let previousDiagonal = i - 1;
    vector[0] = i;

    for (let j = 1; j <= bn; j++) {
      const previousColumn = vector[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      vector[j] = Math.min(
        vector[j] + 1,      // deletion (from a)
        vector[j - 1] + 1,  // insertion (into a)
        previousDiagonal + cost // substitution
      );
      previousDiagonal = previousColumn;
    }
  }

  return vector[bn];
}

/**
 * Result of a fuzzy search for a single option.
 */
export interface FuzzyResult<T> {
  option: T;
  /** Edit distance between the query and the option's label (lower = closer match). */
  distance: number;
}

/**
 * Perform a fuzzy search over a list of options using Levenshtein distance.
 *
 * Compares the whole query string against each option's full label.
 *
 * @param query - User-typed search string (case-insensitive, trimmed).
 * @param options - Options to search through.
 * @param getLabel - Extract the searchable label from an option (default: `opt.label`).
 * @param maxResults - Maximum number of results to return (default: 10).
 * @param maxDistance - Maximum edit distance allowed, or a function of query length
 *                      returning that maximum (default: 3).
 * @returns Options sorted by distance ascending, then alphabetically.
 */
export function fuzzySearch<T extends { label?: string }>(
  query: string,
  options: T[],
  getLabel: (opt: T) => string = (opt) => opt.label ?? '',
  maxResults = 10,
  maxDistance: number | ((queryLength: number) => number) = 3,
): FuzzyResult<T>[] {
  const q = query.toLowerCase().trim();
  if (!q || options.length === 0) return [];

  const threshold =
    typeof maxDistance === 'function' ? maxDistance(q.length) : maxDistance;

  const results: FuzzyResult<T>[] = [];

  for (const opt of options) {
    const label = getLabel(opt);
    if (!label) continue;

    const distance = levenshteinDistance(q, label.toLowerCase());
    if (distance <= threshold) {
      results.push({ option: opt, distance });
    }
  }

  results.sort(
    (a, b) =>
      a.distance - b.distance ||
      getLabel(a.option).localeCompare(getLabel(b.option)),
  );

  return results.slice(0, maxResults);
}

/**
 * Fuzzy search by words, scoring each query word against its closest label word.
 * Every query word must be within maxDistance, so a shared exact word cannot
 * hide a typo in another word.
 */
export function fuzzySearchBestWord<T extends { label?: string }>(
  query: string,
  options: T[],
  getLabel: (opt: T) => string = (opt) => opt.label ?? '',
  maxResults = 10,
  maxDistance = 2,
): FuzzyResult<T>[] {
  const queryWords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (queryWords.length === 0 || options.length === 0) return [];

  const results: FuzzyResult<T>[] = [];

  for (const opt of options) {
    const label = getLabel(opt);
    if (!label) continue;

    const labelWords = label.toLowerCase().split(/\s+/).filter(Boolean);
    let totalDistance = 0;
    let matches = true;
    for (const qWord of queryWords) {
      let bestDistance = Infinity;
      for (const lWord of labelWords) {
        const d = levenshteinDistance(qWord, lWord);
        if (d < bestDistance) bestDistance = d;
      }

      if (bestDistance > maxDistance) {
        matches = false;
        break;
      }
      totalDistance += bestDistance;
    }

    if (matches) {
      results.push({ option: opt, distance: totalDistance });
    }
  }

  results.sort(
    (a, b) =>
      a.distance - b.distance ||
      getLabel(a.option).localeCompare(getLabel(b.option)),
  );

  return results.slice(0, maxResults);
}

/**
 * Rank options by comparing query words with label words and compact substrings.
 * This keeps a close word match ahead of unrelated full labels.
 *
 * Only options whose every query word is within `maxDistance` of a label word
 * are kept, and the summed `totalDistance` must not exceed `maxTotalDistance`.
 * Results are sorted by total distance ascending (closest first).
 */
export function fuzzySearchOptions<T extends { label?: string }>(
  query: string,
  options: T[],
  getLabel: (opt: T) => string = (opt) => opt.label ?? '',
  maxResults = 15,
  maxTotalDistance = 6,
): FuzzyResult<T>[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery || options.length === 0) return [];

  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
  const results: FuzzyResult<T>[] = [];

  for (const option of options) {
    const label = getLabel(option).toLowerCase().trim();
    const labelWords = label.split(/\s+/).filter(Boolean);
    if (labelWords.length === 0) continue;

    let totalDistance = 0;
    let matches = true;
    for (const queryWord of queryWords) {
      const maxDistance = Math.max(2, Math.floor(queryWord.length * 0.25));
      let bestDistance = Infinity;
      for (const labelWord of labelWords) {
        bestDistance = Math.min(
          bestDistance,
          levenshteinDistance(queryWord, labelWord),
        );
      }

      const compactQuery = queryWord.replace(/\s+/g, '');
      const compactLabel = label.replace(/\s+/g, '');
      if (compactLabel.includes(compactQuery)) {
        bestDistance = 0;
      } else {
        for (
          let windowLength = Math.max(1, queryWord.length - maxDistance);
          windowLength <= queryWord.length + maxDistance &&
          windowLength <= compactLabel.length;
          windowLength++
        ) {
          for (let start = 0; start + windowLength <= compactLabel.length; start++) {
            bestDistance = Math.min(
              bestDistance,
              levenshteinDistance(
                queryWord,
                compactLabel.slice(start, start + windowLength),
              ),
            );
          }
        }
      }

      if (bestDistance > maxDistance) {
        matches = false;
        break;
      }
      totalDistance += bestDistance;
    }

    if (matches && totalDistance <= maxTotalDistance) {
      results.push({ option, distance: totalDistance });
    }
  }

  return results
    .sort((a, b) => a.distance - b.distance || getLabel(a.option).localeCompare(getLabel(b.option)))
    .slice(0, maxResults);
}

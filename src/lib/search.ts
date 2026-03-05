export interface SearchItem {
  type: "article" | "snippet" | "project";
  title: string;
  description: string;
  href: string;
  tags: string[];
  meta: string;
}

export interface FuzzyResult {
  item: SearchItem;
  score: number;
  titleIndices: number[];
  descIndices: number[];
}

/**
 * fzf-style fuzzy match. Returns null if no match.
 * Scores: consecutive +8, word-boundary +5, case-exact +1, length bonus.
 */
export function fuzzyMatch(
  query: string,
  target: string,
): { score: number; indices: number[] } | null {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  if (q.length === 0) return { score: 0, indices: [] };
  if (q.length > t.length) return null;

  const indices: number[] = [];
  let score = 0;
  let prev = -1;
  let qi = 0;

  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      indices.push(i);

      // consecutive match
      if (i === prev + 1) score += 8;

      // word boundary (start, after separator)
      if (i === 0 || /[\s\-_/.]/.test(t[i - 1])) score += 5;

      // exact case
      if (target[i] === query[qi]) score += 1;

      prev = i;
      qi++;
    }
  }

  // all query chars must match
  if (qi < q.length) return null;

  // length bonus — shorter targets are more specific
  score += Math.max(0, 30 - t.length);

  // coverage bonus
  score += Math.round((q.length / t.length) * 20);

  return { score, indices };
}

/** Search items with fuzzy matching, returning sorted results. */
export function search(
  items: SearchItem[],
  query: string,
  category: string,
): FuzzyResult[] {
  const filtered = items.filter(
    (item) => category === "all" || item.type === category,
  );

  if (!query.trim()) {
    return filtered.map((item) => ({
      item,
      score: 0,
      titleIndices: [],
      descIndices: [],
    }));
  }

  const results: FuzzyResult[] = [];

  for (const item of filtered) {
    const tm = fuzzyMatch(query, item.title);
    const dm = fuzzyMatch(query, item.description);
    const tagHit = item.tags.some((tag) => fuzzyMatch(query, tag) !== null);
    const metaHit = item.meta ? fuzzyMatch(query, item.meta) !== null : false;

    if (tm || dm || tagHit || metaHit) {
      results.push({
        item,
        score:
          (tm?.score ?? 0) * 2 +
          (dm?.score ?? 0) +
          (tagHit ? 10 : 0) +
          (metaHit ? 8 : 0),
        titleIndices: tm?.indices ?? [],
        descIndices: dm?.indices ?? [],
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

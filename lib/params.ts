/**
 * Cache Components need at least one static param per dynamic route. When there is nothing to
 * list (no entries yet, or no key), this placeholder fails the slug check and renders a 404.
 */
export const PLACEHOLDER_PARAM = '_';

/** `/blog/page/2` → 2; anything that is not a page past the first → `null`. */
export function parseListPage(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return page >= 2 ? page : null;
}

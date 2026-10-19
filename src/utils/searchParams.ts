export type SearchParamsPatch = Record<string, string | number | null | undefined>;

/**
 * Returns a copy of `params` with the patch applied. Empty, null or undefined
 * values remove the key so URLs stay clean.
 */
export function patchSearchParams(params: URLSearchParams, patch: SearchParamsPatch) {
  const next = new URLSearchParams(params);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === undefined || value === '') next.delete(key);
    else next.set(key, String(value));
  }
  return next;
}

/** Parses a 1-based page number, falling back to 1 for invalid input. */
export function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

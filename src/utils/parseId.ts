/** Parses a positive integer route id; returns `null` for anything else (e.g. `/products/abc`). */
export function parseId(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

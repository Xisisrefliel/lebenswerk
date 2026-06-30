/**
 * Type-safe accessor for component/token options (Record<string, unknown>).
 * Replaces scattered `as string | undefined` casts with runtime validation.
 */

/**
 *
 * @param opts
 * @param key
 * @param fallback
 * @returns The string value if present, otherwise the fallback
 */
export function optStr(opts: Record<string, unknown>, key: string, fallback: string): string {
  const v = opts[key];
  return typeof v === 'string' ? v : fallback;
}

/**
 *
 * @param opts
 * @param key
 * @param fallback
 * @returns The number value if present, otherwise the fallback
 */
export function optNum(
  opts: Record<string, unknown>,
  key: string,
  fallback?: number,
): number | undefined {
  const v = opts[key];
  return typeof v === 'number' ? v : fallback;
}

/**
 *
 * @param opts
 * @param key
 * @param fallback
 * @returns The string array if present, otherwise the fallback
 */
export function optStrArray(
  opts: Record<string, unknown>,
  key: string,
  fallback: string[],
): string[] {
  const v = opts[key];
  return Array.isArray(v) ? (v as string[]) : fallback;
}

/**
 *
 * @param opts
 * @param key
 * @param fallback
 * @returns The array if present, otherwise the fallback
 */
export function optArray<T>(opts: Record<string, unknown>, key: string, fallback: T[]): T[] {
  const v = opts[key];
  return Array.isArray(v) ? (v as T[]) : fallback;
}

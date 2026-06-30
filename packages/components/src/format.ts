import type { IsoDateLike, Locale } from '@cv/core';
import { getLabel } from './labels.js';

/**
 *
 * @param value
 * @param locale
 * @returns Formatted date string (e.g. "Jan 2024") or empty string
 */
export function formatIsoDate(value: IsoDateLike | undefined, locale: Locale): string {
  if (!value) return '';
  const parts = value.split('-');
  const year = parts[0];
  const month = parts[1];
  if (!month) return year ?? '';
  const monthIndex = Number.parseInt(month, 10) - 1;
  if (Number.isNaN(monthIndex)) return year ?? '';
  const monthName = new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    month: 'short',
  }).format(new Date(Date.UTC(2000, monthIndex, 1)));
  return `${monthName} ${year}`;
}

/**
 * Format a full ISO date for display (e.g. "14.05.1992" for de, "May 14, 1992" for en).
 * Falls back to {@link formatIsoDate} for partial dates (YYYY or YYYY-MM).
 * @param value
 * @param locale
 * @returns Formatted date string, or empty string if value is undefined.
 */
export function formatFullDate(value: IsoDateLike | undefined, locale: Locale): string {
  if (!value) return '';
  const parts = value.split('-');
  if (parts.length < 3) return formatIsoDate(value, locale);
  const [year, month, day] = parts;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 *
 * @param start
 * @param end
 * @param locale
 * @returns Formatted date range string (e.g. "Jan 2020 – Dec 2024")
 */
export function formatDateRange(
  start: IsoDateLike | undefined,
  end: IsoDateLike | undefined,
  locale: Locale,
): string {
  const left = formatIsoDate(start, locale);
  const right = end ? formatIsoDate(end, locale) : getLabel(locale, 'present');
  if (!left) return right;
  return `${left} – ${right}`;
}

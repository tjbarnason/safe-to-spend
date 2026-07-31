import { format, differenceInDays } from 'date-fns';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currencyCompactFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Format integer cents to display currency string.
 * Example: 240000 → "$2,400.00"
 */
export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

/**
 * Format integer cents to compact display (no cents if whole dollar).
 * Example: 240000 → "$2,400", 12750 → "$127.50"
 */
export function formatCurrencyCompact(cents: number): string {
  const dollars = cents / 100;
  if (Number.isInteger(dollars)) {
    return currencyCompactFormatter.format(dollars);
  }
  return currencyFormatter.format(dollars);
}

/**
 * Parse a display currency string back to integer cents.
 * Example: "$2,400.00" → 240000
 * Returns NaN if parsing fails.
 */
export function parseCents(display: string): number {
  // Strip everything except digits, dot, and minus sign
  const cleaned = display.replace(/[^0-9.\-]/g, '');
  if (cleaned === '' || cleaned === '-') {
    return NaN;
  }
  const dollars = parseFloat(cleaned);
  if (isNaN(dollars)) {
    return NaN;
  }
  return Math.round(dollars * 100);
}

/**
 * Format a date for display. Example: "Jul 15"
 */
export function formatDate(date: Date): string {
  return format(date, 'MMM d');
}

/**
 * Format a date as relative. Example: "in 3 days", "tomorrow", "today"
 */
export function formatRelativeDate(date: Date, referenceDate?: Date): string {
  const ref = referenceDate ?? new Date();

  const days = differenceInDays(date, ref);

  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days === -1) return 'yesterday';

  if (days < 0) {
    return `${Math.abs(days)} days ago`;
  }

  return `in ${days} days`;
}

/**
 * Format a date range. Example: "Jul 15 – Jul 29"
 */
export function formatDateRange(start: Date, end: Date): string {
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
}

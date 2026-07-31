/**
 * Income Predictor — Detects recurring income patterns from transaction history
 * and predicts future income events.
 *
 * All monetary values are in integer cents.
 */

import { addDays } from 'date-fns';
import type { Transaction, IncomeEvent, IncomeFrequency } from '@/domain/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalize a transaction description for grouping purposes.
 * Lowercases, trims, strips transaction IDs/dates, and collapses whitespace.
 */
export function normalizeDescription(description: string): string {
  let normalized = description.toLowerCase().trim();
  // Strip transaction reference numbers (e.g., #12345, REF:12345)
  normalized = normalized.replace(/(?:#|ref:?|conf:?|id:?)\s*\w+/gi, '');
  // Strip trailing dates in various formats (MM/DD/YYYY, YYYY-MM-DD, MM-DD)
  normalized = normalized.replace(/\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?/g, '');
  // Strip standalone numbers that look like IDs (4+ digits)
  normalized = normalized.replace(/\b\d{4,}\b/g, '');
  // Collapse multiple spaces into one
  normalized = normalized.replace(/\s+/g, ' ').trim();
  return normalized;
}

/**
 * Calculate the median of a sorted numeric array.
 */
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

/**
 * Calculate standard deviation of a numeric array.
 */
function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Generate a deterministic ID from a source name.
 */
function generateIncomeId(source: string): string {
  let hash = 0;
  const str = `income:${source}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `inc_${Math.abs(hash).toString(36)}`;
}

// ─── Frequency Classification ────────────────────────────────────────────────

/**
 * Classify income frequency from interval data.
 * Uses the same thresholds as obligation detection:
 *   weekly: 5–9 days
 *   biweekly: 12–16 days
 *   monthly: 27–34 days
 * If the median doesn't fit any standard category: 'irregular'
 */
function classifyIncomeFrequency(intervals: number[]): IncomeFrequency {
  if (intervals.length === 0) return 'irregular';
  const med = median(intervals);

  if (med >= 5 && med <= 9) return 'weekly';
  if (med >= 12 && med <= 16) return 'biweekly';
  if (med >= 27 && med <= 34) return 'monthly';

  return 'irregular';
}

// ─── Exported Functions ──────────────────────────────────────────────────────

/**
 * Filter transactions to include only income-eligible ones.
 * - Only positive amounts (inflows)
 * - Exclude 'income_transfer' category
 * - Exclude descriptions containing "transfer from" (case insensitive)
 */
export function filterIncomeTransactions(transactions: Transaction[]): Transaction[] {
  return transactions.filter((tx) => {
    // Must be an inflow
    if (tx.amount <= 0) return false;
    // Exclude internal transfers by category
    if (tx.category === 'income_transfer') return false;
    // Exclude descriptions that look like internal transfers
    if (/transfer from/i.test(tx.description)) return false;
    return true;
  });
}

/**
 * Detect recurring income patterns from transaction history.
 *
 * Algorithm:
 * 1. Filter to income-eligible transactions
 * 2. Group by normalized source description
 * 3. For each group with >= 3 occurrences:
 *    a. Sort by date ascending
 *    b. Calculate intervals between consecutive deposits
 *    c. Classify frequency
 *    d. Predict amount (median, with variance if unstable)
 *    e. Assign confidence based on timing consistency
 *    f. Predict next date
 *    g. Create IncomeEvent
 * 4. Sort by expectedDate ascending
 */
export function detectIncome(transactions: Transaction[]): IncomeEvent[] {
  const incomeTransactions = filterIncomeTransactions(transactions);

  // Group by normalized description
  const groups = new Map<string, Transaction[]>();
  for (const tx of incomeTransactions) {
    const key = normalizeDescription(tx.description);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(tx);
  }

  const incomeEvents: IncomeEvent[] = [];

  for (const [source, txs] of Array.from(groups.entries())) {
    // Require at least 3 occurrences to detect a pattern
    if (txs.length < 3) continue;

    // Sort by date ascending
    const sorted = [...txs].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate intervals between consecutive deposits (in days)
    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const diffMs = sorted[i].date.getTime() - sorted[i - 1].date.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      intervals.push(diffDays);
    }

    // Classify frequency
    const frequency = classifyIncomeFrequency(intervals);

    // Calculate amounts
    const amounts = sorted.map((tx) => tx.amount);
    const amountPrediction = predictIncomeAmount(amounts);

    // Assign confidence based on timing consistency
    const intervalStdDev = standardDeviation(intervals);
    // 'confirmed' for regular timing (std dev < 3 days), 'estimated' otherwise
    const confidence: 'confirmed' | 'estimated' =
      frequency !== 'irregular' && intervalStdDev < 3 ? 'confirmed' : 'estimated';

    // Get last transaction info
    const lastTx = sorted[sorted.length - 1];

    // Predict next date
    const expectedDate = predictNextIncomeDate(lastTx.date, frequency, intervals);

    const incomeEvent: IncomeEvent = {
      id: generateIncomeId(source),
      accountId: lastTx.accountId,
      source,
      expectedAmount: amountPrediction.expected,
      amountVariance: amountPrediction.variance,
      expectedDate,
      frequency,
      confidence,
      lastReceivedDate: lastTx.date,
      lastReceivedAmount: lastTx.amount,
    };

    incomeEvents.push(incomeEvent);
  }

  // Sort by expectedDate ascending
  incomeEvents.sort((a, b) => a.expectedDate.getTime() - b.expectedDate.getTime());

  return incomeEvents;
}

/**
 * Predict the next income date based on the last date, frequency, and historical intervals.
 *
 * - For regular frequencies (weekly, biweekly, monthly): lastDate + median interval
 * - For irregular: lastDate + median interval
 * - If predicted date lands on a weekend and frequency is 'biweekly' or 'monthly',
 *   shift to the nearest Friday (payroll typically adjusts to before weekend).
 */
export function predictNextIncomeDate(
  lastDate: Date,
  frequency: IncomeFrequency,
  intervals: number[]
): Date {
  if (intervals.length === 0) {
    // Fallback: assume monthly if no interval data
    return addDays(lastDate, 30);
  }

  const medianInterval = median(intervals);
  let predicted = addDays(lastDate, medianInterval);

  // Adjust weekend dates for payroll-type frequencies
  if (frequency === 'biweekly' || frequency === 'monthly') {
    const dayOfWeek = predicted.getDay();
    if (dayOfWeek === 6) {
      // Saturday → shift to Friday
      predicted = addDays(predicted, -1);
    } else if (dayOfWeek === 0) {
      // Sunday → shift to Friday
      predicted = addDays(predicted, -2);
    }
  }

  return predicted;
}

/**
 * Predict the income amount from historical amounts.
 *
 * - Calculate median
 * - Calculate variance (max - min) / median
 * - If variance <= 0.05: return { expected: median }
 * - If variance > 0.05: return { expected: median, variance: { min, max } }
 */
export function predictIncomeAmount(
  amounts: number[]
): { expected: number; variance?: { min: number; max: number } } {
  if (amounts.length === 0) {
    return { expected: 0 };
  }

  const med = median(amounts);

  if (med === 0) {
    return { expected: 0 };
  }

  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  const varianceRatio = (max - min) / med;

  if (varianceRatio <= 0.05) {
    return { expected: med };
  }

  return { expected: med, variance: { min, max } };
}

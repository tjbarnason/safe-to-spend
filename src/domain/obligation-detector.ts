import { addDays } from 'date-fns';
import type {
  Transaction,
  Obligation,
  ObligationFrequency,
  ConfidenceLevel,
} from '@/domain/types';

/**
 * Normalizes a transaction description for grouping:
 * - Lowercase
 * - Trim whitespace
 * - Remove trailing numbers/IDs (e.g., "Netflix #12345" → "netflix")
 * - Remove dates (e.g., "Payment 01/15" → "payment")
 * - Collapse multiple spaces to single space
 * - Remove common prefixes: "payment to ", "ach ", "pos ", "debit "
 */
export function normalizeDescription(description: string): string {
  let result = description.toLowerCase().trim();

  // Remove common prefixes
  const prefixes = ['payment to ', 'ach ', 'pos ', 'debit '];
  for (const prefix of prefixes) {
    if (result.startsWith(prefix)) {
      result = result.slice(prefix.length);
    }
  }

  // Remove trailing numbers/IDs (e.g., "#12345", "* 12345", "123456")
  result = result.replace(/[#*]?\s*\d{3,}$/g, '');

  // Remove date patterns (e.g., "01/15", "01-15", "2024-01-15")
  result = result.replace(/\d{1,4}[-/]\d{1,2}([-/]\d{1,4})?/g, '');

  // Collapse multiple spaces to single space
  result = result.replace(/\s+/g, ' ');

  // Final trim
  result = result.trim();

  return result;
}

/**
 * Calculates the median of a numeric array.
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
 * Calculates the number of days between two dates.
 */
function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

/**
 * Generates a deterministic ID from a group name.
 */
function generateId(groupName: string): string {
  let hash = 0;
  for (let i = 0; i < groupName.length; i++) {
    const char = groupName.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `obl_${Math.abs(hash).toString(36)}`;
}

/**
 * Classifies the frequency of a recurring pattern from the intervals
 * between consecutive occurrences (in days).
 *
 * Returns null if the median interval doesn't fit a known frequency bucket.
 */
export function classifyFrequency(intervals: number[]): ObligationFrequency | null {
  if (intervals.length === 0) return null;

  const med = median(intervals);

  if (med >= 5 && med <= 9) return 'weekly';
  if (med >= 12 && med <= 16) return 'biweekly';
  if (med >= 27 && med <= 34) return 'monthly';
  if (med >= 85 && med <= 95) return 'quarterly';
  if (med >= 355 && med <= 375) return 'annual';

  return null;
}

/**
 * Predicts the next occurrence date based on the last date, frequency,
 * and historical intervals. Uses the median interval to project forward.
 * If the predicted date falls on a weekend, shifts to the nearest weekday.
 */
export function predictNextDate(
  lastDate: Date,
  frequency: ObligationFrequency,
  intervals: number[]
): Date {
  const med = intervals.length > 0 ? median(intervals) : getDefaultInterval(frequency);
  let predicted = addDays(lastDate, med);

  // If the result lands on a weekend, shift to nearest weekday
  const dayOfWeek = predicted.getDay();
  if (dayOfWeek === 0) {
    // Sunday → Monday
    predicted = addDays(predicted, 1);
  } else if (dayOfWeek === 6) {
    // Saturday → Friday
    predicted = addDays(predicted, -1);
  }

  return predicted;
}

/**
 * Returns a default interval for a frequency when no intervals are available.
 */
function getDefaultInterval(frequency: ObligationFrequency): number {
  switch (frequency) {
    case 'weekly':
      return 7;
    case 'biweekly':
      return 14;
    case 'monthly':
      return 30;
    case 'quarterly':
      return 90;
    case 'annual':
      return 365;
  }
}

/**
 * Predicts the expected amount from historical amounts.
 * - If variance ≤ 5%: returns { expected: median } (no variance field)
 * - If variance > 5%: returns { expected: median, variance: { min, max } }
 */
export function predictAmount(
  amounts: number[]
): { expected: number; variance?: { min: number; max: number } } {
  if (amounts.length === 0) return { expected: 0 };
  if (amounts.length === 1) return { expected: amounts[0] };

  const med = median(amounts);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);

  // Variance as (max - min) / median
  const variance = med === 0 ? 0 : (max - min) / med;

  if (variance <= 0.05) {
    return { expected: med };
  }

  return { expected: med, variance: { min, max } };
}

/**
 * Assigns a confidence level based on the number of occurrences
 * and the amount variance percentage.
 *
 * - confirmed: variance ≤ 5% AND occurrences >= 5
 * - new: occurrences >= 3 AND occurrences < 5 (and variance ≤ 5%)
 * - estimated: variance > 5% or fallback
 */
export function assignConfidence(
  occurrences: number,
  amountVariance: number
): ConfidenceLevel {
  if (amountVariance <= 0.05 && occurrences >= 5) return 'confirmed';
  if (occurrences >= 3 && occurrences < 5 && amountVariance <= 0.05) return 'new';
  if (amountVariance > 0.05) return 'estimated';
  return 'estimated';
}

/**
 * Detects recurring obligations from a transaction history.
 *
 * Algorithm:
 * 1. Filter to outflow transactions only (amount < 0)
 * 2. Normalize each transaction's description
 * 3. Group by normalized description
 * 4. For each group with >= 3 transactions:
 *    a. Sort by date ascending
 *    b. Calculate intervals between consecutive occurrences
 *    c. Classify frequency — skip if null
 *    d. Calculate amounts (absolute values)
 *    e. Predict amount and optional variance
 *    f. Assign confidence
 *    g. Predict next date
 *    h. Create Obligation object
 * 5. Sort by expectedDate ascending
 * 6. Return the array
 */
export function detectObligations(transactions: Transaction[]): Obligation[] {
  if (transactions.length === 0) return [];

  // Step 1: Filter to outflows only
  const outflows = transactions.filter((t) => t.amount < 0);

  if (outflows.length === 0) return [];

  // Step 2 & 3: Normalize and group by description
  const groups = new Map<string, Transaction[]>();
  for (const tx of outflows) {
    const key = normalizeDescription(tx.merchant || tx.description);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(tx);
  }

  const obligations: Obligation[] = [];

  // Step 4: Process each group
  groups.forEach((txs, groupName) => {
    // Need at least 3 occurrences
    if (txs.length < 3) return;

    // 4a: Sort by date ascending
    txs.sort((a: Transaction, b: Transaction) => a.date.getTime() - b.date.getTime());

    // 4b: Calculate intervals
    const intervals: number[] = [];
    for (let i = 1; i < txs.length; i++) {
      intervals.push(daysBetween(txs[i - 1].date, txs[i].date));
    }

    // 4c: Classify frequency
    const frequency = classifyFrequency(intervals);
    if (frequency === null) return;

    // 4d: Calculate amounts (absolute values since stored as negative)
    const amounts = txs.map((t: Transaction) => Math.abs(t.amount));

    // 4e: Predict amount
    const amountPrediction = predictAmount(amounts);

    // Calculate variance for confidence assignment
    const med = median(amounts);
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    const variancePercent = med === 0 ? 0 : (max - min) / med;

    // 4f: Assign confidence
    const confidence = assignConfidence(txs.length, variancePercent);

    // 4g: Predict next date
    const lastTx = txs[txs.length - 1];
    const expectedDate = predictNextDate(lastTx.date, frequency, intervals);

    // 4h: Create Obligation object
    const obligation: Obligation = {
      id: generateId(groupName),
      accountId: lastTx.accountId,
      name: groupName,
      expectedAmount: amountPrediction.expected,
      amountVariance: amountPrediction.variance,
      expectedDate,
      frequency,
      confidence,
      lastPaidDate: lastTx.date,
      lastPaidAmount: Math.abs(lastTx.amount),
      isActive: true,
    };

    obligations.push(obligation);
  });

  // Step 5: Sort by expectedDate ascending
  obligations.sort((a, b) => a.expectedDate.getTime() - b.expectedDate.getTime());

  // Step 6: Return
  return obligations;
}

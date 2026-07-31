import { Transaction, TransactionCategory } from '@/domain/types';
import { sarahProfile, ObligationProfile } from './profiles';

/**
 * Mulberry32 seeded PRNG — deterministic pseudo-random number generator.
 * Given the same seed, it always produces the same sequence of numbers.
 */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Get the Nth Friday from a reference date (going back in time).
 * Used to anchor biweekly payroll on Fridays.
 */
function getNthFridayBefore(referenceDate: Date, n: number): Date {
  const d = new Date(referenceDate);
  // Find the most recent Friday on or before reference date
  const dayOfWeek = d.getDay();
  const daysToFriday = dayOfWeek >= 5 ? dayOfWeek - 5 : dayOfWeek + 2;
  d.setDate(d.getDate() - daysToFriday);
  // Go back n pay periods (2 weeks each)
  d.setDate(d.getDate() - n * 14);
  return d;
}

/**
 * Get the specific day of month for a given year/month, handling month-end overflow.
 */
function getDayOfMonth(year: number, month: number, dayOfMonth: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const day = Math.min(dayOfMonth, lastDay);
  return new Date(year, month, day);
}

/**
 * Category mapping for obligation types.
 */
const OBLIGATION_CATEGORY_MAP: Record<ObligationProfile['category'], TransactionCategory> = {
  housing: 'housing',
  transportation: 'transportation',
  insurance: 'insurance',
  utilities: 'utilities',
  subscription: 'subscription',
  loan_payment: 'loan_payment',
  personal: 'personal',
};

/**
 * Discretionary spending merchants by category.
 */
const DISCRETIONARY_MERCHANTS: { merchant: string; category: TransactionCategory; minCents: number; maxCents: number }[] = [
  { merchant: 'Kroger', category: 'food_grocery', minCents: 4500, maxCents: 15000 },
  { merchant: 'Walmart Grocery', category: 'food_grocery', minCents: 3000, maxCents: 12000 },
  { merchant: 'Aldi', category: 'food_grocery', minCents: 2500, maxCents: 8000 },
  { merchant: 'Chipotle', category: 'food_dining', minCents: 1100, maxCents: 2500 },
  { merchant: 'Starbucks', category: 'food_dining', minCents: 500, maxCents: 900 },
  { merchant: 'Panera Bread', category: 'food_dining', minCents: 1200, maxCents: 2200 },
  { merchant: 'Chick-fil-A', category: 'food_dining', minCents: 800, maxCents: 1800 },
  { merchant: 'Shell Gas', category: 'transportation', minCents: 3500, maxCents: 6500 },
  { merchant: 'BP Gas Station', category: 'transportation', minCents: 3000, maxCents: 5500 },
  { merchant: 'Amazon', category: 'other', minCents: 1500, maxCents: 8000 },
  { merchant: 'Target', category: 'other', minCents: 2000, maxCents: 7500 },
  { merchant: 'CVS Pharmacy', category: 'healthcare', minCents: 800, maxCents: 4500 },
  { merchant: 'Walgreens', category: 'healthcare', minCents: 500, maxCents: 3000 },
];

export interface TransactionGeneratorOptions {
  /** Reference date for generation. Default: current date */
  referenceDate?: Date;
  /** Number of days of history to generate. Default: 120 (covers 90+ days comfortably) */
  historyDays?: number;
}

/**
 * Generate a deterministic set of transactions for Sarah's account.
 * Same referenceDate always produces the same transactions.
 */
export function generateTransactions(options: TransactionGeneratorOptions = {}): Transaction[] {
  const referenceDate = options.referenceDate ?? new Date();
  const historyDays = options.historyDays ?? 120;

  // Seed based on a stable date representation (year + day of year)
  const seedBase =
    referenceDate.getFullYear() * 1000 +
    Math.floor((referenceDate.getTime() - new Date(referenceDate.getFullYear(), 0, 0).getTime()) / 86400000);
  const rng = mulberry32(seedBase);

  const transactions: Transaction[] = [];
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - historyDays);

  const accountId = sarahProfile.accountId;
  let txIndex = 0;

  // --- Generate obligation transactions ---
  for (const obligation of sarahProfile.obligations) {
    const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());

    let currentDate = new Date(startMonth);
    while (currentDate <= endMonth) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      let payDate = getDayOfMonth(year, month, obligation.dayOfMonth);

      // Add slight date variance for some bills (±1 day for weekends)
      const dayOfWeek = payDate.getDay();
      if (dayOfWeek === 0) {
        // Sunday → Monday
        payDate = new Date(payDate);
        payDate.setDate(payDate.getDate() + 1);
      } else if (dayOfWeek === 6) {
        // Saturday → Friday
        payDate = new Date(payDate);
        payDate.setDate(payDate.getDate() - 1);
      }

      // Only include if within our date range and not in the future
      if (payDate >= startDate && payDate <= referenceDate) {
        let amount: number;
        if (obligation.amountVariance) {
          // Variable amount: generate within range using PRNG
          const range = obligation.amountVariance.max - obligation.amountVariance.min;
          amount = obligation.amountVariance.min + Math.floor(rng() * range);
        } else {
          amount = obligation.expectedAmount;
        }

        transactions.push({
          id: `tx-${accountId}-${payDate.toISOString().slice(0, 10)}-obl-${txIndex}`,
          accountId,
          amount: -amount, // Outflow
          date: new Date(payDate),
          description: obligation.merchant,
          category: OBLIGATION_CATEGORY_MAP[obligation.category],
          merchant: obligation.merchant,
          isRecurring: true,
          recurringGroupId: `group-${obligation.merchant.toLowerCase().replace(/\s+/g, '-')}`,
        });
        txIndex++;
      }

      // Advance to next month
      currentDate = new Date(year, month + 1, 1);
    }
  }

  // --- Generate biweekly payroll deposits ---
  // Find how many pay periods fit in our history window
  const maxPayPeriods = Math.ceil(historyDays / 14) + 1;
  for (let i = 0; i < maxPayPeriods; i++) {
    const payDate = getNthFridayBefore(referenceDate, i);
    if (payDate >= startDate && payDate <= referenceDate) {
      transactions.push({
        id: `tx-${accountId}-${payDate.toISOString().slice(0, 10)}-payroll-${txIndex}`,
        accountId,
        amount: sarahProfile.income[0].expectedAmount, // $2,847.00
        date: new Date(payDate),
        description: sarahProfile.income[0].source,
        category: 'income_payroll',
        merchant: sarahProfile.income[0].source,
        isRecurring: true,
        recurringGroupId: 'group-employer-direct-deposit',
      });
      txIndex++;
    }
  }

  // --- Generate irregular gig income ---
  const gigIncome = sarahProfile.income[1];
  let gigDate = new Date(startDate);
  gigDate.setDate(gigDate.getDate() + 5); // Start a few days in
  while (gigDate <= referenceDate) {
    // Every 10-15 days, seeded
    const intervalDays = 10 + Math.floor(rng() * 6); // 10-15 days
    gigDate = new Date(gigDate);
    gigDate.setDate(gigDate.getDate() + intervalDays);

    if (gigDate > referenceDate) break;

    const range = gigIncome.amountVariance!.max - gigIncome.amountVariance!.min;
    const amount = gigIncome.amountVariance!.min + Math.floor(rng() * range);

    transactions.push({
      id: `tx-${accountId}-${gigDate.toISOString().slice(0, 10)}-gig-${txIndex}`,
      accountId,
      amount, // Positive (inflow)
      date: new Date(gigDate),
      description: gigIncome.source,
      category: 'income_other',
      merchant: gigIncome.source,
      isRecurring: false,
    });
    txIndex++;
  }

  // --- Generate discretionary spending ---
  let currentDay = new Date(startDate);
  while (currentDay <= referenceDate) {
    // Determine number of discretionary transactions for this day (0-3)
    const numTx = Math.floor(rng() * 3.5); // 0, 1, 2, or 3 transactions per day

    for (let i = 0; i < numTx; i++) {
      const merchantIdx = Math.floor(rng() * DISCRETIONARY_MERCHANTS.length);
      const merchant = DISCRETIONARY_MERCHANTS[merchantIdx];
      const range = merchant.maxCents - merchant.minCents;
      const amount = merchant.minCents + Math.floor(rng() * range);

      transactions.push({
        id: `tx-${accountId}-${currentDay.toISOString().slice(0, 10)}-disc-${txIndex}`,
        accountId,
        amount: -amount, // Outflow
        date: new Date(currentDay),
        description: merchant.merchant,
        category: merchant.category,
        merchant: merchant.merchant,
        isRecurring: false,
      });
      txIndex++;
    }

    // Advance to next day
    currentDay = new Date(currentDay);
    currentDay.setDate(currentDay.getDate() + 1);
  }

  // Sort by date descending (most recent first)
  transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

  return transactions;
}

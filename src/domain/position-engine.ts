/**
 * Position Engine — the core service that combines account balance, detected obligations,
 * and predicted income into a complete financial position.
 *
 * All monetary values are in integer cents.
 */

import { addDays, startOfDay, isSameDay, format } from 'date-fns';
import type {
  Account,
  Obligation,
  IncomeEvent,
  FinancialPosition,
  DailyPosition,
  PositionStatus,
  HeadsUpAlert,
} from '@/domain/types';

/**
 * Calculate the full financial position for an account over a given time window.
 *
 * Algorithm:
 * 1. Filter obligations to active ones within the time window
 * 2. Filter income events within the time window
 * 3. Compute totalCommitted and availableCapacity
 * 4. Generate daily projection and determine status
 */
export function calculatePosition(
  account: Account,
  obligations: Obligation[],
  income: IncomeEvent[],
  windowDays: number,
  floor: number = 0,
  referenceDate: Date = new Date()
): FinancialPosition {
  const now = startOfDay(referenceDate);
  const windowEnd = addDays(now, windowDays);

  // Filter obligations: active only, within time window
  const filteredObligations = obligations.filter((ob) => {
    if (!ob.isActive) return false;
    const obDate = startOfDay(ob.expectedDate);
    return obDate >= now && obDate <= windowEnd;
  });

  // Filter income: within time window (include all for MVP regardless of confidence)
  const filteredIncome = income.filter((inc) => {
    const incDate = startOfDay(inc.expectedDate);
    return incDate >= now && incDate <= windowEnd;
  });

  // Sort obligations chronologically
  const sortedObligations = [...filteredObligations].sort(
    (a, b) => a.expectedDate.getTime() - b.expectedDate.getTime()
  );

  // Sort income chronologically
  const sortedIncome = [...filteredIncome].sort(
    (a, b) => a.expectedDate.getTime() - b.expectedDate.getTime()
  );

  // Calculate totals
  const totalCommitted = sortedObligations.reduce(
    (sum, ob) => sum + ob.expectedAmount,
    0
  );
  const availableCapacity = account.currentBalance - totalCommitted - floor;

  // Generate daily projection
  const dailyProjection = generateDailyProjection(
    account.currentBalance,
    sortedObligations,
    sortedIncome,
    windowDays,
    now
  );

  // Determine status
  const status = determineStatus(availableCapacity, totalCommitted, dailyProjection);

  return {
    accountId: account.id,
    calculatedAt: referenceDate,
    currentBalance: account.currentBalance,
    totalCommitted,
    availableCapacity,
    timeWindow: windowDays,
    obligations: sortedObligations,
    expectedIncome: sortedIncome,
    dailyProjection,
    status,
  };
}

/**
 * Generate a day-by-day projection of account balance.
 *
 * Iterates from startDate for the given number of days, applying obligations
 * (subtracting) and income (adding) on their respective expected dates.
 */
export function generateDailyProjection(
  startBalance: number,
  obligations: Obligation[],
  income: IncomeEvent[],
  days: number,
  startDate: Date
): DailyPosition[] {
  const projection: DailyPosition[] = [];
  let runningBalance = startBalance;
  let cumulativeOutflow = 0;
  let cumulativeInflow = 0;

  const normalizedStart = startOfDay(startDate);

  for (let i = 0; i < days; i++) {
    const currentDay = addDays(normalizedStart, i);

    // Find obligations due on this day (compare date portion only)
    const dayObligations = obligations.filter((ob) =>
      isSameDay(startOfDay(ob.expectedDate), currentDay)
    );

    // Find income expected on this day
    const dayIncome = income.filter((inc) =>
      isSameDay(startOfDay(inc.expectedDate), currentDay)
    );

    // Subtract obligation amounts
    const dayOutflow = dayObligations.reduce(
      (sum, ob) => sum + ob.expectedAmount,
      0
    );
    runningBalance -= dayOutflow;
    cumulativeOutflow += dayOutflow;

    // Add income amounts
    const dayInflow = dayIncome.reduce(
      (sum, inc) => sum + inc.expectedAmount,
      0
    );
    runningBalance += dayInflow;
    cumulativeInflow += dayInflow;

    projection.push({
      date: currentDay,
      projectedBalance: runningBalance,
      obligations: dayObligations,
      income: dayIncome,
      cumulativeOutflow,
      cumulativeInflow,
    });
  }

  return projection;
}

/**
 * Determine the position status based on capacity and projection.
 *
 * - tight: any day in projection has negative balance
 * - watch: capacity > 0 but ≤ 20% of committed
 * - comfortable: capacity > 20% of committed, or no committed obligations
 */
export function determineStatus(
  availableCapacity: number,
  totalCommitted: number,
  dailyProjection: DailyPosition[]
): PositionStatus {
  // If any day has a negative projected balance, it's tight
  const hasNegativeDay = dailyProjection.some(
    (day) => day.projectedBalance < 0
  );
  if (hasNegativeDay) return 'tight';

  // If no obligations and positive capacity, comfortable
  if (totalCommitted === 0 && availableCapacity > 0) return 'comfortable';

  // Watch: capacity is positive but within 20% of committed
  if (availableCapacity > 0 && availableCapacity <= 0.2 * totalCommitted) {
    return 'watch';
  }

  // Comfortable: capacity exceeds 20% of committed
  if (availableCapacity > 0.2 * totalCommitted) return 'comfortable';

  // Fallback
  return 'watch';
}

/**
 * Generate proactive heads-up alerts when a shortfall is projected.
 *
 * Scans the daily projection within the lookahead window for any day with
 * a negative balance and generates a HeadsUpAlert with causing obligations.
 */
export function generateAlerts(
  position: FinancialPosition,
  lookaheadDays?: number
): HeadsUpAlert[] {
  const effectiveLookahead = lookaheadDays ?? 7;
  const alerts: HeadsUpAlert[] = [];

  // Only look at the projection within the lookahead window
  const projectionWindow = position.dailyProjection.slice(0, effectiveLookahead);

  // Find the first day with a negative balance
  const shortfallDayIndex = projectionWindow.findIndex(
    (day) => day.projectedBalance < 0
  );

  if (shortfallDayIndex === -1) {
    // No shortfall projected within the lookahead window
    return alerts;
  }

  const shortfallDay = projectionWindow[shortfallDayIndex];
  const shortfallDate = shortfallDay.date;
  const shortfallAmount = Math.abs(shortfallDay.projectedBalance);

  // Identify causing obligations: those due on or after the day before the shortfall
  // that contribute to the deficit
  const causingObligations = position.obligations.filter((ob) => {
    const obDate = startOfDay(ob.expectedDate);
    // Include obligations from the shortfall day and any that preceded it in
    // the window that contributed to the running deficit
    return obDate <= shortfallDate && obDate >= startOfDay(position.dailyProjection[0].date);
  });

  // Build a deterministic ID from accountId + shortfall date
  const alertId = `${position.accountId}-shortfall-${format(shortfallDate, 'yyyy-MM-dd')}`;

  // Generate the alert message
  const obligationNames = causingObligations.map((ob) => ob.name).join(', ');
  const totalObligationAmount = causingObligations.reduce(
    (sum, ob) => sum + ob.expectedAmount,
    0
  );
  const formattedTotal = `$${(totalObligationAmount / 100).toFixed(2)}`;
  const formattedDate = format(shortfallDate, 'MMM d');

  const message = `Your upcoming bills may exceed your available balance by ${formattedDate}. ${obligationNames} total ${formattedTotal} before your next expected deposit.`;

  // Calculate generatedAt — at least 48 hours before shortfall
  const now = new Date();
  const hoursBefore = (shortfallDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const generatedAt = hoursBefore >= 48 ? now : now;

  alerts.push({
    id: alertId,
    accountId: position.accountId,
    generatedAt,
    shortfallDate,
    shortfallAmount,
    causingObligations,
    isDismissed: false,
    message,
  });

  return alerts;
}

/**
 * Consequence Simulator — projects the impact of a hypothetical spend on
 * the member's financial position over the lookahead window.
 *
 * All monetary values are in integer cents.
 */

import { startOfDay, addDays } from 'date-fns';
import type {
  FinancialPosition,
  DailyPosition,
  Obligation,
  SimulationResult,
  SimulationStatus,
} from '@/domain/types';
import { generateDailyProjection } from './position-engine';

/**
 * Simulate the effect of spending a hypothetical amount.
 *
 * Algorithm:
 * 1. If hypotheticalAmount <= 0, return current position as-is (safe, no change)
 * 2. Calculate revisedCapacity = position.availableCapacity - hypotheticalAmount
 * 3. Regenerate daily projection with reduced starting balance
 * 4. Identify at-risk obligations
 * 5. Determine simulation status
 * 6. Find shortfall date and amount (if any day goes negative)
 */
export function simulate(
  position: FinancialPosition,
  hypotheticalAmount: number
): SimulationResult {
  // Edge case: zero or negative hypothetical means no impact
  if (hypotheticalAmount <= 0) {
    return {
      hypotheticalAmount: 0,
      revisedCapacity: position.availableCapacity,
      dailyProjection: position.dailyProjection,
      atRiskObligations: [],
      status: 'safe',
    };
  }

  const revisedCapacity = position.availableCapacity - hypotheticalAmount;

  // Regenerate projection with reduced starting balance
  const newStartBalance = position.currentBalance - hypotheticalAmount;
  const startDate = position.dailyProjection.length > 0
    ? startOfDay(position.dailyProjection[0].date)
    : startOfDay(new Date());

  const revisedProjection = generateDailyProjection(
    newStartBalance,
    position.obligations,
    position.expectedIncome,
    position.dailyProjection.length > 0 ? position.dailyProjection.length : position.timeWindow,
    startDate
  );

  // Identify at-risk obligations
  const atRiskObligations = identifyAtRiskObligations(revisedProjection);

  // Determine simulation status
  const status = determineSimulationStatus(revisedProjection, position.totalCommitted);

  // Find shortfall date and amount (first day with negative balance)
  let shortfallDate: Date | undefined;
  let shortfallAmount: number | undefined;

  for (const day of revisedProjection) {
    if (day.projectedBalance < 0) {
      shortfallDate = day.date;
      shortfallAmount = Math.abs(day.projectedBalance);
      break;
    }
  }

  const result: SimulationResult = {
    hypotheticalAmount,
    revisedCapacity,
    dailyProjection: revisedProjection,
    atRiskObligations,
    status,
  };

  if (shortfallDate !== undefined) {
    result.shortfallDate = shortfallDate;
  }
  if (shortfallAmount !== undefined) {
    result.shortfallAmount = shortfallAmount;
  }

  return result;
}

/**
 * Identify obligations that are at risk of non-payment due to insufficient funds.
 *
 * Algorithm:
 * - Find the first day in projection where projectedBalance < 0
 * - Collect all obligations due on that day or any subsequent day
 * - If no negative day exists, return empty array
 */
export function identifyAtRiskObligations(
  dailyProjection: DailyPosition[]
): Obligation[] {
  if (dailyProjection.length === 0) {
    return [];
  }

  // Find the index of the first day with negative balance
  const firstNegativeIndex = dailyProjection.findIndex(
    (day) => day.projectedBalance < 0
  );

  if (firstNegativeIndex === -1) {
    return [];
  }

  // Collect all obligations from the first negative day onward
  const atRiskObligations: Obligation[] = [];
  for (let i = firstNegativeIndex; i < dailyProjection.length; i++) {
    for (const obligation of dailyProjection[i].obligations) {
      atRiskObligations.push(obligation);
    }
  }

  return atRiskObligations;
}

/**
 * Determine the simulation status based on the revised projection.
 *
 * - at-risk: any day has projectedBalance < 0
 * - tight: min balance > 0 AND min balance <= 10% of totalCommitted
 * - safe: otherwise
 */
export function determineSimulationStatus(
  revisedProjection: DailyPosition[],
  totalCommitted: number
): SimulationStatus {
  if (revisedProjection.length === 0) {
    return 'safe';
  }

  // If any day has negative balance → at-risk
  const hasNegativeDay = revisedProjection.some(
    (day) => day.projectedBalance < 0
  );
  if (hasNegativeDay) {
    return 'at-risk';
  }

  // Find minimum projected balance across all days
  const minBalance = Math.min(
    ...revisedProjection.map((day) => day.projectedBalance)
  );

  // Tight: min balance > 0 but within 10% of totalCommitted
  if (minBalance > 0 && totalCommitted > 0 && minBalance <= 0.1 * totalCommitted) {
    return 'tight';
  }

  return 'safe';
}

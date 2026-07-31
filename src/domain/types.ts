/**
 * Domain types for the Safe to Spend feature.
 *
 * Convention: All monetary values are represented as integer cents (e.g., $24.00 = 2400).
 * This avoids floating-point precision errors. Format to display currency only at the UI boundary.
 */

// ─── Type Aliases ────────────────────────────────────────────────────────────

export type TransactionCategory =
  | 'income_payroll'
  | 'income_transfer'
  | 'income_other'
  | 'housing'
  | 'utilities'
  | 'insurance'
  | 'transportation'
  | 'subscription'
  | 'loan_payment'
  | 'food_grocery'
  | 'food_dining'
  | 'healthcare'
  | 'personal'
  | 'transfer_out'
  | 'other';

export type PositionStatus = 'comfortable' | 'watch' | 'tight';

export type ObligationFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annual';

export type IncomeFrequency = 'weekly' | 'biweekly' | 'monthly' | 'irregular';

export type ConfidenceLevel = 'confirmed' | 'estimated' | 'new';

export type SimulationStatus = 'safe' | 'tight' | 'at-risk';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings';
  /** Current account balance in integer cents. */
  currentBalance: number;
  /** Available balance in integer cents (may differ from current due to holds). */
  availableBalance: number;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  /** Transaction amount in integer cents. Negative values represent outflows. */
  amount: number;
  date: Date;
  description: string;
  category: TransactionCategory;
  merchant?: string;
  isRecurring: boolean;
  recurringGroupId?: string;
}

export interface Obligation {
  id: string;
  accountId: string;
  name: string;
  /** Expected payment amount in integer cents. */
  expectedAmount: number;
  /** Optional variance range for variable-amount obligations, in integer cents. */
  amountVariance?: { min: number; max: number };
  expectedDate: Date;
  frequency: ObligationFrequency;
  confidence: ConfidenceLevel;
  lastPaidDate: Date;
  /** Last paid amount in integer cents. */
  lastPaidAmount: number;
  isActive: boolean;
}

export interface IncomeEvent {
  id: string;
  accountId: string;
  source: string;
  /** Expected income amount in integer cents. */
  expectedAmount: number;
  /** Optional variance range for variable-amount income, in integer cents. */
  amountVariance?: { min: number; max: number };
  expectedDate: Date;
  frequency: IncomeFrequency;
  confidence: 'confirmed' | 'estimated';
  lastReceivedDate: Date;
  /** Last received amount in integer cents. */
  lastReceivedAmount: number;
}

export interface FinancialPosition {
  accountId: string;
  calculatedAt: Date;
  /** Current account balance in integer cents. */
  currentBalance: number;
  /** Sum of all committed obligation amounts within the time window, in integer cents. */
  totalCommitted: number;
  /** Available capacity (currentBalance - totalCommitted) in integer cents. */
  availableCapacity: number;
  /** Forward-looking time window in days. */
  timeWindow: number;
  obligations: Obligation[];
  expectedIncome: IncomeEvent[];
  dailyProjection: DailyPosition[];
  status: PositionStatus;
}

export interface DailyPosition {
  date: Date;
  /** Projected account balance for this day in integer cents. */
  projectedBalance: number;
  obligations: Obligation[];
  income: IncomeEvent[];
  /** Cumulative outflow from obligations up to this day, in integer cents. */
  cumulativeOutflow: number;
  /** Cumulative inflow from income up to this day, in integer cents. */
  cumulativeInflow: number;
}

export interface SimulationResult {
  /** Hypothetical spending amount in integer cents. */
  hypotheticalAmount: number;
  /** Revised available capacity after hypothetical spend, in integer cents. */
  revisedCapacity: number;
  dailyProjection: DailyPosition[];
  atRiskObligations: Obligation[];
  status: SimulationStatus;
  shortfallDate?: Date;
  /** Shortfall amount (deficit) in integer cents, if a shortfall is projected. */
  shortfallAmount?: number;
}

export interface HeadsUpAlert {
  id: string;
  accountId: string;
  generatedAt: Date;
  shortfallDate: Date;
  /** Projected shortfall amount in integer cents. */
  shortfallAmount: number;
  causingObligations: Obligation[];
  isDismissed: boolean;
  message: string;
}

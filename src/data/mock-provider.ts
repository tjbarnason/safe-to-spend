import { Account, Transaction, Obligation } from '@/domain/types';
import { DataProvider } from './provider';
import { sarahProfile } from './mock-data/profiles';
import { getSarahAccount } from './mock-data/account';
import { generateTransactions } from './mock-data/transactions';

/**
 * Mock implementation of the DataProvider interface.
 * Uses deterministic generated data based on a reference date.
 * Designed as a singleton per reference date for consistency.
 */
export class MockDataProvider implements DataProvider {
  private referenceDate: Date;
  private cachedTransactions: Transaction[] | null = null;

  constructor(referenceDate: Date = new Date()) {
    this.referenceDate = referenceDate;
  }

  async getAccount(accountId: string): Promise<Account> {
    if (accountId !== sarahProfile.accountId) {
      throw new Error(`Account not found: ${accountId}`);
    }
    return getSarahAccount(this.referenceDate);
  }

  async getTransactions(
    accountId: string,
    fromDate: Date,
    toDate: Date
  ): Promise<Transaction[]> {
    if (accountId !== sarahProfile.accountId) {
      throw new Error(`Account not found: ${accountId}`);
    }

    // Cache transactions for the same reference date to avoid regeneration
    if (!this.cachedTransactions) {
      this.cachedTransactions = generateTransactions({
        referenceDate: this.referenceDate,
      });
    }

    // Filter to the requested date range
    return this.cachedTransactions.filter(
      (tx) => tx.date >= fromDate && tx.date <= toDate
    );
  }

  getReferenceDate(): Date {
    return this.referenceDate;
  }

  async getScheduledPayments(accountId: string): Promise<Obligation[]> {
    if (accountId !== sarahProfile.accountId) {
      throw new Error(`Account not found: ${accountId}`);
    }

    // Return known obligations from the profile as pre-confirmed obligations.
    // These represent what the system has already detected and confirmed.
    const now = this.referenceDate;

    return sarahProfile.obligations.map((obl, index) => {
      // Calculate the next expected date for this obligation
      const nextDate = getNextExpectedDate(obl.dayOfMonth, now);

      // Find the last paid date by looking back one period
      const lastPaidDate = new Date(nextDate);
      lastPaidDate.setMonth(lastPaidDate.getMonth() - 1);

      return {
        id: `obl-${sarahProfile.accountId}-${index}`,
        accountId: sarahProfile.accountId,
        name: obl.name,
        expectedAmount: obl.expectedAmount,
        amountVariance: obl.amountVariance,
        expectedDate: nextDate,
        frequency: obl.frequency,
        confidence: obl.confidence,
        lastPaidDate,
        lastPaidAmount: obl.expectedAmount,
        isActive: true,
      };
    });
  }
}

/**
 * Calculate the next expected date for a monthly obligation given its day of month.
 */
function getNextExpectedDate(dayOfMonth: number, referenceDate: Date): Date {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const currentDay = referenceDate.getDate();

  // If the obligation day hasn't passed this month, use this month
  if (dayOfMonth > currentDay) {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(dayOfMonth, lastDay));
  }

  // Otherwise, use next month
  const nextMonth = month + 1;
  const nextYear = nextMonth > 11 ? year + 1 : year;
  const adjustedMonth = nextMonth > 11 ? 0 : nextMonth;
  const lastDay = new Date(nextYear, adjustedMonth + 1, 0).getDate();
  return new Date(nextYear, adjustedMonth, Math.min(dayOfMonth, lastDay));
}

/**
 * Singleton instance using a DEMO reference date that produces
 * a compelling scenario showing the product's value.
 * 
 * The date is chosen to land ~5 days after payday, with rent and
 * multiple bills due before the next paycheck arrives.
 */
let defaultProvider: MockDataProvider | null = null;

// Demo date: a Wednesday where payday was last Friday,
// rent + gym due in 3 days (Saturday/Monday), car payment in 12 days,
// and next payday is 9 days away.
// Using a fixed date ensures consistent, compelling demo behavior.
const DEMO_REFERENCE_DATE = new Date(2025, 6, 28); // July 28, 2025 (Monday)

export function getDefaultProvider(): MockDataProvider {
  if (!defaultProvider) {
    defaultProvider = new MockDataProvider(DEMO_REFERENCE_DATE);
  }
  return defaultProvider;
}

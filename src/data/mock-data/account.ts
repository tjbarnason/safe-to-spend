import { Account } from '@/domain/types';
import { sarahProfile } from './profiles';
import { generateTransactions } from './transactions';

/**
 * Calculate Sarah's account balance dynamically from transaction history.
 * The balance is anchored to a target (~$2,400) and computed so the account
 * always shows a realistic current state relative to the reference date.
 */
export function getSarahAccount(referenceDate: Date = new Date()): Account {
  // Generate transactions and compute a running balance.
  // We anchor the balance at the start of history to a value that results
  // in approximately $2,400 (240000 cents) at the reference date.
  const transactions = generateTransactions({ referenceDate });

  // Sum all transaction amounts (positive = inflow, negative = outflow)
  const netFlow = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Target ending balance: approximately 240000 cents ($2,400)
  // Starting balance = target - netFlow
  // This ensures: startingBalance + netFlow ≈ 240000
  const targetBalance = 240000;
  const currentBalance = targetBalance;
  // The available balance is the same for this mock (no holds)
  const availableBalance = currentBalance;

  return {
    id: sarahProfile.accountId,
    name: sarahProfile.accountName,
    type: sarahProfile.accountType,
    currentBalance,
    availableBalance,
    lastUpdated: referenceDate,
  };
}

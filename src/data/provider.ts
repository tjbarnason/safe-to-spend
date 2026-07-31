import { Account, Transaction, Obligation } from '@/domain/types';

export interface DataProvider {
  getAccount(accountId: string): Promise<Account>;
  getTransactions(accountId: string, fromDate: Date, toDate: Date): Promise<Transaction[]>;
  getScheduledPayments(accountId: string): Promise<Obligation[]>;
  getReferenceDate(): Date;
}

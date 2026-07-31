import { ObligationFrequency, ConfidenceLevel, IncomeFrequency } from '@/domain/types';

export interface ObligationProfile {
  name: string;
  merchant: string;
  /** Expected amount in integer cents */
  expectedAmount: number;
  /** For variable obligations, the min/max range in cents */
  amountVariance?: { min: number; max: number };
  frequency: ObligationFrequency;
  /** Day of month the obligation is expected (1-31) */
  dayOfMonth: number;
  confidence: ConfidenceLevel;
  category: 'housing' | 'transportation' | 'insurance' | 'utilities' | 'subscription' | 'loan_payment' | 'personal';
}

export interface IncomeProfile {
  source: string;
  /** Expected amount in integer cents */
  expectedAmount: number;
  /** For variable income, the min/max range in cents */
  amountVariance?: { min: number; max: number };
  frequency: IncomeFrequency;
  confidence: 'confirmed' | 'estimated';
}

export interface MemberProfile {
  accountId: string;
  accountName: string;
  accountType: 'checking' | 'savings';
  income: IncomeProfile[];
  obligations: ObligationProfile[];
}

export const sarahProfile: MemberProfile = {
  accountId: 'sarah-checking-001',
  accountName: "Sarah's Checking",
  accountType: 'checking',
  income: [
    {
      source: 'Employer Direct Deposit',
      expectedAmount: 284700, // $2,847.00 net biweekly
      frequency: 'biweekly',
      confidence: 'confirmed',
    },
    {
      source: 'TaskRabbit Payment',
      expectedAmount: 22500, // ~$225 average
      amountVariance: { min: 15000, max: 30000 }, // $150-$300
      frequency: 'irregular',
      confidence: 'estimated',
    },
  ],
  obligations: [
    {
      name: 'Rent',
      merchant: 'Oakwood Property Management',
      expectedAmount: 125000, // $1,250.00
      frequency: 'monthly',
      dayOfMonth: 1,
      confidence: 'confirmed',
      category: 'housing',
    },
    {
      name: 'Car Payment',
      merchant: 'Capital One Auto Finance',
      expectedAmount: 38900, // $389.00
      frequency: 'monthly',
      dayOfMonth: 15,
      confidence: 'confirmed',
      category: 'transportation',
    },
    {
      name: 'Car Insurance',
      merchant: 'Progressive Insurance',
      expectedAmount: 12700, // $127.00
      frequency: 'monthly',
      dayOfMonth: 22,
      confidence: 'confirmed',
      category: 'insurance',
    },
    {
      name: 'Electric',
      merchant: 'Duke Energy',
      expectedAmount: 13000, // ~$130 average
      amountVariance: { min: 9500, max: 16500 }, // $95-$165 variable
      frequency: 'monthly',
      dayOfMonth: 12,
      confidence: 'estimated',
      category: 'utilities',
    },
    {
      name: 'Phone',
      merchant: 'T-Mobile',
      expectedAmount: 8500, // $85.00
      frequency: 'monthly',
      dayOfMonth: 18,
      confidence: 'confirmed',
      category: 'utilities',
    },
    {
      name: 'Streaming',
      merchant: 'Netflix',
      expectedAmount: 2299, // $22.99
      frequency: 'monthly',
      dayOfMonth: 5,
      confidence: 'confirmed',
      category: 'subscription',
    },
    {
      name: 'Gym',
      merchant: 'Planet Fitness',
      expectedAmount: 4999, // $49.99
      frequency: 'monthly',
      dayOfMonth: 1,
      confidence: 'confirmed',
      category: 'personal',
    },
    {
      name: 'Internet',
      merchant: 'Spectrum',
      expectedAmount: 6999, // $69.99
      frequency: 'monthly',
      dayOfMonth: 8,
      confidence: 'confirmed',
      category: 'utilities',
    },
    {
      name: 'Student Loan',
      merchant: 'Navient',
      expectedAmount: 27500, // $275.00
      frequency: 'monthly',
      dayOfMonth: 20,
      confidence: 'confirmed',
      category: 'loan_payment',
    },
  ],
};

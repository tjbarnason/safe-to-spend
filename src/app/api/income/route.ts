import { NextResponse } from 'next/server';
import { getDefaultProvider } from '@/data/mock-provider';
import { detectIncome } from '@/domain/income-predictor';

export async function GET() {
  try {
    const provider = getDefaultProvider();
    const account = await provider.getAccount('sarah-checking-001');

    const now = new Date();
    const past = new Date(now);
    past.setDate(past.getDate() - 120);
    const transactions = await provider.getTransactions(account.id, past, now);

    const income = detectIncome(transactions);

    // Sort by expectedDate ascending
    const sorted = [...income].sort(
      (a, b) => a.expectedDate.getTime() - b.expectedDate.getTime()
    );

    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to process request. Please try again.' },
      { status: 500 }
    );
  }
}

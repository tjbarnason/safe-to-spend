import { NextResponse } from 'next/server';
import { getDefaultProvider } from '@/data/mock-provider';
import { detectObligations } from '@/domain/obligation-detector';

export async function GET() {
  try {
    const provider = getDefaultProvider();
    const account = await provider.getAccount('sarah-checking-001');

    const now = new Date();
    const past = new Date(now);
    past.setDate(past.getDate() - 120);
    const transactions = await provider.getTransactions(account.id, past, now);

    const obligations = detectObligations(transactions);

    // Sort by expectedDate ascending
    const sorted = [...obligations].sort(
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

import { NextResponse } from 'next/server';
import { getDefaultProvider } from '@/data/mock-provider';
import { detectIncome } from '@/domain/income-predictor';
import { calculatePosition } from '@/domain/position-engine';
import { simulate } from '@/domain/consequence-simulator';
import { DEFAULT_FLOOR_CENTS } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body. Provide JSON with { amount: number }.' },
        { status: 400 }
      );
    }

    const { amount } = body as { amount?: unknown };

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be a number greater than 0.' },
        { status: 400 }
      );
    }

    const provider = getDefaultProvider();
    const account = await provider.getAccount('sarah-checking-001');
    const referenceDate = provider.getReferenceDate();

    // Use scheduled payments for reliable demo data
    const obligations = await provider.getScheduledPayments(account.id);

    // Detect income from history
    const historyStart = new Date(referenceDate);
    historyStart.setDate(historyStart.getDate() - 120);
    const transactions = await provider.getTransactions(account.id, historyStart, referenceDate);
    const income = detectIncome(transactions);

    const position = calculatePosition(account, obligations, income, 14, DEFAULT_FLOOR_CENTS, referenceDate);

    const result = simulate(position, amount);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to process request. Please try again.' },
      { status: 500 }
    );
  }
}

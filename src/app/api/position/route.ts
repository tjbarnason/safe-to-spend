import { NextResponse } from 'next/server';
import { getDefaultProvider } from '@/data/mock-provider';
import { detectIncome } from '@/domain/income-predictor';
import { calculatePosition } from '@/domain/position-engine';
import { DEFAULT_FLOOR_CENTS } from '@/lib/constants';

const VALID_WINDOWS = [7, 14, 30];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const windowParam = searchParams.get('window');
    const windowDays = windowParam ? parseInt(windowParam, 10) : 14;

    if (!VALID_WINDOWS.includes(windowDays)) {
      return NextResponse.json(
        { error: 'Invalid time window. Use 7, 14, or 30.' },
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

    const position = calculatePosition(account, obligations, income, windowDays, DEFAULT_FLOOR_CENTS, referenceDate);

    return NextResponse.json(position);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to calculate position. Please try again.' },
      { status: 500 }
    );
  }
}

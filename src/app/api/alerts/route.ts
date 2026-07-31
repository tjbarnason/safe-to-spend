import { NextResponse } from 'next/server';
import { getDefaultProvider } from '@/data/mock-provider';
import { detectIncome } from '@/domain/income-predictor';
import { calculatePosition, generateAlerts } from '@/domain/position-engine';
import { DEFAULT_FLOOR_CENTS } from '@/lib/constants';

export async function GET() {
  try {
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

    const alerts = generateAlerts(position);

    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to process request. Please try again.' },
      { status: 500 }
    );
  }
}

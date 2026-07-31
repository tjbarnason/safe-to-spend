import Link from 'next/link';
import { getDefaultProvider } from '@/data/mock-provider';
import { detectIncome } from '@/domain/income-predictor';
import { calculatePosition } from '@/domain/position-engine';
import { DEFAULT_WINDOW_DAYS, DEFAULT_FLOOR_CENTS } from '@/lib/constants';
import { ConsequenceExplorer } from '@/components/simulate/ConsequenceExplorer';

export default async function SimulatePage() {
  const provider = getDefaultProvider();
  const account = await provider.getAccount('sarah-checking-001');
  const referenceDate = provider.getReferenceDate();

  // Use scheduled payments for reliable data
  const obligations = await provider.getScheduledPayments(account.id);

  // Detect income from history
  const historyStart = new Date(referenceDate);
  historyStart.setDate(historyStart.getDate() - 120);
  const transactions = await provider.getTransactions(account.id, historyStart, referenceDate);
  const income = detectIncome(transactions);

  const position = calculatePosition(
    account,
    obligations,
    income,
    DEFAULT_WINDOW_DAYS,
    DEFAULT_FLOOR_CENTS,
    referenceDate
  );

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          <span aria-hidden="true">&larr;</span>
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            What if I spend...?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            No math needed — just enter an amount and see what happens
          </p>
        </div>

        {/* Explorer */}
        <ConsequenceExplorer currentCapacity={position.availableCapacity} />
      </div>
    </main>
  );
}

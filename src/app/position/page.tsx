import Link from 'next/link';
import { getDefaultProvider } from '@/data/mock-provider';
import { detectIncome } from '@/domain/income-predictor';
import { calculatePosition } from '@/domain/position-engine';
import { DEFAULT_WINDOW_DAYS, DEFAULT_FLOOR_CENTS } from '@/lib/constants';
import { PositionSummaryBar } from '@/components/position/PositionSummaryBar';
import { PositionTimeline } from '@/components/position/PositionTimeline';
import { ObligationList } from '@/components/obligations/ObligationList';
import { IncomeList } from '@/components/income/IncomeList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function PositionDetailPage() {
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

  // Calculate position using reference date
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
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Position Detail
          </h1>
        </div>

        {/* Position Summary */}
        <section className="mb-8">
          <PositionSummaryBar
            currentBalance={position.currentBalance}
            totalCommitted={position.totalCommitted}
            availableCapacity={position.availableCapacity}
            status={position.status}
          />
        </section>

        {/* Time Window Tabs */}
        <section className="mb-8">
          <Tabs defaultValue="14" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="7">7 days</TabsTrigger>
              <TabsTrigger value="14">14 days</TabsTrigger>
              <TabsTrigger value="30">30 days</TabsTrigger>
            </TabsList>
            <TabsContent value="7">
              <div className="mt-4">
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  Balance Projection
                </h2>
                <PositionTimeline dailyProjection={position.dailyProjection} />
              </div>
            </TabsContent>
            <TabsContent value="14">
              <div className="mt-4">
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  Balance Projection
                </h2>
                <PositionTimeline dailyProjection={position.dailyProjection} />
              </div>
            </TabsContent>
            <TabsContent value="30">
              <div className="mt-4">
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  Balance Projection
                </h2>
                <PositionTimeline dailyProjection={position.dailyProjection} />
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Upcoming Obligations */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Upcoming Obligations
          </h2>
          <ObligationList obligations={position.obligations} referenceDate={referenceDate} />
        </section>

        {/* Expected Income */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Expected Income
          </h2>
          <IncomeList income={position.expectedIncome} referenceDate={referenceDate} />
        </section>
      </div>
    </main>
  );
}

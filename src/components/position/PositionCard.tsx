import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PositionSummaryBar } from './PositionSummaryBar';
import { formatCurrencyCompact, formatRelativeDate } from '@/lib/format';
import type { FinancialPosition, PositionStatus } from '@/domain/types';

interface PositionCardProps {
  position: FinancialPosition;
}

function StatusMessage({ status }: { status: PositionStatus }) {
  const messages = {
    comfortable: "You're on track. Your upcoming bills are covered and you have room to breathe.",
    watch: "You're cutting it close this period. Consider holding off on large purchases until after your next deposit.",
    tight: "Heads up — your upcoming bills may exceed your available balance before your next deposit.",
  };

  const styles = {
    comfortable: "bg-green-50 text-green-700 border-green-200",
    watch: "bg-amber-50 text-amber-700 border-amber-200",
    tight: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${styles[status]}`}>
      <p>{messages[status]}</p>
    </div>
  );
}

export function PositionCard({ position }: PositionCardProps) {
  // Filter to meaningful bills only — exclude discretionary spending detected as "recurring"
  const BILL_CATEGORIES = ['housing', 'utilities', 'insurance', 'transportation', 'subscription', 'loan_payment'];
  const meaningfulObligations = position.obligations.filter(ob => {
    // Show confirmed obligations regardless of category
    if (ob.confidence === 'confirmed') return true;
    // For estimated/new, only show if the amount suggests a real bill (> $20)
    return ob.expectedAmount > 2000;
  });
  const nextObligation = meaningfulObligations[0] ?? null;
  // Prioritize confirmed/payroll income over estimated/gig income for display
  const confirmedIncome = position.expectedIncome.find(inc => inc.confidence === 'confirmed');
  const nextIncome = confirmedIncome ?? position.expectedIncome[0] ?? null;

  return (
    <Card className={cn(
      "w-full shadow-md",
      position.status === 'comfortable' && "border-green-200 bg-gradient-to-b from-green-50/50 to-white",
      position.status === 'watch' && "border-amber-200 bg-gradient-to-b from-amber-50/50 to-white",
      position.status === 'tight' && "border-amber-300 bg-gradient-to-b from-amber-50/80 to-white"
    )}>
      <CardContent className="p-6 pb-0">
        {/* Summary bar — the three key numbers */}
        <PositionSummaryBar
          currentBalance={position.currentBalance}
          totalCommitted={position.totalCommitted}
          availableCapacity={position.availableCapacity}
          status={position.status}
        />

        {/* Contextual status message */}
        <StatusMessage status={position.status} />

        {/* Explainability context */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
          <span>{meaningfulObligations.length} bills detected · 14-day outlook</span>
          {nextIncome && (
            <span>Next deposit {formatRelativeDate(nextIncome.expectedDate, position.calculatedAt)}</span>
          )}
        </div>

        {/* Divider */}
        <div className="my-5 border-t" />

        {/* Info rows */}
        <div className="space-y-4">
          {/* Next obligation */}
          {nextObligation && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm"
                  aria-hidden="true"
                >
                  ↓
                </span>
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-medium text-foreground"
                    aria-label={`Next obligation: ${nextObligation.name}, ${formatCurrencyCompact(nextObligation.expectedAmount)}, ${formatRelativeDate(nextObligation.expectedDate, position.calculatedAt)}`}
                  >
                    {nextObligation.name} · {formatCurrencyCompact(nextObligation.expectedAmount)} · {formatRelativeDate(nextObligation.expectedDate, position.calculatedAt)}
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="shrink-0 capitalize"
              >
                {nextObligation.confidence === 'confirmed' ? 'Confirmed' : 'Estimated'}
              </Badge>
            </div>
          )}

          {/* Next income */}
          {nextIncome && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm"
                  aria-hidden="true"
                >
                  ↑
                </span>
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-medium text-foreground"
                    aria-label={`Next income: ${nextIncome.source}, ${formatCurrencyCompact(nextIncome.expectedAmount)}, ${formatRelativeDate(nextIncome.expectedDate, position.calculatedAt)}`}
                  >
                    {nextIncome.source} · {formatCurrencyCompact(nextIncome.expectedAmount)} · {formatRelativeDate(nextIncome.expectedDate, position.calculatedAt)}
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="shrink-0 capitalize"
              >
                {nextIncome.confidence === 'confirmed' ? 'Confirmed' : 'Estimated'}
              </Badge>
            </div>
          )}

          {/* Empty state if no obligations or income detected */}
          {!nextObligation && !nextIncome && (
            <p className="text-sm text-muted-foreground text-center py-2">
              We&apos;re learning your patterns. Recurring payments will appear here.
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="my-5 border-t" />
      </CardContent>

      {/* CTA */}
      <CardFooter className="px-6 pb-6 pt-0">
        <div className="w-full">
          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/simulate">
              What if I spend...?
            </Link>
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            See how a purchase would affect your position
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

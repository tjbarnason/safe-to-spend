import { Badge } from '@/components/ui/badge';
import { formatCurrencyCompact, formatRelativeDate } from '@/lib/format';
import type { IncomeEvent } from '@/domain/types';

interface IncomeListProps {
  income: IncomeEvent[];
  referenceDate?: Date;
}

export function IncomeList({ income, referenceDate }: IncomeListProps) {
  if (income.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No expected income detected yet.
      </p>
    );
  }

  return (
    <div className="divide-y" role="list" aria-label="Expected income">
      {income.map((event) => {
        const amountDisplay = event.amountVariance
          ? `${formatCurrencyCompact(event.amountVariance.min)} – ${formatCurrencyCompact(event.amountVariance.max)}`
          : formatCurrencyCompact(event.expectedAmount);

        const dateDisplay = formatRelativeDate(event.expectedDate, referenceDate);

        const ariaLabel = `${event.source}, ${amountDisplay}, expected ${dateDisplay}, confidence: ${event.confidence}`;

        return (
          <div
            key={event.id}
            className="flex items-center justify-between gap-3 py-3"
            role="listitem"
            aria-label={ariaLabel}
          >
            {/* Left: indicator + source and date */}
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm text-green-600"
                aria-hidden="true"
              >
                ↑
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {event.source}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dateDisplay}
                </p>
              </div>
            </div>

            {/* Right: amount + confidence badge */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="text-sm font-semibold text-green-600"
                aria-label={`Amount: ${amountDisplay}`}
              >
                +{amountDisplay}
              </span>
              <Badge
                variant="secondary"
                className="capitalize text-[10px] px-1.5 py-0"
              >
                {event.confidence}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}

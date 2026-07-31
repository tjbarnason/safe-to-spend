import { Badge } from '@/components/ui/badge';
import { formatCurrencyCompact, formatRelativeDate } from '@/lib/format';
import type { Obligation } from '@/domain/types';

interface ObligationItemProps {
  obligation: Obligation;
  referenceDate?: Date;
}

export function ObligationItem({ obligation, referenceDate }: ObligationItemProps) {
  const { name, expectedAmount, amountVariance, expectedDate, confidence } = obligation;

  // Format amount: show range if variance exists, otherwise show single amount
  const amountDisplay = amountVariance
    ? `${formatCurrencyCompact(amountVariance.min)} – ${formatCurrencyCompact(amountVariance.max)}`
    : formatCurrencyCompact(expectedAmount);

  const dateDisplay = formatRelativeDate(expectedDate, referenceDate);

  const ariaLabel = `${name}, ${amountDisplay}, due ${dateDisplay}, confidence: ${confidence}`;

  return (
    <div
      className="flex items-center justify-between gap-3 py-3"
      aria-label={ariaLabel}
    >
      {/* Left: indicator + name and date */}
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm"
          aria-hidden="true"
        >
          ↓
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {name}
          </p>
          <p className="text-xs text-muted-foreground">
            {dateDisplay}
          </p>
        </div>
      </div>

      {/* Right: amount + confidence badge */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="text-sm font-semibold text-foreground"
          aria-label={`Amount: ${amountDisplay}`}
        >
          {amountDisplay}
        </span>
        <Badge
          variant="secondary"
          className="capitalize text-[10px] px-1.5 py-0"
        >
          {confidence}
        </Badge>
      </div>
    </div>
  );
}

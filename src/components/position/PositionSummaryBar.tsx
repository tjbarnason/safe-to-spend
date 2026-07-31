import { cn } from '@/lib/utils';
import { formatCurrencyCompact } from '@/lib/format';
import type { PositionStatus } from '@/domain/types';

interface PositionSummaryBarProps {
  currentBalance: number;
  totalCommitted: number;
  availableCapacity: number;
  status: PositionStatus;
}

function StatusIndicator({ status }: { status: PositionStatus }) {
  if (status === 'comfortable') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span
          className="h-2.5 w-2.5 rounded-full bg-green-600"
          aria-hidden="true"
        />
        <span className="sr-only">Status: comfortable</span>
      </span>
    );
  }

  if (status === 'watch') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span
          className="h-2.5 w-2.5 rounded-full bg-amber-500"
          aria-hidden="true"
        />
        <span className="sr-only">Status: watch</span>
      </span>
    );
  }

  // tight — text indicator only, no color dot
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">Tight</span>
      <span className="sr-only">Status: tight</span>
    </span>
  );
}

export function PositionSummaryBar({
  currentBalance,
  totalCommitted,
  availableCapacity,
  status,
}: PositionSummaryBarProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
      {/* Balance */}
      <div className="text-center sm:text-left">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Balance
        </p>
        <p
          className="mt-1 text-lg font-semibold text-foreground"
          aria-label={`Balance: ${formatCurrencyCompact(currentBalance)}`}
        >
          {formatCurrencyCompact(currentBalance)}
        </p>
      </div>

      {/* Upcoming Bills */}
      <div className="text-center sm:text-left">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Upcoming Bills
        </p>
        <p
          className="mt-1 text-lg font-semibold text-foreground"
          aria-label={`Upcoming bills next 14 days: ${formatCurrencyCompact(totalCommitted)}`}
        >
          {formatCurrencyCompact(totalCommitted)}
        </p>
      </div>

      {/* Available Capacity — hero number */}
      <div className="text-center sm:text-left">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Available to Spend
        </p>
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
          above $1,000 buffer
        </p>
        <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
          <StatusIndicator status={status} />
          <p
            className={cn(
              'text-3xl font-bold sm:text-4xl',
              status === 'comfortable' && 'text-green-600',
              status === 'watch' && 'text-amber-500',
              status === 'tight' && 'text-foreground'
            )}
            aria-label={`Available to spend: ${formatCurrencyCompact(availableCapacity)}`}
          >
            {formatCurrencyCompact(availableCapacity)}
          </p>
        </div>
        {/* Status label - prominent text below the number */}
        <p className={cn(
          "text-xs font-medium mt-1",
          status === 'comfortable' && "text-green-600",
          status === 'watch' && "text-amber-600",
          status === 'tight' && "text-amber-700"
        )}>
          {status === 'comfortable' && "✓ On track"}
          {status === 'watch' && "⚠ Watch spending"}
          {status === 'tight' && "⚠ Tight this period"}
        </p>
      </div>
    </div>
  );
}

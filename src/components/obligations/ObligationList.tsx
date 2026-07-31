import { ObligationItem } from './ObligationItem';
import type { Obligation } from '@/domain/types';

interface ObligationListProps {
  obligations: Obligation[];
  referenceDate?: Date;
}

export function ObligationList({ obligations, referenceDate }: ObligationListProps) {
  if (obligations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No upcoming obligations detected yet.
      </p>
    );
  }

  return (
    <div className="divide-y" role="list" aria-label="Upcoming obligations">
      {obligations.map((obligation) => (
        <div key={obligation.id} role="listitem">
          <ObligationItem obligation={obligation} referenceDate={referenceDate} />
        </div>
      ))}
    </div>
  );
}

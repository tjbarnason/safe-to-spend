'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/format';
import type { SimulationResult } from '@/domain/types';

interface ConsequenceResultProps {
  result: SimulationResult;
  currentCapacity: number;
}

export function ConsequenceResult({ result, currentCapacity }: ConsequenceResultProps) {
  if (result.status === 'safe') {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-green-800">
            Looks good
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
            <span>
              Available: {formatCurrency(currentCapacity)}
            </span>
            <span aria-hidden="true">&rarr;</span>
            <span className="font-medium">
              {formatCurrency(result.revisedCapacity)}
            </span>
          </div>

          <p className="mt-3 text-sm text-green-700">
            Your position stays comfortable through your next income date.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (result.status === 'tight') {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-amber-800">
            Cutting it close
          </h2>

          <div className="mt-3 flex items-center gap-2 text-sm text-amber-700">
            <span>
              Available: {formatCurrency(currentCapacity)}
            </span>
            <span aria-hidden="true">&rarr;</span>
            <span className="font-medium">
              {formatCurrency(result.revisedCapacity)}
            </span>
          </div>

          <p className="mt-3 text-sm text-amber-700">
            This would leave you with only {formatCurrency(result.revisedCapacity)} of margin.
          </p>
        </CardContent>
      </Card>
    );
  }

  // status === 'at-risk'
  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-amber-800">
          This might cause a problem
        </h2>

        <div className="mt-3 flex items-center gap-2 text-sm text-amber-700">
          <span>
            Available: {formatCurrency(currentCapacity)}
          </span>
          <span aria-hidden="true">&rarr;</span>
          <span className="font-medium">
            {formatCurrency(result.revisedCapacity)}
          </span>
        </div>

        {result.atRiskObligations.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-amber-800 mb-2">
              These upcoming payments could be affected:
            </p>
            <ul className="space-y-2">
              {result.atRiskObligations.map((obligation) => (
                <li
                  key={obligation.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-amber-700 truncate">
                      {obligation.name}
                    </span>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {formatDate(obligation.expectedDate)}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium text-amber-800 shrink-0">
                    {formatCurrency(obligation.expectedAmount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.shortfallDate && result.shortfallAmount != null && (
          <p className="mt-4 text-sm text-amber-700">
            You&apos;d be {formatCurrency(result.shortfallAmount)} short on{' '}
            {formatDate(result.shortfallDate)}.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

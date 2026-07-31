import Link from 'next/link';
import { Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { HeadsUpAlert } from '@/domain/types';

interface HeadsUpBannerProps {
  alert: HeadsUpAlert;
}

/**
 * Proactive informational banner displayed when a financial shortfall is projected.
 *
 * Uses amber/warm tones to communicate awareness without alarm.
 * Designed to feel preparatory — "here's something to be aware of" — not urgent.
 */
export function HeadsUpBanner({ alert }: HeadsUpBannerProps) {
  return (
    <div role="status" aria-live="polite" className="mb-4">
      <Alert className="border-l-4 border-l-amber-400 bg-amber-50 text-amber-700 border-amber-200">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 font-semibold">
          Heads up
        </AlertTitle>
        <AlertDescription className="text-amber-700">
          <p className="mt-1">{alert.message}</p>
          <div className="mt-3 flex items-center gap-4">
            <Link
              href="/position"
              className="text-sm font-medium text-amber-800 underline underline-offset-2 hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
            >
              View details
            </Link>
            <button
              type="button"
              className="text-sm text-amber-600 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded px-1"
            >
              Dismiss
            </button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

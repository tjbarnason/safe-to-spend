import Link from 'next/link';
import { getDefaultProvider } from '@/data/mock-provider';
import { detectIncome } from '@/domain/income-predictor';
import { calculatePosition } from '@/domain/position-engine';
import { DEFAULT_WINDOW_DAYS, DEFAULT_FLOOR_CENTS } from '@/lib/constants';
import { formatCurrencyCompact, formatRelativeDate } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default async function EarlyPayPage() {
  const provider = getDefaultProvider();
  const account = await provider.getAccount('sarah-checking-001');
  const obligations = await provider.getScheduledPayments(account.id);
  const referenceDate = provider.getReferenceDate();
  const historyStart = new Date(referenceDate);
  historyStart.setDate(historyStart.getDate() - 120);
  const transactions = await provider.getTransactions(account.id, historyStart, referenceDate);
  const income = detectIncome(transactions);
  const position = calculatePosition(account, obligations, income, DEFAULT_WINDOW_DAYS, DEFAULT_FLOOR_CENTS, referenceDate);
  
  const nextIncome = position.expectedIncome.find(inc => inc.confidence === 'confirmed') ?? position.expectedIncome[0];
  
  // Calculate available advance (up to $500, capped at 50% of expected deposit)
  const maxAdvance = nextIncome ? Math.min(50000, Math.floor(nextIncome.expectedAmount * 0.5)) : 0;
  const suggestedAdvance = Math.min(maxAdvance, 25000); // Suggest $250 or less
  
  // Calculate what the advance would do to their position
  const newAvailable = position.availableCapacity + suggestedAdvance;

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-5">
      <div className="w-full max-w-[420px]">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-emerald-600">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Access Your Paycheck Early
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-[280px] mx-auto">
            Get up to {formatCurrencyCompact(maxAdvance)} from your upcoming direct deposit — no interest, no credit check.
          </p>
        </div>

        {/* Amount Selection Card */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 ring-1 ring-black/[0.04] mb-5">
          <CardContent className="p-6">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Choose Amount
            </p>
            
            {/* Amount Display */}
            <div className="text-center mb-6">
              <p className="text-[42px] font-bold text-slate-900 tracking-tight">
                {formatCurrencyCompact(suggestedAdvance)}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Available up to {formatCurrencyCompact(maxAdvance)}
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[5000, 10000, 25000, maxAdvance].map((amount) => (
                <button
                  key={amount}
                  className={cn(
                    "h-10 rounded-xl text-xs font-semibold transition-colors",
                    amount === suggestedAdvance
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  {formatCurrencyCompact(amount)}
                </button>
              ))}
            </div>

            {/* Impact Preview */}
            <div className="rounded-xl bg-emerald-50 p-4 mb-6">
              <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                Impact on your position
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-600">Safe to Spend increases to</p>
                  <p className="text-lg font-bold text-emerald-700 mt-0.5">
                    {formatCurrencyCompact(newAvailable)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-600">Repays automatically</p>
                  <p className="text-sm font-semibold text-emerald-700 mt-0.5">
                    {nextIncome ? formatRelativeDate(nextIncome.expectedDate, referenceDate) : 'next payday'}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button className="w-full h-12 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors">
              Get {formatCurrencyCompact(suggestedAdvance)} Now — Free
            </button>
            
            <p className="text-center text-[11px] text-slate-400 mt-3">
              Instant delivery available for $2 · Standard delivery is free (24 hrs)
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="bg-white rounded-2xl shadow-sm border-0 ring-1 ring-black/[0.04]">
          <CardContent className="p-5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
              How Early Pay Works
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-slate-500">1</span>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-slate-900">Choose your amount</p>
                  <p className="text-[12px] text-slate-400">Up to {formatCurrencyCompact(maxAdvance)} from your upcoming deposit</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-slate-500">2</span>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-slate-900">Funds arrive instantly or next day</p>
                  <p className="text-[12px] text-slate-400">Free standard delivery or $2 for instant</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-slate-500">3</span>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-slate-900">Repays automatically on payday</p>
                  <p className="text-[12px] text-slate-400">Deducted from your next direct deposit — no interest</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-around text-center">
                <div>
                  <p className="text-[12px] font-semibold text-slate-700">0%</p>
                  <p className="text-[10px] text-slate-400">Interest</p>
                </div>
                <div className="h-6 w-px bg-slate-100" />
                <div>
                  <p className="text-[12px] font-semibold text-slate-700">No</p>
                  <p className="text-[10px] text-slate-400">Credit check</p>
                </div>
                <div className="h-6 w-px bg-slate-100" />
                <div>
                  <p className="text-[12px] font-semibold text-slate-700">Auto</p>
                  <p className="text-[10px] text-slate-400">Repayment</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

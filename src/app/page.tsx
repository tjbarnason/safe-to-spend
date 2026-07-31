import { Suspense } from 'react';
import { getDefaultProvider } from '@/data/mock-provider';
import { detectIncome } from '@/domain/income-predictor';
import { calculatePosition, generateAlerts } from '@/domain/position-engine';
import { DEFAULT_WINDOW_DAYS, DEFAULT_FLOOR_CENTS } from '@/lib/constants';
import { formatCurrencyCompact, formatDate } from '@/lib/format';
import { SafeToSpendCard } from '@/components/position/SafeToSpendCard';
import { RecommendedAction } from '@/components/actions/RecommendedAction';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

async function DashboardContent() {
  const provider = getDefaultProvider();
  const account = await provider.getAccount('sarah-checking-001');
  const obligations = await provider.getScheduledPayments(account.id);
  const referenceDate = provider.getReferenceDate();
  const historyStart = new Date(referenceDate);
  historyStart.setDate(historyStart.getDate() - 120);
  const transactions = await provider.getTransactions(account.id, historyStart, referenceDate);
  const income = detectIncome(transactions);
  const position = calculatePosition(account, obligations, income, DEFAULT_WINDOW_DAYS, DEFAULT_FLOOR_CENTS, referenceDate);
  const alerts = generateAlerts(position);
  const activeAlert = alerts.find(a => !a.isDismissed);

  // Get recent transactions for the activity feed (last 5)
  const recentTx = transactions
    .filter(tx => tx.date <= referenceDate)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <div className="w-full space-y-5">
      {/* Greeting */}
      <div className="pt-1">
        <h1 className="text-lg font-semibold text-slate-900">
          Good morning, Sarah
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Here&apos;s your financial snapshot
        </p>
      </div>

      {/* Account Balance Card */}
      <Card className="bg-white rounded-2xl shadow-sm border-0 ring-1 ring-black/[0.04]">
        <CardContent className="p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Checking ••4821</p>
          <p className="text-[32px] font-bold text-slate-900 mt-1.5 tracking-tight">
            {formatCurrencyCompact(account.currentBalance)}
          </p>
          <div className="flex gap-2 mt-4">
            <Link href="/early-pay" className="flex-1 h-9 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              Early Pay
            </Link>
            <button className="flex-1 h-9 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              Transfer
            </button>
            <button className="flex-1 h-9 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Protect
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Safe to Spend — The Star Feature */}
      <SafeToSpendCard position={position} alert={activeAlert} referenceDate={referenceDate} />

      {/* Intelligent Next Action */}
      <RecommendedAction position={position} />

      {/* Recent Activity */}
      <Card className="bg-white rounded-2xl shadow-sm border-0 ring-1 ring-black/[0.04]">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
            <Link href="#" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">See All</Link>
          </div>
          <div className="space-y-3.5">
            {recentTx.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                    tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tx.amount > 0 ? '↑' : '↓'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{tx.merchant || tx.description}</p>
                    <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {tx.amount > 0 ? '+' : '-'}{formatCurrencyCompact(Math.abs(tx.amount))}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-5">
      <div className="w-full max-w-[420px]">
        <Suspense fallback={
          <div className="animate-pulse space-y-5">
            <div className="h-6 bg-slate-200 rounded-lg w-48" />
            <div className="h-36 bg-slate-200 rounded-2xl" />
            <div className="h-72 bg-slate-200 rounded-2xl" />
          </div>
        }>
          <DashboardContent />
        </Suspense>
      </div>
    </main>
  );
}

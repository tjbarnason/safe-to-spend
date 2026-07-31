import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrencyCompact, formatRelativeDate } from '@/lib/format';
import type { FinancialPosition, PositionStatus, HeadsUpAlert } from '@/domain/types';

interface SafeToSpendCardProps {
  position: FinancialPosition;
  alert?: HeadsUpAlert | null;
  referenceDate: Date;
}

function getStatusConfig(status: PositionStatus, availableCapacity: number) {
  if (status === 'tight' || availableCapacity <= 0) {
    return {
      headline: "Hold off on spending",
      subtext: "Your upcoming bills exceed your available cushion. Wait for your next deposit.",
      cardClass: "bg-gradient-to-br from-amber-50 via-white to-white ring-amber-200/60",
      badgeClass: "bg-amber-100 text-amber-800",
      badgeText: "Needs attention",
      amountColor: "text-amber-600",
    };
  }
  if (status === 'watch') {
    return {
      headline: "Be mindful this week",
      subtext: "You have some room, but larger purchases could put your upcoming bills at risk.",
      cardClass: "bg-gradient-to-br from-amber-50/60 via-white to-white ring-amber-100/60",
      badgeClass: "bg-amber-100 text-amber-700",
      badgeText: "Watch",
      amountColor: "text-amber-600",
    };
  }
  return {
    headline: "You're in good shape",
    subtext: "Your upcoming bills are covered. You have room to spend comfortably.",
    cardClass: "bg-gradient-to-br from-emerald-50/60 via-white to-white ring-emerald-100/60",
    badgeClass: "bg-emerald-100 text-emerald-700",
    badgeText: "On track",
    amountColor: "text-emerald-600",
  };
}

export function SafeToSpendCard({ position, alert, referenceDate }: SafeToSpendCardProps) {
  const config = getStatusConfig(position.status, position.availableCapacity);
  
  // Get meaningful obligations (confirmed or > $20)
  const meaningfulObligations = position.obligations.filter(ob => 
    ob.confidence === 'confirmed' || ob.expectedAmount > 2000
  );
  
  // Prioritize payroll-sized income (>$1000) over gig income for display
  const payrollIncome = position.expectedIncome.find(inc => inc.expectedAmount > 100000);
  const confirmedIncome = position.expectedIncome.find(inc => inc.confidence === 'confirmed');
  const nextIncome = payrollIncome ?? confirmedIncome ?? position.expectedIncome[0] ?? null;
  
  // Show top 3 upcoming bills
  const topBills = meaningfulObligations.slice(0, 3);

  return (
    <Card className={cn("w-full rounded-2xl shadow-sm border-0 ring-1 overflow-hidden", config.cardClass)}>
      <CardContent className="p-5">
        {/* Section Label */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md flex items-center justify-center bg-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5 text-white">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Safe to Spend</span>
          </div>
          <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full", config.badgeClass)}>
            {config.badgeText}
          </span>
        </div>

        {/* LAYER 1: The Answer */}
        <div className="mb-2">
          <p className={cn("text-[36px] font-bold tracking-tight leading-none", config.amountColor)}>
            {formatCurrencyCompact(Math.max(0, position.availableCapacity))}
          </p>
        </div>

        {/* LAYER 2: Headline + Explanation */}
        <p className="text-[15px] font-semibold text-slate-900 mb-1">
          {config.headline}
        </p>
        <p className="text-sm text-slate-500 leading-relaxed">
          {config.subtext}
        </p>

        {/* LAYER 3: Evidence — Upcoming bills & income */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Coming up</p>
          <div className="space-y-3">
            {topBills.map((ob) => (
              <div key={ob.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                    <span className="text-[10px] text-slate-500">↓</span>
                  </div>
                  <span className="text-[13px] font-medium text-slate-700 truncate">{ob.name}</span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[13px] font-semibold text-slate-900 tabular-nums">
                    {formatCurrencyCompact(ob.expectedAmount)}
                  </span>
                  <span className="text-[11px] text-slate-400 w-14 text-right">
                    {formatRelativeDate(ob.expectedDate, referenceDate)}
                  </span>
                </div>
              </div>
            ))}
            {nextIncome && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <span className="text-[10px] text-emerald-600">↑</span>
                  </div>
                  <span className="text-[13px] font-medium text-slate-700 truncate">
                    {nextIncome.source.toLowerCase().includes('employer') || nextIncome.source.toLowerCase().includes('direct deposit') 
                      ? 'Paycheck' 
                      : nextIncome.source.toLowerCase().includes('taskrabbit')
                      ? 'Side income'
                      : nextIncome.source}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[13px] font-semibold text-emerald-600 tabular-nums">
                    +{formatCurrencyCompact(nextIncome.expectedAmount)}
                  </span>
                  <span className="text-[11px] text-slate-400 w-14 text-right">
                    {formatRelativeDate(nextIncome.expectedDate, referenceDate)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LAYER 4: Action */}
        <div className="mt-5">
          <Link 
            href="/simulate"
            className="flex items-center justify-center w-full h-10 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            What if I spend...?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

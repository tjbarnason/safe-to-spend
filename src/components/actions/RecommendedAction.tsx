import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrencyCompact } from '@/lib/format';
import type { FinancialPosition } from '@/domain/types';

interface RecommendedActionProps {
  position: FinancialPosition;
}

interface ActionConfig {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  cta: string;
  ctaStyle: string;
  href?: string;
  secondaryAction?: {
    title: string;
    description: string;
    cta: string;
    href?: string;
  };
}

function getRecommendation(position: FinancialPosition): ActionConfig {
  const { status, availableCapacity, expectedIncome } = position;
  const nextIncome = expectedIncome[0];
  const hasUpcomingDeposit = nextIncome && nextIncome.expectedAmount > 0;
  
  // TIGHT — urgent, protective actions
  if (status === 'tight' || availableCapacity <= 0) {
    return {
      icon: '⚡',
      iconBg: 'bg-blue-50',
      title: 'Transfer from Savings',
      description: `Moving $100 from Savings would increase your cushion to ${formatCurrencyCompact(availableCapacity + 10000)} and keep all upcoming bills covered.`,
      cta: 'Transfer Now',
      ctaStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondaryAction: hasUpcomingDeposit ? {
        title: 'Access Early Pay',
        description: `Access up to $500 from your upcoming paycheck to bridge the gap until payday.`,
        cta: 'Learn More',
        href: '/early-pay',
      } : undefined,
    };
  }
  
  // WATCH — cautious, helpful actions
  if (status === 'watch') {
    if (hasUpcomingDeposit) {
      return {
        icon: '💡',
        iconBg: 'bg-amber-50',
        title: 'Access Your Paycheck Early',
        description: `Your next paycheck arrives soon. Access up to ${formatCurrencyCompact(50000)} today to give yourself more breathing room before rent is due.`,
        cta: 'Access Early Pay',
        ctaStyle: 'bg-slate-900 hover:bg-slate-800 text-white',
        href: '/early-pay',
        secondaryAction: {
          title: 'Instant Transfer from Savings',
          description: 'Move funds instantly to increase your spending cushion.',
          cta: 'Transfer',
          href: '#',
        },
      };
    }
    return {
      icon: '🛡️',
      iconBg: 'bg-amber-50',
      title: 'Enable Overdraft Protection',
      description: 'Link your savings account so you\'re automatically covered if your balance runs low before payday.',
      cta: 'Set Up Protection',
      ctaStyle: 'bg-slate-900 hover:bg-slate-800 text-white',
    };
  }
  
  // COMFORTABLE — growth-oriented actions
  const excessAmount = Math.max(0, availableCapacity - 25000); // Amount above $250 "comfortable spending"
  if (excessAmount > 10000) {
    return {
      icon: '🌱',
      iconBg: 'bg-emerald-50',
      title: 'Move to Savings',
      description: `You have ${formatCurrencyCompact(excessAmount)} beyond your comfortable spending range. Growing your emergency fund keeps you prepared for the unexpected.`,
      cta: 'Move to Savings',
      ctaStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      secondaryAction: {
        title: 'Round Up Purchases',
        description: 'Automatically round up every purchase and save the difference.',
        cta: 'Enable',
      },
    };
  }
  
  return {
    icon: '✓',
    iconBg: 'bg-emerald-50',
    title: 'You\'re all set',
    description: 'Your bills are covered and your position looks healthy. Keep it up!',
    cta: 'View Cash Flow',
    ctaStyle: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  };
}

export function RecommendedAction({ position }: RecommendedActionProps) {
  const recommendation = getRecommendation(position);

  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0 ring-1 ring-black/[0.04]">
      <CardContent className="p-5">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Recommended
        </p>
        
        {/* Primary Recommendation */}
        <div className="flex gap-3.5">
          <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-lg shrink-0", recommendation.iconBg)}>
            {recommendation.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-slate-900">
              {recommendation.title}
            </p>
            <p className="text-[13px] text-slate-500 leading-relaxed mt-1">
              {recommendation.description}
            </p>
            <Link 
              href={recommendation.href ?? '#'}
              className={cn(
                "inline-flex items-center mt-3 h-8 px-4 rounded-lg text-xs font-semibold transition-colors",
                recommendation.ctaStyle
              )}
            >
              {recommendation.cta}
            </Link>
          </div>
        </div>

        {/* Secondary Recommendation (if available) */}
        {recommendation.secondaryAction && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-slate-700">
                  {recommendation.secondaryAction.title}
                </p>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  {recommendation.secondaryAction.description}
                </p>
              </div>
              <Link 
                href={recommendation.secondaryAction.href ?? '#'}
                className="shrink-0 ml-3 h-7 px-3 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-600 hover:bg-slate-200 transition-colors inline-flex items-center"
              >
                {recommendation.secondaryAction.cta}
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

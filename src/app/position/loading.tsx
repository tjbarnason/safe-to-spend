import { Skeleton } from '@/components/ui/skeleton';

export default function PositionDetailLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-7 w-48 mb-8" />
        {/* Summary bar skeleton */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div><Skeleton className="h-3 w-16 mb-2" /><Skeleton className="h-6 w-24" /></div>
          <div><Skeleton className="h-3 w-20 mb-2" /><Skeleton className="h-6 w-20" /></div>
          <div><Skeleton className="h-3 w-28 mb-2" /><Skeleton className="h-9 w-32" /></div>
        </div>
        {/* Timeline skeleton */}
        <Skeleton className="h-[200px] w-full rounded-lg mb-8" />
        {/* Lists skeleton */}
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </main>
  );
}

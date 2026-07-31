import { Skeleton } from '@/components/ui/skeleton';

export default function SimulateLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <Skeleton className="h-4 w-36 mb-6" />
        <Skeleton className="h-7 w-56 mb-2" />
        <Skeleton className="h-4 w-72 mb-8" />
        {/* Input skeleton */}
        <Skeleton className="h-12 w-full rounded-lg mb-6" />
        {/* Result skeleton */}
        <Skeleton className="h-[160px] w-full rounded-lg" />
      </div>
    </main>
  );
}

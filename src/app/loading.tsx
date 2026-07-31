import { PositionCardSkeleton } from '@/components/position/PositionCardSkeleton';

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <PositionCardSkeleton />
      </div>
    </main>
  );
}

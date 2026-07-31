import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PositionCardSkeleton() {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="mb-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-2 h-4 w-36" />
      </div>

      <Card className="w-full shadow-md">
        <CardContent className="p-6 pb-0">
          {/* Summary bar skeleton — 3 numbers */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <Skeleton className="mx-auto h-3 w-16 sm:mx-0" />
              <Skeleton className="mx-auto mt-2 h-6 w-24 sm:mx-0" />
            </div>
            <div className="text-center sm:text-left">
              <Skeleton className="mx-auto h-3 w-20 sm:mx-0" />
              <Skeleton className="mx-auto mt-2 h-6 w-20 sm:mx-0" />
            </div>
            <div className="text-center sm:text-left">
              <Skeleton className="mx-auto h-3 w-28 sm:mx-0" />
              <Skeleton className="mx-auto mt-2 h-9 w-32 sm:mx-0" />
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 border-t" />

          {/* Info rows skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-44" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 border-t" />
        </CardContent>

        {/* CTA skeleton */}
        <CardFooter className="px-6 pb-6 pt-0">
          <Skeleton className="h-10 w-full rounded-md" />
        </CardFooter>
      </Card>
    </div>
  );
}

import { Skeleton } from "@/components/shared/skeleton";

export default function IntelligenceLoading() {
  return (
    <div className="space-y-space-8 w-full pb-space-12">
      {/* Page title skeleton */}
      <div className="space-y-space-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Weekly Review skeleton */}
      <Skeleton className="h-52 w-full rounded-xl" />

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-6">
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-6">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-6">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>
  );
}

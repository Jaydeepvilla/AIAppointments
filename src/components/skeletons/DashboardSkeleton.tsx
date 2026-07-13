import { Skeleton } from "@/components/shared/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-space-6 w-full animate-in fade-in">
      {/* Header */}
      <div className="space-y-space-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-card text-card-foreground shadow-sm p-space-6 space-y-space-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-space-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-card text-card-foreground shadow-sm">
              <div className="p-space-6 border-b border-neutral-200 dark:border-neutral-800">
                <Skeleton className="h-5 w-40 mb-space-2" />
                <Skeleton className="h-4 w-60" />
              </div>
              <div className="p-space-6">
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-space-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-card text-card-foreground shadow-sm p-space-6 space-y-space-4">
              <Skeleton className="h-5 w-32 mb-space-4" />
              <div className="space-y-space-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

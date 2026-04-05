import { Skeleton } from "./skeleton";

export const StatCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-5 space-y-3">
    <Skeleton className="w-10 h-10 rounded-xl" />
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-4 w-24" />
  </div>
);

export const TripCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-5 space-y-3">
    <div className="flex items-center gap-2">
      <Skeleton className="w-8 h-8 rounded-lg" />
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <div className="flex gap-3">
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-14" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

export const RecommendationSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="w-full h-48 rounded-xl" />
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </div>
    <div className="grid md:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

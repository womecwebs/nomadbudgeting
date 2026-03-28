import React from 'react';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} {...props} />
);

export const BudgetCardSkeleton = () => (
  <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm space-y-4">
    <Skeleton className="h-6 w-1/3" />
    <Skeleton className="h-10 w-1/2" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

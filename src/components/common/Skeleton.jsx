import React from 'react';

const Skeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`}></div>
  );
};

export const CardSkeleton = () => (
  <div className="card space-y-4">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex gap-2">
      <Skeleton className="h-8 w-20 rounded-full" />
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  </div>
);

export default Skeleton;

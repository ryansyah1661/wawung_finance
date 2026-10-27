import React from 'react';
import { Skeleton } from './skeleton';

export function DetailSkeleton({ maxWidth = "max-w-[900px]" }: { maxWidth?: string }) {
  return (
    <div className={`${maxWidth} mx-auto space-y-6 animate-pulse`}>
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      {/* Status Banner Skeleton */}
      <Skeleton className="h-14 w-full rounded-xl" />

      {/* Two Column Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-5 w-40 rounded-md" />
          </div>
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <Skeleton className="h-3.5 w-20 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-4 w-36 rounded" />
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <div className="flex justify-between items-center py-2">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-4 w-36 rounded" />
            </div>
          </div>
        </div>

        {/* Right Card: Jumlah & Keperluan */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2 shadow-xs">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-8 w-48 rounded-lg" />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-full rounded" />
          </div>
        </div>
      </div>

      {/* Table Section Skeleton */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-44 rounded-md" />
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default DetailSkeleton;

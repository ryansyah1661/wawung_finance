import React from 'react';
import { Skeleton } from './skeleton';

export default function PageSkeleton() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-[200px] rounded-lg" />
        <Skeleton className="h-4 w-[300px] rounded-lg" />
      </div>

      {/* Top Cards (like Dashboard stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>

      {/* Main Content Area (like Table or Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[400px] lg:col-span-2 rounded-2xl" />
        <Skeleton className="h-[400px] lg:col-span-1 rounded-2xl" />
      </div>
      
      {/* Table Skeleton fallback */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}

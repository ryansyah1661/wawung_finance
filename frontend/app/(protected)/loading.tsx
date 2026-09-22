import React from 'react';
import PageSkeleton from '@/components/ui/PageSkeleton';

export default function Loading() {
  return (
    <div className="w-full h-full p-4 md:p-8">
      <PageSkeleton />
    </div>
  );
}

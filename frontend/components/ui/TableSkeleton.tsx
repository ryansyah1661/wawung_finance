import React from 'react';
import { Skeleton } from './skeleton';

export default function TableSkeleton({ columns = 5, rows = 5 }: { columns?: number, rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-slate-100 last:border-0">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="p-4">
              <Skeleton className="h-5 w-full rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

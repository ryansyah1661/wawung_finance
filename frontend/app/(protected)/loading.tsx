import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 w-full h-full">
      <div className="relative flex items-center justify-center w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        {/* Inner Icon */}
        <span className="material-symbols-outlined text-primary text-[24px] animate-pulse">
          account_balance
        </span>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-widest animate-pulse">
          Kawungpitu Finance
        </h3>
        <p className="text-xs text-slate-400 mt-1">Memuat data...</p>
      </div>
    </div>
  );
}

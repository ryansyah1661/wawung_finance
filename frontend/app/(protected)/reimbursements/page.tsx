'use client';

import React, { useState } from 'react';

export default function ReimbursementsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Reimbursements</h2>
          <p className="text-sm text-slate-500 mt-0.5">Kelola klaim penggantian biaya dari staf.</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Reimbursement
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-50">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Search</label>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search request, user..." 
            className="w-full pl-3 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        
        <div className="w-40">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Status</label>
          <select className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>

        <button className="p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Request ID</th>
              <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
              <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Jumlah</th>
              <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="py-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {/* Mock Data */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-4 px-4 font-mono font-medium text-slate-900">RB-2023-001</td>
              <td className="py-4 px-4 text-slate-700">Dina Rahmawati</td>
              <td className="py-4 px-4 text-slate-500">24 Oct 2023</td>
              <td className="py-4 px-4 font-mono font-semibold text-slate-900">Rp 350.000</td>
              <td className="py-4 px-4 text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium text-[11px]">Pending</span>
              </td>
              <td className="py-4 px-4 text-right">
                <button className="text-primary hover:underline font-semibold cursor-pointer">View</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-4 px-4 font-mono font-medium text-slate-900">RB-2023-002</td>
              <td className="py-4 px-4 text-slate-700">Budi Santoso</td>
              <td className="py-4 px-4 text-slate-500">23 Oct 2023</td>
              <td className="py-4 px-4 font-mono font-semibold text-slate-900">Rp 1.200.000</td>
              <td className="py-4 px-4 text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[11px]">Approved</span>
              </td>
              <td className="py-4 px-4 text-right">
                <button className="text-primary hover:underline font-semibold cursor-pointer">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FUND_REQUESTS = [
  { id: 'PD-2023-001', date: '2023-10-24', requester: 'Dina Rahmawati', department: 'Marketing', purpose: 'Biaya transportasi kunjungan klien PT. Maju Bersama', amount: 350000, status: 'pending' },
  { id: 'PD-2023-002', date: '2023-10-23', requester: 'Ahmad Fauzi', department: 'Finance', purpose: 'Dana operasional acara internal', amount: 1200000, status: 'approved' },
  { id: 'PD-2023-003', date: '2023-10-20', requester: 'Budi Santoso', department: 'Operations', purpose: 'Pembelian perlengkapan gudang', amount: 850000, status: 'approved' },
  { id: 'PD-2023-004', date: '2023-10-18', requester: 'Siti Nurhaliza', department: 'Sales', purpose: 'Biaya entertain klien Q4', amount: 2500000, status: 'rejected' },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending Approval', bg: 'bg-amber-50', text: 'text-amber-700' },
  approved: { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  rejected: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-700' },
};

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function FundRequestsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Fund Requests</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola pengajuan dana operasional</p>
        </div>
        <Link
          href="/fund-requests/new-fund-request"
          className="bg-primary text-white hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          New Fund Request
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pending</p>
            <p className="text-xl font-bold text-slate-900 font-mono">1 <span className="text-xs font-normal text-slate-500">items</span></p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Approved (Month)</p>
            <p className="text-lg font-bold text-slate-900 font-mono">Rp 2.05M</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rejected</p>
            <p className="text-xl font-bold text-slate-900 font-mono">1 <span className="text-xs font-normal text-slate-500">items</span></p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <span className="material-symbols-outlined text-[20px]">cancel</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-50">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nama pemohon, nomor pengajuan..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>
        <div className="w-44">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
          <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
          <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer">
            <option>All Departments</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>Operations</option>
            <option>Finance</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3">No. Pengajuan</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Pemohon</th>
                <th className="p-3">Departemen</th>
                <th className="p-3">Keperluan</th>
                <th className="p-3 text-right">Jumlah</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {FUND_REQUESTS.map((item) => {
                const status = STATUS_CONFIG[item.status];
                return (
                  <tr
                    key={item.id}
                    onClick={() => router.push(`/fund-requests/${item.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="p-3 font-mono text-xs font-medium text-slate-900">{item.id}</td>
                    <td className="p-3 text-slate-500">{item.date}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px]">
                          {item.requester.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-slate-900">{item.requester}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-500">{item.department}</td>
                    <td className="p-3 text-slate-700 max-w-70 truncate">{item.purpose}</td>
                    <td className="p-3 text-right font-mono font-medium text-slate-900">{formatRupiah(item.amount)}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" style={{ fontSize: '18px' }}>
                        chevron_right
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-slate-500 text-sm">
            Menampilkan 1-4 dari 4 pengajuan
          </span>
          <div className="flex gap-1">
            <button className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer" disabled>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
            </button>
            <button className="px-3 py-1 rounded bg-primary/10 text-primary font-medium text-sm cursor-pointer">1</button>
            <button className="p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
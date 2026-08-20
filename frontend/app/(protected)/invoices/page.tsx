'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const INVOICES = [
  {
    id: 'INV-2023-104',
    client: 'PT Alpha',
    issueDate: '2023-10-10',
    dueDate: '2023-10-27',
    amount: 8500000,
    status: 'overdue',
  },
  {
    id: 'INV-2023-105',
    client: 'CV Beta',
    issueDate: '2023-10-12',
    dueDate: '2023-10-28',
    amount: 12100000,
    status: 'due-soon',
  },
  {
    id: 'INV-2023-103',
    client: 'PT Maju Bersama',
    issueDate: '2023-10-05',
    dueDate: '2023-10-20',
    amount: 25000000,
    status: 'paid',
  },
  {
    id: 'INV-2023-102',
    client: 'CV Sukses Mandiri',
    issueDate: '2023-10-01',
    dueDate: '2023-10-15',
    amount: 4750000,
    status: 'paid',
  },
  {
    id: 'INV-2023-101',
    client: 'PT Delta Prima',
    issueDate: '2023-09-28',
    dueDate: '2023-10-12',
    amount: 6200000,
    status: 'paid',
  },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  overdue: { label: 'Overdue', bg: 'bg-rose-50', text: 'text-rose-700' },
  'due-soon': { label: 'Due Soon', bg: 'bg-amber-50', text: 'text-amber-700' },
  paid: { label: 'Paid', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  draft: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-600' },
};

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoices</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola tagihan dan pembayaran klien</p>
        </div>
        <Link href="/invoices/new-invoice">
          <button className="bg-primary text-white hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Create Invoice
          </button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Outstanding</p>
            <p className="text-lg font-bold text-slate-900 font-mono">Rp 20.6M</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Overdue</p>
            <p className="text-lg font-bold text-slate-900 font-mono">1 <span className="text-xs font-normal text-slate-500">invoice</span></p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <span className="material-symbols-outlined text-[20px]">event_busy</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Due Soon</p>
            <p className="text-lg font-bold text-slate-900 font-mono">1 <span className="text-xs font-normal text-slate-500">invoice</span></p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-[20px]">schedule</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Paid (Month)</p>
            <p className="text-lg font-bold text-slate-900 font-mono">Rp 35.9M</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
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
            placeholder="Client, ID invoice..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>
        <div className="w-44">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
          <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer">
            <option>All Status</option>
            <option>Draft</option>
            <option>Due Soon</option>
            <option>Overdue</option>
            <option>Paid</option>
          </select>
        </div>
        <div className="w-56">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date Range</label>
          <input
            type="date"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3">No. Invoice</th>
                <th className="p-3">Client</th>
                <th className="p-3">Tanggal Terbit</th>
                <th className="p-3">Jatuh Tempo</th>
                <th className="p-3 text-right">Jumlah</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {INVOICES.map((invoice) => {
                const status = STATUS_CONFIG[invoice.status];
                return (
                  <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-3 font-mono text-xs font-medium text-slate-900">{invoice.id}</td>
                    <td className="p-3 font-medium text-slate-900">{invoice.client}</td>
                    <td className="p-3 text-slate-500">{invoice.issueDate}</td>
                    <td className="p-3 text-slate-500">{invoice.dueDate}</td>
                    <td className="p-3 text-right font-mono font-medium text-slate-900">{formatRupiah(invoice.amount)}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="View">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Download">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                        </button>
                      </div>
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
            Menampilkan 1-5 dari 5 invoice
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
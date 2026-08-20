'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type TransactionType = 'income' | 'expense';

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') as TransactionType || 'expense';
  const [type, setType] = useState<TransactionType>(initialType);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      {/* Page Header & Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Semua Transaksi</h2>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            Export
          </button>
          <Link href="/transactions/income-expense?type=expense" className="bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
              Input Expense
          </Link>
          <Link href="/transactions/income-expense?type=income" className="bg-primary text-white hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Input Income
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-50">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Description, ID..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>
        <div className="w-40">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
          <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer">
            <option>All Types</option>
            <option>Income</option>
            <option>Expense</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
          <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer">
            <option>All Categories</option>
            <option>Operations</option>
            <option>Marketing</option>
            <option>Payroll</option>
          </select>
        </div>
        <div className="w-56">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date Range</label>
          <input
            type="date"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
          />
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors p-2 rounded-lg flex items-center justify-center h-9.5 w-9.5 cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3 w-12 text-center">
                  <input className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                </th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Keterangan</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Akun</th>
                <th className="p-3 text-right">Jumlah</th>
                <th className="p-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {/* Row 1 */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="p-3 text-center">
                  <input className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                </td>
                <td className="p-3 text-slate-500">2023-10-27</td>
                <td className="p-3 font-medium text-slate-900">Payment for Services</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                    Income
                  </span>
                </td>
                <td className="p-3 text-slate-500">BCA Utama</td>
                <td className="p-3 text-right font-mono text-emerald-600 font-medium">+ Rp 15.000.000</td>
                <td className="p-3 text-center">
                  <button className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="p-3 text-center">
                  <input className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                </td>
                <td className="p-3 text-slate-500">2023-10-26</td>
                <td className="p-3 font-medium text-slate-900">Office Supplies - October</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                    Operations
                  </span>
                </td>
                <td className="p-3 text-slate-500">Kas Kecil</td>
                <td className="p-3 text-right font-mono text-rose-600 font-medium">- Rp 1.250.000</td>
                <td className="p-3 text-center">
                  <button className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="p-3 text-center">
                  <input className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                </td>
                <td className="p-3 text-slate-500">2023-10-25</td>
                <td className="p-3 font-medium text-slate-900">Client Reimbursement #INV-892</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                    Income
                  </span>
                </td>
                <td className="p-3 text-slate-500">Mandiri Bisnis</td>
                <td className="p-3 text-right font-mono text-emerald-600 font-medium">+ Rp 8.400.000</td>
                <td className="p-3 text-center">
                  <button className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="p-3 text-center">
                  <input className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                </td>
                <td className="p-3 text-slate-500">2023-10-24</td>
                <td className="p-3 font-medium text-slate-900">Software Subscriptions (AWS, GitHub)</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                    IT &amp; Tech
                  </span>
                </td>
                <td className="p-3 text-slate-500">Kartu Kredit Perusahaan</td>
                <td className="p-3 text-right font-mono text-rose-600 font-medium">- Rp 3.850.000</td>
                <td className="p-3 text-center">
                  <button className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Row 5 */}
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="p-3 text-center">
                  <input className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                </td>
                <td className="p-3 text-slate-500">2023-10-22</td>
                <td className="p-3 font-medium text-slate-900">Consulting Retainer - Q4</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                    Income
                  </span>
                </td>
                <td className="p-3 text-slate-500">BCA Utama</td>
                <td className="p-3 text-right font-mono text-emerald-600 font-medium">+ Rp 25.000.000</td>
                <td className="p-3 text-center">
                  <button className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-slate-500 text-sm">
            Menampilkan 1-10 dari 156 transaksi
          </span>
          <div className="flex gap-1">
            <button className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer" disabled>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
            </button>
            <button className="px-3 py-1 rounded bg-primary/10 text-primary font-medium text-sm cursor-pointer">1</button>
            <button className="px-3 py-1 rounded text-slate-500 hover:bg-slate-100 transition-colors text-sm cursor-pointer">2</button>
            <button className="px-3 py-1 rounded text-slate-500 hover:bg-slate-100 transition-colors text-sm cursor-pointer">3</button>
            <span className="px-2 py-1 text-slate-400">...</span>
            <button className="px-3 py-1 rounded text-slate-500 hover:bg-slate-100 transition-colors text-sm cursor-pointer">16</button>
            <button className="p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
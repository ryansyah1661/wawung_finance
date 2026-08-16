'use client';

import React, { useState } from 'react';

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      
      {/* Page Header & Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="font-headline-md text-headline-md text-on-surface">Semua Transaksi</h2>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button className="bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors px-4 py-2 rounded-lg flex items-center gap-2 font-body-sm text-body-sm cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            Export
          </button>
          <button className="bg-error-container text-on-error-container hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 font-body-sm text-body-sm cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
            Input Expense
          </button>
          <button className="bg-primary-container text-on-primary-container hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 font-body-sm text-body-sm cursor-pointer">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Input Income
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Search</label>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Description, ID..." 
            className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-sm text-body-sm placeholder-on-surface-variant"
          />
        </div>
        <div className="w-40">
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Type</label>
          <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-sm text-body-sm appearance-none cursor-pointer">
            <option>All Types</option>
            <option>Income</option>
            <option>Expense</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Category</label>
          <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-sm text-body-sm appearance-none cursor-pointer">
            <option>All Categories</option>
            <option>Operations</option>
            <option>Marketing</option>
            <option>Payroll</option>
          </select>
        </div>
        <div className="w-56">
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Date Range</label>
          <input 
            type="date" 
            className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-sm text-body-sm cursor-pointer"
          />
        </div>
        <button className="bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors p-2 rounded-lg flex items-center justify-center h-[38px] w-[38px] cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-[#334155] font-label-caps text-label-caps text-on-surface-variant">
                <th className="p-3 w-12 text-center">
                  <input className="rounded bg-surface-container border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer" type="checkbox" />
                </th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Keterangan</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Akun</th>
                <th className="p-3 text-right">Jumlah</th>
                <th className="p-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm divide-y divide-[#334155]">
              {/* Row 1 */}
              <tr className="hover:bg-surface-container-highest transition-colors group">
                <td className="p-3 text-center">
                  <input className="rounded bg-surface border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer" type="checkbox" />
                </td>
                <td className="p-3 text-on-surface-variant">2023-10-27</td>
                <td className="p-3 font-medium text-on-surface">Payment for Services</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/10 text-secondary">
                    Income
                  </span>
                </td>
                <td className="p-3 text-on-surface-variant">BCA Utama</td>
                <td className="p-3 text-right font-data-mono-md text-emerald-400">+ Rp 15.000.000</td>
                <td className="p-3 text-center">
                  <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-surface-container-highest transition-colors group">
                <td className="p-3 text-center">
                  <input className="rounded bg-surface border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer" type="checkbox" />
                </td>
                <td className="p-3 text-on-surface-variant">2023-10-26</td>
                <td className="p-3 font-medium text-on-surface">Office Supplies - October</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-tertiary/10 text-tertiary">
                    Operations
                  </span>
                </td>
                <td className="p-3 text-on-surface-variant">Kas Kecil</td>
                <td className="p-3 text-right font-data-mono-md text-error">- Rp 1.250.000</td>
                <td className="p-3 text-center">
                  <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-surface-container-highest transition-colors group">
                <td className="p-3 text-center">
                  <input className="rounded bg-surface border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer" type="checkbox" />
                </td>
                <td className="p-3 text-on-surface-variant">2023-10-25</td>
                <td className="p-3 font-medium text-on-surface">Client Reimbursement #INV-892</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/10 text-secondary">
                    Income
                  </span>
                </td>
                <td className="p-3 text-on-surface-variant">Mandiri Bisnis</td>
                <td className="p-3 text-right font-data-mono-md text-emerald-400">+ Rp 8.400.000</td>
                <td className="p-3 text-center">
                  <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="hover:bg-surface-container-highest transition-colors group">
                <td className="p-3 text-center">
                  <input className="rounded bg-surface border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer" type="checkbox" />
                </td>
                <td className="p-3 text-on-surface-variant">2023-10-24</td>
                <td className="p-3 font-medium text-on-surface">Software Subscriptions (AWS, GitHub)</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-tertiary/10 text-tertiary">
                    IT & Tech
                  </span>
                </td>
                <td className="p-3 text-on-surface-variant">Kartu Kredit Perusahaan</td>
                <td className="p-3 text-right font-data-mono-md text-error">- Rp 3.850.000</td>
                <td className="p-3 text-center">
                  <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                  </button>
                </td>
              </tr>
              {/* Row 5 */}
              <tr className="hover:bg-surface-container-highest transition-colors group">
                <td className="p-3 text-center">
                  <input className="rounded bg-surface border-outline-variant text-primary-container focus:ring-primary-container cursor-pointer" type="checkbox" />
                </td>
                <td className="p-3 text-on-surface-variant">2023-10-22</td>
                <td className="p-3 font-medium text-on-surface">Consulting Retainer - Q4</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/10 text-secondary">
                    Income
                  </span>
                </td>
                <td className="p-3 text-on-surface-variant">BCA Utama</td>
                <td className="p-3 text-right font-data-mono-md text-emerald-400">+ Rp 25.000.000</td>
                <td className="p-3 text-center">
                  <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-surface border-t border-[#334155] p-4 flex items-center justify-between">
          <span className="text-on-surface-variant font-body-sm text-body-sm">
            Menampilkan 1-10 dari 156 transaksi
          </span>
          <div className="flex gap-1">
            <button className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer" disabled>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
            </button>
            <button className="px-3 py-1 rounded bg-secondary-container text-on-secondary-container font-body-sm text-body-sm font-medium cursor-pointer">1</button>
            <button className="px-3 py-1 rounded text-on-surface-variant hover:bg-surface-container transition-colors font-body-sm text-body-sm cursor-pointer">2</button>
            <button className="px-3 py-1 rounded text-on-surface-variant hover:bg-surface-container transition-colors font-body-sm text-body-sm cursor-pointer">3</button>
            <span className="px-2 py-1 text-on-surface-variant">...</span>
            <button className="px-3 py-1 rounded text-on-surface-variant hover:bg-surface-container transition-colors font-body-sm text-body-sm cursor-pointer">16</button>
            <button className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
'use client';

import React, { useState } from 'react';

const REPORT_TYPES = [
  {
    id: 'profit-loss',
    title: 'Laporan Laba Rugi',
    description: 'Ringkasan pendapatan, beban, dan laba bersih periode berjalan',
    icon: 'trending_up',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    id: 'cash-flow',
    title: 'Laporan Arus Kas',
    description: 'Pergerakan kas masuk dan keluar per kategori dan periode',
    icon: 'account_balance',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    id: 'balance-sheet',
    title: 'Neraca',
    description: 'Posisi aset, liabilitas, dan ekuitas perusahaan',
    icon: 'balance',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    id: 'expense-breakdown',
    title: 'Rincian Pengeluaran',
    description: 'Breakdown pengeluaran per departemen dan kategori',
    icon: 'pie_chart',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

const RECENT_REPORTS = [
  { name: 'Laporan Laba Rugi - Oktober 2023', type: 'PDF', date: '2023-10-27', size: '284 KB' },
  { name: 'Arus Kas - Q3 2023', type: 'XLSX', date: '2023-10-15', size: '512 KB' },
  { name: 'Rincian Pengeluaran - September 2023', type: 'PDF', date: '2023-10-02', size: '198 KB' },
  { name: 'Neraca - September 2023', type: 'PDF', date: '2023-10-01', size: '221 KB' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('this-month');

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
          <p className="text-sm text-slate-500 mt-1">Generate dan unduh laporan keuangan</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
        >
          <option value="this-month">Bulan Ini</option>
          <option value="last-month">Bulan Lalu</option>
          <option value="this-quarter">Kuartal Ini</option>
          <option value="this-year">Tahun Ini</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_TYPES.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col gap-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-lg ${report.bg} flex items-center justify-center ${report.color}`}>
              <span className="material-symbols-outlined text-[20px]">{report.icon}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                {report.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{report.description}</p>
            </div>
            <button className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-primary self-start">
              Generate
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue vs Expense Chart */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Pendapatan vs Pengeluaran</h3>
            <span className="text-xs text-slate-500">6 Bulan Terakhir</span>
          </div>

          <div className="flex-1 relative min-h-55 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size[20px_20px] rounded-lg p-4 flex items-end gap-6">
            {[
              { month: 'Jan', income: 40, expense: 25 },
              { month: 'Feb', income: 45, expense: 28 },
              { month: 'Mar', income: 50, expense: 30 },
              { month: 'Apr', income: 65, expense: 35 },
              { month: 'Mei', income: 60, expense: 32 },
              { month: 'Jun', income: 75, expense: 38 },
            ].map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center gap-1 h-40">
                  <div
                    className="w-3 bg-emerald-500 rounded-t"
                    style={{ height: `${d.income}%` }}
                  ></div>
                  <div
                    className="w-3 bg-rose-400 rounded-t"
                    style={{ height: `${d.expense}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <span className="w-3 h-3 rounded bg-emerald-500"></span> Pendapatan
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <span className="w-3 h-3 rounded bg-rose-400"></span> Pengeluaran
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Ringkasan Periode</h3>
          <div className="space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">Total Pendapatan</span>
              <span className="font-mono font-semibold text-emerald-600">Rp 45.2M</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">Total Pengeluaran</span>
              <span className="font-mono font-semibold text-rose-600">Rp 12.8M</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">Laba Bersih</span>
              <span className="font-mono font-semibold text-slate-900">Rp 32.4M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Margin</span>
              <span className="font-mono font-semibold text-primary">71.7%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Laporan Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3">Nama Laporan</th>
                <th className="p-3">Tipe</th>
                <th className="p-3">Tanggal Dibuat</th>
                <th className="p-3">Ukuran</th>
                <th className="p-3 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {RECENT_REPORTS.map((report) => (
                <tr key={report.name} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-[16px]">description</span>
                      </div>
                      <span className="font-medium text-slate-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600">
                      {report.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{report.date}</td>
                  <td className="p-3 text-slate-500">{report.size}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Download">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function SuperadminDashboard() {
  const router = useRouter();

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      
      {/* Greeting */}
      <header className="mb-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1 tracking-tight">Selamat datang, Ahmad!</h2>
        <p className="text-sm text-slate-500">Berikut adalah ringkasan operasional Kawung Finance untuk hari ini.</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pemasukan */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 font-bold text-[11px] tracking-wider uppercase">Pemasukan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </div>
          </div>
          <div>
            <div className="font-semibold text-lg text-slate-900 mb-1 font-mono">Rp 45.200.000</div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              12.5% vs bulan lalu
            </div>
          </div>
        </div>

        {/* Pengeluaran */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 font-bold text-[11px] tracking-wider uppercase">Pengeluaran</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <span className="material-symbols-outlined text-[18px]">trending_down</span>
            </div>
          </div>
          <div>
            <div className="font-semibold text-lg text-slate-900 mb-1 font-mono">Rp 12.800.000</div>
            <div className="flex items-center gap-1 text-xs text-rose-600 font-medium">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
              3.2% vs bulan lalu
            </div>
          </div>
        </div>

        {/* Saldo Bersih */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-slate-500 font-bold text-[11px] tracking-wider uppercase">Saldo Bersih</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-blue-600 mb-1 text-lg font-bold font-mono">Rp 32.400.000</div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              8.1% vs bulan lalu
            </div>
          </div>
        </div>

        {/* Menunggu Approval */}
        <div className="bg-white border border-amber-200 shadow-sm rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <span className="text-amber-600 font-bold text-[11px] tracking-wider uppercase">Menunggu Approval</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-slate-900 mb-1 text-xl font-mono font-bold">5 <span className="text-xs text-slate-500 font-normal">items</span></div>
              <div className="text-xs text-slate-500">Perlu tindakan</div>
            </div>
            <span className="material-symbols-outlined text-amber-600 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart Area */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Tren Arus Kas (Cash Flow)</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary outline-none cursor-pointer">
              <option>6 Bulan Terakhir</option>
              <option>Tahun Ini</option>
            </select>
          </div>
          
          <div className="flex-1 relative min-h-[250px] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px] rounded-lg p-4 flex items-end">
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-slate-400 text-[11px] font-mono py-4 px-2">
              <span>60M</span>
              <span>40M</span>
              <span>20M</span>
              <span>0</span>
            </div>
            
            <svg className="absolute inset-0 w-full h-full p-4 pl-12" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path className="opacity-80" d="M 0 80 Q 20 70, 40 50 T 60 40 T 80 20 T 100 30" fill="none" stroke="#10b981" strokeWidth="2.5"></path>
              <circle cx="100" cy="30" fill="#10b981" r="3"></circle>
              <path className="opacity-80" d="M 0 90 Q 20 85, 40 80 T 60 70 T 80 75 T 100 65" fill="none" stroke="#ef4444" strokeWidth="2.5"></path>
              <circle cx="100" cy="65" fill="#ef4444" r="3"></circle>
            </svg>

            <div className="absolute bottom-0 left-12 right-4 flex justify-between text-slate-500 text-xs translate-y-6 font-medium">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span>
            </div>

            <div className="absolute top-4 right-4 flex gap-4 bg-white/90 px-3 py-1.5 rounded-md backdrop-blur-sm border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="w-3 h-1 bg-emerald-500 rounded-full"></span> Pemasukan
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="w-3 h-1 bg-rose-500 rounded-full"></span> Pengeluaran
              </div>
            </div>
          </div>
        </div>

        {/* Donut Chart Area */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Komposisi Pengeluaran</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div 
              className="w-44 h-44 rounded-full flex items-center justify-center shadow-inner" 
              style={{
                background: 'conic-gradient(#3b82f6 0% 45%, #8b5cf6 45% 70%, #f59e0b 70% 88%, #64748b 88% 100%)'
              }}
            >
              <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-slate-400 text-xs">Total Keluar</span>
                <span className="text-sm font-semibold text-slate-900 mt-0.5 font-mono">Rp 12.8M</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-xs text-slate-700 font-medium">Gaji</span>
              <span className="text-xs text-slate-500 ml-auto font-mono">45%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-xs text-slate-700 font-medium">Ops</span>
              <span className="text-xs text-slate-500 ml-auto font-mono">25%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs text-slate-700 font-medium">Marketing</span>
              <span className="text-xs text-slate-500 ml-auto font-mono">18%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              <span className="text-xs text-slate-700 font-medium">Lainnya</span>
              <span className="text-xs text-slate-500 ml-auto font-mono">12%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transaksi Terbaru Table */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
            <h3 className="text-lg font-semibold text-slate-900">Transaksi Terbaru</h3>
            <button className="text-primary hover:underline text-xs transition-colors flex items-center gap-1 font-semibold cursor-pointer">
              Lihat Semua <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Jumlah</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-6 text-slate-500">24 Okt 2023</td>
                  <td className="py-3.5 px-6 text-slate-900 font-medium">Pembayaran Vendor IT</td>
                  <td className="py-3.5 px-6 text-slate-500">Operations</td>
                  <td className="py-3.5 px-6 text-slate-900 font-mono text-right">-Rp 4.500.000</td>
                  <td className="py-3.5 px-6 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">Verified</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-6 text-slate-500">23 Okt 2023</td>
                  <td className="py-3.5 px-6 text-slate-900 font-medium">Invoice Client A</td>
                  <td className="py-3.5 px-6 text-slate-500">Income</td>
                  <td className="py-3.5 px-6 text-emerald-600 font-mono text-right font-medium">+Rp 12.000.000</td>
                  <td className="py-3.5 px-6 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">Verified</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-6 text-slate-500">23 Okt 2023</td>
                  <td className="py-3.5 px-6 text-slate-900 font-medium">Reimbursement Budi</td>
                  <td className="py-3.5 px-6 text-slate-500">HR/Staff</td>
                  <td className="py-3.5 px-6 text-slate-900 font-mono text-right">-Rp 850.000</td>
                  <td className="py-3.5 px-6 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">Pending</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-6 text-slate-500">22 Okt 2023</td>
                  <td className="py-3.5 px-6 text-slate-900 font-medium">Langganan Software</td>
                  <td className="py-3.5 px-6 text-slate-500">Operations</td>
                  <td className="py-3.5 px-6 text-slate-900 font-mono text-right">-Rp 2.100.000</td>
                  <td className="py-3.5 px-6 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">Verified</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="flex flex-col gap-6">
          
          {/* Menunggu Approval List */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">pending_actions</span>
              Menunggu Approval
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-amber-300 transition-colors">
                <div>
                  <div className="text-xs font-medium text-slate-900 mb-1">Pengajuan Dana Dept Marketing</div>
                  <div className="text-xs text-amber-600 font-mono font-semibold">Rp 15.000.000</div>
                </div>
                <button className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0 shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </button>
              </li>
              <li className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-amber-300 transition-colors">
                <div>
                  <div className="text-xs font-medium text-slate-900 mb-1">Reimbursement Travel - Siti</div>
                  <div className="text-xs text-amber-600 font-mono font-semibold">Rp 3.200.000</div>
                </div>
                <button className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0 shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </button>
              </li>
            </ul>
            <button className="w-full mt-4 text-center text-xs text-primary hover:underline font-semibold cursor-pointer">Lihat 3 lainnya</button>
          </div>

          {/* Invoice Jatuh Tempo List */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600">event_busy</span>
              Invoice Jatuh Tempo
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border-l-4 border-l-rose-500 border border-slate-200">
                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-900">INV-2023-104 (PT Alpha)</div>
                  <div className="text-[11px] text-rose-600 font-medium mt-1">Jatuh Tempo: Hari Ini</div>
                </div>
                <div className="text-xs text-slate-900 font-mono font-semibold">Rp 8.5M</div>
              </li>
              <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border-l-4 border-l-amber-500 border border-slate-200">
                <div className="flex-1">
                  <div className="text-xs font-medium text-slate-900">INV-2023-105 (CV Beta)</div>
                  <div className="text-[11px] text-amber-600 font-medium mt-1">Jatuh Tempo: Besok</div>
                </div>
                <div className="text-xs text-slate-900 font-mono font-semibold">Rp 12.1M</div>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type TransactionType = 'income' | 'expense';

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as TransactionType) || 'expense';
  const [type, setType] = useState<TransactionType>(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterDate, setFilterDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mock_transactions') || '[]');
    const filtered = saved.filter((t: any) => {
      const matchSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.id?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === 'All Types' || t.type === filterType;
      const matchCategory = filterCategory === 'All Categories' || t.category === filterCategory;
      const matchDate = !filterDate || t.date === filterDate;
      return matchSearch && matchType && matchCategory && matchDate;
    });
    setTransactions(filtered);
    setLoading(false);
  }, [searchQuery, filterType, filterCategory, filterDate]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      {/* Page Header & Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Semua Transaksi</h2>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => {
              if (transactions.length === 0) {
                alert('Tidak ada data untuk di-export!');
                return;
              }
              const headers = ['ID', 'Tanggal', 'Keterangan', 'Kategori', 'Akun', 'Type', 'Jumlah'];
              const rows = transactions.map((t: any) => [t.id, t.date, `"${t.description}"`, t.category, t.account, t.type, t.amount]);
              const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement("a");
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", "laporan_transaksi.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer"
          >
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
        <div className="flex-1 min-w-[200px]">
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
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
          >
            <option>All Types</option>
            <option>Income</option>
            <option>Expense</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
          >
            <option>All Categories</option>
            <option>Operations</option>
            <option>Marketing</option>
            <option>Payroll</option>
            <option>IT & Tech</option>
            <option>Income</option>
            <option>Lainnya</option>
          </select>
        </div>
        <div className="w-56">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date Range</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
          />
        </div>
        <button 
          onClick={() => {
            setSearchQuery('');
            setFilterType('All Types');
            setFilterCategory('All Categories');
            setFilterDate('');
          }}
          title="Reset Filters"
          className="bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors p-2 rounded-lg flex items-center justify-center h-9.5 w-9.5 cursor-pointer"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_alt_off</span>
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
                <th className="p-3 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">Memuat data dari database...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">Tidak ada transaksi ditemukan.</td>
                </tr>
              ) : (
                transactions.map((trx: any) => (
                  <tr key={trx.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-3 text-center">
                      <input className="rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" type="checkbox" />
                    </td>
                    <td className="p-3 text-slate-500">{trx.date}</td>
                    <td className="p-3 font-medium text-slate-900">{trx.description}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${trx.type === 'Income' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                        {trx.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{trx.account}</td>
                    <td className={`p-3 text-right font-mono font-medium ${trx.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {trx.type === 'Income' ? '+ ' : '- '} Rp {Number(trx.amount).toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => alert(`Fitur Edit untuk transaksi "${trx.description}" sedang dalam pengembangan.`)}
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" 
                          title="Edit"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Hapus transaksi "${trx.description}" secara permanen?`)) {
                              const saved = JSON.parse(localStorage.getItem('mock_transactions') || '[]');
                              const updated = saved.filter((t: any) => t.id !== trx.id);
                              localStorage.setItem('mock_transactions', JSON.stringify(updated));
                              setTransactions(prev => prev.filter((t: any) => t.id !== trx.id));
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" 
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-slate-500 text-sm">
            Menampilkan {transactions.length} data
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
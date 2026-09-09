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

  // Custom Modals State
  const [infoModal, setInfoModal] = useState({ show: false, message: '', title: 'Informasi', type: 'info' as 'info' | 'success' | 'warning' });
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);

  // 1. FETCH DATA DARI API LARAVEL
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/transactions');
      const result = await res.json();

      if (result.success) {
        // Pagination Laravel membungkus list data di result.data.data
        const dataFromApi = result.data.data;

        // Filter data di sisi frontend
        const filtered = dataFromApi.filter((t: any) => {
          const matchSearch = t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(t.id).toLowerCase().includes(searchQuery.toLowerCase());
          const matchType = filterType === 'All Types' || t.type?.toLowerCase() === filterType.toLowerCase();
          const matchCategory = filterCategory === 'All Categories' || t.category === filterCategory;
          const matchDate = !filterDate || t.date === filterDate;
          return matchSearch && matchType && matchCategory && matchDate;
        });

        setTransactions(filtered);
      }
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [searchQuery, filterType, filterCategory, filterDate]);

  // 2. HAPUS DATA VIA API (DELETE)
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`http://localhost:8000/api/transactions/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        setDeleteConfirm(null);
        fetchTransactions();
        setInfoModal({ show: true, message: 'Transaksi berhasil dihapus!', title: 'Sukses', type: 'success' });
      }
    } catch (error) {
      console.error('Gagal menghapus transaksi:', error);
    }
  };

  // 3. UPDATE DATA VIA API (PUT)
  const handleUpdate = async () => {
    if (!editData) return;
    try {
      const res = await fetch(`http://localhost:8000/api/transactions/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          date: editData.date,
          description: editData.description,
          category: editData.category,
          account: editData.account,
          type: editData.type,
          amount: editData.amount,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setEditData(null);
        fetchTransactions();
        setInfoModal({ show: true, message: 'Transaksi berhasil diubah!', title: 'Sukses', type: 'success' });
      }
    } catch (error) {
      console.error('Gagal mengupdate transaksi:', error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      {/* Page Header & Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Semua Transaksi</h2>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              if (transactions.length === 0) {
                setInfoModal({ show: true, message: 'Tidak ada data untuk di-export!', title: 'Perhatian', type: 'warning' });
                return;
              }
              import('xlsx').then(XLSX => {
                const worksheet = XLSX.utils.json_to_sheet(transactions.map((t: any) => ({
                  ID: t.id,
                  Tanggal: t.date,
                  Keterangan: t.description,
                  Kategori: t.category,
                  Akun: t.account,
                  Tipe: t.type,
                  Jumlah: t.amount
                })));
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
                XLSX.writeFile(workbook, "laporan_transaksi.xlsx");
              });
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
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${trx.type?.toLowerCase() === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                        {trx.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{trx.account}</td>
                    <td className={`p-3 text-right font-mono font-medium ${trx.type?.toLowerCase() === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {trx.type?.toLowerCase() === 'income' ? '+ ' : '- '} Rp {Number(trx.amount).toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setEditData({ ...trx })}
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(trx)}
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

      {/* Info Modal */}
      {infoModal.show && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${infoModal.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                infoModal.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                <span className="material-symbols-outlined text-[32px]">
                  {infoModal.type === 'success' ? 'check_circle' :
                    infoModal.type === 'warning' ? 'warning' : 'info'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{infoModal.title}</h3>
              <p className="text-slate-500 mb-6">{infoModal.message}</p>
              <button
                onClick={() => setInfoModal({ show: false, message: '', title: '', type: 'info' })}
                className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition-colors cursor-pointer shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">warning</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Transaksi?</h3>
              <p className="text-slate-500 mb-6">
                Apakah Anda yakin ingin menghapus transaksi <strong>"{deleteConfirm.description}"</strong> secara permanen?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors cursor-pointer shadow-sm"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_square</span>
                Edit Transaksi
              </h3>
              <button
                onClick={() => setEditData(null)}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tipe</label>
                  <select
                    value={editData.type}
                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none"
                  >
                    <option value="expense">expense</option>
                    <option value="income">income</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keterangan</label>
                <input
                  type="text"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none"
                  >
                    <option>Operations</option>
                    <option>Marketing</option>
                    <option>Payroll</option>
                    <option>IT & Tech</option>
                    <option>Income</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Akun</label>
                  <select
                    value={editData.account}
                    onChange={(e) => setEditData({ ...editData, account: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none"
                  >
                    <option>Mandiri Bisnis</option>
                    <option>BCA Utama</option>
                    <option>Kas Kecil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah (Rp)</label>
                <input
                  type="text"
                  value={Number(editData.amount).toLocaleString('id-ID')}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setEditData({ ...editData, amount: val ? parseInt(val, 10) : 0 });
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-mono"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setEditData(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition-colors cursor-pointer text-sm shadow-sm"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
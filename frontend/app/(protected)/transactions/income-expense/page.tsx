'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

type TransactionType = 'income' | 'expense';

export default function InputTransactionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as TransactionType) || 'expense';
  const [type, setType] = useState<TransactionType>(initialType);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="max-w-200 mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/transactions"
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Input Transaksi</h2>
          <p className="text-sm text-slate-500">Catat transaksi pemasukan atau pengeluaran baru</p>
        </div>
      </div>

      {/* Type Toggle */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-1.5 flex gap-1">
        <button
          onClick={() => setType('expense')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            type === 'expense' ? 'bg-rose-50 text-rose-700' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
          Expense
        </button>
        <button
          onClick={() => setType('income')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Income
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-5">

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keterangan</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Pembayaran Vendor IT"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah (Rp)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, '');
                setAmount(rawValue ? parseInt(rawValue, 10).toLocaleString('id-ID') : '');
              }}
              placeholder="0"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-mono placeholder-slate-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
            >
              <option value="">Pilih kategori...</option>
              <option>Operations</option>
              <option>Marketing</option>
              <option>Payroll</option>
              <option>IT & Tech</option>
              {type === 'income' && <option>Income</option>}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Akun</label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
            >
              <option value="">Pilih akun...</option>
              <option>BCA Utama</option>
              <option>Mandiri Bisnis</option>
              <option>Kas Kecil</option>
              <option>Kartu Kredit Perusahaan</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Catatan (Opsional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tambahkan catatan tambahan..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none h-20 placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lampiran (Opsional)</label>
          <label className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer">
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".png,.jpg,.jpeg,.pdf"
            />
            {file ? (
              <>
                <span className="material-symbols-outlined text-emerald-500 text-[28px]">check_circle</span>
                <p className="text-sm text-slate-700 font-medium">{file.name}</p>
                <p className="text-xs text-slate-400">Klik untuk mengganti file</p>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-slate-400 text-[28px]">upload_file</span>
                <p className="text-sm text-slate-500">Klik untuk upload atau drag & drop</p>
                <p className="text-xs text-slate-400">PNG, JPG, PDF maksimal 5MB</p>
              </>
            )}
          </label>
        </div>

      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/transactions"
          className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          Batal
        </Link>
        <button
          onClick={() => {
            const newTrx = {
              id: 'TRX-' + Math.floor(Math.random() * 10000),
              date: date || new Date().toISOString().split('T')[0],
              description: description || 'Transaksi Baru',
              category: category || 'Lainnya',
              account: account || 'Kas',
              amount: parseInt(amount.replace(/\D/g, '') || '0', 10),
              type: type === 'income' ? 'Income' : 'Expense'
            };
            const existing = JSON.parse(localStorage.getItem('mock_transactions') || '[]');
            localStorage.setItem('mock_transactions', JSON.stringify([newTrx, ...existing]));
            
            setShowSuccessModal(true);
            setTimeout(() => {
              router.push('/transactions');
            }, 2000);
          }}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer shadow-sm ${
            type === 'expense' ? 'bg-rose-600 hover:brightness-110' : 'bg-primary hover:brightness-110'
          }`}
        >
          Simpan Transaksi
        </button>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Berhasil!</h3>
            <p className="text-slate-500 mb-6">Transaksi Anda telah berhasil disimpan.</p>
            <button 
              onClick={() => router.push('/transactions')}
              className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition-colors cursor-pointer"
            >
              Ke Daftar Transaksi
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
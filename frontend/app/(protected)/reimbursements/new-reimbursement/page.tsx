'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewReimbursementPage() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [purpose, setPurpose] = useState('');

  return (
    <div className="max-w-200 mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/reimbursements"
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pengajuan Reimbursement Baru</h2>
          <p className="text-sm text-slate-500">Ajukan penggantian biaya yang sudah dikeluarkan</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-5">

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Reimbursement Travel - Client Visit"
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
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Pengeluaran</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
          >
            <option value="">Pilih kategori...</option>
            <option>Travel</option>
            <option>Meals & Entertainment</option>
            <option>Office Supplies</option>
            <option>Training & Development</option>
            <option>Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keperluan / Alasan</label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Jelaskan konteks pengeluaran ini..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none h-24 placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bukti / Nota (Wajib)</label>
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-slate-400 text-[28px]">receipt_long</span>
            <p className="text-sm text-slate-500">Klik untuk upload nota/kwitansi</p>
            <p className="text-xs text-slate-400">PNG, JPG, PDF maksimal 5MB</p>
          </div>
        </div>

      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <span className="material-symbols-outlined text-blue-600 text-[20px]">info</span>
        <p className="text-sm text-blue-800">
          Pengajuan akan dikirim ke Superadmin untuk direview. Kamu akan mendapat notifikasi setelah statusnya diperbarui.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/reimbursements"
          className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          Batal
        </Link>
        <button
          onClick={() => {
            const newReimbursement = {
              id: 'RM-' + Math.floor(Math.random() * 10000),
              date: expenseDate || new Date().toISOString().split('T')[0],
              requester: 'Current User', // Mock
              department: 'General', // Mock
              description: description || 'Reimbursement Baru',
              category: category || 'Lainnya',
              amount: amount || '0',
              status: 'pending'
            };
            const existing = JSON.parse(localStorage.getItem('mock_reimbursements') || '[]');
            localStorage.setItem('mock_reimbursements', JSON.stringify([newReimbursement, ...existing]));
            
            setShowSuccessModal(true);
            setTimeout(() => {
              router.push('/reimbursements');
            }, 2000);
          }}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:brightness-110 transition-colors cursor-pointer shadow-sm"
        >
          Ajukan Reimbursement
        </button>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Berhasil!</h3>
            <p className="text-slate-500 mb-6">Pengajuan reimbursement telah berhasil disimpan.</p>
            <button 
              onClick={() => router.push('/reimbursements')}
              className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition-colors cursor-pointer"
            >
              Ke Daftar Reimbursement
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
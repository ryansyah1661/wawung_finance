'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NewFundRequestPage() {
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [neededDate, setNeededDate] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="max-w-200 mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/fund-requests"
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pengajuan Dana Baru</h2>
          <p className="text-sm text-slate-500">Ajukan permintaan dana untuk keperluan operasional</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-5">

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keperluan Singkat</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Contoh: Biaya transportasi kunjungan klien"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah Pengajuan (Rp)</label>
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
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Dibutuhkan</label>
            <input
              type="date"
              value={neededDate}
              onChange={(e) => setNeededDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Penjelasan Keperluan</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan detail keperluan dana ini secara lengkap..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none h-28 placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lampiran Pendukung (Opsional)</label>
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-slate-400 text-[28px]">attachment</span>
            <p className="text-sm text-slate-500">Klik untuk upload dokumen pendukung</p>
            <p className="text-xs text-slate-400">PNG, JPG, PDF maksimal 5MB</p>
          </div>
        </div>

      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <span className="material-symbols-outlined text-blue-600 text-[20px]">info</span>
        <p className="text-sm text-blue-800">
          Pengajuan akan berstatus <span className="font-semibold">Pending Approval</span> hingga direview oleh Superadmin.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/fund-requests"
          className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          Batal
        </Link>
        <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:brightness-110 transition-colors cursor-pointer shadow-sm">
          Ajukan Dana
        </button>
      </div>

    </div>
  );
}
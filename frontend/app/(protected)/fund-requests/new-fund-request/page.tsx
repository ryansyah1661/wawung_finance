'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewFundRequestPage() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [neededDate, setNeededDate] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setAttachment(e.target.files[0]);
              }
            }}
            className="hidden" 
            accept=".png,.jpg,.jpeg,.pdf"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100"
          >
            {attachment ? (
              <>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-[24px]">task</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{attachment.name}</p>
                <p className="text-xs text-slate-500">{(attachment.size / 1024 / 1024).toFixed(2)} MB • Klik untuk mengganti file</p>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-slate-400 text-[28px]">attachment</span>
                <p className="text-sm text-slate-600 font-medium">Klik untuk upload dokumen pendukung</p>
                <p className="text-xs text-slate-400">PNG, JPG, PDF maksimal 5MB</p>
              </>
            )}
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
        <button
          onClick={async () => {
            let attachmentData = null;
            if (attachment) {
              const reader = new FileReader();
              const dataUrl: string = await new Promise((resolve) => {
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(attachment);
              });
              attachmentData = {
                name: attachment.name,
                size: attachment.size,
                type: attachment.type,
                dataUrl
              };
            }
            const newReq = {
              id: 'REQ-' + Math.floor(Math.random() * 10000),
              purpose: purpose || 'Pengajuan Baru',
              amount: amount || '0',
              neededDate: neededDate || new Date().toISOString().split('T')[0],
              description: description || '-',
              status: 'Pending',
              requestDate: new Date().toISOString().split('T')[0],
              requester: 'User (Anda)',
              department: 'General',
              attachment: attachmentData
            };
            const existing = JSON.parse(localStorage.getItem('mock_fund_requests') || '[]');
            localStorage.setItem('mock_fund_requests', JSON.stringify([newReq, ...existing]));
            
            setShowSuccessModal(true);
            setTimeout(() => {
              router.push('/fund-requests');
            }, 2000);
          }}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:brightness-110 transition-colors cursor-pointer shadow-sm"
        >
          Ajukan Dana
        </button>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Berhasil!</h3>
            <p className="text-slate-500 mb-6">Pengajuan dana telah berhasil disimpan.</p>
            <button 
              onClick={() => router.push('/fund-requests')}
              className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition-colors cursor-pointer"
            >
              Ke Daftar Pengajuan
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
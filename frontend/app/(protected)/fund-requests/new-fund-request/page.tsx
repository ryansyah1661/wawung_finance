'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewFundRequestPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [neededDate, setNeededDate] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      setAttachment(selectedFile);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanAmount = parseInt(amount.replace(/\D/g, ''), 10);
    if (!purpose || !cleanAmount || !neededDate) {
      setErrorMsg('Harap isi semua kolom wajib!');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      // Menggunakan FormData karena Laravel butuh multipart jika ada file upload
      const formData = new FormData();
      formData.append('purpose', purpose);
      formData.append('amount', cleanAmount.toString());
      formData.append('need_date', neededDate);
      formData.append('applicant_name', 'Ryan Syah'); // Nilai default / ganti dengan session user
      formData.append('department', 'Finance');       // Nilai default / ganti dengan session user
      if (description) formData.append('description', description);
      if (attachment) formData.append('attachment', attachment);

      const res = await fetch('/api/fund-requests', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Gagal mengirimkan pengajuan dana ke server.');
      }

      setShowSuccessModal(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
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

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Keperluan Singkat <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Contoh: Biaya transportasi kunjungan klien"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Jumlah Pengajuan (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
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
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Tanggal Dibutuhkan <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
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
            onChange={handleFileChange}
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

        {/* Info Box */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <span className="material-symbols-outlined text-blue-600 text-[20px]">info</span>
          <p className="text-sm text-blue-800">
            Pengajuan akan berstatus <span className="font-semibold">Pending Approval</span> hingga direview oleh Superadmin.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/fund-requests"
            className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:brightness-110 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Mengirim...' : 'Ajukan Dana'}
          </button>
        </div>
      </form>

      {/* Modal Sukses */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Berhasil!</h3>
            <p className="text-slate-500 mb-6">Pengajuan dana telah berhasil dikirimkan ke server.</p>
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
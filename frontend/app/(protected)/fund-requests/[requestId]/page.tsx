'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  pending: { label: 'Pending Approval', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'pending_actions' },
  approved: { label: 'Disetujui', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'check_circle' },
  rejected: { label: 'Ditolak', bg: 'bg-rose-50', text: 'text-rose-700', icon: 'cancel' },
};

function formatRupiah(amount: number | string) {
  const num = typeof amount === 'string' ? parseInt(amount.replace(/\D/g, '') || '0', 10) : amount;
  return `Rp ${num.toLocaleString('id-ID')}`;
}

export default function FundRequestDetailPage({ params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = use(params);
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Approval modal
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'Approved' | 'Rejected'>('Approved');
  const [approvalNote, setApprovalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success modal
  const [successModal, setSuccessModal] = useState({ show: false, message: '' });

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      const res = await fetch(`/api/fund-requests/${requestId}`);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setErrorMsg(err.message || 'Data tidak ditemukan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [requestId]);

  const handleApproval = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/fund-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: approvalAction,
          approval_note: approvalNote,
        }),
      });

      if (!res.ok) throw new Error('Gagal mengubah status');

      setShowApprovalModal(false);
      setApprovalNote('');
      setSuccessModal({
        show: true,
        message: approvalAction === 'Approved'
          ? 'Pengajuan dana berhasil disetujui!'
          : 'Pengajuan dana telah ditolak.',
      });
      fetchDetail();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengajuan ini?')) return;
    try {
      const res = await fetch(`/api/fund-requests/${requestId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      router.push('/fund-requests');
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[900px] mx-auto py-20 text-center text-slate-500">
        <span className="material-symbols-outlined text-4xl animate-spin mb-3 block">progress_activity</span>
        Memuat detail pengajuan...
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="max-w-[900px] mx-auto py-20 text-center">
        <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">error_outline</span>
        <p className="text-slate-500 mb-4">{errorMsg || 'Data tidak ditemukan'}</p>
        <Link href="/fund-requests" className="text-primary font-semibold hover:underline">
          ← Kembali ke daftar
        </Link>
      </div>
    );
  }

  const statusKey = (data.status || 'pending').toLowerCase();
  const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const isPending = statusKey === 'pending';
  const displayDate = data.need_date
    ? new Date(data.need_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';
  const createdDate = data.created_at
    ? new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '-';

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/fund-requests"
            className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Detail Pengajuan Dana</h2>
            <p className="text-sm text-slate-500">{data.request_number || `#${data.id}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPending && (
            <>
              <button
                onClick={() => { setApprovalAction('Approved'); setShowApprovalModal(true); }}
                className="bg-emerald-600 text-white hover:bg-emerald-700 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm font-semibold"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                Setujui
              </button>
              <button
                onClick={() => { setApprovalAction('Rejected'); setShowApprovalModal(true); }}
                className="bg-rose-600 text-white hover:bg-rose-700 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm font-semibold"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cancel</span>
                Tolak
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`${status.bg} border rounded-xl p-4 flex items-center gap-3`}>
        <span className={`material-symbols-outlined text-[24px] ${status.text}`}>{status.icon}</span>
        <div>
          <span className={`text-sm font-bold ${status.text}`}>{status.label}</span>
          {data.approval_note && (
            <p className="text-xs text-slate-600 mt-0.5">Catatan: {data.approval_note}</p>
          )}
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Pengajuan */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">info</span>
            Informasi Pengajuan
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-start py-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">No. Pengajuan</span>
              <span className="font-mono text-sm font-medium text-slate-900">{data.request_number || `#${data.id}`}</span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pemohon</span>
              <span className="text-sm font-medium text-slate-900">{data.applicant_name || '-'}</span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Departemen</span>
              <span className="text-sm text-slate-700">{data.department || '-'}</span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Dibutuhkan</span>
              <span className="text-sm text-slate-700">{displayDate}</span>
            </div>
            <div className="flex justify-between items-start py-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Pengajuan</span>
              <span className="text-sm text-slate-500">{createdDate}</span>
            </div>
          </div>
        </div>

        {/* Jumlah & Keperluan */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jumlah Pengajuan</h3>
            <p className="text-3xl font-bold text-slate-900 font-mono">{formatRupiah(data.amount)}</p>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Keperluan</h3>
            <p className="text-sm text-slate-900 font-medium">{data.purpose || '-'}</p>
            {data.description && (
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{data.description}</p>
            )}
          </div>

          {data.attachment && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lampiran</h3>
              <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                <span className="material-symbols-outlined text-slate-400">attachment</span>
                <span className="text-sm text-slate-700 truncate">{data.attachment}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {approvalAction === 'Approved' ? 'Setujui Pengajuan' : 'Tolak Pengajuan'}
              </h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className={`p-4 rounded-xl flex items-center gap-3 ${approvalAction === 'Approved' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                <span className={`material-symbols-outlined text-[24px] ${approvalAction === 'Approved' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {approvalAction === 'Approved' ? 'check_circle' : 'cancel'}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {data.request_number} — {formatRupiah(data.amount)}
                  </p>
                  <p className="text-xs text-slate-500">Pemohon: {data.applicant_name}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Tambahkan catatan untuk pemohon..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none h-24"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleApproval}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm cursor-pointer disabled:opacity-50 ${
                    approvalAction === 'Approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {isSubmitting
                    ? 'Memproses...'
                    : approvalAction === 'Approved' ? 'Ya, Setujui' : 'Ya, Tolak'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Berhasil</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{successModal.message}</p>
              <div className="pt-2">
                <button
                  onClick={() => setSuccessModal({ show: false, message: '' })}
                  className="w-full py-2.5 px-4 rounded-xl text-white font-semibold shadow-sm transition-colors cursor-pointer bg-emerald-600 hover:bg-emerald-700"
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
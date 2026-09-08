'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function formatRupiah(amount: number | string) {
  const num = typeof amount === 'string' ? parseInt(amount.replace(/\D/g, '') || '0', 10) : amount;
  return `Rp ${num.toLocaleString('id-ID')}`;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string, icon: string }> = {
  pending: { label: 'Pending Approval', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'hourglass_empty' },
  approved: { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'check_circle' },
  rejected: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-700', icon: 'cancel' },
};

export default function ReimbursementDetail() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(params.id as string);

  const [requestData, setRequestData] = useState<any>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<'Approved' | 'Rejected' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('mock_reimbursements') || '[]');
    const found = data.find((r: any) => r.id === id);
    setRequestData(found);
    setIsLoading(false);
  }, [id]);

  const executeAction = () => {
    if (!confirmAction) return;
    
    const data = JSON.parse(localStorage.getItem('mock_reimbursements') || '[]');
    const updated = data.map((r: any) => {
      if (r.id === id) {
        return { ...r, status: confirmAction, approvalNote };
      }
      return r;
    });
    localStorage.setItem('mock_reimbursements', JSON.stringify(updated));
    setSuccessMessage(`Pengajuan berhasil di-${confirmAction.toLowerCase()}!`);
    setConfirmAction(null);
    setShowSuccess(true);
  };

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading data...</div>;
  
  if (!requestData) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-slate-500">Data reimbursement {id} tidak ditemukan.</p>
        <button onClick={() => router.push('/reimbursements')} className="text-primary hover:underline">Kembali ke Daftar Reimbursement</button>
      </div>
    );
  }

  const status = STATUS_CONFIG[requestData.status?.toLowerCase()] || STATUS_CONFIG.pending;
  const requesterName = requestData.requester || requestData.employee || 'User';
  const requesterInitials = requesterName.split(' ').map((n: string) => n[0]).join('').slice(0, 2);

  return (
    <div className="max-w-300 mx-auto space-y-6">
      
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Detail Reimbursement #{requestData.id}</h2>
            <div className={`px-2.5 py-1 rounded-md border ${status.bg} ${status.text} flex items-center gap-1.5 shadow-sm`}>
              <span className="material-symbols-outlined text-[14px]">{status.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">{status.label}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">Diajukan pada {requestData.date || '-'}</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button onClick={() => router.push('/reimbursements')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all text-sm font-semibold shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all text-sm font-semibold shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Informasi Utama & Lampiran */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Informasi Utama Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">info</span>
              Informasi Utama
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nomor Pengajuan</p>
                <p className="font-mono text-sm font-medium text-slate-900">{requestData.id}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kategori</p>
                <p className="text-sm text-slate-900 font-medium">{requestData.category || '-'}</p>
              </div>
              
              <div className="col-span-full">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Karyawan</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
                    {requesterInitials}
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 font-medium">{requesterName}</p>
                    <p className="text-xs text-slate-500">{requestData.department || 'General'}</p>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keperluan / Deskripsi</p>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-wrap">
                  {requestData.purpose || requestData.description || '-'}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Reimbursement</p>
              <p className="text-2xl lg:text-3xl text-primary font-bold font-mono tracking-tight">
                {formatRupiah(requestData.amount)}
              </p>
            </div>
          </div>

          {/* Lampiran Pendukung Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">attachment</span>
              Bukti / Nota
            </h3>
            {requestData.attachment ? (
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50 group hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">image</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 font-medium group-hover:text-primary transition-colors">{requestData.attachment.name || 'Dokumen Terlampir'}</p>
                    <p className="text-xs text-slate-500">Uploaded on {requestData.date || '-'}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      if (requestData.attachment?.dataUrl) {
                        setShowPreview(true);
                      } else {
                        alert('Preview tidak tersedia untuk file ini.');
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-colors cursor-pointer shadow-sm" title="Preview"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (requestData.attachment?.dataUrl) {
                        const link = document.createElement('a');
                        link.href = requestData.attachment.dataUrl;
                        link.download = requestData.attachment.name || 'attachment';
                        link.click();
                      } else {
                        alert('Download tidak tersedia untuk file ini.');
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-colors cursor-pointer shadow-sm" title="Download"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Tidak ada lampiran nota.</p>
            )}
          </div>

        </div>

        {/* Right Side: Approval Action & Timeline */}
        <div className="space-y-6">
          
          {/* Approval Action Card */}
          {(!requestData.status || requestData.status.toLowerCase() === 'pending') && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Approval Action</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Catatan Approval (Opsional)</label>
                  <textarea 
                    value={approvalNote}
                    onChange={(e) => setApprovalNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none h-24 transition-all" 
                    placeholder="Masukkan catatan atau alasan..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setConfirmAction('Rejected')} className="flex-1 py-2.5 px-4 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    Reject
                  </button>
                  <button onClick={() => setConfirmAction('Approved')} className="flex-1 py-2.5 px-4 bg-primary text-white hover:brightness-110 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    Approve
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Timeline</h3>
            <div className="relative pl-4 space-y-6 before:absolute before:inset-y-2 before:left-1.75 before:w-px before:bg-slate-200">
              
              {requestData.status && requestData.status.toLowerCase() !== 'pending' && (
                <div className="relative">
                  <div className={`absolute -left-5.75 w-3 h-3 ${status.text.replace('text-', 'bg-')} rounded-full ring-4 ring-white shadow-sm`}></div>
                  <p className="text-sm text-slate-900 font-medium">{requestData.status}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Oleh Superadmin</p>
                  {requestData.approvalNote && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-200">
                      &quot;{requestData.approvalNote}&quot;
                    </p>
                  )}
                </div>
              )}

              <div className="relative">
                <div className={`absolute -left-5.75 w-3 h-3 ${!requestData.status || requestData.status.toLowerCase() === 'pending' ? 'bg-primary' : 'bg-slate-300'} rounded-full ring-4 ring-white shadow-sm`}></div>
                <p className="text-sm text-slate-900 font-medium">Pending Approval</p>
                <p className="text-xs text-slate-500 mt-0.5">Menunggu respon Superadmin</p>
              </div>

              <div className="relative">
                <div className="absolute -left-5.75 w-3 h-3 bg-slate-300 rounded-full ring-4 ring-white"></div>
                <p className="text-sm text-slate-500 font-medium">Created</p>
                <p className="text-xs text-slate-500 mt-0.5">Oleh {requesterName}</p>
                <p className="font-mono text-xs text-slate-400 mt-1">{requestData.date || '-'}</p>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className={`w-16 h-16 rounded-full ${confirmAction === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'} mx-auto flex items-center justify-center mb-4`}>
                <span className="material-symbols-outlined text-[32px]">
                  {confirmAction === 'Approved' ? 'check_circle' : 'cancel'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Konfirmasi Tindakan</h3>
              <p className="text-slate-500 mb-6">
                Apakah Anda yakin ingin melakukan <strong>{confirmAction}</strong> pada pengajuan ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  onClick={executeAction}
                  className={`flex-1 py-2.5 ${confirmAction === 'Approved' ? 'bg-emerald-600' : 'bg-rose-600'} text-white font-semibold rounded-lg hover:brightness-110 transition-colors cursor-pointer`}
                >
                  Ya, {confirmAction}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 mb-6 shadow-sm">
                <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>check_circle</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Berhasil!</h3>
              <p className="text-slate-500 mb-8">{successMessage}</p>
              <button 
                onClick={() => router.push('/reimbursements')}
                className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:brightness-110 transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                Kembali ke Daftar Reimbursement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && requestData.attachment?.dataUrl && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{requestData.attachment.name}</p>
                  <p className="text-xs text-slate-500">{(requestData.attachment.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = requestData.attachment.dataUrl;
                    link.download = requestData.attachment.name || 'attachment';
                    link.click();
                  }}
                  className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" 
                  title="Download"
                >
                  <span className="material-symbols-outlined text-[20px]">download</span>
                </button>
                <button 
                  onClick={() => setShowPreview(false)} 
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" 
                  title="Tutup"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-50">
              {requestData.attachment.type?.startsWith('image/') ? (
                <img 
                  src={requestData.attachment.dataUrl} 
                  alt={requestData.attachment.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
                />
              ) : requestData.attachment.type === 'application/pdf' ? (
                <iframe 
                  src={requestData.attachment.dataUrl}
                  className="w-full h-[70vh] rounded-lg border border-slate-200"
                  title="PDF Preview"
                />
              ) : (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-slate-300 text-[64px] mb-4">description</span>
                  <p className="text-slate-500">Preview tidak tersedia untuk tipe file ini.</p>
                  <p className="text-xs text-slate-400 mt-1">Silakan download file untuk melihat isinya.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

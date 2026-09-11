'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

function formatRupiah(amount: number | string) {
  const num = typeof amount === 'string' ? parseInt(amount.replace(/\D/g, '') || '0', 10) : amount;
  return `Rp ${num.toLocaleString('id-ID')}`;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  overdue: { label: 'Terlambat', bg: 'bg-rose-50', text: 'text-rose-700', icon: 'error' },
  'due-soon': { label: 'Segera Jatuh Tempo', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'schedule' },
  paid: { label: 'Lunas', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'check_circle' },
  draft: { label: 'Draf', bg: 'bg-slate-100', text: 'text-slate-600', icon: 'draft' },
};

export default function InvoiceDetail() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(params.id as string);

  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    client_name: '',
    issue_date: '',
    due_date: '',
    amount: 0,
    status: 'draft',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user role
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await api.get('/users/1');
        if (res.data?.role) setUserRole(res.data.role);
      } catch (e) {
        console.error('Gagal fetch role', e);
      }
    };
    fetchRole();
  }, []);

  const fetchInvoiceDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (!res.ok) throw new Error('Data tidak ditemukan');
      const raw = await res.json();
      const invoiceData = raw?.data || raw;
      setInvoice(invoiceData);
    } catch (err) {
      setInvoice(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoiceDetail();
  }, [fetchInvoiceDetail]);

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Gagal memperbarui status');

      const raw = await res.json();
      const updatedData = raw?.data || raw;
      setInvoice(updatedData);
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status');
    } finally {
      setIsUpdating(false);
    }
  };

  const isSuperadmin = userRole === 'superadmin';

  const openEditModal = () => {
    setEditForm({
      client_name: invoice.client_name || '',
      issue_date: invoice.issue_date || '',
      due_date: invoice.due_date || '',
      amount: Number(invoice.amount) || 0,
      status: invoice.status || 'draft',
    });
    setIsEditOpen(true);
  };

  const handleEditSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Gagal menyimpan perubahan');
      const raw = await res.json();
      const updatedData = raw?.data || raw;
      setInvoice(updatedData);
      setIsEditOpen(false);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading data...</div>;

  if (!invoice) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-slate-500">Data invoice {id} tidak ditemukan.</p>
        <button onClick={() => router.push('/invoices')} className="text-primary hover:underline cursor-pointer">
          Kembali ke Daftar Invoices
        </button>
      </div>
    );
  }

  const status = STATUS_CONFIG[invoice.status?.toLowerCase()] || STATUS_CONFIG.draft;
  const items = invoice.items || [];

  return (
    <div className="max-w-300 mx-auto space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Invoice #{invoice.invoice_number || invoice.id}</h2>
            <div className={`px-2.5 py-1 rounded-md border ${status.bg} ${status.text} flex items-center gap-1.5 shadow-sm`}>
              <span className="material-symbols-outlined text-[14px]">{status.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">{status.label}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">Client: {invoice.client_name}</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={() => router.push('/invoices')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all text-sm font-semibold shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all text-sm font-semibold shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print
          </button>
          {isSuperadmin && (
            <button
              onClick={openEditModal}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:brightness-110 rounded-xl transition-all text-sm font-semibold shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Invoice
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side: Invoice Details */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            {/* Header / Meta Info */}
            <div className="flex flex-col md:flex-row justify-between mb-10 gap-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">INVOICE</h1>
                <p className="text-slate-500 font-mono text-sm">{invoice.invoice_number || invoice.id}</p>
              </div>
              <div className="flex gap-8 text-sm">
                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Tanggal Terbit</p>
                  <p className="font-medium text-slate-900">{invoice.issue_date || '-'}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Jatuh Tempo</p>
                  <p className="font-medium text-slate-900">{invoice.due_date || '-'}</p>
                </div>
              </div>
            </div>

            {/* Billed To */}
            <div className="mb-10">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">Ditagihkan Kepada:</p>
              <p className="text-lg font-bold text-slate-900">{invoice.client_name}</p>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-y border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-2">Deskripsi</th>
                    <th className="py-3 px-2 text-center w-20">Qty</th>
                    <th className="py-3 px-2 text-right w-40">Harga</th>
                    <th className="py-3 px-2 text-right w-48">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {items.length > 0 ? (
                    items.map((item: any, idx: number) => (
                      <tr key={item.id || idx}>
                        <td className="py-4 px-2 text-slate-700">{item.description || 'Item Tagihan'}</td>
                        <td className="py-4 px-2 text-center font-mono text-slate-600">{item.qty || 1}</td>
                        <td className="py-4 px-2 text-right font-mono text-slate-600">{formatRupiah(item.price || invoice.amount || 0)}</td>
                        <td className="py-4 px-2 text-right font-mono font-medium text-slate-900">
                          {formatRupiah((item.qty || 1) * (item.price || invoice.amount || 0))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4 px-2 text-slate-700">Jasa / Layanan</td>
                      <td className="py-4 px-2 text-center font-mono text-slate-600">1</td>
                      <td className="py-4 px-2 text-right font-mono text-slate-600">{formatRupiah(invoice.amount || 0)}</td>
                      <td className="py-4 px-2 text-right font-mono font-medium text-slate-900">{formatRupiah(invoice.amount || 0)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-10">
              <div className="w-full sm:w-1/2 md:w-1/3">
                <div className="flex justify-between items-center py-2 border-t-2 border-slate-900 mt-2 pt-4">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-xs">Total Tagihan</span>
                  <span className="text-xl font-bold text-primary font-mono">{formatRupiah(invoice.amount || 0)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600 border border-slate-200">
                <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">Catatan:</p>
                <p className="whitespace-pre-wrap leading-relaxed">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Timeline & Status info */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Informasi Pembayaran</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status Saat Ini</p>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border ${status.bg} ${status.text} gap-2`}>
                  <span className="material-symbols-outlined text-[18px]">{status.icon}</span>
                  <span className="text-sm font-bold uppercase tracking-wider">{status.label}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {invoice.status !== 'paid' && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Update Status</p>
                  <div className="flex flex-col gap-2">
                    {invoice.status === 'draft' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus('due-soon')}
                        className="w-full py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors text-sm cursor-pointer disabled:opacity-50"
                      >
                        Kirim Invoice (Segera Jatuh Tempo)
                      </button>
                    )}
                    <button
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus('paid')}
                      className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Tandai Lunas
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Metode Pembayaran</p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-900 font-semibold mb-1">Bank Mandiri</p>
                  <p className="text-sm text-slate-700 font-mono tracking-widest mb-1">123-456-7890</p>
                  <p className="text-xs text-slate-500 uppercase">a/n Wawung Finance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Invoice Modal (Superadmin Only) */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Invoice</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hanya Superadmin yang dapat mengedit</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Klien</label>
                <input
                  type="text"
                  value={editForm.client_name}
                  onChange={(e) => setEditForm({ ...editForm, client_name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Terbit</label>
                  <input
                    type="date"
                    value={editForm.issue_date}
                    onChange={(e) => setEditForm({ ...editForm, issue_date: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jatuh Tempo</label>
                  <input
                    type="date"
                    value={editForm.due_date}
                    onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah (Rp)</label>
                <input
                  type="text"
                  value={editForm.amount ? editForm.amount.toLocaleString('id-ID') : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    setEditForm({ ...editForm, amount: raw ? parseInt(raw, 10) : 0 });
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer appearance-none"
                >
                  <option value="draft">Draf</option>
                  <option value="due-soon">Segera Jatuh Tempo</option>
                  <option value="overdue">Terlambat</option>
                  <option value="paid">Lunas</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm cursor-pointer"
              >
                Batal
              </button>
              <button
                disabled={isSaving}
                onClick={handleEditSave}
                className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition-colors text-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
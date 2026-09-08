'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function formatRupiah(amount: number | string) {
  const num = typeof amount === 'string' ? parseInt(amount.replace(/\D/g, '') || '0', 10) : amount;
  return `Rp ${num.toLocaleString('id-ID')}`;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string, icon: string }> = {
  overdue: { label: 'Overdue', bg: 'bg-rose-50', text: 'text-rose-700', icon: 'error' },
  'due-soon': { label: 'Due Soon', bg: 'bg-amber-50', text: 'text-amber-700', icon: 'schedule' },
  paid: { label: 'Paid', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'check_circle' },
  draft: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-600', icon: 'draft' },
};

export default function InvoiceDetail() {
  const params = useParams();
  const router = useRouter();
  const id = decodeURIComponent(params.id as string);

  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('mock_invoices') || '[]');
    const found = data.find((r: any) => r.id === id);
    setInvoice(found);
    setIsLoading(false);
  }, [id]);

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading data...</div>;
  
  if (!invoice) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-slate-500">Data invoice {id} tidak ditemukan.</p>
        <button onClick={() => router.push('/invoices')} className="text-primary hover:underline">Kembali ke Daftar Invoices</button>
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
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Invoice #{invoice.id}</h2>
            <div className={`px-2.5 py-1 rounded-md border ${status.bg} ${status.text} flex items-center gap-1.5 shadow-sm`}>
              <span className="material-symbols-outlined text-[14px]">{status.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">{status.label}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">Client: {invoice.client}</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button onClick={() => router.push('/invoices')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all text-sm font-semibold shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all text-sm font-semibold shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print
          </button>
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
                <p className="text-slate-500 font-mono text-sm">{invoice.id}</p>
              </div>
              <div className="flex gap-8 text-sm">
                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Tanggal Terbit</p>
                  <p className="font-medium text-slate-900">{invoice.issueDate || '-'}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Jatuh Tempo</p>
                  <p className="font-medium text-slate-900">{invoice.dueDate || '-'}</p>
                </div>
              </div>
            </div>

            {/* Billed To */}
            <div className="mb-10">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">Ditagihkan Kepada:</p>
              <p className="text-lg font-bold text-slate-900">{invoice.client}</p>
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
                  {items.length > 0 ? items.map((item: any, idx: number) => (
                    <tr key={item.id || idx}>
                      <td className="py-4 px-2 text-slate-700">{item.description || 'Item Tagihan'}</td>
                      <td className="py-4 px-2 text-center font-mono text-slate-600">{item.qty || 1}</td>
                      <td className="py-4 px-2 text-right font-mono text-slate-600">{formatRupiah(item.price || invoice.amount)}</td>
                      <td className="py-4 px-2 text-right font-mono font-medium text-slate-900">{formatRupiah((item.qty || 1) * (item.price || invoice.amount))}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="py-4 px-2 text-slate-700">Jasa / Layanan (Generated)</td>
                      <td className="py-4 px-2 text-center font-mono text-slate-600">1</td>
                      <td className="py-4 px-2 text-right font-mono text-slate-600">{formatRupiah(invoice.amount)}</td>
                      <td className="py-4 px-2 text-right font-mono font-medium text-slate-900">{formatRupiah(invoice.amount)}</td>
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
                  <span className="text-xl font-bold text-primary font-mono">{formatRupiah(invoice.amount)}</span>
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

        {/* Right Side: Timeline & Status info (Optional) */}
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
                         onClick={() => {
                           const data = JSON.parse(localStorage.getItem('mock_invoices') || '[]');
                           const updated = data.map((r: any) => r.id === invoice.id ? { ...r, status: 'due-soon' } : r);
                           localStorage.setItem('mock_invoices', JSON.stringify(updated));
                           setInvoice({ ...invoice, status: 'due-soon' });
                         }}
                         className="w-full py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors text-sm"
                       >
                         Kirim Invoice (Due Soon)
                       </button>
                     )}
                     <button 
                       onClick={() => {
                         const data = JSON.parse(localStorage.getItem('mock_invoices') || '[]');
                         const updated = data.map((r: any) => r.id === invoice.id ? { ...r, status: 'paid' } : r);
                         localStorage.setItem('mock_invoices', JSON.stringify(updated));
                         setInvoice({ ...invoice, status: 'paid' });
                       }}
                       className="w-full py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center gap-1"
                     >
                       <span className="material-symbols-outlined text-[18px]">check_circle</span>
                       Mark as Paid
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
    </div>
  );
}
